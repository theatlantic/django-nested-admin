from selenium.webdriver.common.action_chains import ActionChains

from .base import BaseNestedAdminTestCase
from .models import Group, Section, Item


class TestAdmin(BaseNestedAdminTestCase):

    def make_footer_position_static(self):
        """Make <footer> element styles 'position: static'"""
        self.selenium.execute_script("document.getElementsByTagName('footer')[0].className = 'grp-module grp-submit-row';")
        self.selenium.execute_script("if(document.getElementById('content-inner')) {"
            "document.getElementById('content-inner').style.bottom = '0';}")

    def test_add_section_to_empty(self):
        group = Group.objects.create(slug='test')
        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))

        with self.clickable_xpath('//a[text()="Add Section"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-slug"]') as el:
            el.send_keys("test")
        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()

        sections = group.section_set.all()

        self.assertEqual(len(sections), 1)
        self.assertEqual(sections[0].slug, 'test')
        self.assertEqual(sections[0].position, 0)

    def test_add_item_to_empty(self):
        group = Group.objects.create(slug='test')
        section = Section.objects.create(slug='test', group=group, position=0)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))

        with self.clickable_xpath('//a[text()="Add Item"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-0-item_set-0-name"]') as el:
            el.send_keys("Test")
        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()

        items = section.item_set.all()

        self.assertEqual(len(items), 1)
        self.assertEqual(items[0].name, "Test")
        self.assertEqual(items[0].position, 0)

    def test_drag_last_item_between_sections(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 2[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_middle_item_between_sections(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set1 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 2[1]'])

    def test_drag_middle_item_between_sections_after_adding_new_item(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_selector('#section_set-1-item_set-group .grp-add-item > a.grp-add-handler.item') as el:
            el.click()
        with self.clickable_selector('#id_section_set-1-item_set-3-name') as el:
            el.send_keys("Item B 3")

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set1 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 2[1]',
            'group/b[1]/Item B 3[2]'])

    def test_drag_middle_item_between_sections_after_adding_new_item_to_other_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_selector('#section_set-0-item_set-group .grp-add-item > a.grp-add-handler.item') as el:
            el.click()
        with self.clickable_selector('#id_section_set-0-item_set-3-name') as el:
            el.send_keys("Item A 3")

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set1 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]',
            'group/a[0]/Item A 3[4]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 2[1]'])

    def test_drag_new_item_between_sections(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)

        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_selector('#section_set-1-item_set-group .grp-add-item > a.grp-add-handler.item') as el:
            el.click()
        with self.clickable_selector('#id_section_set-1-item_set-2-name') as el:
            el.send_keys("Item B 2")

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1')

        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')

        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 2[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_delete_item(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        self.selenium.find_element_by_css_selector('#section_set-1-item_set1 a.grp-delete-handler').click()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 2[1]'])

    def test_delete_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        self.selenium.find_element_by_css_selector('#section_set0 a.grp-delete-handler.section').click()
        self.wait_until_clickable_selector('#section_set0.grp-predelete a.grp-delete-handler.section')

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        self.assertEqual(len(Section.objects.filter(slug='a')), 0, "Section was not deleted")

        section_b = Section.objects.get(slug='b')

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[0]/Item B 0[0]',
            'group/b[0]/Item B 1[1]',
            'group/b[0]/Item B 2[2]'])

    def test_delete_item_undelete_section(self):
        """
        Test that, if an item is deleted, then the section is deleted, and
        then the section is undeleted, that the item stays deleted.
        """
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        self.selenium.find_element_by_css_selector('#section_set-0-item_set1 a.grp-delete-handler').click()
        self.selenium.find_element_by_css_selector('#section_set0 a.grp-delete-handler.section').click()
        self.wait_until_clickable_selector('#section_set0.grp-predelete a.grp-delete-handler.section')
        self.selenium.find_element_by_css_selector('#section_set0 a.grp-delete-handler.section').click()
        self.wait_until_clickable_selector('#section_set0:not(.grp-predelete) a.grp-delete-handler.section')

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        self.assertEqual(len(Section.objects.filter(slug='a')), 1, "Section should not be deleted")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 2[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]',
            'group/b[1]/Item B 2[2]'])

    def test_remove_item(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_selector('#section_set-1-item_set-group .grp-add-item > a.grp-add-handler.item') as el:
            el.click()
        with self.clickable_selector('#id_section_set-1-item_set-2-name') as el:
            el.send_keys("Item B 2")

        self.selenium.find_element_by_css_selector('#section_set-1-item_set2 a.grp-remove-handler').click()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_empty_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set-group > .nested-sortable-container')

        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')],
            ['group/a[0]/Item B 2[0]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_first_position(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set0')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item B 2[0]',
            'group/a[0]/Item A 0[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_last_position(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set2')

        (ActionChains(self.selenium)
            .click_and_hold(source)
            .move_to_element_with_offset(target, 0, 0)
            .move_by_offset(0, 200)
            .release()
            .perform())

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]',
            'group/a[0]/Item B 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_new_empty_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_xpath('//a[text()="Add Section"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-1-slug"]') as el:
            el.send_keys("b")

        source = self.selenium.find_element_by_css_selector('#section_set-0-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-1-item_set-group > .nested-sortable-container')

        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_a_2 = Item.objects.get(name='Item A 2')
        section_b = Section.objects.get(slug='b')
        self.assertEqual(item_a_2.section, section_b, "item was not moved to the correct section")
        self.assertEqual(item_a_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')],
            ['group/a[0]/Item A 0[0]', 'group/a[0]/Item A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')],
            ['group/b[1]/Item A 2[0]'])

    def test_position_update_bug(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)

        Item.objects.create(name='Item B 0', section=section_b, position=0)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_selector('#section_set-0-item_set-group .grp-add-item > a.grp-add-handler.item') as button:
            button.click()
            with self.clickable_selector('#id_section_set-0-item_set-0-name') as el:
                el.send_keys("Item A 0")
            button.click()
            with self.clickable_selector('#id_section_set-0-item_set-1-name') as el:
                el.send_keys("Item A 1")
            button.click()
            with self.clickable_selector('#id_section_set-0-item_set-2-name') as el:
                el.send_keys("Item A 2")

        # Move to second position of the first section
        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')

        (ActionChains(self.selenium)
            .click_and_hold(source)
            .move_to_element(target)
            .move_by_offset(0, -48)
            .move_by_offset(0, 48)
            .release()
            .perform())

        # Move to the last position of the first section
        source = self.selenium.find_element_by_xpath('//h3[text()="group/b[1]/Item B 0[0]"]')
        target = self.selenium.find_element_by_css_selector(
            '#section_set-0-item_set-group .empty-form-container')
        (ActionChains(self.selenium)
            .click_and_hold(source)
            .move_to_element(target)
            .move_by_offset(0, -48)
            .move_by_offset(0, 48)
            .release()
            .perform())

        def check_position_is_correct(d):
            val = d.execute_script(
                'return document.getElementById('
                '   "id_section_set-0-item_set-0-position").value')
            return val == '3'

        self.wait_until(
            check_position_is_correct,
            message="Timeout waiting for position to update to correct value")

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()
        self.wait_page_loaded()

        item_b_0 = Item.objects.get(name='Item B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]',
            'group/a[0]/Item B 0[3]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [])

    def test_drag_existing_item_to_new_section_and_back(self):
        group = Group.objects.create(slug='test')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))

        with self.clickable_xpath('//a[text()="Add Section"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-1-slug"]') as el:
            el.send_keys("b")

        source = self.selenium.find_element_by_css_selector('#section_set-0-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-1-item_set-group > .nested-sortable-container')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set-group > .nested-sortable-container')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()

        self.assertEqual(len(Section.objects.all()), 2, "Save failed")

        item_a_0 = Item.objects.get(name='Item A 0')

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
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)

        self.wait_page_loaded()
        self.make_footer_position_static()

        # Drag the first item of section 'b' into section 'a'
        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        # Create invalid item (missing required field 'name')
        with self.clickable_selector('#section_set-1-item_set-group .grp-add-item > a.grp-add-handler.item') as el:
            el.click()

        # Save
        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-0-item_set1 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        # Remove invalid item
        self.selenium.find_element_by_css_selector(
            '.nested-inline-form:not(.grp-empty-form) > .grp-tools .grp-remove-handler').click()

        # Make a change to test whether save succeeds
        with self.clickable_selector('#id_section_set-0-item_set-0-name') as el:
            el.clear()
            el.send_keys("Item A 0_changed")

        # Save
        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()

        item_a_0 = Item.objects.get(section=section_a, position=0)
        self.assertEqual(item_a_0.name, 'Item A 0_changed', 'Save failed')

    def test_swap_first_two_items_between_sections(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set0')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        source = self.selenium.find_element_by_css_selector('#section_set-0-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-1-item_set0 > h3')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_0 = Item.objects.get(name='Item B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item B 0[0]',
            'group/a[0]/Item A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item A 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_first_item_to_new_section(self):
        """
        Test dragging the first of several items in a pre-existing section into
        a newly created section.
        """
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)

        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()

        with self.clickable_xpath('//a[text()="Add Section"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="section_set-1-slug"]') as el:
            el.send_keys("b")

        source = self.selenium.find_element_by_css_selector('#section_set-0-item_set0 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-1-item_set-group > .nested-sortable-container')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        with self.clickable_xpath('//input[@name="_continue"]') as el:
            el.click()

        self.wait_page_loaded()

        self.assertEqual(len(Section.objects.all()), 2, "Save failed")

        section_b = Section.objects.get(slug='b')
        item_a_0 = Item.objects.get(name='Item A 0')

        self.assertEqual(item_a_0.section, section_b, "Item is in the wrong section")
        self.assertEqual(item_a_0.position, 0, "Item has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.item_set.all().order_by('position')], [
            'group/a[0]/Item A 1[0]'])

        self.assertEqual(["%s" % i for i in section_b.item_set.all().order_by('position')], [
            'group/b[1]/Item A 0[0]'])
