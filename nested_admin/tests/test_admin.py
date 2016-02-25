import time
from unittest import SkipTest, skipIf

import django
from django.conf import settings

from selenium.webdriver.common.action_chains import ActionChains

from .base import BaseNestedAdminTestCase
from .models import (
    StackedGroup, StackedSection, StackedItem,
    TabularGroup, TabularSection, TabularItem,
    SortableWithExtraRoot, SortableWithExtraChild)


if not hasattr(__builtins__, 'cmp'):
    def cmp(a, b):
        return (a > b) - (a < b)


def xpath_cls(classname):
    return 'contains(concat(" ", @class, " "), " %s ")' % classname


def xpath_item():
    xpath_item_predicate = 'not(contains(@class, "-drag")) and not(self::thead)'
    return "%s and %s" % (xpath_cls('djn-item'), xpath_item_predicate)


class DragAndDropAction(object):

    def __init__(self, test_case, from_section, from_item, to_section, to_item=None):
        self.test_case = test_case
        self.selenium = test_case.selenium

        self.target_num_items = self.test_case.get_num_items(to_section)

        if to_item is None:
            self.test_case.assertEqual(self.target_num_items, 0,
                "Must specify target item index when section is not empty")
            to_item = 0

        self.from_section = from_section
        self.from_item = from_item
        self.to_section = to_section
        self.to_item = to_item

    def css_select(self, selector):
        return self.selenium.find_element_by_css_selector(selector)

    @property
    def source(self):
        if not hasattr(self, '_source'):
            base_sel = self.test_case.djn_items_base_selector
            source_section = self.css_select("%s > .djn-items > .djn-item:nth-child(%d)"
                    % (base_sel, self.from_section + 2))
            self._source = source_section.find_element_by_xpath(
                ".//*[%(items_cls)s]/*[%(item_pred)s][%(item_pos)d]/%(drag_handler)s" % {
                    'items_cls': xpath_cls("djn-items"),
                    'item_pred': xpath_item(),
                    'item_pos': self.from_item + 1,
                    'drag_handler': self.drag_handler_xpath,
                })
        return self._source

    @property
    def target(self):
        if not hasattr(self, '_target'):
            base_sel = self.test_case.djn_items_base_selector
            target_section = self.css_select("%s > .djn-items > .djn-item:nth-child(%d)"
                    % (base_sel, self.to_section + 2))
            item_xpath = ".//*[%s]" % xpath_cls("djn-items")
            if self.target_num_items != self.to_item:
                item_xpath += "/*[%(item_pred)s][%(item_pos)d]" % {
                    'item_pred': xpath_item(),
                    'item_pos': self.to_item + 1,
                }
            self._target = target_section.find_element_by_xpath(item_xpath)
        return self._target

    @property
    def drag_handler_xpath(self):
        if self.test_case.inline_type == 'stacked':
            return "h3"
        elif self.test_case.is_grappelli:
            return "/".join([
                "*[%s]" % xpath_cls("djn-tr"),
                "*[%s]" % xpath_cls("djn-td"),
                "*[%s]" % xpath_cls("tools"),
                "/*[%s]" % xpath_cls("djn-drag-handler"),
            ])
        else:
            return "/".join([
                "*[%s]" % xpath_cls("djn-tr"),
                "*[%s]" % xpath_cls("is-sortable"),
                "*[%s]" % xpath_cls("djn-drag-handler"),
            ])

    def initialize_drag(self):
        source = self.source
        (ActionChains(self.selenium)
            .move_to_element_with_offset(source, 0, 0)
            .click_and_hold()
            .move_by_offset(0, -15)
            .move_by_offset(0, 15)
            .perform())
        time.sleep(0.1)
        return self.css_select('.ui-sortable-helper')

    @property
    def placeholder(self):
        return self.css_select('.ui-sortable-placeholder')

    def move_by_offset(self, x_offset, y_offset):
        ActionChains(self.selenium).move_by_offset(x_offset, y_offset).perform()

    def release(self):
        ActionChains(self.selenium).release().perform()

    def _match_helper_with_target(self, helper, target):
        limit = 8
        count = 0
        # True if aiming for the bottom of the target
        target_bottom = bool(0 < self.to_item == self.target_num_items)
        helper_height = helper.size['height']
        self.move_by_offset(0, -1)
        while True:
            helper_y = helper.location['y']
            y_offset = target.location['y'] - helper_y
            if target_bottom:
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
            count += 1
        return helper

    @property
    def current_position(self):
        placeholder = self.placeholder
        section = len(placeholder
            .find_element_by_xpath('ancestor::*[%s]' % xpath_cls("djn-item"))
            .find_elements_by_xpath('preceding-sibling::*[%s]' % xpath_item()))
        item = len(placeholder.find_elements_by_xpath(
            'preceding-sibling::*[%s]' % xpath_item()))
        return (section, item)

    def _finesse_position(self, helper, target):
        limit = 200
        count = 0
        if self.target_num_items == 0:
            dy = 1 if self.test_case.inline_type == 'tabular' else 8
        else:
            dy = 4 if self.test_case.inline_type == 'tabular' else 20
        desired_pos = (self.to_section, self.to_item)
        while True:
            if count >= limit:
                break
            curr_pos = self.current_position
            pos_diff = cmp(desired_pos, curr_pos)
            if pos_diff == 0:
                break
            if curr_pos[0] == desired_pos[0] and abs(curr_pos[1] - desired_pos[1]) > 1:
                mult = 2
            else:
                mult = 1
            self.move_by_offset(0, pos_diff * dy * mult)
            count += 1

    def move_to_target(self, screenshot_hack=False):
        target = self.target
        helper = self.initialize_drag()
        if screenshot_hack:
            # I don't know why, but saving a screenshot fixes a weird bug
            # in phantomjs
            self.selenium.save_screenshot('/dev/null')
        helper = self._match_helper_with_target(helper, target)
        self._finesse_position(helper, target)
        self.release()


