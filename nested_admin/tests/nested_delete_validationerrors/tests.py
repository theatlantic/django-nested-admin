import time
from unittest import SkipTest

from django.conf import settings

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import Parent, Child, GrandChild


class TestDeleteNestedInlineMinNumRequirement(BaseNestedAdminTestCase):

    root_model = Parent
    nested_models = (Child, GrandChild)

    def test_min_num_delete_bug(self):
        """It should be possible to delete inlines, even if min_num requirement not met"""
        rhea = Parent.objects.create(name='Rhea')
        poseidon = Child.objects.create(name='Poseidon', parent=rhea, position=0)
        zeus = Child.objects.create(name='Zeus', parent=rhea, position=1)
        demeter = Child.objects.create(name='Demeter', parent=rhea, position=2)

        GrandChild.objects.create(name='Apollo', parent=zeus, position=0)
        GrandChild.objects.create(name='Persephone', parent=demeter, position=0)

        self.load_admin(rhea)
        self.delete_inline([0])
        self.save_form()

        validation_errors = self.selenium.execute_script(
            "return $('ul.errorlist li').length")

        self.assertEqual(
            0, validation_errors, "Save should have completed without validation errors")

        children = Child.objects.filter(parent=rhea)
        self.assertNotEqual(3, len(children), "Child with empty grandchild was not deleted")
        self.assertEqual(2, len(children))
