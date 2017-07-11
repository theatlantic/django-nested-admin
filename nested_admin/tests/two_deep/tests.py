import time
from unittest import skipIf, SkipTest

import django

from nested_admin.tests.base import (
    BaseNestedAdminTestCase, expected_failure_if_suit)
from .models import (
    StackedGroup, StackedSection, StackedItem,
    TabularGroup, TabularSection, TabularItem,
    SortableWithExtraRoot, SortableWithExtraChild)


class InlineAdminTestCaseMixin(object):

    @classmethod
    def setUpClass(cls):
        super(InlineAdminTestCaseMixin, cls).setUpClass()
        cls.section_cls, cls.item_cls = cls.nested_models

    def test_add_section_to_empty(self):
        group = self.root_model.objects.create(slug='test')

        self.load_admin(group)

        self.add_inline(slug="test")
        self.save_form()

        sections = group.section_set.all()

        self.assertEqual(len(sections), 1)
        self.assertEqual(sections[0].slug, 'test')
        self.assertEqual(sections[0].position, 0)

    def test_add_item_to_empty(self):
        group = self.root_model.objects.create(slug='test')
        section = self.section_cls.objects.create(slug='test', group=group, position=0)

        self.load_admin(group)

        item_verbose_name = self.item_cls._meta.verbose_name.title()
        with self.clickable_xpath('//a[contains(string(.), "Add another %s")]' % item_verbose_name) as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-item_set-0-name"]') as el:
            el.send_keys("Test")
        self.save_form()

        items = section.item_set.all()

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].name, "Test")
        self.assertEqual(items[0].position, 0)

    def test_drag_last_item_between_sections(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)
        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 1],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.drag_and_drop_item(from_indexes=[1, 1], to_indexes=[0, 1])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.add_inline(indexes=[1], name='B 3')
        self.drag_and_drop_item(from_indexes=[1, 1], to_indexes=[0, 1],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.add_inline(indexes=[0], name='A 3')
        self.drag_and_drop_item(from_indexes=[1, 1], to_indexes=[0, 1],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)

        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        self.add_inline(indexes=[1], name='B 2')
        time.sleep(0.01)
        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 1],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.delete_inline(indexes=[1, 1])

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 2[1]'])

    def test_delete_section(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.delete_inline(indexes=[0])

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.filter(slug='a')), 0, "Section was not deleted")

        section_b = self.section_cls.objects.get(slug='b')

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[0]/B 0[0]',
            'group/b[0]/B 1[1]',
            'group/b[0]/B 2[2]'])

    @expected_failure_if_suit
    def test_delete_item_undelete_section(self):
        """
        Test that, if an item is deleted, then the section is deleted, and
        then the section is undeleted, that the item stays deleted.
        """
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.delete_inline(indexes=[0, 1])
        self.delete_inline(indexes=[0])
        self.undelete_inline(indexes=[0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        self.add_inline(indexes=[1], name='B 2')
        self.remove_inline(indexes=[1, 2])

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/A 0[0]',
            'group/a[0]/A 1[1]',
            'group/a[0]/A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 0[0]',
            'group/b[1]/B 1[1]'])

    def test_drag_item_to_empty_section(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 0],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)
        self.item_cls.objects.create(name='B 2', section=section_b, position=2)

        self.load_admin(group)

        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 3])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='A 2', section=section_a, position=2)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.drag_and_drop_item(from_indexes=[0, 2], to_indexes=[1, 0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)

        self.item_cls.objects.create(name='B 0', section=section_b, position=0)

        self.load_admin(group)

        self.add_inline(indexes=[0], name='A 0')
        self.add_inline(indexes=[0], name='A 1')
        self.add_inline(indexes=[0], name='A 2')

        # Move to second position of the first section
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 1])

        # Move to the last position of the first section
        self.drag_and_drop_item(from_indexes=[0, 1], to_indexes=[0, 3])

        position_selector = self.get_form_field_selector('position', indexes=[0, 3])

        def check_position_is_correct(d):
            val = d.execute_script('return $("%s").val()' % position_selector)
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
        group = self.root_model.objects.create(slug='test')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 1])
        # Create invalid item (missing required field 'name')
        self.add_inline(indexes=[1])

        # We need to manually set the position to trigger the validation error,
        # otherwise it will be skipped as an empty inline on save
        self.set_field('position', '1', indexes=[1, 1])

        # Save
        self.save_form()

        self.drag_and_drop_item(from_indexes=[1, 1], to_indexes=[0, 0],
            screenshot_hack=True)
        # Remove invalid item
        self.remove_inline(indexes=[0, 0])
        # Make a change to test whether save succeeds
        self.set_field("name", 'A 0_changed', indexes=[0, 0])

        self.save_form()

        item_a_0 = self.item_cls.objects.get(section=section_a, position=0)
        self.assertEqual(item_a_0.name, 'A 0_changed', 'Save failed')

    def test_swap_first_two_items_between_sections(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 0],
            screenshot_hack=True)
        self.drag_and_drop_item(from_indexes=[0, 1], to_indexes=[1, 0],
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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='A 1', section=section_a, position=1)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.add_inline(indexes=[1], name='B 0')
        self.add_inline(indexes=[1], name='B 1')
        self.remove_inline(indexes=[1, 0])
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.add_inline(indexes=[1], name='B 0')
        self.add_inline(indexes=[1], name='B 1')
        self.add_inline(indexes=[1], name='B 2')
        self.remove_inline(indexes=[1, 0])
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])
        self.remove_inline(indexes=[1, 1])

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
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 0])

        # Delete section 'b'
        self.delete_inline(indexes=[1])

        self.save_form()

        self.assertNotEqual(len(self.section_cls.objects.all()), 2, "Save failed")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 0[0]', 'group/a[0]/A 0[1]'])

    def test_delete_undelete_section_after_dragging_item_away(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        section_b = self.section_cls.objects.create(slug='b', group=group, position=1)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)
        self.item_cls.objects.create(name='B 0', section=section_b, position=0)
        self.item_cls.objects.create(name='B 1', section=section_b, position=1)

        self.load_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 0])

        # Delete section 'b'
        self.delete_inline(indexes=[1])
        self.undelete_inline(indexes=[1])

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2)

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/B 0[0]', 'group/a[0]/A 0[1]'])
        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/B 1[0]'])

    def test_drag_into_new_section_after_adding_and_removing_preceding_section(self):
        group = self.root_model.objects.create(slug='group')
        section_a = self.section_cls.objects.create(slug='a', group=group, position=0)
        self.item_cls.objects.create(name='A 0', section=section_a, position=0)

        self.load_admin(group)

        self.add_inline(slug="b")
        self.add_inline(slug="c")
        self.remove_inline(indexes=[1])
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])

        self.save_form()

        self.assertEqual(len(self.section_cls.objects.all()), 2, "Save failed (new section wasn't added)")

        item_a0 = self.item_cls.objects.get(name='A 0')
        section_c = self.section_cls.objects.get(slug='c')

        self.assertEqual(item_a0.section, section_c, "Item was not moved to new section")


