from contextlib import contextmanager
import time
from unittest import expectedFailure, SkipTest

import django
from django.conf import settings
from django.utils import six
from django.utils.text import slugify, unescape_entities

from nested_admin.tests.base import (
    expected_failure_if_grappelli, expected_failure_if_suit,
    skip_if_not_grappelli, BaseNestedAdminTestCase)
from .models import (
    TestAdminWidgetsRoot, TestAdminWidgetsA, TestAdminWidgetsB,
    TestAdminWidgetsC0, TestAdminWidgetsC1)
from .admin import (
    TestAdminWidgetsAInline, TestAdminWidgetsBInline,
    TestAdminWidgetsC0Inline, TestAdminWidgetsC1Inline)


admin_classes = [
    TestAdminWidgetsAInline, TestAdminWidgetsBInline,
    TestAdminWidgetsC0Inline, TestAdminWidgetsC1Inline,
]


@contextmanager
def enable_inline_collapsing():
    """A context manager that configures the inline classes to be collapsible."""
    if 'grappelli' in settings.INSTALLED_APPS:
        class_attr = "inline_classes"
        class_val = ("collapse", "closed", "grp-collapse", "grp-closed")
        reset_val = ("collapse", "open", "grp-collapse", "grp-open")
    else:
        class_attr = "classes"
        class_val = ("collapse", )
        reset_val = None

    for admin in admin_classes:
        setattr(admin, class_attr, class_val)
    try:
        yield
    finally:
        for admin in admin_classes:
            setattr(admin, class_attr, reset_val)


