from __future__ import absolute_import

import collections
import contextlib
import copy
import functools
import json
import logging
import re
import time
import unittest

import django
from django.conf import settings
from django.contrib.admin.sites import site as admin_site
from django.contrib.auth.models import User
from django.contrib.staticfiles.testing import StaticLiveServerTestCase
try:
    # Django 1.10
    from django.urls import reverse
except ImportError:
    # Django <= 1.9
    from django.core.urlresolvers import reverse
from django.test.utils import override_settings
from django.utils import six
from django.utils.translation import ugettext as _

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.expected_conditions import (
    visibility_of_element_located, element_to_be_clickable)

from .selenium import SeleniumTestCase


logger = logging.getLogger(__name__)


if not hasattr(__builtins__, 'cmp'):
    def cmp(a, b):
        return (a > b) - (a < b)


def is_sequence(o):
    return isinstance(o, collections.Sequence)


def is_integer(o):
    return isinstance(o, six.integer_types)


def is_str(o):
    return isinstance(o, six.string_types)


get_model_name = lambda m: "-".join([m._meta.app_label, m._meta.model_name])


def xpath_cls(classname):
    return 'contains(concat(" ", @class, " "), " %s ")' % classname


def xpath_item(model_name=None):
    xpath_item_predicate = 'not(contains(@class, "-drag")) and not(contains(@class, "thead"))'
    expr = "%s and %s" % (xpath_cls('djn-item'), xpath_item_predicate)
    if model_name:
        expr += ' and contains(@class, "-%s")' % model_name
    return expr


