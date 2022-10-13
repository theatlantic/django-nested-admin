import time

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import GFKRoot, GFKA, GFKB


class TestGenericInlineAdmin(BaseNestedAdminTestCase):

    root_model = GFKRoot

    def test_add_to_empty_one_deep(self):
        root = self.root_model.objects.create(slug="test")

        self.load_admin(root)

        self.add_inline(slug="test")
        self.save_form()

        a_set = root.a_set.all()

        self.assertEqual(len(a_set), 1)
        self.assertEqual(a_set[0].slug, "test")
        self.assertEqual(a_set[0].position, 0)

    def test_add_to_empty_two_deep(self):
        root = self.root_model.objects.create(slug="test")
        a = GFKA.objects.create(slug="test", content_object=root, position=0)

        self.load_admin(root)
        self.add_inline([0], name="Test")
        self.save_form()

        b_set = a.b_set.all()

        self.assertEqual(len(b_set), 1)
        self.assertEqual(b_set[0].name, "Test")
        self.assertEqual(b_set[0].position, 0)

    def test_drag_existing_objs(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.drag_and_drop_item(
            from_indexes=[1, 2], to_indexes=[0, 1], screenshot_hack=True
        )
        self.save_form()

        y_2 = GFKB.objects.get(name="Y 2")

        self.assertEqual(
            y_2.content_object, x, "item was not moved to the correct parent"
        )
        self.assertEqual(y_2.position, 1, "item was not moved to the correct position")

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()],
            [
                "root/x[0]/X 0[0]",
                "root/x[0]/Y 2[1]",
                "root/x[0]/X 1[2]",
                "root/x[0]/X 2[3]",
            ],
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 1[1]"]
        )

    def test_drag_add_drag(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.add_inline(indexes=[0], name="X 3")
        self.drag_and_drop_item(
            from_indexes=[1, 1], to_indexes=[0, 1], screenshot_hack=True
        )

        self.save_form()

        y_1 = GFKB.objects.get(name="Y 1")
        self.assertEqual(
            y_1.content_object, x, "Y1 was not moved to the correct parent"
        )
        self.assertEqual(y_1.position, 1, "Y1 was not moved to the correct position")

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()],
            [
                "root/x[0]/X 0[0]",
                "root/x[0]/Y 1[1]",
                "root/x[0]/X 1[2]",
                "root/x[0]/X 2[3]",
                "root/x[0]/X 3[4]",
            ],
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 2[1]"]
        )

    def test_drag_new_item(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)

        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)

        self.load_admin(root)

        self.add_inline(indexes=[1], name="Y 2")
        time.sleep(0.01)
        self.drag_and_drop_item(
            from_indexes=[1, 2], to_indexes=[0, 1], screenshot_hack=True
        )

        self.save_form()

        y_2 = GFKB.objects.get(name="Y 2")

        self.assertEqual(
            y_2.content_object, x, "Y2 was not moved to the correct parent"
        )
        self.assertEqual(y_2.position, 1, "Y2 was not moved to the correct position")

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()],
            [
                "root/x[0]/X 0[0]",
                "root/x[0]/Y 2[1]",
                "root/x[0]/X 1[2]",
                "root/x[0]/X 2[3]",
            ],
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 1[1]"]
        )

    def test_delete_two_deep(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.delete_inline(indexes=[1, 1])

        self.save_form()

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()],
            ["root/x[0]/X 0[0]", "root/x[0]/X 1[1]", "root/x[0]/X 2[2]"],
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 2[1]"]
        )

    def test_delete_one_deep(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.delete_inline(indexes=[0])

        self.save_form()

        self.assertEqual(
            len(GFKA.objects.filter(slug="x")), 0, "GFKA instance was not deleted"
        )

        y = GFKA.objects.get(slug="y")

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()],
            ["root/y[0]/Y 0[0]", "root/y[0]/Y 1[1]", "root/y[0]/Y 2[2]"],
        )

    def test_delete_two_deep_undelete_one_deep(self):
        """
        Test that, if an item is deleted, then the parent is deleted, and
        then the parent is undeleted, that the item stays deleted.
        """
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.delete_inline(indexes=[0, 1])
        self.delete_inline(indexes=[0])
        self.undelete_inline(indexes=[0])

        self.save_form()

        self.assertEqual(
            len(GFKA.objects.filter(slug="x")), 1, "GFKA instance should not be deleted"
        )

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()], ["root/x[0]/X 0[0]", "root/x[0]/X 2[1]"]
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()],
            ["root/y[1]/Y 0[0]", "root/y[1]/Y 1[1]", "root/y[1]/Y 2[2]"],
        )

    def test_remove_two_deep(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)

        self.load_admin(root)

        self.add_inline(indexes=[1], name="Y 2")
        self.remove_inline(indexes=[1, 2])

        self.save_form()

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()],
            ["root/x[0]/X 0[0]", "root/x[0]/X 1[1]", "root/x[0]/X 2[2]"],
        )

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 1[1]"]
        )

    def test_drag_item_to_empty_parent(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        y = GFKA.objects.create(slug="y", content_object=root, position=1)
        GFKB.objects.create(name="Y 0", content_object=y, position=0)
        GFKB.objects.create(name="Y 1", content_object=y, position=1)
        GFKB.objects.create(name="Y 2", content_object=y, position=2)

        self.load_admin(root)

        self.drag_and_drop_item(from_indexes=[1, 2], to_indexes=[0, 0])

        self.save_form()

        y_2 = GFKB.objects.get(name="Y 2")
        self.assertEqual(
            y_2.content_object, x, "Y2 was not moved to the correct parent"
        )
        self.assertEqual(y_2.position, 0, "Y2 was not moved to the correct position")

        self.assertEqual(["%s" % i for i in x.b_set.all()], ["root/x[0]/Y 2[0]"])

        self.assertEqual(
            ["%s" % i for i in y.b_set.all()], ["root/y[1]/Y 0[0]", "root/y[1]/Y 1[1]"]
        )

    def test_drag_item_to_new_empty_parent(self):
        root = self.root_model.objects.create(slug="root")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        GFKB.objects.create(name="X 0", content_object=x, position=0)
        GFKB.objects.create(name="X 1", content_object=x, position=1)
        GFKB.objects.create(name="X 2", content_object=x, position=2)

        self.load_admin(root)

        self.add_inline(slug="y")
        self.drag_and_drop_item(from_indexes=[0, 2], to_indexes=[1, 0])

        self.save_form()

        x_2 = GFKB.objects.get(name="X 2")
        y = GFKA.objects.get(slug="y")
        self.assertEqual(
            x_2.content_object, y, "X2 was not moved to the correct parent"
        )
        self.assertEqual(x_2.position, 0, "X2 was not moved to the correct position")

        self.assertEqual(
            ["%s" % i for i in x.b_set.all()], ["root/x[0]/X 0[0]", "root/x[0]/X 1[1]"]
        )

        self.assertEqual(["%s" % i for i in y.b_set.all()], ["root/y[1]/X 2[0]"])

    def test_drag_existing_gfkb_to_new_parent_and_back(self):
        root = self.root_model.objects.create(slug="test")
        x = GFKA.objects.create(slug="x", content_object=root, position=0)
        GFKB.objects.create(name="X 0", content_object=x, position=0)

        self.load_admin(root)

        self.add_inline(slug="y")
        self.drag_and_drop_item(from_indexes=[0, 0], to_indexes=[1, 0])
        self.drag_and_drop_item(from_indexes=[1, 0], to_indexes=[0, 0])

        self.save_form()

        self.assertEqual(len(GFKA.objects.all()), 2, "Save failed")

        x_0 = GFKB.objects.get(name="X 0")

        self.assertEqual(x_0.content_object, x, "X0 is in the wrong parent")
        self.assertEqual(x_0.position, 0, "X0 has the wrong position")
