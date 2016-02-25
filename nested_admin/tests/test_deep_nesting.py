from .base import BaseNestedAdminTestCase
from .models import TopLevel


class TestDeepNesting(BaseNestedAdminTestCase):

    def test_validationerror_on_empty_extra_parent_form(self):
        toplevel = TopLevel.objects.create(name='a')
        self.load_change_admin(toplevel)

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
