from django.contrib.auth.models import Permission, User

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import TopLevel, LevelOne, LevelTwo, LevelThree


class TestDeepNesting(BaseNestedAdminTestCase):

    root_model = TopLevel
    nested_models = (LevelOne, LevelTwo, LevelThree)

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.l1_model, cls.l2_model, cls.l3_model = cls.nested_models

    def test_validationerror_on_empty_extra_parent_form(self):
        toplevel = TopLevel.objects.create(name="a")
        self.load_admin(toplevel)

        self.set_field("name", "c", indexes=[0, 0])
        self.set_field("name", "d", indexes=[0, 0, 0])

        self.save_form()

        field_id_with_error = self.selenium.execute_script(
            "return $('ul.errorlist li').closest('.form-row').find('input').attr('id')"
        )

        self.assertEqual(field_id_with_error, "id_children-0-name")

    def test_create_new(self):
        self.load_admin()
        self.set_field("name", "a")
        self.set_field("name", "b", [0])
        self.set_field("name", "c", [0, 0])
        self.set_field("name", "d", [0, 0, 0])
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(
            len(root_instances), 0, "%s did not save" % self.root_model.__name__
        )
        self.assertEqual(
            len(root_instances), 1, "Too many %s found" % self.root_model.__name__
        )
        root = root_instances[0]
        self.assertEqual(
            root.name, "a", "%s.name has wrong value" % self.root_model.__name__
        )
        l1_instances = root.children.all()
        self.assertNotEqual(
            len(l1_instances), 0, "%s did not save" % self.l1_model.__name__
        )
        self.assertEqual(
            len(l1_instances), 1, "Too many %s found" % self.l1_model.__name__
        )
        l1_instance = l1_instances[0]
        self.assertEqual(
            l1_instance.name, "b", "%s.name has wrong value" % self.l1_model.__name__
        )
        l2_instances = l1_instance.children.all()
        self.assertNotEqual(
            len(l2_instances), 0, "%s did not save" % self.l2_model.__name__
        )
        self.assertEqual(
            len(l2_instances), 1, "Too many %s found" % self.l2_model.__name__
        )
        l2_instance = l2_instances[0]
        self.assertEqual(
            l2_instance.name, "c", "%s.name has wrong value" % self.l2_model.__name__
        )
        l3_instances = l2_instance.children.all()
        self.assertNotEqual(
            len(l3_instances), 0, "%s did not save" % self.l3_model.__name__
        )
        self.assertEqual(
            len(l3_instances), 1, "Too many %s found" % self.l3_model.__name__
        )
        l3_instance = l3_instances[0]
        self.assertEqual(
            l3_instance.name, "d", "%s.name has wrong value" % self.l3_model.__name__
        )

    def test_create_new_no_extras(self):
        self.load_admin()
        self.set_field("name", "a")
        self.remove_inline([0])
        self.add_inline(name="b")
        self.remove_inline([0, 0])
        self.add_inline([0], name="c")
        self.remove_inline([0, 0, 0])
        self.add_inline([0, 0], name="d")
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(
            len(root_instances), 0, "%s did not save" % self.root_model.__name__
        )
        self.assertEqual(
            len(root_instances), 1, "Too many %s found" % self.root_model.__name__
        )
        root = root_instances[0]
        self.assertEqual(
            root.name, "a", "%s.name has wrong value" % self.root_model.__name__
        )
        l1_instances = root.children.all()
        self.assertNotEqual(
            len(l1_instances), 0, "%s did not save" % self.l1_model.__name__
        )
        self.assertEqual(
            len(l1_instances), 1, "Too many %s found" % self.l1_model.__name__
        )
        l1_instance = l1_instances[0]
        self.assertEqual(
            l1_instance.name, "b", "%s.name has wrong value" % self.l1_model.__name__
        )
        l2_instances = l1_instance.children.all()
        self.assertNotEqual(
            len(l2_instances), 0, "%s did not save" % self.l2_model.__name__
        )
        self.assertEqual(
            len(l2_instances), 1, "Too many %s found" % self.l2_model.__name__
        )
        l2_instance = l2_instances[0]
        self.assertEqual(
            l2_instance.name, "c", "%s.name has wrong value" % self.l2_model.__name__
        )
        l3_instances = l2_instance.children.all()
        self.assertNotEqual(
            len(l3_instances), 0, "%s did not save" % self.l3_model.__name__
        )
        self.assertEqual(
            len(l3_instances), 1, "Too many %s found" % self.l3_model.__name__
        )
        l3_instance = l3_instances[0]
        self.assertEqual(
            l3_instance.name, "d", "%s.name has wrong value" % self.l3_model.__name__
        )

    def test_save_missing_intermediate_inline(self):
        self.load_admin()
        self.set_field("name", "a")
        self.set_field("name", "b", [0])
        self.set_field("name", "d", [0, 0, 0])
        self.save_form()

        root_instances = self.root_model.objects.all()
        self.assertNotEqual(
            len(root_instances), 0, "%s did not save" % self.root_model.__name__
        )