class TestAdminWidgets(BaseNestedAdminTestCase):

    fixtures = ['admin-widgets.xml']

    root_model = TestAdminWidgetsRoot
    nested_models = (TestAdminWidgetsA, TestAdminWidgetsB,
        (TestAdminWidgetsC0, TestAdminWidgetsC1))

    @classmethod
    def setUpClass(cls):
        super(TestAdminWidgets, cls).setUpClass()
        cls.a_model, cls.b_model, (cls.c0_model, cls.c1_model) = cls.nested_models

    def get_name_for_indexes(self, indexes):
        name = "Item %s" % (" ABC"[len(indexes)])
        if name == 'Item C':
            name += "%d%d" % (indexes[-1][0], indexes[-1][1])
        else:
            name += "%d" % indexes[-1]

        name += " (%s)" % " > ".join(["%s" % i[1] for i in self._normalize_indexes(indexes)])
        return name

    def check_prepopulated(self, indexes):
        name = self.get_name_for_indexes(indexes)
        expected_slug = slugify(six.text_type(name))

        slug_sel = self.get_form_field_selector('slug', indexes)

        self.set_field('name', name, indexes)
        time.sleep(0.2)
        slug_val = self.selenium.execute_script(
            'return $("%s").val()' % slug_sel)
        self.assertEqual(slug_val, expected_slug, "prepopulated slug field did not sync")

    def check_datetime(self, indexes):
        date_el = self.get_field('date_0', indexes)
        time_el = self.get_field('date_1', indexes)

        if self.has_grappelli:
            now_link_xpath = "following-sibling::*[1]"
        else:
            now_link_xpath = "following-sibling::*[1]/a[1]"
        date_el.clear()
        time_el.clear()
        date_el.find_element_by_xpath(now_link_xpath).click()
        if self.has_grappelli:
            selector = '#ui-datepicker-div .ui-state-highlight'
            with self.clickable_selector(selector, timeout=1) as el:
                el.click()
        time.sleep(0.1)
        time_el.find_element_by_xpath(now_link_xpath).click()
        if self.has_grappelli:
            selector = '#ui-timepicker .ui-state-active'
            with self.clickable_selector(selector, timeout=1) as el:
                el.click()
        time.sleep(0.10)
        self.assertNotEqual(date_el.get_attribute('value'), '', 'Date was not set')
        self.assertNotEqual(time_el.get_attribute('value'), '', 'Time was not set')

    def check_m2m(self, indexes):
        add_all_link = self.get_field('m2m_add_all_link', indexes)
        remove_all_link = self.get_field('m2m_remove_all_link', indexes)
        remove_all_link.click()
        add_all_link.click()
        m2m_to_sel = self.get_form_field_selector('m2m_to', indexes)
        time.sleep(0.2)
        selected = self.selenium.execute_script(
            'return $("%s").find("option").toArray().map(function(el) { return parseInt(el.value, 10); })'
                % m2m_to_sel)
        self.assertEqual(selected, [1, 2, 3])

    def check_fk(self, indexes):
        field = self.get_field('fk1', indexes)
        parent = field.find_element_by_xpath('parent::*')
        add_related = parent.find_element_by_css_selector('.add-related')
        if self.has_grappelli:
            # Grappelli can be very slow to initialize fk bindings, particularly
            # when run on travis-ci
            time.sleep(1)
        add_related.click()
        name = self.get_name_for_indexes(indexes)
        with self.switch_to_popup_window():
            self.set_field('name', name)
            self.save_form()
        time.sleep(0.1)
        field_id = field.get_attribute('id')
        current_val = self.selenium.execute_script(
            'return $("#%s").find("option:selected").html()' % field_id)
        self.assertEqual(unescape_entities(current_val), name)

    def test_collapsible_inlines(self):
        if not self.has_grappelli and django.VERSION < (1, 10):
            raise SkipTest("Collapsible inlines not supported")

        with enable_inline_collapsing():
            self.load_admin()
            name_field = self.get_field('name', [0])

            self.assertFalse(name_field.is_displayed(), "Inline did not load collapsed")

            if self.has_grappelli:
                collapse_handler = self.selenium.execute_script(
                    'return $(arguments[0]).find("> .djn-collapse-handler")[0]',
                    self.get_item([0]))
            else:
                collapse_handler = self.selenium.execute_script(
                    'return $(arguments[0]).find("> fieldset > h2 > .collapse-toggle")[0]',
                    self.get_group())

            collapse_handler.click()
            self.assertTrue(name_field.is_displayed(), "Inline did not expand")
            collapse_handler.click()
            self.assertFalse(name_field.is_displayed(), "Inline did not collapse")

    def test_initial_extra_prepopulated(self):
        self.load_admin()
        self.check_prepopulated([0])
        self.check_prepopulated([0, 0])

    def test_initial_extra_m2m(self):
        self.load_admin()
        self.check_m2m([0])
        self.check_m2m([0, 0])

    def test_initial_extra_fk_one_deep(self):
        self.load_admin()
        self.check_fk([0])

    def test_initial_extra_fk_two_deep(self):
        self.load_admin()
        if self.has_grappelli:
            time.sleep(0.3)
        self.check_fk([0, 0])

    def test_initial_extra_datetime(self):
        self.load_admin()
        self.check_datetime([0])
        self.check_datetime([0, 0])

    @expected_failure_if_suit  # Known bug with prepopulated fields and django-suit
    def test_add_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.check_prepopulated([1])

    @expected_failure_if_suit  # Known bug with prepopulated fields and django-suit
    def test_add_initial_extra_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.check_prepopulated([1, 0])

    def test_add_m2m(self):
        self.load_admin()
        self.add_inline()
        self.check_m2m([1])

    @expected_failure_if_suit  # Known bug with this test, django-suit, and phantomjs
    def test_add_fk(self):
        self.load_admin()
        if self.has_grappelli:
            time.sleep(0.3)
        self.add_inline()
        if self.has_grappelli:
            time.sleep(0.3)
        time.sleep(0.1)
        self.check_fk([1])

    @expectedFailure  # Known bug
    def test_add_initial_extra_m2m(self):
        self.load_admin()
        self.add_inline()
        self.check_m2m([1, 0])

    def test_add_initial_extra_fk(self):
        self.load_admin()
        if self.has_grappelli:
            time.sleep(0.3)
        self.add_inline()
        if self.has_grappelli:
            time.sleep(0.3)
        self.check_fk([1, 0])

    def test_add_datetime(self):
        self.load_admin()
        self.add_inline()
        self.check_datetime([1])

    @expected_failure_if_grappelli  # Known bug with datetime fields and grappelli
    def test_add_initial_extra_datetime(self):
        self.load_admin()
        self.add_inline()
        self.check_datetime([1, 0])

    def test_add_two_deep_m2m(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.check_m2m([1, 1])

    def test_add_two_deep_fk(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.check_fk([1, 1])

    @expected_failure_if_suit  # Known bug with prepopulated fields and django-suit
    def test_add_two_deep_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.check_prepopulated([1, 1])

    @expected_failure_if_grappelli  # Known bug with datetime fields and grappelli
    def test_add_two_deep_datetime(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.check_datetime([1, 1])

    def test_add_three_deep_m2m(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_m2m([1, 0, [1, 0]])

    def test_add_three_deep_fk(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_fk([1, 0, [1, 0]])

    @expected_failure_if_suit  # Known bug with prepopulated fields and django-suit
    def test_add_three_deep_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_prepopulated([1, 0, [1, 0]])

    @expected_failure_if_grappelli  # Known bug with datetime fields and grappelli
    def test_add_three_deep_datetime(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_datetime([1, 0, [1, 0]])

    @skip_if_not_grappelli
    def test_autocomplete_single_init(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        autocomplete_elements = self.selenium.find_elements_by_xpath(
            '//*[@id="id_testadminwidgetsa_set-1-testadminwidgetsb_set-0-fk2-autocomplete"]')
        self.assertNotEqual(len(autocomplete_elements), 0,
            "Zero autocomplete fields initialized")
        self.assertEqual(len(autocomplete_elements), 1,
            "Too many autocomplete fields initialized")