@override_settings(ROOT_URLCONF='nested_admin.tests.urls')
class BaseNestedAdminTestCase(SeleniumTestCase, StaticLiveServerTestCase):

    has_grappelli = bool('grappelli' in settings.INSTALLED_APPS)
    has_suit = bool('suit' in settings.INSTALLED_APPS)

    root_model = None
    nested_models = None

    maxDiff = None

    @property
    def available_apps(self):
        apps = [
            'django.contrib.auth',
            'django.contrib.contenttypes',
            'django.contrib.messages',
            'django.contrib.sessions',
            'django.contrib.sites',
            'django.contrib.staticfiles',
            'django.contrib.admin',
            'nested_admin',
        ]
        if self.has_grappelli:
            apps.insert(0, 'grappelli')

        current_app = type(self).__module__.rpartition('.')[0]
        apps.append(current_app)

    @classmethod
    def setUpClass(cls):
        super(BaseNestedAdminTestCase, cls).setUpClass()
        import nested_admin.tests.urls

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
        self.selenium.set_window_size(1120, 1300)
        self.selenium.set_page_load_timeout(10)
        User.objects.create_superuser(username='super', password='secret', email='super@example.com')
        self.logged_in = False

    def tearDown(self):
        # Close any popup windows that might have stuck around (for instance,
        # if an assertion failed or an exception occurred while a popup was
        # open)
        try:
            popup_window = self.selenium.window_handles[1]
        except:
            pass
        else:
            self.selenium.switch_to.window(popup_window)
            self.selenium.close()
            self.selenium.switch_to.window(self.selenium.window_handles[0])

    def assertNotRegex(self, s, r):
        matches = r.findall(s)
        self.assertEqual(matches, [])

    def wait_for(self, css_selector, timeout=10):
        """
        Helper function that blocks until a CSS selector is found on the page.
        """
        from selenium.webdriver.common.by import By
        from selenium.webdriver.support import expected_conditions as ec
        self.wait_until(
            ec.presence_of_element_located((By.CSS_SELECTOR, css_selector)),
            timeout
        )

    invalid_re = re.compile(r'(?<=INVALID {{ )((?:.(?!}}))*?) }}')

    def wait_page_loaded(self):
        """
        Block until page has started to load.
        """
        from selenium.common.exceptions import TimeoutException
        try:
            # Wait for the next page to be loaded
            self.wait_for('body')
        except TimeoutException:
            # IE7 occasionally returns an error "Internet Explorer cannot
            # display the webpage" and doesn't load the next page. We just
            # ignore it.
            pass
        else:
            self.assertNotRegex(self.selenium.page_source, self.invalid_re)

    def admin_login(self, username, password, login_url=None):
        """
        Helper function to log into the admin.
        """
        self.client.login(username=username, password=password)
        self.selenium.get("%s%s" % (self.live_server_url, '/static/blank.html'))
        self.wait_page_loaded()
        for k, v in self.client.cookies.items():
            self.selenium.add_cookie({'name': k, 'value': v.value, 'path': '/'})
        if login_url:
            self.selenium.get("%s%s" % (self.live_server_url, login_url))
            self.wait_page_loaded()
        self.logged_in = True

    def wait_until(self, callback, timeout=10, message=None):
        """
        Helper function that blocks the execution of the tests until the
        specified callback returns a value that is not falsy. This function can
        be called, for example, after clicking a link or submitting a form.
        See the other public methods that call this function for more details.
        """
        from selenium.webdriver.support.wait import WebDriverWait
        WebDriverWait(self.selenium, timeout).until(callback, message)

    def wait_until_visible_selector(self, selector, timeout=10):
        self.wait_until(
            visibility_of_element_located((By.CSS_SELECTOR, selector)),
            timeout=timeout,
            message="Timeout waiting for visible element at selector='%s'" % selector)

    def wait_until_clickable_xpath(self, xpath, timeout=10):
        self.wait_until(
            element_to_be_clickable((By.XPATH, xpath)), timeout=timeout,
            message="Timeout waiting for clickable element at xpath='%s'" % xpath)

    def wait_until_clickable_selector(self, selector, timeout=10):
        self.wait_until(
            element_to_be_clickable((By.CSS_SELECTOR, selector)),
            timeout=timeout,
            message="Timeout waiting for clickable element at selector='%s'" % selector)

    def wait_until_available_selector(self, selector, timeout=10):
        self.wait_until(
            lambda driver: driver.find_element_by_css_selector(selector),
            timeout=timeout,
            message="Timeout waiting for available element at selector='%s'" % selector)

    def wait_until_available_xpath(self, xpath, timeout=10):
        self.wait_until(
            lambda driver: driver.find_element_by_xpath(xpath),
            timeout=timeout,
            message="Timeout waiting for available element at xpath='%s'" % xpath)

    @contextlib.contextmanager
    def visible_selector(self, selector, timeout=10):
        self.wait_until_visible_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def clickable_selector(self, selector, timeout=10):
        self.wait_until_clickable_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def clickable_xpath(self, xpath, timeout=10):
        self.wait_until_clickable_xpath(xpath, timeout)
        yield self.selenium.find_element_by_xpath(xpath)

    @contextlib.contextmanager
    def available_selector(self, selector, timeout=10):
        self.wait_until_available_selector(selector, timeout)
        yield self.selenium.find_element_by_css_selector(selector)

    @contextlib.contextmanager
    def available_xpath(self, xpath, timeout=10):
        self.wait_until_available_xpath(xpath, timeout)
        yield self.selenium.find_element_by_xpath(xpath)

    @contextlib.contextmanager
    def switch_to_popup_window(self):
        self.wait_until(lambda d: len(d.window_handles) == 2)
        self.selenium.switch_to.window(self.selenium.window_handles[1])
        yield
        try:
            self.wait_until(lambda d: len(d.window_handles) == 1)
        except:
            self.close()
            raise
        finally:
            self.selenium.switch_to.window(self.selenium.window_handles[0])

    def load_admin(self, obj=None):
        info = (self.root_model._meta.app_label, self.root_model._meta.object_name.lower())
        if obj:
            url = reverse('admin:%s_%s_change' % info, args=[obj.pk])
        else:
            url = reverse('admin:%s_%s_add' % info)
        if not self.logged_in:
            self.admin_login("super", "secret", url)
        else:
            self.selenium.get('%s%s' % (self.live_server_url, url))
            self.wait_page_loaded()
        self.selenium.set_window_size(1120, 1300)
        self.selenium.set_page_load_timeout(10)
        self.selenium.execute_script("window.$ = django.jQuery")
        self.make_header_footer_position_static()

    def save_form(self):
        browser_errors = [e for e in self.selenium.get_log('browser')
                          if 'favicon' not in e['message']]
        if len(browser_errors) > 0:
            logger.error("Found browser errors: %s" % json.dumps(browser_errors, indent=4))
        # Account for FK popups, which do not have "Save and continue editing"
        has_continue = bool(
            self.selenium.execute_script('return django.jQuery("[name=_continue]").length;'))
        name_attr = "_continue" if has_continue else "_save"
        self.selenium.find_element_by_xpath('//*[@name="%s"]' % name_attr).click()
        if has_continue:
            self.wait_page_loaded()
            self.selenium.set_window_size(1120, 1300)
            self.selenium.set_page_load_timeout(10)
            self.selenium.execute_script("window.$ = django.jQuery")
            self.make_header_footer_position_static()

    def make_header_footer_position_static(self):
        """Make grappelli header and footer element styles 'position: static'"""
        self.selenium.execute_script(
            "$('footer').attr('class', 'grp-module grp-submit-row');"
            "$('#content-inner').css('bottom', '0');"
            "$('#grp-header').css('position', 'static');"
            "$('#grp-content').css('top', '0');")

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
            el.click()
        indexes[-1] = [model_name, new_index]
        if name is not None:
            self.set_field("name", name, indexes=indexes)
        if slug is not None:
            self.set_field("slug", slug, indexes=indexes)

    def remove_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name = indexes[-1][0]
        remove_selector = "#%s .djn-remove-handler.djn-model-%s" % (
            self.get_item(indexes).get_attribute('id'), model_name)
        with self.clickable_selector(remove_selector) as el:
            el.click()

    def delete_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_name = indexes[-1][0]
        item_id = self.get_item(indexes).get_attribute('id')
        delete_selector = "#%s .djn-delete-handler.djn-model-%s" % (
            item_id, model_name)
        with self.clickable_selector(delete_selector) as el:
            el.click()
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
            el.click()
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


