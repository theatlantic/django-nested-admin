try:
    from distutils.spawn import find_executable
except:
    find_executable = lambda f: None
import django
import inspect
import logging
import os
import shutil
import subprocess
import tempfile
from unittest import SkipTest

from django.contrib.admin.sites import site as admin_site

from nested_admin.tests.base import BaseNestedAdminTestCase, get_model_name
from .models import (
    PlainStackedRoot, PlainTabularRoot, NestedStackedRoot, NestedTabularRoot)


logger = logging.getLogger(__name__)


class VisualComparisonTestCase(BaseNestedAdminTestCase):

    root_model = None
    root_models = [PlainStackedRoot, PlainTabularRoot, NestedStackedRoot, NestedTabularRoot]

    @classmethod
    def setUpClass(cls):
        cls.blinkdiff_bin = os.environ.get('BLINKDIFF_BIN')
        if not cls.blinkdiff_bin:
            cls.blinkdiff_bin = find_executable('blink-diff')
        if not cls.blinkdiff_bin or not os.path.exists(cls.blinkdiff_bin):
            raise SkipTest("blink-diff not installed")
        cls.screenshot_output_dir = os.environ.get('SCREENSHOT_OUTPUT_DIR')
        super(BaseNestedAdminTestCase, cls).setUpClass()
        cls.root_temp_dir = tempfile.mkdtemp()

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

    def setUp(self):
        super(VisualComparisonTestCase, self).setUp()
        self.temp_dir = tempfile.mkdtemp(dir=self.root_temp_dir)
        self.selenium.set_window_size(780, 600)

    @property
    def models(self):
        return self.all_models[self.root_model]

    @property
    def model_names(self):
        return self.all_model_names[self.root_model]

    def assertSameScreenshot(self, a, b, extra_args=None):
        diff_output_path = a.replace('_a.png', '_diff.png')
        args = [
            self.blinkdiff_bin, "--verbose", "--threshold", "1", "--delta", "0",
            "--output", diff_output_path]

        if self.has_suit:
            suit_left = self.selenium.find_element_by_css_selector('#suit-left')
            args += ['--block-out', "%(x)s,%(y)s,%(w)s,%(h)s" % {
                'x': suit_left.location['x'],
                'y': suit_left.location['y'],
                'w': suit_left.size['width'],
                'h': suit_left.size['height'],
            }]
        if extra_args:
            args += extra_args

        args += [a, b]

        p = subprocess.Popen(args, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, _ = p.communicate()
        if p.returncode == 0:
            # No differences found
            if self.screenshot_output_dir:
                os.unlink(a)
                os.unlink(b)
                os.unlink(diff_output_path)
            return
        else:
            logger.info(stdout)
            msg = "Screenshots do not match"
            if self.screenshot_output_dir:
                msg = "%s (See %s)" % (msg, diff_output_path)
            raise AssertionError(msg)

    def get_admin_screenshot(self):
        name = inspect.stack()[1][3]
        prefix = "dj%s%s" % django.VERSION[:2]
        if self.has_grappelli:
            prefix += "_grp"
        output_dir = self.screenshot_output_dir or self.temp_dir
        suffix = ('a' if self.root_model.__name__.startswith('Plain') else 'b')
        image_path = os.path.join(output_dir, "%s_%s_%s.png" % (prefix, name, suffix))
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
            if self.has_suit:
                self.selenium.set_window_size(1400, 800)
            self.add_inline()
            with self.clickable_selector('#id_slug') as el:
                el.send_keys('a')
            with self.clickable_selector('#id_children-0-slug') as el:
                el.send_keys('b')
            self.save_form()
            screenshots.append(self.get_admin_screenshot())
        extra_args = []
        if not self.has_grappelli:
            # django has a bug where it doesn't show the 'Remove' link
            # if there is a validationerror on a newly added inline
            # see <https://code.djangoproject.com/ticket/15910>
            delete_col = self.selenium.find_element_by_css_selector('#children-0 .delete')
            extra_args += ['--block-out', "%(x)s,%(y)s,%(w)s,%(h)s" % {
                'x': delete_col.location['x'],
                'y': delete_col.location['y'],
                'w': delete_col.size['width'],
                'h': delete_col.size['height'],
            }]
        self.assertSameScreenshot(*screenshots, extra_args=extra_args)

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
        extra_args = []
        if not self.has_grappelli:
            # django has a bug where it doesn't show the 'Remove' link
            # if there is a validationerror on a newly added inline
            # see <https://code.djangoproject.com/ticket/15910>
            delete_col = self.selenium.find_element_by_css_selector('#children-0 .inline-deletelink')
            extra_args += ['--block-out', "%(x)s,%(y)s,%(w)s,%(h)s" % {
                'x': delete_col.location['x'],
                'y': delete_col.location['y'],
                'w': delete_col.size['width'],
                'h': delete_col.size['height'],
            }]
        self.assertSameScreenshot(*screenshots, extra_args=extra_args)

