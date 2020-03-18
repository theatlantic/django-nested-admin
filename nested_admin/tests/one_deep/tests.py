try:
    from distutils.spawn import find_executable
except:
    find_executable = lambda f: None
import inspect
import logging
import os
import re
import shutil
import subprocess
import sys
import tempfile
import time
from unittest import SkipTest

import PIL.Image
import PIL.ImageDraw

import django
from django.conf import settings
from django.contrib.admin.sites import site as admin_site
from django.test import override_settings
import six
from six.moves.urllib.parse import urlparse, urlunparse, ParseResult

try:
    from storages.backends.s3boto3 import S3Boto3Storage
except:
    S3Boto3Storage = None

from nested_admin.tests.base import (
    BaseNestedAdminTestCase, get_model_name)
from .models import (
    PlainStackedRoot, PlainTabularRoot, NestedStackedRoot, NestedTabularRoot)


logger = logging.getLogger(__name__)


def strip_query_from_url(url):
    parts = list(urlparse(url))
    parts[ParseResult._fields.index('query')] = ''
    return urlunparse(parts)


class disable_string_if_invalid_for_grappelli(override_settings):

    def __init__(self):
        self.options = {"TEMPLATES": [settings.TEMPLATES[0].copy()]}
        if 'grappelli' in settings.INSTALLED_APPS:
            self.options['TEMPLATES'][0]['OPTIONS'].pop('string_if_invalid')