class DragAndDropAction(object):

    def __init__(self, test_case, from_indexes, to_indexes):
        self.test_case = test_case
        self.selenium = test_case.selenium

        if len(from_indexes) > len(to_indexes):
            self.target_is_empty = True
        else:
            self.target_is_empty = False

        self.from_indexes = self.test_case._normalize_indexes(from_indexes, named_models=False)
        self.to_indexes = self.test_case._normalize_indexes(
            to_indexes, is_group=self.target_is_empty, named_models=False)

        num_inlines_indexes = self.test_case._normalize_indexes(
            to_indexes, is_group=self.target_is_empty, named_models=True)
        if not is_integer(num_inlines_indexes[-1]):
            num_inlines_indexes[-1] = num_inlines_indexes[-1][0]
        self.target_num_items = self.test_case.get_num_inlines(num_inlines_indexes)

        if is_integer(self.to_indexes[-1]):
            self.to_indexes[-1] = [self.to_indexes[-1], 0]
        self.to_indexes = [tuple(i) for i in self.to_indexes]

        inline_models = self.test_case.models[1]
        for inline_index, item_index in self.to_indexes[:-1]:
            inline_models = inline_models[inline_index][1]
        self.target_num_inlines = len(inline_models)

        if self.from_indexes[:-1] == self.to_indexes[:-1]:
            if self.from_indexes[-1][1] < self.to_indexes[-1][1]:
                self.to_indexes[-1][1] += 1

        self.test_case.assertEqual(len(to_indexes), len(from_indexes),
            "Depth of source and target must be the same")

    @property
    def source(self):
        if not hasattr(self, '_source'):
            source_item = self.test_case.get_item(indexes=self.from_indexes)
            if source_item.tag_name == 'div':
                drag_handler_xpath = "h3"
            elif self.test_case.has_grappelli:
                drag_handler_xpath = "/".join([
                    "*[%s]" % xpath_cls("djn-tr"),
                    "*[%s]" % xpath_cls("djn-td"),
                    "*[%s]" % xpath_cls("tools"),
                    "/*[%s]" % xpath_cls("djn-drag-handler"),
                ])
            else:
                drag_handler_xpath = "/".join([
                    "*[%s]" % xpath_cls("djn-tr"),
                    "*[%s]" % xpath_cls("is-sortable"),
                    "*[%s]" % xpath_cls("djn-drag-handler"),
                ])
            self._source = source_item.find_element_by_xpath(drag_handler_xpath)
        return self._source

    @property
    def target(self):
        if not hasattr(self, '_target'):
            if len(self.to_indexes) > 1:
                target_inline_parent = self.test_case.get_item(self.to_indexes[:-1])
            else:
                target_inline_parent = self.selenium
            target_xpath = ".//*[%s][%d]//*[%s]" % (
                xpath_cls('djn-group'), self.to_indexes[-1][0] + 1, xpath_cls("djn-items"))
            if self.target_num_items != self.to_indexes[-1][1]:
                target_xpath += "/*[%(item_pred)s][%(item_pos)d]" % {
                    'item_pred': xpath_item(),
                    'item_pos': self.to_indexes[-1][1] + 1,
                }
            self._target = target_inline_parent.find_element_by_xpath(target_xpath)
        return self._target

    def initialize_drag(self):
        source = self.source
        if self.test_case.has_suit and self.test_case.browser == 'chrome' and source.tag_name == 'h3':
            source = source.find_element_by_css_selector('b')
        (ActionChains(self.selenium)
            .move_to_element_with_offset(source, 0, 0)
            .click_and_hold()
            .perform())
        time.sleep(0.05)
        ActionChains(self.selenium).move_by_offset(0, -15).perform()
        time.sleep(0.05)
        ActionChains(self.selenium).move_by_offset(0, 15).perform()
        with self.test_case.visible_selector('.ui-sortable-helper') as el:
            return el

    def move_by_offset(self, x_offset, y_offset):
        increment = -15 if y_offset < 0 else 15
        for offset in range(0, y_offset, increment):
            ActionChains(self.selenium).move_by_offset(0, increment).perform()
        if offset != y_offset:
            ActionChains(self.selenium).move_by_offset(0, y_offset - offset).perform()

    def release(self):
        ActionChains(self.selenium).release().perform()

    def _match_helper_with_target(self, helper, target):
        limit = 8
        count = 0
        # True if aiming for the bottom of the target
        helper_height = helper.size['height']
        self.move_by_offset(0, -1)
        desired_pos = tuple(self.to_indexes)
        target_bottom = bool(0 < self.to_indexes[-1][1] == (self.target_num_items - 1)
            and self.to_indexes[-1][0] == (self.target_num_inlines - 1)
            and cmp(desired_pos[:-1], self.current_position[:-1]) > -1)

        while True:
            helper_y = helper.location['y']
            y_offset = target.location['y'] - helper_y
            if target_bottom:
                if y_offset > 0:
                    y_offset += target.size['height']
                else:
                    y_offset += target.size['height'] - helper_height
            if abs(y_offset) < 1:
                break
            if count >= limit:
                break
            scaled_offset = int(round(y_offset * 0.9))
            self.move_by_offset(0, scaled_offset)
            if count == 0 and helper_y == helper.location['y']:
                # phantomjs: the drag didn't have any effect.
                # refresh the action chain
                self.release()
                time.sleep(0.1)
                helper = self.initialize_drag()
                time.sleep(0.1)
                self.move_by_offset(0, scaled_offset)
            curr_pos = self.current_position
            pos_diff = cmp(desired_pos, curr_pos)
            if pos_diff == 0:
                break
            count += 1
        return helper

    def _num_preceding_siblings(self, ctx, condition):
        """
        For an unknown reason, evaluating XPath expressions of the form

            preceding-sibling::*[not(contains(@attr, 'value'))]

        Where 'value' is contained in at least one of the preceding siblings,
        is extraordinarily slow. So we just grab all siblings and iterate
        through the elements in python.
        """
        siblings = ctx.find_element_by_xpath('parent::*').find_elements_by_xpath('*')
        count = 0
        for el in siblings:
            if el.id == ctx.id:
                break
            if condition(el):
                count += 1
        return count

    def _num_preceding_djn_items(self, ctx):
        def is_djn_item(el):
            classes = set(re.split(r'\s+', el.get_attribute('class')))
            return (classes & {'djn-item'} and
                not(classes & {'djn-no-drag', 'djn-thead', 'djn-item-dragging'}))

        return self._num_preceding_siblings(ctx, condition=is_djn_item)

    def _num_preceding_djn_groups(self, ctx):
        def is_djn_group(el):
            return "djn-group" in re.split(r'\s+', el.get_attribute('class'))

        return self._num_preceding_siblings(ctx, condition=is_djn_group)

    @property
    def current_position(self):
        placeholder = self.selenium.find_element_by_css_selector(
            '.ui-sortable-placeholder')
        pos = []
        ctx = None
        ancestor_xpath = 'ancestor::*[%s][1]' % xpath_cls("djn-item")
        for i in range(0, len(self.to_indexes)):
            if ctx is None:
                ctx = placeholder
            else:
                ctx = ctx.find_element_by_xpath(ancestor_xpath)
            item_index = self._num_preceding_djn_items(ctx)
            ctx = ctx.find_element_by_xpath('ancestor::*[%s][1]' % xpath_cls("djn-group"))
            inline_index = self._num_preceding_djn_groups(ctx)
            pos.insert(0, (inline_index, item_index))
        return tuple(pos)

    def _finesse_position(self, helper, target):
        limit = 200
        count = 0
        helper_height = helper.size['height']
        if self.target_num_items == 0:
            dy = max(1, int(round(helper_height / 38.0)))
        else:
            dy = int(round(helper_height / 10.0))
        desired_pos = tuple(self.to_indexes)
        while True:
            if count >= limit:
                break
            curr_pos = self.current_position
            pos_diff = cmp(desired_pos, curr_pos)
            if pos_diff == 0:
                break
            self.move_by_offset(0, pos_diff * dy)
            count += 1

    def move_to_target(self, screenshot_hack=False):
        target = self.target
        helper = self.initialize_drag()
        if screenshot_hack and 'phantomjs' in self.test_case.browser:
            # I don't know why, but saving a screenshot fixes a weird bug
            # in phantomjs
            self.selenium.save_screenshot('/dev/null')
        helper = self._match_helper_with_target(helper, target)
        self._finesse_position(helper, target)
        self.release()


def expected_failure_if_grappelli(func):
    if 'grappelli' in settings.INSTALLED_APPS:
        return unittest.expectedFailure(func)
    return func


def expected_failure_if_suit(func):
    if 'suit' in settings.INSTALLED_APPS:
        return unittest.expectedFailure(func)
    return func


def skip_if_not_grappelli(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        if 'grappelli' not in settings.INSTALLED_APPS:
            raise unittest.SkipTest("Skipping (grappelli required)")
        return func(*args, **kwargs)
    return wrapper
