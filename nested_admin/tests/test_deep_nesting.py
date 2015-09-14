from .base import BaseNestedAdminTestCase
from .models import TopLevel


class TestDeepNesting(BaseNestedAdminTestCase):

    def load_toplevel_change_admin(self, toplevel):
        self.selenium.get("%s%s" % (self.live_server_url, toplevel.get_absolute_url()))
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

    def test_validationerror_on_empty_extra_parent_form(self):
        toplevel = TopLevel.objects.create(name='a')
        self.load_toplevel_change_admin(toplevel)


        with self.clickable_selector('#id_levelone_set-0-leveltwo_set-0-name') as el:
            el.clear()
            el.send_keys('c')
        with self.clickable_selector('#id_levelone_set-0-leveltwo_set-0-levelthree_set-0-name') as el:
            el.clear()
            el.send_keys('d')

        self.save_form()

        field_id_with_error = self.selenium.execute_script(
            "return $('ul.errorlist li').parent().parent().find('input').attr('id')")

        self.assertEqual(field_id_with_error, "id_levelone_set-0-name")
