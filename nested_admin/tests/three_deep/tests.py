from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import TopLevel, LevelOne, LevelTwo, LevelThree


class TestDeepNesting(BaseNestedAdminTestCase):

    root_model = TopLevel
    nested_models = (LevelOne, LevelTwo, LevelThree)

    @classmethod
    def setUpClass(cls):
        super(TestDeepNesting, cls).setUpClass()
        cls.l1_model, cls.l2_model, cls.l3_model = cls.nested_models

    def test_validationerror_on_empty_extra_parent_form(self):
        toplevel = TopLevel.objects.create(name='a')
        self.load_admin(toplevel)

        self.set_field('name', 'c', indexes=[0, 0])
        self.set_field('name', 'd', indexes=[0, 0, 0])

        self.save_form()

        field_id_with_error = self.selenium.execute_script(
            "return $('ul.errorlist li').closest('.form-row').find('input').attr('id')")

        self.assertEqual(field_id_with_error, "id_children-0-name")

    def test_create_new(self):
        self.load_admin()
        self.set_field('name', 'a')
        self.set_field('name', 'b', [0])
        self.set_field('name', 'c', [0, 0])
        self.set_field('name', 'd', [0, 0, 0])
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(len(root_instances), 0, "%s did not save" % self.root_model.__name__)
        self.assertEqual(len(root_instances), 1, "Too many %s found" % self.root_model.__name__)
        root = root_instances[0]
        self.assertEqual(root.name, 'a', "%s.name has wrong value" % self.root_model.__name__)
        l1_instances = root.children.all()
        self.assertNotEqual(len(l1_instances), 0, "%s did not save" % self.l1_model.__name__)
        self.assertEqual(len(l1_instances), 1, "Too many %s found" % self.l1_model.__name__)
        l1_instance = l1_instances[0]
        self.assertEqual(l1_instance.name, 'b', "%s.name has wrong value" % self.l1_model.__name__)
        l2_instances = l1_instance.children.all()
        self.assertNotEqual(len(l2_instances), 0, "%s did not save" % self.l2_model.__name__)
        self.assertEqual(len(l2_instances), 1, "Too many %s found" % self.l2_model.__name__)
        l2_instance = l2_instances[0]
        self.assertEqual(l2_instance.name, 'c', "%s.name has wrong value" % self.l2_model.__name__)
        l3_instances = l2_instance.children.all()
        self.assertNotEqual(len(l3_instances), 0, "%s did not save" % self.l3_model.__name__)
        self.assertEqual(len(l3_instances), 1, "Too many %s found" % self.l3_model.__name__)
        l3_instance = l3_instances[0]
        self.assertEqual(l3_instance.name, 'd', "%s.name has wrong value" % self.l3_model.__name__)

    def test_create_new_no_extras(self):
        self.load_admin()
        self.set_field('name', 'a')
        self.remove_inline([0])
        self.add_inline(name='b')
        self.remove_inline([0, 0])
        self.add_inline([0], name='c')
        self.remove_inline([0, 0, 0])
        self.add_inline([0, 0], name='d')
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(len(root_instances), 0, "%s did not save" % self.root_model.__name__)
        self.assertEqual(len(root_instances), 1, "Too many %s found" % self.root_model.__name__)
        root = root_instances[0]
        self.assertEqual(root.name, 'a', "%s.name has wrong value" % self.root_model.__name__)
        l1_instances = root.children.all()
        self.assertNotEqual(len(l1_instances), 0, "%s did not save" % self.l1_model.__name__)
        self.assertEqual(len(l1_instances), 1, "Too many %s found" % self.l1_model.__name__)
        l1_instance = l1_instances[0]
        self.assertEqual(l1_instance.name, 'b', "%s.name has wrong value" % self.l1_model.__name__)
        l2_instances = l1_instance.children.all()
        self.assertNotEqual(len(l2_instances), 0, "%s did not save" % self.l2_model.__name__)
        self.assertEqual(len(l2_instances), 1, "Too many %s found" % self.l2_model.__name__)
        l2_instance = l2_instances[0]
        self.assertEqual(l2_instance.name, 'c', "%s.name has wrong value" % self.l2_model.__name__)
        l3_instances = l2_instance.children.all()
        self.assertNotEqual(len(l3_instances), 0, "%s did not save" % self.l3_model.__name__)
        self.assertEqual(len(l3_instances), 1, "Too many %s found" % self.l3_model.__name__)
        l3_instance = l3_instances[0]
        self.assertEqual(l3_instance.name, 'd', "%s.name has wrong value" % self.l3_model.__name__)

    def test_save_missing_intermediate_inline(self):
        self.load_admin()
        self.set_field('name', 'a')
        self.set_field('name', 'b', [0])
        self.set_field('name', 'd', [0, 0, 0])
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(len(root_instances), 0, "%s did not save" % self.root_model.__name__)