class TestNestedPermissions(BaseNestedAdminTestCase):
    auto_login = False

    root_model = TopLevel
    nested_models = (LevelOne, LevelTwo, LevelThree)

    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls.l1_model, cls.l2_model, cls.l3_model = cls.nested_models

    def setUp(self):
        super().setUp()

        self.user = User(username="user", is_staff=True, is_active=True)
        self.user.set_password("password")
        self.user.save()

        models = (self.root_model,) + self.nested_models
        self.permissions = {}

        for model in models:
            app_label = model._meta.app_label
            model_name = model._meta.model_name
            for perm_type in ["add", "change", "delete"]:
                codename = "{}_{}".format(perm_type, model_name)
                self.permissions[codename] = Permission.objects.get_by_natural_key(
                    codename, app_label, model_name
                )

            self.user.user_permissions.add(self.permissions["change_%s" % model_name])

            try:
                view_perm = Permission.objects.get_by_natural_key(
                    "view_%s" % model_name, app_label, model_name
                )
            except Permission.DoesNotExist:
                pass
            else:
                # Give the user view permissions
                self.user.user_permissions.add(view_perm)

    def test_user_lacks_parent_permissions_can_add(self):
        for perm_type in ["add", "delete"]:
            self.user.user_permissions.add(
                self.permissions["%s_levelthree" % perm_type]
            )

        toplevel = TopLevel.objects.create(name="root")
        l1 = LevelOne.objects.create(name="a1", parent_level=toplevel, position=0)
        l2_1 = LevelTwo.objects.create(name="b1", parent_level=l1, position=0)
        LevelTwo.objects.create(name="b2", parent_level=l1, position=1)
        LevelThree.objects.create(name="c1", parent_level=l2_1, position=0)

        self.admin_login("user", "password")

        self.load_admin(toplevel)

        self.set_field("name", "c2", [0, 1, 0])
        self.save_form()

        l3_objs = LevelThree.objects.all().order_by("name")
        self.assertEqual(l3_objs[0].name, "c1")
        self.assertNotEqual(len(l3_objs), 1, "New LevelThree inline was not saved")
        self.assertEqual(len(l3_objs), 2)
        self.assertEqual(l3_objs[1].name, "c2")

    def test_user_lacks_parent_permissions_can_delete(self):
        for perm_type in ["add", "delete"]:
            self.user.user_permissions.add(
                self.permissions["%s_levelthree" % perm_type]
            )

        toplevel = TopLevel.objects.create(name="root")
        l1 = LevelOne.objects.create(name="a1", parent_level=toplevel, position=0)
        l2_1 = LevelTwo.objects.create(name="b1", parent_level=l1, position=0)
        LevelTwo.objects.create(name="b2", parent_level=l1, position=1)
        LevelThree.objects.create(name="c1", parent_level=l2_1, position=0)

        self.admin_login("user", "password")

        self.load_admin(toplevel)

        self.delete_inline([0, 0, 0])
        self.save_form()

        l3_objs = LevelThree.objects.all().order_by("name")
        self.assertEqual(len(l3_objs), 0, "LevelThree inline did not delete")