class TestStackedInlineAdmin(InlineAdminTestCaseMixin, BaseNestedAdminTestCase):

    root_model = StackedGroup
    nested_models = (StackedSection, StackedItem)

    def test_add_item_inline_label_update(self):
        if django.VERSION < (1, 9):
            raise SkipTest("Test only applies to Django 1.9+")
        if self.has_grappelli:
            raise SkipTest("Test does not apply if using django-grappelli")
        if self.has_suit:
            raise SkipTest("Test does not apply if using django-suit")
        group = self.root_model.objects.create(slug='test')
        self.section_cls.objects.create(slug='test', group=group, position=0)

        self.load_admin(group)
        item_verbose_name = self.item_cls._meta.verbose_name.title()
        with self.clickable_xpath('//a[contains(string(.), "Add another %s")]' % item_verbose_name) as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-item_set-0-name"]') as el:
            el.send_keys("Test 1")
        with self.clickable_xpath('//a[contains(string(.), "Add another %s")]' % item_verbose_name) as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-item_set-0-name"]') as el:
            el.send_keys("Test 2")

        inline_label = self.get_item([0, 1]).find_element_by_class_name('inline_label')
        self.assertEqual(inline_label.text, '#2')


class TestTabularInlineAdmin(InlineAdminTestCaseMixin, BaseNestedAdminTestCase):

    root_model = TabularGroup
    nested_models = (TabularSection, TabularItem)


class TestSortablesWithExtra(BaseNestedAdminTestCase):

    root_model = SortableWithExtraRoot
    nested_models = (SortableWithExtraChild, )

    def test_blank_extra_inlines_validation(self):
        root = self.root_model.objects.create(slug='a')
        self.load_admin(root)
        self.set_field('slug', 'b')

        self.save_form()

        validation_errors = self.selenium.execute_script(
            "return $('ul.errorlist li').length")

        self.assertEqual(validation_errors, 0, "Unexpected validation errors encountered")

    def test_blank_extra_inlines_validation_with_change(self):
        root = self.root_model.objects.create(slug='a')
        self.load_admin(root)
        self.set_field('slug', 'b')
        self.set_field('slug', 'a', indexes=[0])

        self.save_form()

        validation_errors = self.selenium.execute_script(
            "return $('ul.errorlist li').length")

        self.assertEqual(validation_errors, 0, "Unexpected validation errors encountered")

        # refetch from the database
        root = self.root_model.objects.get(pk=root.pk)

        self.assertEqual(root.slug, 'b', "Root slug did not change")

        children = self.nested_models[0].objects.all()

        self.assertNotEqual(len(children), 0, "Child object did not save")
        self.assertEqual(len(children), 1, "Incorrect number of children saved")
        self.assertEqual(children[0].slug, "a", "Child slug incorrect")
