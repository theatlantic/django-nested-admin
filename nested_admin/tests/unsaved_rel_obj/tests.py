from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import Main, Level1, Level2


class TestUnsavedRelObj(BaseNestedAdminTestCase):

    root_model = Main
    nested_models = (Level1, Level2)

    def test_save_missing_two_intermediate_inlines(self):
        self.load_admin()
        self.add_inline()
        if self.has_grappelli:
            with self.clickable_selector('#level1_set0 .grp-collapse-handler') as el:
                el.click()
        self.add_inline([0])
        self.set_field("text", 'c', indexes=[0, 0])
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(len(root_instances), 0, "%s did not save" % self.root_model.__name__)
