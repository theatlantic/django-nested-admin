from contextlib import contextmanager
import time
from unittest import SkipTest

import django
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.utils.text import slugify

try:
    from html import unescape
except ImportError:
    from django.utils.text import unescape_entities as unescape

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as ec
from selenium.webdriver.support.ui import Select
import six

from nested_admin.tests.base import (
    skip_if_not_grappelli, BaseNestedAdminTestCase)
from .models import (
    WidgetsRoot, WidgetsA, WidgetsB,
    WidgetsC0, WidgetsC1,
    WidgetMediaOrderRoot, WidgetMediaOrderA, WidgetMediaOrderB,
    WidgetMediaOrderC0, WidgetMediaOrderC1)
from .admin import (
    WidgetsAInline, WidgetsBInline, WidgetsM2M,
    WidgetsC0Inline, WidgetsC1Inline,
    WidgetMediaOrderAInline, WidgetMediaOrderBInline,
    WidgetMediaOrderC0Inline, WidgetMediaOrderC1Inline)


class BaseWidgetTestCase(BaseNestedAdminTestCase):

    admin_classes = []

    root_model = None
    nested_models = []

    fixtures = ['admin-widgets.xml']

    @classmethod
    def setUpClass(cls):
        super(BaseWidgetTestCase, cls).setUpClass()
        if cls.nested_models:
            cls.a_model, cls.b_model, (cls.c0_model, cls.c1_model) = cls.nested_models

    @contextmanager
    def enable_inline_collapsing(self):
        """A context manager that configures the inline classes to be collapsible."""
        if 'grappelli' in settings.INSTALLED_APPS:
            class_attr = "inline_classes"
            class_val = ("grp-collapse", "grp-closed")
            reset_val = ("grp-collapse", "grp-open")
        else:
            class_attr = "classes"
            class_val = ("collapse", )
            reset_val = None

        for admin in self.admin_classes:
            setattr(admin, class_attr, class_val)
        try:
            yield
        finally:
            for admin in self.admin_classes:
                setattr(admin, class_attr, reset_val)

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
        self.click(date_el.find_element_by_xpath(now_link_xpath))
        if self.has_grappelli:
            selector = '#ui-datepicker-div .ui-state-highlight'
            with self.clickable_selector(selector, timeout=1) as el:
                self.selenium.execute_script('arguments[0].scrollIntoView()', date_el)
                self.click(el)
                self.wait_until_element_is('#ui-datepicker-div', ':not(:visible)',
                    'Datepicker widget did not close')
        time.sleep(0.1)
        self.click(time_el.find_element_by_xpath(now_link_xpath))
        if self.has_grappelli:
            selector = '#ui-timepicker .ui-state-active'
            with self.clickable_selector(selector, timeout=1) as el:
                self.selenium.execute_script('arguments[0].scrollIntoView()', time_el)
                self.click(el)
                self.wait_until_element_is('#ui-timepicker', ':not(:visible)',
                    'Timepicker widget did not close')
        time.sleep(0.10)
        self.assertNotEqual(date_el.get_attribute('value'), '', 'Date was not set')
        self.assertNotEqual(time_el.get_attribute('value'), '', 'Time was not set')

    def check_m2m(self, indexes):
        add_all_link = self.get_field('m2m_add_all_link', indexes)
        remove_all_link = self.get_field('m2m_remove_all_link', indexes)
        self.click(remove_all_link)
        self.click(add_all_link)
        m2m_to_sel = self.get_form_field_selector('m2m_to', indexes)
        time.sleep(0.2)
        selected = self.selenium.execute_script((
            'return $("%s").find("option").toArray().map('
            '  function(el) { return parseInt(el.value, 10); })') % m2m_to_sel)
        self.assertEqual(selected, [1, 2, 3])

    def check_fk(self, indexes):
        field = self.get_field('fk1', indexes)
        parent = field.get_property('parentNode').get_property('parentNode')
        add_related = parent.find_element_by_css_selector('.add-related')
        if self.has_grappelli:
            # Grappelli can be very slow to initialize fk bindings, particularly
            # when run on travis-ci
            time.sleep(1)
        self.click(add_related)
        name = self.get_name_for_indexes(indexes)
        with self.switch_to_popup_window():
            self.set_field('name', name)
            self.save_form()
        time.sleep(0.1)
        field_id = field.get_attribute('id')
        current_val = self.selenium.execute_script(
            'return $("#%s").find("option:selected").html()' % field_id)
        self.assertEqual(unescape(current_val), name)

    def check_gfk_related_lookup(self, indexes):
        ctype_field = self.get_field('content_type', indexes)
        select = Select(ctype_field)
        m2m_ctype_id = ContentType.objects.get_for_model(WidgetsM2M).pk
        select.select_by_value(str(m2m_ctype_id))
        object_id_field = self.get_field('object_id', indexes)
        object_id_field_id = object_id_field.get_attribute('id')
        related_lookup_selector = (
            "#%s + .related-lookup" % object_id_field_id)

        self.wait_until(
            ec.element_to_be_clickable((By.CSS_SELECTOR, related_lookup_selector)),
            message="Timeout waiting for related lookup widget on '#%s'" % object_id_field_id)

        lookup_el = self.selenium.find_element_by_css_selector(related_lookup_selector)
        lookup_el.click()
        with self.switch_to_popup_window():
            with self.clickable_xpath('//tr//a[text()="Zither"]') as el:
                el.click()
        time.sleep(0.1)

        z_pk = "%s" % WidgetsM2M.objects.get(name='Zither').pk

        def element_value_populated(d):
            el = d.find_element_by_css_selector("#%s" % object_id_field_id)
            return el.get_attribute('value')

        self.wait_until(
            element_value_populated,
            message='Timeout waiting for gfk object_id value')
        self.assertEqual(z_pk, object_id_field.get_attribute('value'))