class BaseInlineAdminTestCase(BaseNestedAdminTestCase):

    group_cls = None
    section_cls = None
    item_cls = None

    @classmethod
    def setUpClass(cls):
        if cls is BaseInlineAdminTestCase:
            raise SkipTest("Don't run tests on base test case")

        super(BaseInlineAdminTestCase, cls).setUpClass()

        if cls.group_cls is None:
            raise Exception("Test cases extending BaseTestInlineAdmin must define group_cls")
        if cls.section_cls is None:
            raise Exception("Test cases extending BaseTestInlineAdmin must define section_cls")
        if cls.item_cls is None:
            raise Exception("Test cases extending BaseTestInlineAdmin must define item_cls")

        if django.VERSION >= (1, 8):
            get_model_name = lambda m: m._meta.model_name
        else:
            get_model_name = lambda m: m._meta.object_name.lower()

        cls.section_model_name = get_model_name(cls.section_cls)
        cls.item_model_name = get_model_name(cls.item_cls)

        # will be 'stacked' or 'tabular'
        cls.inline_type = cls.section_model_name.replace('section', '')
        cls.is_grappelli = 'grappelli' in settings.INSTALLED_APPS

    def get_num_sections(self):
        return self.selenium.execute_script(
            "return $('.dynamic-form-%s').length" % self.section_model_name)

    def get_num_items(self, section):
        return self.selenium.execute_script(
            "return $('#section_set%d .dynamic-form-%s').length"
                % (section, self.item_model_name))

    @property
    def djn_items_base_selector(self):
        if self.inline_type == 'tabular' and not self.is_grappelli:
            return "#section_set-group > .tabular > .module"
        else:
            return "#section_set-group"

    def drag_and_drop_item(self, from_section, from_item, to_section, to_item=None, screenshot_hack=False):
        action = DragAndDropAction(self, from_section, from_item, to_section, to_item)
        action.move_to_target(screenshot_hack=screenshot_hack)

    def add_section(self, slug):
        index = self.get_num_sections()
        add_handler_selector = (".grp-add-item > a.grp-add-handler.%s"
            % self.section_model_name)
        with self.clickable_selector(add_handler_selector) as el:
            el.click()
        self.set_section_slug(section=index, slug=slug)

    def add_item(self, section, name=None):
        item_index = self.get_num_items(section=section)
        add_selector = (
            "#section_set-%d-item_set-group "
            ".grp-add-item > a.grp-add-handler.%s") % (section, self.item_model_name)
        with self.clickable_selector(add_selector) as el:
            el.click()
        if name is not None:
            self.set_item_name(section=section, item=item_index, name=name)

    def set_item_name(self, section, item, name):
        with self.clickable_selector('#id_section_set-%d-item_set-%d-name' % (section, item)) as el:
            el.clear()
            el.send_keys(name)

    def set_section_slug(self, section, slug):
        with self.clickable_xpath('//input[@name="section_set-%d-slug"]' % section) as el:
            el.clear()
            el.send_keys(slug)

    def remove_section(self, section):
        selector = ("#section_set%d .grp-remove-handler.%s"
            % (section, self.section_model_name))
        with self.clickable_selector(selector) as remove_button:
            remove_button.click()

    def get_section(self, section):
        return self.selenium.find_element_by_css_selector(
            "%s > .djn-items > .djn-item:nth-child(%d)"
                % (self.djn_items_base_selector, section + 2))

    def remove_item(self, section, item):
        item_xpath = "/".join([
            "*[%s]" % xpath_cls("djn-items"),
            "*[%s][%d]" % (xpath_item(), item + 1),
            "/a[%s]" % xpath_cls("grp-remove-handler"),
        ])
        self.get_section(section).find_element_by_xpath(".//%s" % item_xpath).click()

    def delete_item(self, section, item):
        item_xpath = "/".join([
            "*[%s]" % xpath_cls("djn-items"),
            "*[%s][%d]" % (xpath_item(), item + 1),
            "/a[%s]" % xpath_cls("grp-delete-handler"),
        ])
        self.get_section(section).find_element_by_xpath(".//%s" % item_xpath).click()

    def delete_section(self, section):
        sel = "#section_set%d" % section
        del_handler_sel = "a.grp-delete-handler.%s" % self.section_model_name
        self.selenium.find_element_by_css_selector('%s %s' % (sel, del_handler_sel)).click()
        self.wait_until_clickable_selector('%s.grp-predelete %s' % (sel, del_handler_sel))

    def undelete_section(self, section):
        sel = '#section_set%d' % section
        del_handler_sel = "a.grp-delete-handler.%s" % self.section_model_name
        self.selenium.find_element_by_css_selector('%s %s' % (sel, del_handler_sel)).click()
        self.wait_until_clickable_selector('%s:not(.grp-predelete) %s' % (sel, del_handler_sel))

    def test_add_section_to_empty(self):
        group = self.group_cls.objects.create(slug='test')

        self.load_change_admin(group)

        self.add_section(slug="test")
        self.save_form()

        sections = group.section_set.all()

        self.assertEqual(len(sections), 1)
        self.assertEqual(sections[0].slug, 'test')
        self.assertEqual(sections[0].position, 0)

    def test_add_item_to_empty(self):
        group = self.group_cls.objects.create(slug='test')
        section = self.section_cls.objects.create(slug='test', group=group, position=0)

        self.load_change_admin(group)

        item_verbose_name = self.item_cls._meta.verbose_name.title()
        with self.clickable_xpath('//a[text()="Add %s"]' % item_verbose_name) as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-item_set-0-name"]') as el:
            el.send_keys("Test")
        self.save_form()

        items = section.item_set.all()

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].name, "Test")
        self.assertEqual(items[0].position, 0)

    def test_drag_last_item_between_sections(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)
        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=1,
            screenshot_hack=True)
        self.save_form()

        item_b_2 = self.item_cls.objects.get(name='B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/B 2[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_middle_item_between_sections(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1)

        self.save_form()

        item_b_1 = self.item_cls.objects.get(name='B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/B 1[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 2[1]'])

    def test_drag_middle_item_between_sections_after_adding_new_item(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.add_item(section=1, name='B 3')
        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1,
            screenshot_hack=True)

        self.save_form()

        item_b_1 = self.item_cls.objects.get(name='B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/B 1[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 2[1]',
            'group/b[1]/B 3[2]'])

    def test_drag_middle_item_between_sections_after_adding_new_item_to_other_section(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.add_item(section=0, name='A 3')
        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1,
            screenshot_hack=True)

        self.save_form()

        item_b_1 = self.item_cls.objects.get(name='B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/B 1[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]',
            'group/a[0]/A 3[4]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 2[1]'])

    def test_drag_new_item_between_sections(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)

        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        self.add_item(section=1, name='B 2')
        time.sleep(0.01)
        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=1,
            screenshot_hack=True)

        self.save_form()

        item_b_2 = self.item_cls.objects.get(name='B 2')

        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/B 2[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_delete_item(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.delete_item(section=1, item=1)

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 2[1]'])

    def test_delete_section(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.delete_section(section=0)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.filter(slug='a')), 0, "Section was not deleted")

        section_b = self.section_cls.objects.get(slug='b')

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[0]/B 0[0]',
            'group/b[0]/B 1[1]',
            'group/b[0]/B 2[2]'])

    def test_delete_item_undelete_section(self):
        """
        Test that, if an item is deleted, then the section is deleted, and
        then the section is undeleted, that the item stays deleted.
        """
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.delete_item(section=0, item=1)
        self.delete_section(section=0)
        self.undelete_section(section=0)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.filter(slug='a')), 1, "Section should not be deleted")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 2[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]',
            'group/b[1]/B 2[2]'])

    def test_remove_item(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        self.add_item(section=1, name='B 2')
        self.remove_item(section=1, item=2)

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_item_to_empty_section(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0)

        self.save_form()

        item_b_2 = self.item_cls.objects.get(name='B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')],
            ['group/a[0]/B 2[0]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_item_to_first_position(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=0,
            screenshot_hack=True)

        self.save_form()

        item_b_2 = self.item_cls.objects.get(name='B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 2[0]',
            'group/a[0]/A 0[1]',
            'group/a[0]/A 1[2]',
            'group/a[0]/A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_item_to_last_position(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=3)

        self.save_form()

        item_b_2 = self.item_cls.objects.get(name='B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]',
            'group/a[0]/B 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    # This test fails with the phantomjs driver on Travis, but it passes locally
    # and it passes with the Chrome driver, so chalking it up to a fluke
    @skipIf(django.VERSION[:2] == (1, 9), "Skipping misbehaving test on travis")
    def test_drag_item_to_new_empty_section(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=2, to_section=1)

        self.save_form()

        item_a_2 = self.item_cls.objects.get(name='A 2')
        section_b = self.section_cls.objects.get(slug='b')
        self.assertEqual(item_a_2.section, section_b, "item was not moved to the correct section")
        self.assertEqual(item_a_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')],
            ['group/a[0]/A 0[0]', 'group/a[0]/A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')],
            ['group/b[1]/A 2[0]'])

    def test_position_update_bug(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)

        self.item_cls.objects.create(name='B 0', section=section_b, position=0)

        self.load_change_admin(group)

        self.add_item(section=0, name='A 0')
        self.add_item(section=0, name='A 1')
        self.add_item(section=0, name='A 2')

        # Move to second position of the first section
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=1)

        # Move to the last position of the first section
        self.drag_and_drop_item(from_section=0, from_item=1, to_section=0, to_item=3)

        def check_position_is_correct(d):
            val = d.execute_script(
                'return document.getElementById('
                '   "id_section_set-0-item_set-0-position").value')
            return val == '3'

        self.wait_until(
            check_position_is_correct,
            message="Timeout waiting for position to update to correct value")

        self.save_form()

        item_b_0 = self.item_cls.objects.get(name='B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]',
            'group/a[0]/B 0[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [])

    def test_drag_existing_item_to_new_section_and_back(self):
        group = self.group_cls.objects.create(slug='test')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2, "Save failed")

        item_a_0 = self.item_cls.objects.get(name='A 0')

        self.assertEqual(item_a_0.section, section_a, "Item is in the wrong section")
        self.assertEqual(item_a_0.position, 0, "Item has the wrong position")

    def test_drag_item_create_invalid_new_item_then_drag_back_after_validation_error_removing_invalid_item(self):
        """
        Tests regression of a scenario after encountering a validation error.

        Steps to reproduce:
            1. Begin with at least two items in each section
            2. Drag one of the items from the first section into the second
            3. Create an invalid item in the first section
            4. Save, encounter a validation error
            5. Drag the invalid item back to the first group
            6. Remove the invalid item
            7. Save, get a 500 Internal Server Error
        """
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=1)
        # Create invalid item (missing required field 'name')
        self.add_item(section=1)
        # We need to manually set the position to trigger the validation error,
        # otherwise it will be skipped as an empty inline on save
        with self.clickable_selector('#id_section_set-1-item_set-1-position') as el:
            el.send_keys('1')

        # Save
        self.save_form()

        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=0,
            screenshot_hack=True)
        # Remove invalid item
        self.remove_item(section=0, item=0)
        # Make a change to test whether save succeeds
        self.set_item_name(section=0, item=0, name='A 0_changed')

        self.save_form()

        item_a_0 = self.item_cls.objects.get(section=section_a, position=0)
        self.assertEqual(item_a_0.name, 'A 0_changed', 'Save failed')

    def test_swap_first_two_items_between_sections(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0,
            screenshot_hack=True)
        self.drag_and_drop_item(from_section=0, from_item=1, to_section=1, to_item=0,
            screenshot_hack=True)

        self.save_form()

        item_b_0 = self.item_cls.objects.get(name='B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 0[0]',
            'group/a[0]/A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/A 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_first_item_to_new_section(self):
        """
        Test dragging the first of several items in a pre-existing section into
        a newly created section.
        """
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2, "Save failed")

        section_b = self.section_cls.objects.get(slug='b')
        item_a_0 = self.item_cls.objects.get(name='A 0')

        self.assertEqual(item_a_0.section, section_b, "Item is in the wrong section")
        self.assertEqual(item_a_0.position, 0, "Item has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 1[0]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/A 0[0]'])

    def test_drag_first_item_to_new_section_after_removing_item(self):
        """
        Test dragging the first of several items in a pre-existing section into
        a newly created section after having added two items and then removing
        one of those items.
        """
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.add_item(section=1, name='B 0')
        self.add_item(section=1, name='B 1')
        self.remove_item(section=1, item=0)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1, to_item=0)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2, "Save failed")

        section_b = self.section_cls.objects.get(slug='b')
        item_a_0 = self.item_cls.objects.get(name='A 0')
        item_a_1 = self.item_cls.objects.get(name='A 1')
        item_b_1 = self.item_cls.objects.get(name='B 1')

        self.assertNotEqual(item_a_0.section, section_a, "A0 did not move to new section")
        self.assertEqual(item_a_0.position, 0, "A0 has the wrong position")
        self.assertEqual(item_a_1.position, 0, "A1 has the wrong position")
        self.assertEqual(item_b_1.position, 1, "B1 has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 1[0]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/A 0[0]', 'group/b[1]/B 1[1]'])

    def test_add_remove_items_in_new_section_dragging_existing_items(self):
        """
        Tests for a regression that could be reproduced with the following steps:

        1. Begin with one section, with at least one item in it.
        2. Create a new section
        3. Create three items in the new section
        4. Remove the first of the new items
        5. Drag the first of the existing items into the first position in the
           new section.
        6. Remove the second item in the new section
        8. Save

        Expected outcome:
            The dragged item from the existing section should have been moved
            to the new section.

        Outcome with bug:
            The item has not moved.
        """
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.add_item(section=1, name='B 0')
        self.add_item(section=1, name='B 1')
        self.add_item(section=1, name='B 2')
        self.remove_item(section=1, item=0)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1, to_item=0)
        self.remove_item(section=1, item=1)

        self.save_form()

        section_b = self.section_cls.objects.get(slug='b')
        item_a_0 = self.item_cls.objects.get(name='A 0')
        item_b_2 = self.item_cls.objects.get(name='B 2')

        self.assertNotEqual(item_a_0.section, section_a, "A0 did not move to new section")
        self.assertEqual(item_a_0.position, 0, "A0 has the wrong position")
        self.assertEqual(item_b_2.position, 1, "B2 has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [])
        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/A 0[0]', 'group/b[1]/B 2[1]'])

    def test_delete_section_after_dragging_item_away(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0)

        # Delete section 'b'
        self.delete_section(section=1)

        self.save_form()

        self.assertNotEqual(len(self.section_cls.objects.all()), 2, "Save failed")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 0[0]', 'group/a[0]/A 0[1]'])

    def test_delete_undelete_section_after_dragging_item_away(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0)

        # Delete section 'b'
        self.delete_section(section=1)
        self.undelete_section(section=1)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2)

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 0[0]', 'group/a[0]/A 0[1]'])
        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 1[0]'])

    def test_drag_into_new_section_after_adding_and_removing_preceding_section(self):
        group = self.group_cls.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_change_admin(group)

        self.add_section(slug="b")
        self.add_section(slug="c")
        self.remove_section(section=1)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2, "Save failed (new section wasn't added)")

        item_a0 = self.item_cls.objects.get(name='A 0')
        section_c = self.section_cls.objects.get(slug='c')

        self.assertEqual(item_a0.section, section_c, "Item was not moved to new section")


