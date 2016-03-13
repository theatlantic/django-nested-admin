from .base import BaseNestedAdminTestCase
from .models import TopLevel, LevelOne, LevelTwo, LevelThree


class TestDeepNesting(BaseNestedAdminTestCase):

    root_model = TopLevel
    nested_models = (LevelOne, LevelTwo, LevelThree)

    def test_validationerror_on_empty_extra_parent_form(self):
        toplevel = TopLevel.objects.create(name='a')
        self.load_admin(toplevel)

        self.set_field('name', 'c', indexes=[0, 0])
        self.set_field('name', 'd', indexes=[0, 0, 0])

        self.save_form()

        field_id_with_error = self.selenium.execute_script(
            "return $('ul.errorlist li').parent().parent().find('input').attr('id')")

        self.assertEqual(field_id_with_error, "id_levelone_set-0-name")