@disable_string_if_invalid_for_grappelli()
class VisualComparisonTestCase(BaseNestedAdminTestCase):

    root_model = None
    root_models = [PlainStackedRoot, PlainTabularRoot, NestedStackedRoot, NestedTabularRoot]
    storage = None

    window_size = (1200, 800)

    @classmethod
    def setUpClass(cls):
        if six.PY2:
            raise SkipTest("Skipping redundant test")
        cls.pixelmatch_bin = os.environ.get('PIXELMATCH_BIN')
        if not cls.pixelmatch_bin:
            cls.pixelmatch_bin = find_executable('pixelmatch')
        if not cls.pixelmatch_bin or not os.path.exists(cls.pixelmatch_bin):
            raise SkipTest("pixelmatch not installed")
        cls.screenshot_output_dir = os.environ.get('SCREENSHOT_OUTPUT_DIR', '/tmp/djn-tests')
        super(BaseNestedAdminTestCase, cls).setUpClass()
        cls.root_temp_dir = tempfile.mkdtemp()

        if os.environ.get('TRAVIS_BUILD_NUMBER'):
            # For some reason these tests fail on travis when Django > 1.11
            if django.VERSION > (1, 11):
                raise SkipTest("Issue with travis and Django >= 1.11")
            cls.path_prefix = "travis_%s" % os.environ['TRAVIS_BUILD_NUMBER']
        else:
            cls.path_prefix = "local"

        cls.temp_dir = tempfile.mkdtemp(dir=cls.root_temp_dir)
        os.makedirs(os.path.join(cls.temp_dir, cls.path_prefix))
        if cls.screenshot_output_dir:
            screenshot_path = os.path.join(cls.screenshot_output_dir, cls.path_prefix)
            if not os.path.exists(screenshot_path):
                os.makedirs(screenshot_path)

        if all(os.environ.get(k) for k in ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY']):
            try:
                storage = S3Boto3Storage()
                bucket = storage.bucket  # noqa
            except:
                pass
            else:
                cls.storage = storage

        cls.all_models = {}
        cls.all_model_names = {}

        for root_model in cls.root_models:
            root_admin = admin_site._registry[root_model]

            def descend_admin_inlines(admin):
                data = [admin.model, []]
                for inline in (getattr(admin, 'inlines', None) or []):
                    data[1].append(descend_admin_inlines(inline))
                return data

            cls.all_models[root_model] = models = descend_admin_inlines(root_admin)

            def recursive_map_model_names(data):
                if isinstance(data, list):
                    return [m for m in map(recursive_map_model_names, data)]
                else:
                    return get_model_name(data)

            cls.all_model_names[root_model] = recursive_map_model_names(models)

    @classmethod
    def tearDownClass(cls):
        super(VisualComparisonTestCase, cls).tearDownClass()
        shutil.rmtree(cls.root_temp_dir)

    @property
    def models(self):
        return self.all_models[self.root_model]

    @property
    def model_names(self):
        return self.all_model_names[self.root_model]

    def _block_out_arg(self, selector):
        """
        Generate the --block-out argument passed to pixelmatch that excludes
        an element from the diff
        """
        el = self.selenium.find_element_by_css_selector(selector)
        return ['--block-out', "%(x)s,%(y)s,%(w)s,%(h)s" % {
            'x': el.location['x'],
            'y': el.location['y'],
            'w': el.size['width'],
            'h': el.size['height'],
        }]

    def exclude_from_screenshots(self, imgs, exclude=None):
        pixel_density = self.selenium.execute_script('return window.devicePixelRatio') or 1
        exclude = exclude or []
        rects = []
        for selector in exclude:
            el = self.selenium.find_element_by_css_selector(selector)
            x0, y0 = el.location['x'], el.location['y']
            w, h = el.size['width'], el.size['height']
            x1, y1 = x0 + w, y0 + h
            coords = [v * pixel_density for v in [x0, y0, x1, y1]]
            rects.append(coords)
        for img_path in imgs:
            im = PIL.Image.open(img_path)
            draw = PIL.ImageDraw.Draw(im)
            for rect in rects:
                draw.rectangle(rect, fill='black')
            im.save(img_path)

    def assertSameScreenshot(self, a, b, exclude=None):
        diff_output_path = a.replace('_a.png', '_diff.png')
        args = [self.pixelmatch_bin, a, b, diff_output_path, 'threshold=0']

        exclude = exclude or []
        self.exclude_from_screenshots([a, b], exclude)

        p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, _ = p.communicate()
        stdout = stdout.decode('utf-8')
        diff_pixels = int(re.search(r'different pixels: (\d+)', stdout).group(1))
        if diff_pixels == 0:
            # No differences found
            if self.screenshot_output_dir:
                os.unlink(a)
                os.unlink(b)
                os.unlink(diff_output_path)
            return
        else:
            msg = "Screenshots do not match (%d pixels differ)" % diff_pixels
            if self.storage:
                s3_name = "%s/%s" % (self.path_prefix, os.path.basename(diff_output_path))
                with open(diff_output_path, 'rb') as f:
                    s3_name = self.storage.save(s3_name, f)
                s3_url = strip_query_from_url(self.storage.url(s3_name))
                msg = "%s (See <%s>)" % (msg, s3_url)
            elif self.screenshot_output_dir:
                msg = "%s (See %s)" % (msg, diff_output_path)
            raise AssertionError(msg)

    def get_admin_screenshot(self):
        name = inspect.stack()[1][3]
        prefix = "%s/py%s%s_dj%s%s" % (
            (self.path_prefix,) + sys.version_info[:2] + django.VERSION[:2])
        if self.has_grappelli:
            prefix += "_grp"
        output_dir = self.screenshot_output_dir or self.temp_dir
        suffix = ('a' if self.root_model.__name__.startswith('Plain') else 'b')
        image_path = os.path.join(output_dir, "%s_%s_%s.png" % (prefix, name, suffix))
        # Move mouse to a consistent place, to avoid hover styles confusing things
        # body_element = self.selenium.execute_script('return document.body')
        self.selenium.execute_script('document.body.scrollTop = 0')
        self.selenium.execute_script('$("*:focus").blur()')
        time.sleep(0.2)
        self.selenium.save_screenshot(image_path)
        return image_path

    def add_inline(self):
        child_model = self.models[1][0][0]
        verbose_name = child_model._meta.verbose_name.title()
        with self.clickable_xpath('//a[contains(string(.), "Add another %s")]' % verbose_name) as el:
            el.click()

    def test_stacked_empty(self):
        screenshots = []
        for model in [PlainStackedRoot, NestedStackedRoot]:
            self.root_model = model
            self.load_admin()
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_tabular_empty(self):
        screenshots = []
        for model in [PlainTabularRoot, NestedTabularRoot]:
            self.root_model = model
            self.load_admin()
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_tabular_one_item(self):
        screenshots = []
        for model in [PlainTabularRoot, NestedTabularRoot]:
            self.root_model = model
            child_model = self.models[1][0][0]
            root = model.objects.create(slug='a')
            child_model.objects.create(slug='b', root=root, position=0)
            self.load_admin(obj=root)
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_stacked_one_item(self):
        screenshots = []
        for model in [PlainStackedRoot, NestedStackedRoot]:
            self.root_model = model
            child_model = self.models[1][0][0]
            root = model.objects.create(slug='a')
            child_model.objects.create(slug='b', root=root, position=0)
            self.load_admin(obj=root)
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_tabular_added_item(self):
        screenshots = []
        for model in [PlainTabularRoot, NestedTabularRoot]:
            self.root_model = model
            self.load_admin()
            self.add_inline()
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_stacked_added_item(self):
        screenshots = []
        for model in [PlainStackedRoot, NestedStackedRoot]:
            self.root_model = model
            self.load_admin()
            self.add_inline()
            screenshots.append(self.get_admin_screenshot())
        self.assertSameScreenshot(*screenshots)

    def test_tabular_validation_error(self):
        screenshots = []
        for model in [PlainTabularRoot, NestedTabularRoot]:
            self.root_model = model
            self.load_admin()
            self.add_inline()
            with self.clickable_selector('#id_slug') as el:
                el.send_keys('a')
            with self.clickable_selector('#id_children-0-slug') as el:
                el.send_keys('b')
            self.save_form()
            screenshots.append(self.get_admin_screenshot())
        exclude = []
        if not self.has_grappelli:
            # django has a bug where it doesn't show the 'Remove' link
            # if there is a validationerror on a newly added inline
            # see <https://code.djangoproject.com/ticket/15910>
            exclude += ['#children-0 .delete']
        self.assertSameScreenshot(*screenshots, exclude=exclude)

    def test_stacked_validation_error(self):
        screenshots = []
        for model in [PlainStackedRoot, NestedStackedRoot]:
            self.root_model = model
            self.load_admin()
            self.add_inline()
            with self.clickable_selector('#id_slug') as el:
                el.send_keys('a')
            with self.clickable_selector('#id_children-0-slug') as el:
                el.send_keys('b')
            self.save_form()
            screenshots.append(self.get_admin_screenshot())
        exclude = []
        if not self.has_grappelli:
            # django has a bug where it doesn't show the 'Remove' link
            # if there is a validationerror on a newly added inline
            # see <https://code.djangoproject.com/ticket/15910>
            exclude += ['.inline-related:not(.empty-form) > h3']
        self.assertSameScreenshot(*screenshots, exclude=exclude)
