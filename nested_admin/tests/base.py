from __future__ import absolute_import

from datetime import datetime
import functools
import inspect
import json
import logging
import os
import sys
import time
import unittest

import django
from django.conf import settings
from django.contrib.admin.sites import site as admin_site

import six
from selenosis import AdminSelenosisTestCase
from .drag_drop import DragAndDropAction
from .utils import (
    xpath_item, is_sequence, is_integer, is_str, ElementRect)


logger = logging.getLogger(__name__)


get_model_name = lambda m: "-".join([m._meta.app_label, m._meta.model_name])


class BaseNestedAdminTestCase(AdminSelenosisTestCase):

    root_urlconf = "nested_admin.tests.urls"

    root_model = None
    nested_models = None

    @classmethod
    def setUpClass(cls):
        super(BaseNestedAdminTestCase, cls).setUpClass()

        root_admin = admin_site._registry[cls.root_model]

        def descend_admin_inlines(admin):
            data = [admin.model, []]
            for inline in (getattr(admin, 'inlines', None) or []):
                data[1].append(descend_admin_inlines(inline))
            return data

        cls.models = descend_admin_inlines(root_admin)

        def recursive_map_model_names(data):
            if isinstance(data, list):
                return [m for m in map(recursive_map_model_names, data)]
            else:
                return get_model_name(data)

        cls.model_names = recursive_map_model_names(cls.models)

    def setUp(self):
        super(BaseNestedAdminTestCase, self).setUp()
        self.server_exc_info = None
        app = self.server_thread.httpd.application.application.application
        if app._exception_middleware is None:
            app.load_middleware()
        app._exception_middleware.append(self.handle_server_error)

    def tearDown(self):
        app = self.server_thread.httpd.application.application.application
        app._exception_middleware = []
        self.dump_js_coverage()
        super(BaseNestedAdminTestCase, self).tearDown()

    def handle_server_error(self, request, exception):
        self.server_exc_info = sys.exc_info()

    def load_admin(self, obj=None):
        if obj is None:
            obj = self.root_model
        super(BaseNestedAdminTestCase, self).load_admin(obj)

    def initialize_page(self):
        if self.server_exc_info:
            six.reraise(*self.server_exc_info)

        super(BaseNestedAdminTestCase, self).initialize_page()

        browser_errors = [e for e in self.selenium.get_log('browser')
                          if 'favicon' not in e['message']]
        if len(browser_errors) > 0:
            logger.error("Found browser errors: %s" % json.dumps(browser_errors, indent=4))

        # Store last mousemove event, so we can track the mouse position
        self.selenium.execute_script("""
            if (window.DJNesting) {
                document.body.addEventListener('mousemove', function(event) {
                    DJNesting.lastMouseMove = event;
                });
            }
        """)
        self.selenium.execute_script("window.$ = window.django.jQuery")

    def wait_until_element_is(self, element, selector, timeout=None, message=None):
        def element_matches_selector(d):
            return d.execute_script(
                'return !!$(arguments[0]).is(arguments[1])',
                element, selector)

        message = message or "Timeout waiting for element to match selector %s" % selector
        self.wait_until(element_matches_selector, message=message)

    # @property
    # def is_chromedriver(self):
    #     return bool(self.selenium.capabilities.get('chrome')
    #
    # @property
    # def chromedriver_version(self):
    #     if not self.is_chromedriver:
    #         return
    #     version = self.selenium.capabilities['chrome'].get('chromedriverVersion')
    #     if not version:
    #         return
    #     return version.partition(' ')[0]

    def get_test_filename_base(self):
        """Returns a unique filename based on the current test conditions"""
        if self.has_grappelli:
            admin_type = "grp"
        else:
            admin_type = "std"

        return "py%(pyver)s_dj%(djver)s_%(type)s.%(cls)s.%(fn)s.%(ts)s%(usec)s" % {
            'pyver': "%s%s" % sys.version_info[:2],
            'djver': "%s%s" % django.VERSION[:2],
            'type': admin_type,
            'cls': type(self).__name__,
            'fn': self._testMethodName,
            'ts': datetime.now().strftime('%Y%m%d%H%M%S'),
            'usec': ("%.6f" % time.time()).split('.')[1],
        }

    def dump_js_coverage(self):
        try:
            coverage_dumped = self.selenium.execute_script('return window._coverage_dumped')
            if coverage_dumped:
                return
            else:
                json = self.selenium.execute_script('return JSON.stringify(__coverage__)')
                self.selenium.execute_script('window._coverage_dumped = true')
        except:
            return
        nyc_output_dir = os.path.join(os.getcwd(), '.nyc_output')
        if not os.path.exists(nyc_output_dir):
            os.makedirs(nyc_output_dir)
        filename = "%s.json" % self.get_test_filename_base()
        with open(os.path.join(nyc_output_dir, filename), mode='w') as f:
            f.write(json)

    def save_form(self):
        browser_errors = [e for e in self.selenium.get_log('browser')
                          if 'favicon' not in e['message']]
        if len(browser_errors) > 0:
            logger.error("Found browser errors: %s" % json.dumps(browser_errors, indent=4))

        self.dump_js_coverage()

        has_continue = bool(
            self.selenium.execute_script(
                'return django.jQuery("[name=_continue]").length'))
        name_attr = "_continue" if has_continue else "_save"
        self.click(self.selenium.find_element_by_xpath('//*[@name="%s"]' % name_attr))
        if has_continue:
            self.wait_page_loaded()
            self.initialize_page()

    def _normalize_indexes(self, indexes, is_group=False, named_models=True):
        """
        To allow for the case where there are multiple inlines defined on a
        given ModelAdmin or InlineModelAdmin, we need indexes to be a list of
        lists (or at any rate an iterable of iterables, but lets call the
        outermost iterable a list, and the elements themselves tuples).
        The elements of the top-level list should be seen as directions for
        how to descend the hierarchy of the inlines (an empty list thus
        referring to the root model, which is not an inline). Descending down
        the hierarchy, each element is a 2-tuple (a, b) where ``a``
        is the index on the ModelAdmin.inlines attribute, and b is a 0-indexed
        number corresponding to the actual item in that inline currently on
        the page.

        Some operations, such as ``add_inline`` and ``get_num_inlines`` (along
        with the helper method ``get_group``) refer not to a specific item
        within an inline, but to the group of inlines as a whole (at least
        at the last step of descending the hierarchy: for instance when
        clicking add on a nested inline; the add button is at the group-level,
        but the parents of that group are all specific inline items). In the
        case of such operations that operate at the group level, the last item
        is a 1-tuple to indicate which group of the available inlines at that
        level is the target.

        In the trivial case, there is only one inline at every level. Most of
        the unit tests are trivial in this sense. It would be very burdensome,
        not to mention difficult to parse, if the operation::

            self.add_inline(indexes=[1, 3, 2])

        had to be written out as::

            self.add_inline(indexes=[(0, 1), (0, 3), (0, 2), (0, ))])

        The first example above is hard enough to follow without adding a
        number of zeros to each element (and at the end!) to accommodate the
        possibility of there being multiple inline classes when we already now
        that there is only one.

        To ease the burden of writing test cases, it is possible to use an
        integer at a given level of the indexes if there is only one possible
        inline at that level. It is similarly alright to omit the terminal
        1-tuple of (0, ) to ``add_inline`` and ``get_num_inlines`` if there
        is only one possible inline group that can be added to.

        The purposes of this function is to normalize the indexes parameter
        so that it can be converted from the shorter notation to a fully
        qualified one of 2-tuples (and the occasional terminal 1-tuple).
        """
        norm_indexes = []
        root_model_name, inline_model_names = list(self.model_names)

        indexes = list(indexes or [])

        # Are we already normalized? If so, just return
        inline_type_check = is_str if named_models else is_integer
        if is_group:
            if len(indexes) and inline_type_check(indexes[-1]):
                try:
                    if all([inline_type_check(a) and is_integer(b) for a, b in indexes[:-1]]):
                        return indexes
                except:
                    pass
        else:
            try:
                if all([inline_type_check(a) and is_integer(b) for a, b in indexes]):
                    return indexes
            except:
                pass

        group_index = None
        if is_group:
            if len(indexes) and is_sequence(indexes[-1]) and len(indexes[-1]) == 1:
                group_index = indexes.pop()[0]
            else:
                indexes.append(None)
        elif not indexes:
            return indexes

        for level, level_indexes in enumerate(indexes):
            if len(inline_model_names) == 0:
                raise ValueError("Indexes depth greater than inline depth")
            if level_indexes is None:
                if not is_group:
                    raise ValueError("Unexpected None found in indexes")
                if len(inline_model_names) > 1:
                    raise ValueError(
                        "Terminal index to inline class omitted in group-level "
                        "operation, but parent has more than one inline")
                if named_models:
                    norm_indexes.append(inline_model_names[0][0])
                else:
                    norm_indexes.append(0)
                break
            if not is_sequence(level_indexes) and not is_integer(level_indexes):
                raise ValueError("Unexpected type %s in list of indexes" % (
                    type(level_indexes).__name__))
            if is_integer(level_indexes):
                if len(inline_model_names) > 1:
                    raise ValueError((
                        "indexes[%d] using shorthand integer value, but more "
                        "than one inline to choose from") % (level))
                level_indexes = [0, level_indexes]
            if is_sequence(level_indexes):
                if len(level_indexes) != 2:
                    raise ValueError("Expected indexes[%d] to have len 2, got %d" % (
                        level, len(level_indexes)))
                if not all([is_integer(i) for i in level_indexes]):
                    raise ValueError("indexes[%d] must have only integers" % level)
                inline_index, inline_item = level_indexes
                inline_model_name, inline_model_names = inline_model_names[inline_index]
                if named_models:
                    norm_indexes.append([inline_model_name, inline_item])
                else:
                    norm_indexes.append([inline_index, inline_item])

        if group_index is not None:
            if named_models:
                norm_indexes.append(inline_model_names[group_index][0])
            else:
                norm_indexes.append(group_index)

        return norm_indexes

    def click(self, element):
        """A safe click method that ensures the element is scrolled into view"""
        try:
            element.click()
        except:
            rect = ElementRect(element)
            if rect.top < 0:
                self.selenium.execute_script(
                    'document.documentElement.scrollTop += arguments[0]', rect.top)
            else:
                self.selenium.execute_script('arguments[0].scrollIntoView()', element)

            element.click()

    def drag_and_drop_item(self, from_indexes, to_indexes, screenshot_hack=False):
        action = DragAndDropAction(self, from_indexes=from_indexes, to_indexes=to_indexes)
        action.move_to_target(screenshot_hack=screenshot_hack)

    def get_num_inlines(self, indexes=None):
        indexes = self._normalize_indexes(indexes, is_group=True)
        model_name = indexes[-1]
        group = self.get_group(indexes=indexes)
        group_id = group.get_attribute('id')
        selector = "#%s .djn-dynamic-form-%s" % (group_id, model_name)
        return self.selenium.execute_script("return $('%s').length" % selector)

    def get_group(self, indexes=None):
        indexes = self._normalize_indexes(indexes, is_group=True)
        model_name = indexes.pop()
        expr_parts = []
        for parent_model, parent_item_index in indexes:
            expr_parts += ["/*[%s][%d]" % (xpath_item(parent_model), parent_item_index + 1)]
        expr_parts += ["/*[@data-inline-model='%s']" % model_name]
        expr = "/%s" % ("/".join(expr_parts))
        return self.selenium.find_element_by_xpath(expr)

    def get_item(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name, item_index = indexes.pop()
        indexes.append(model_name)
        group = self.get_group(indexes=indexes)
        return group.find_element_by_xpath(".//*[%s][%d]" % (xpath_item(model_name), item_index + 1))

    def add_inline(self, indexes=None, name=None, slug=None):
        indexes = self._normalize_indexes(indexes, is_group=True)
        new_index = self.get_num_inlines(indexes)
        model_name = indexes[-1]
        add_selector = "#%s .djn-add-item a.djn-add-handler.djn-model-%s" % (
            self.get_group(indexes).get_attribute('id'), model_name)
        with self.clickable_selector(add_selector) as el:
            self.click(el)
        indexes[-1] = [model_name, new_index]
        if name is not None:
            self.set_field("name", name, indexes=indexes)
        if slug is not None:
            self.set_field("slug", slug, indexes=indexes)
        return indexes

    def remove_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name = indexes[-1][0]
        remove_selector = "#%s .djn-remove-handler.djn-model-%s" % (
            self.get_item(indexes).get_attribute('id'), model_name)
        with self.clickable_selector(remove_selector) as el:
            self.click(el)

    def delete_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name = indexes[-1][0]
        item_id = self.get_item(indexes).get_attribute('id')
        delete_selector = "#%s .djn-delete-handler.djn-model-%s" % (
            item_id, model_name)
        with self.clickable_selector(delete_selector) as el:
            self.click(el)
        if self.has_grappelli:
            undelete_selector = "#%s.grp-predelete .grp-delete-handler.djn-model-%s" % (
                item_id, model_name)
            self.wait_until_clickable_selector(undelete_selector)

    def undelete_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name = indexes[-1][0]
        item_id = self.get_item(indexes).get_attribute('id')
        undelete_selector = "#%s .djn-delete-handler.djn-model-%s" % (item_id, model_name)
        with self.clickable_selector(undelete_selector) as el:
            self.click(el)
        if self.has_grappelli:
            delete_selector = "#%s:not(.grp-predelete) .grp-delete-handler.djn-model-%s" % (
                item_id, model_name)
            self.wait_until_clickable_selector(delete_selector)

    def get_form_field_selector(self, attname, indexes=None):
        indexes = self._normalize_indexes(indexes)
        if not indexes:
            return "#id_%s" % attname
        field_prefix = self.get_item(indexes=indexes).get_attribute('id')
        return "#id_%s-%s" % (field_prefix, attname)

    def get_field(self, attname, indexes=None):
        indexes = self._normalize_indexes(indexes)
        field_selector = self.get_form_field_selector(attname, indexes=indexes)
        return self.selenium.find_element_by_css_selector(field_selector)

    def set_field(self, attname, value, indexes=None):
        indexes = self._normalize_indexes(indexes)
        field_selector = self.get_form_field_selector(attname, indexes=indexes)
        with self.clickable_selector(field_selector) as el:
            el.clear()
            el.send_keys(value)


def expected_failure_if_grappelli(func):
    if 'grappelli' in settings.INSTALLED_APPS:
        return unittest.expectedFailure(func)
    return func


def skip_if_not_grappelli(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if 'grappelli' not in settings.INSTALLED_APPS:
            raise unittest.SkipTest("Skipping (grappelli required)")
        return func(*args, **kwargs)
    return wrapper