class Widgets(BaseWidgetTestCase):

    admin_classes = [
        WidgetsAInline, WidgetsBInline,
        WidgetsC0Inline, WidgetsC1Inline,
    ]

    root_model = WidgetsRoot
    nested_models = (WidgetsA, WidgetsB,
        (WidgetsC0, WidgetsC1))

    def test_collapsible_inlines(self):
        with self.enable_inline_collapsing():
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

            self.click(collapse_handler)
            self.assertTrue(name_field.is_displayed(), "Inline did not expand")
            self.click(collapse_handler)
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

    def test_add_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.check_prepopulated([1])

    def test_add_initial_extra_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.check_prepopulated([1, 0])

    def test_add_m2m(self):
        self.load_admin()
        self.add_inline()
        self.check_m2m([1])

    def test_add_fk(self):
        self.load_admin()
        if self.has_grappelli:
            time.sleep(0.3)
        self.add_inline()
        if self.has_grappelli:
            time.sleep(0.3)
        time.sleep(0.1)
        self.check_fk([1])

    def test_add_initial_extra_m2m(self):
        self.load_admin()
        time.sleep(0.2)
        self.add_inline()
        time.sleep(0.2)
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

    def test_add_two_deep_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.check_prepopulated([1, 1])

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

    def test_add_three_deep_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_prepopulated([1, 0, [1, 0]])

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
            '//*[@id="id_widgetsa_set-1-widgetsb_set-0-fk2-autocomplete"]')
        self.assertNotEqual(len(autocomplete_elements), 0,
            "Zero autocomplete fields initialized")
        self.assertEqual(len(autocomplete_elements), 1,
            "Too many autocomplete fields initialized")

    @skip_if_not_grappelli
    def test_gfk_related_lookup_initial_extra(self):
        self.load_admin()
        self.check_gfk_related_lookup([0])
        self.check_gfk_related_lookup([0, 0])

    @skip_if_not_grappelli
    def test_gfk_related_lookup_add_three_deep(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_gfk_related_lookup([1, 0, [1, 0]])

    def test_nested_autocomplete_extra(self):
        if self.has_grappelli:
            raise SkipTest("Not testing autocomplete on grappelli")
        if django.VERSION < (2, 0):
            raise SkipTest("autocomplete_fields not available in Django before 2.0")
        self.load_admin()
        self.add_inline([0, [0]])
        self.add_inline([0, 1, [0]])
        select_field = self.get_field('fk3', indexes=[0, 1, [0, 0]])
        select_parent = select_field.find_element_by_xpath('parent::*')
        select_parent.click()
        select2_is_active = self.selenium.execute_script(
            'return $(".select2-search__field").length > 0')
        self.assertTrue(select2_is_active)
        select2_input = self.selenium.execute_script('return $(".select2-search__field")[0]')
        self.assertIsNotNone(select2_input)
        select2_input.send_keys('l')
        select2_input.send_keys(Keys.ENTER)
        self.assertEqual(select_field.get_attribute('value'), '2')


class WidgetMediaOrder(BaseWidgetTestCase):

    admin_classes = [
        WidgetMediaOrderAInline, WidgetMediaOrderBInline,
        WidgetMediaOrderC0Inline, WidgetMediaOrderC1Inline,
    ]

    root_model = WidgetMediaOrderRoot
    nested_models = (WidgetMediaOrderA, WidgetMediaOrderB,
        (WidgetMediaOrderC0, WidgetMediaOrderC1))

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

    def test_add_three_deep_prepopulated(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_prepopulated([1, 0, [1, 0]])

    def test_add_three_deep_datetime(self):
        self.load_admin()
        self.add_inline()
        self.add_inline([1])
        self.add_inline([1, 0, [1]])
        self.check_datetime([1, 0, [1, 0]])