class TestStackedInlineAdmin(BaseInlineAdminTestCase):

    group_cls = StackedGroup
    section_cls = StackedSection
    item_cls = StackedItem


class TestTabularInlineAdmin(BaseInlineAdminTestCase):

    group_cls = TabularGroup
    section_cls = TabularSection
    item_cls = TabularItem


class TestSortablesWithExtra(BaseNestedAdminTestCase):

    def test_blank_extra_inlines_validation(self):
        root = SortableWithExtraRoot.objects.create(slug='a')
        self.load_change_admin(root)
        with self.clickable_selector('#id_slug') as el:
            el.clear()
            el.send_keys('b')

        self.save_form()

        validation_errors = self.selenium.execute_script(
            "return $('ul.errorlist li').length")

        self.assertEqual(validation_errors, 0, "Unexpected validation errors encountered")

    def test_blank_extra_inlines_validation_with_change(self):
        root = SortableWithExtraRoot.objects.create(slug='a')
        self.load_change_admin(root)
        with self.clickable_selector('#id_slug') as el:
            el.clear()
            el.send_keys('b')
        with self.clickable_selector('#id_sortablewithextrachild_set-0-slug') as el:
            el.clear()
            el.send_keys('a')

        self.save_form()

        validation_errors = self.selenium.execute_script(
            "return $('ul.errorlist li').length")

        self.assertEqual(validation_errors, 0, "Unexpected validation errors encountered")

        # refetch from the database
        root = SortableWithExtraRoot.objects.get(pk=root.pk)

        self.assertEqual(root.slug, 'b', "Root slug did not change")

        children = SortableWithExtraChild.objects.all()

        self.assertNotEqual(len(children), 0, "Child object did not save")
        self.assertEqual(len(children), 1, "Incorrect number of children saved")
        self.assertEqual(children[0].slug, "a", "Child slug incorrect")
