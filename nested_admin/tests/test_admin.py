from selenium.webdriver.common.action_chains import ActionChains

from .base import BaseNestedAdminTestCase
from .models import Group, TestSection as Section, TestItem as Item


class TestAdmin(BaseNestedAdminTestCase):

    def load_group_change_admin(self, group):
        self.selenium.get("%s%s" % (self.live_server_url, group.get_absolute_url()))
        self.wait_page_loaded()
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()
        self.selenium.execute_script("window.$ = django.jQuery")

    def save_form(self):
        self.selenium.find_element_by_xpath('//input[@name="_continue"]').click()
        self.wait_page_loaded()
        self.selenium.set_window_size(1120, 2000)
        self.make_footer_position_static()
        self.selenium.execute_script("window.$ = django.jQuery")

    def make_footer_position_static(self):
        """Make <footer> element styles 'position: static'"""
        self.selenium.execute_script("var footer = document.getElementsByTagName('footer')[0]; if (footer) footer.className = 'grp-module grp-submit-row';")
        self.selenium.execute_script("if(document.getElementById('content-inner')) {"
            "document.getElementById('content-inner').style.bottom = '0';}")

    def get_num_sections(self):
        return self.selenium.execute_script("return $('.dynamic-form-testsection').length")

    def get_num_items(self, section):
        return self.selenium.execute_script(
            "return $('#testsection_set%d .dynamic-form-testitem').length" % section)

    def drag_and_drop_item(self, from_section, from_item, to_section, to_item=None):
        target_num_items = self.get_num_items(to_section)

        if to_item is None:
            self.assertEqual(target_num_items, 0,
                "Must specify target item index when section is not empty")
            to_item = 0

        source = self.selenium.find_element_by_css_selector((
            "#testsection_set-group > "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            "> .nested-inline-form > h3") % (from_section + 2, from_item + 2))

        self.assertLessEqual(to_item, target_num_items,
            "Attempt to drag to position %d in a section with %d items" % (to_item, target_num_items))

        if ((target_num_items == to_item and target_num_items != 0)
         or (from_section == to_section and to_item == target_num_items - 1)):
            if from_section <= to_section:
                target = self.selenium.find_element_by_css_selector((
                    "#testsection_set-group > "
                    ".items > .nested-sortable-item:nth-of-type(%d) "
                    ".items > .empty-form-container") % (to_section + 2))
                (ActionChains(self.selenium)
                    .click_and_hold(source)
                    .move_to_element(target)
                    .move_by_offset(0, -48)
                    .move_by_offset(0, 48)
                    .release()
                    .perform())
            else:
                target = self.selenium.find_element_by_css_selector((
                    "#testsection_set-group > "
                    ".items > .nested-sortable-item:nth-of-type(%d) "
                    ".items > .nested-sortable-item:nth-of-type(%d) "
                    "> .nested-inline-form") % (to_section + 2, to_item + 1))
                (ActionChains(self.selenium)
                    .click_and_hold(source)
                    .move_to_element_with_offset(target, 0, 0)
                    .move_by_offset(0, 220)
                    .release()
                    .perform())
            return

        if target_num_items == 0:
            target_selector = (
                "#testsection_set-group > .items "
                "> .nested-sortable-item:nth-of-type(%d) .items") % (to_section + 2)
        else:
            target_selector = (
                "#testsection_set-group > "
                ".items > .nested-sortable-item:nth-of-type(%d) "
                ".items > .nested-sortable-item:nth-of-type(%d) "
                "> .nested-inline-form > h3") % (to_section + 2, to_item + 2)

        target = self.selenium.find_element_by_css_selector(target_selector)
        ActionChains(self.selenium).drag_and_drop(source, target).perform()

    def add_section(self, slug):
        index = self.get_num_sections()
        with self.clickable_selector(".grp-add-item > a.grp-add-handler.testsection") as el:
            el.click()
        self.set_section_slug(section=index, slug=slug)

    def add_item(self, section, name=None):
        item_index = self.get_num_items(section=section)
        add_selector = (
            "#testsection_set-%d-testitem_set-group "
            ".grp-add-item > a.grp-add-handler.testitem") % section
        with self.clickable_selector(add_selector) as el:
            el.click()
        if name is not None:
            self.set_item_name(section=section, item=item_index, name=name)

    def set_item_name(self, section, item, name):
        with self.clickable_selector('#id_testsection_set-%d-testitem_set-%d-name' % (section, item)) as el:
            el.clear()
            el.send_keys(name)

    def set_section_slug(self, section, slug):
        with self.clickable_xpath('//input[@name="testsection_set-%d-slug"]' % section) as el:
            el.clear()
            el.send_keys(slug)

    def remove_section(self, section):
        selector = '#testsection_set%d .grp-remove-handler.testsection' % section
        with self.clickable_selector(selector) as remove_button:
            remove_button.click()

    def remove_item(self, section, item):
        selector = (
            "#testsection_set-group > "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            "a.grp-remove-handler") % (section + 2, item + 2)
        self.selenium.find_element_by_css_selector(selector).click()

    def delete_item(self, section, item):
        selector = (
            "#testsection_set-group > "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            ".items > .nested-sortable-item:nth-of-type(%d) "
            "a.grp-delete-handler") % (section + 2, item + 2)
        self.selenium.find_element_by_css_selector(selector).click()

    def delete_section(self, section):
        sel = '#testsection_set%d' % section
        self.selenium.find_element_by_css_selector('%s a.grp-delete-handler.testsection' % sel).click()
        self.wait_until_clickable_selector('%s.grp-predelete a.grp-delete-handler.testsection' % sel)

    def undelete_section(self, section):
        sel = '#testsection_set%d' % section
        self.selenium.find_element_by_css_selector('%s a.grp-delete-handler.testsection' % sel).click()
        self.wait_until_clickable_selector('%s:not(.grp-predelete) a.grp-delete-handler.testsection' % sel)

    def test_add_section_to_empty(self):
        group = Group.objects.create(slug='test')

        self.load_group_change_admin(group)

        self.add_section(slug="test")
        self.save_form()

        sections = group.testsection_set.all()

        self.assertEqual(len(sections), 1)
        self.assertEqual(sections[0].slug, 'test')
        self.assertEqual(sections[0].position, 0)

    def test_add_item_to_empty(self):
        group = Group.objects.create(slug='test')
        section = Section.objects.create(slug='test', group=group, position=0)

        self.load_group_change_admin(group)

        with self.clickable_xpath('//a[text()="Add Test Item"]') as el:
            el.click()
        with self.clickable_xpath('//input[@name="testsection_set-0-testitem_set-0-name"]') as el:
            el.send_keys("Test")
        self.save_form()

        items = section.testitem_set.all()

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

        self.load_group_change_admin(group)
        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=1)
        self.save_form()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 2[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1)

        self.save_form()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.add_item(section=1, name='Item B 3')
        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1)

        self.save_form()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.add_item(section=0, name='Item A 3')
        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=1)

        self.save_form()

        item_b_1 = Item.objects.get(name='Item B 1')
        self.assertEqual(item_b_1.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_1.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 1[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]',
            'group/a[0]/Item A 3[4]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.add_item(section=1, name='Item B 2')
        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=1)

        self.save_form()

        item_b_2 = Item.objects.get(name='Item B 2')

        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item B 2[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.delete_item(section=1, item=1)

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.delete_section(section=0)

        self.save_form()

        self.assertEqual(len(Section.objects.filter(slug='a')), 0, "Section was not deleted")

        section_b = Section.objects.get(slug='b')

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.delete_item(section=0, item=1)
        self.delete_section(section=0)
        self.undelete_section(section=0)

        self.save_form()

        self.assertEqual(len(Section.objects.filter(slug='a')), 1, "Section should not be deleted")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 2[1]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.add_item(section=1, name='Item B 2')
        self.remove_item(section=1, item=2)

        self.save_form()

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_empty_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)
        Item.objects.create(name='Item B 2', section=section_b, position=2)

        self.load_group_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0)

        self.save_form()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')],
            ['group/a[0]/Item B 2[0]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=0)

        self.save_form()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item B 2[0]',
            'group/a[0]/Item A 0[1]',
            'group/a[0]/Item A 1[2]',
            'group/a[0]/Item A 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=2, to_section=0, to_item=3)

        self.save_form()

        item_b_2 = Item.objects.get(name='Item B 2')
        self.assertEqual(item_b_2.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_2.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]',
            'group/a[0]/Item B 2[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item B 0[0]',
            'group/b[1]/Item B 1[1]'])

    def test_drag_item_to_new_empty_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)
        Item.objects.create(name='Item A 2', section=section_a, position=2)

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=2, to_section=1)

        self.save_form()

        item_a_2 = Item.objects.get(name='Item A 2')
        section_b = Section.objects.get(slug='b')
        self.assertEqual(item_a_2.section, section_b, "item was not moved to the correct section")
        self.assertEqual(item_a_2.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')],
            ['group/a[0]/Item A 0[0]', 'group/a[0]/Item A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')],
            ['group/b[1]/Item A 2[0]'])

    def test_position_update_bug(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)

        Item.objects.create(name='Item B 0', section=section_b, position=0)

        self.load_group_change_admin(group)

        self.add_item(section=0, name='Item A 0')
        self.add_item(section=0, name='Item A 1')
        self.add_item(section=0, name='Item A 2')

        # Move to second position of the first section
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=1)

        # Move to the last position of the first section
        self.drag_and_drop_item(from_section=0, from_item=1, to_section=0, to_item=3)

        def check_position_is_correct(d):
            val = d.execute_script(
                'return document.getElementById('
                '   "id_testsection_set-0-testitem_set-0-position").value')
            return val == '3'

        self.wait_until(
            check_position_is_correct,
            message="Timeout waiting for position to update to correct value")

        self.save_form()

        item_b_0 = Item.objects.get(name='Item B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 3, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 0[0]',
            'group/a[0]/Item A 1[1]',
            'group/a[0]/Item A 2[2]',
            'group/a[0]/Item B 0[3]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [])

    def test_drag_existing_item_to_new_section_and_back(self):
        group = Group.objects.create(slug='test')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0)

        self.save_form()

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

        self.load_group_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=1)
        # Create invalid item (missing required field 'name')
        self.add_item(section=1)

        # Save
        self.save_form()

        self.drag_and_drop_item(from_section=1, from_item=1, to_section=0, to_item=0)
        # Remove invalid item
        self.remove_item(section=0, item=0)
        # Make a change to test whether save succeeds
        self.set_item_name(section=0, item=0, name='Item A 0_changed')

        self.save_form()

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

        self.load_group_change_admin(group)

        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0)
        self.drag_and_drop_item(from_section=0, from_item=1, to_section=1, to_item=0)

        self.save_form()

        item_b_0 = Item.objects.get(name='Item B 0')
        self.assertEqual(item_b_0.section, section_a, "item was not moved to the correct section")
        self.assertEqual(item_b_0.position, 0, "item was not moved to the correct position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item B 0[0]',
            'group/a[0]/Item A 1[1]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
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

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)

        self.save_form()

        self.assertEqual(len(Section.objects.all()), 2, "Save failed")

        section_b = Section.objects.get(slug='b')
        item_a_0 = Item.objects.get(name='Item A 0')

        self.assertEqual(item_a_0.section, section_b, "Item is in the wrong section")
        self.assertEqual(item_a_0.position, 0, "Item has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 1[0]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item A 0[0]'])

    def test_drag_first_item_to_new_section_after_removing_item(self):
        """
        Test dragging the first of several items in a pre-existing section into
        a newly created section after having added two items and then removing
        one of those items.
        """
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item A 1', section=section_a, position=1)

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.add_item(section=1, name='Item B 0')
        self.add_item(section=1, name='Item B 1')
        self.remove_item(section=1, item=0)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1, to_item=0)

        self.save_form()

        self.assertEqual(len(Section.objects.all()), 2, "Save failed")

        section_b = Section.objects.get(slug='b')
        item_a_0 = Item.objects.get(name='Item A 0')
        item_a_1 = Item.objects.get(name='Item A 1')
        item_b_1 = Item.objects.get(name='Item B 1')

        self.assertNotEqual(item_a_0.section, section_a, "Item A0 did not move to new section")
        self.assertEqual(item_a_0.position, 0, "Item A0 has the wrong position")
        self.assertEqual(item_a_1.position, 0, "Item A1 has the wrong position")
        self.assertEqual(item_b_1.position, 1, "Item B1 has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item A 1[0]'])

        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item A 0[0]', 'group/b[1]/Item B 1[1]'])

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
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.add_item(section=1, name='Item B 0')
        self.add_item(section=1, name='Item B 1')
        self.add_item(section=1, name='Item B 2')
        self.remove_item(section=1, item=0)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1, to_item=0)
        self.remove_item(section=1, item=1)

        self.save_form()

        section_b = Section.objects.get(slug='b')
        item_a_0 = Item.objects.get(name='Item A 0')
        item_b_2 = Item.objects.get(name='Item B 2')

        self.assertNotEqual(item_a_0.section, section_a, "Item A0 did not move to new section")
        self.assertEqual(item_a_0.position, 0, "Item A0 has the wrong position")
        self.assertEqual(item_b_2.position, 1, "Item B2 has the wrong position")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [])
        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item A 0[0]', 'group/b[1]/Item B 2[1]'])

    def test_delete_section_after_dragging_item_away(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.load_group_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0)

        # Delete section 'b'
        self.delete_section(section=1)

        self.save_form()

        self.assertNotEqual(len(Section.objects.all()), 2, "Save failed")

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item B 0[0]', 'group/a[0]/Item A 0[1]'])

    def test_delete_undelete_section_after_dragging_item_away(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        section_b = Section.objects.create(slug='b', group=group, position=1)
        Item.objects.create(name='Item A 0', section=section_a, position=0)
        Item.objects.create(name='Item B 0', section=section_b, position=0)
        Item.objects.create(name='Item B 1', section=section_b, position=1)

        self.load_group_change_admin(group)

        # Drag the first item of section 'b' into section 'a'
        self.drag_and_drop_item(from_section=1, from_item=0, to_section=0, to_item=0)

        # Delete section 'b'
        self.delete_section(section=1)
        self.undelete_section(section=1)

        self.save_form()

        self.assertEqual(len(Section.objects.all()), 2)

        self.assertEqual(["%s" % i for i in section_a.testitem_set.all().order_by('position')], [
            'group/a[0]/Item B 0[0]', 'group/a[0]/Item A 0[1]'])
        self.assertEqual(["%s" % i for i in section_b.testitem_set.all().order_by('position')], [
            'group/b[1]/Item B 1[0]'])

    def test_drag_into_new_section_after_adding_and_removing_preceding_section(self):
        group = Group.objects.create(slug='group')
        section_a = Section.objects.create(slug='a', group=group, position=0)
        Item.objects.create(name='Item A 0', section=section_a, position=0)

        self.load_group_change_admin(group)

        self.add_section(slug="b")
        self.add_section(slug="c")
        self.remove_section(section=1)
        self.drag_and_drop_item(from_section=0, from_item=0, to_section=1)

        self.save_form()

        self.assertEqual(len(Section.objects.all()), 2, "Save failed (new section wasn't added)")

        item_a0 = Item.objects.get(name='Item A 0')
        section_c = Section.objects.get(slug='c')

        self.assertEqual(item_a0.section, section_c, "Item was not moved to new section")
