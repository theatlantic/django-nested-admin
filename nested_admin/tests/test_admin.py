from selenium.webdriver.common.action_chains import ActionChains

from .base import BaseNestedAdminTestCase
from .models import Group, Section, Item


class TestAdmin(BaseNestedAdminTestCase):

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

    def test_drag_item_between_sections(self):
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
        self.selenium.execute_script("document.getElementsByTagName('footer')[0].style.position = 'static';")

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1')
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(map(repr, section_a.item_set.all().order_by('position')), [
            '<Item: group/a[0]/Item A 0[0]>',
            '<Item: group/a[0]/Item B 2[1]>',
            '<Item: group/a[0]/Item A 1[2]>',
            '<Item: group/a[0]/Item A 2[3]>'])

        self.assertEqual(map(repr, section_b.item_set.all().order_by('position')), [
            '<Item: group/b[1]/Item B 0[0]>',
            '<Item: group/b[1]/Item B 1[1]>'])

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
        self.selenium.execute_script("document.getElementsByTagName('footer')[0].style.position = 'static';")

        with self.clickable_xpath('//*[@id="section_set-1-item_set-group"]//a[text()="Add Item"]') as el:
            el.click()

        with self.clickable_xpath('//input[@name="section_set-1-item_set-2-name"]') as el:
            el.send_keys("Item B 2")

        source = self.selenium.find_element_by_css_selector('#section_set-1-item_set2 > h3')
        target = self.selenium.find_element_by_css_selector('#section_set-0-item_set1')

        ActionChains(self.selenium).drag_and_drop(source, target).perform()

        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()

        self.wait_page_loaded()

        item_b_2 = Item.objects.get(name='Item B 2')

        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(map(repr, section_a.item_set.all().order_by('position')), [
            '<Item: group/a[0]/Item A 0[0]>',
            '<Item: group/a[0]/Item B 2[1]>',
            '<Item: group/a[0]/Item A 1[2]>',
            '<Item: group/a[0]/Item A 2[3]>'])

        self.assertEqual(map(repr, section_b.item_set.all().order_by('position')), [
            '<Item: group/b[1]/Item B 0[0]>',
            '<Item: group/b[1]/Item B 1[1]>'])
