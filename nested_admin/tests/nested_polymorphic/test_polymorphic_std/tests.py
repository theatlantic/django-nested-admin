from unittest import SkipTest
from django.test import TestCase

from .models import (
    # ALevelTwoC, LevelTwoC, LevelTwoD, ALevelTwo, BLevelTwo, LevelTwoC,
    LevelOneA,
    ALevelTwoC,
    ALevelTwoD,
    TopLevel,
    LevelOne,
    LevelOneB,
    LevelTwo,
    BLevelTwoC,
    BLevelTwoD,
    GFKX,
)


try:
    from nested_admin.tests.nested_polymorphic.base import BaseNestedPolymorphicTestCase
except ImportError:
    BaseNestedPolymorphicTestCase = TestCase
    has_polymorphic = False
else:
    has_polymorphic = True


class PolymorphicStdTestCase(BaseNestedPolymorphicTestCase):
    root_model = TopLevel
    nested_models = (LevelOne, LevelTwo)

    @classmethod
    def setUpClass(cls):
        if not has_polymorphic:
            raise SkipTest("django-polymorphic unavailable")
        super().setUpClass()

    def test_add_level_one_to_empty(self):
        obj = self.root_model.objects.create(name="test")
        self.load_admin(obj)
        self.add_inline(model=LevelOneB, name="x", b="bx")
        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        self.assertEqual(children[0].name, "x")
        self.assertEqual(children[0].b, "bx")

    def test_add_level_two_to_empty(self):
        obj = self.root_model.objects.create(name="test")
        self.load_admin(obj)

        indexes = self.add_inline(model=LevelOneB, name="x", b="bx")

        self.add_inline(indexes, model=BLevelTwoC, name="y", bc="bcy")

        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        b = children[0]
        self.assertEqual(b.name, "x")
        self.assertEqual(b.b, "bx")

        b_children = b.b_set.all()
        self.assertEqual(len(b_children), 1)
        self.assertIsInstance(b_children[0], BLevelTwoC)
        self.assertEqual(b_children[0].name, "y")
        self.assertEqual(b_children[0].bc, "bcy")

    def test_add_level_two_to_empty_with_validation_error(self):
        obj = self.root_model.objects.create(name="test")
        self.load_admin(obj)

        l1_indexes_a = self.add_inline(model=LevelOneA, name="k", a="ak")
        l2_indexes_a = self.add_inline(l1_indexes_a, model=ALevelTwoC, name="l")
        self.save_form()

        self.remove_inline(l2_indexes_a)

        l1_indexes_b = self.add_inline(model=LevelOneB, name="m", b="bm")
        self.add_inline(l1_indexes_b, model=BLevelTwoD, name="n", bd="bdn")
        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 2)

        a, b = list(children)

        self.assertIsInstance(a, LevelOneA)
        self.assertIsInstance(b, LevelOneB)

        self.assertEqual(a.name, "k")
        self.assertEqual(a.a, "ak")
        self.assertEqual(len(a.a_set.all()), 0)

        self.assertEqual(b.name, "m")
        self.assertEqual(b.b, "bm")

        b_children = b.b_set.all()
        self.assertEqual(len(b_children), 1)
        self.assertIsInstance(b_children[0], BLevelTwoD)
        self.assertEqual(b_children[0].name, "n")
        self.assertEqual(b_children[0].bd, "bdn")

    def test_add_level_two_to_empty_drag_and_drop(self):
        obj = self.root_model.objects.create(name="test")
        self.load_admin(obj)

        indexes = self.add_inline(model=LevelOneB, name="x", b="bx")
        from_indexes = self.add_inline(indexes, model=BLevelTwoC, name="y", bc="bcy")
        to_indexes = self.add_inline(indexes, model=BLevelTwoD, name="z", bd="bdz")

        self.drag_and_drop_item(from_indexes, to_indexes)

        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        b = children[0]
        self.assertEqual(b.name, "x")
        self.assertEqual(b.b, "bx")

        b_children = b.b_set.all()
        self.assertEqual(len(b_children), 2)
        self.assertIsInstance(b_children[0], BLevelTwoD)
        self.assertNotEqual(
            b_children[0].name, "y", "Dragged BLevelTwoD inline did not move"
        )
        self.assertEqual(b_children[0].name, "z")
        self.assertEqual(b_children[0].bd, "bdz")
        self.assertIsInstance(b_children[1], BLevelTwoC)
        self.assertEqual(b_children[1].name, "y")
        self.assertEqual(b_children[1].bc, "bcy")

    def test_add_level_two_child_gfk_inline(self):
        obj = self.root_model.objects.create(name="test")
        self.load_admin(obj)
        idx_a = self.add_inline(model=LevelOneA, name="x", a="ax")
        idx_a_d = self.add_inline(idx_a, model=ALevelTwoD, name="y", ad="ady")
        self.add_inline(idx_a_d, model=GFKX)
        gfk_name_selector = "#id_children-0-a_set-0-test_polymorphic_std-gfkx-content_type-object_id-0-name"
        with self.available_selector(gfk_name_selector) as el:
            el.clear()
            el.send_keys("Z")

        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneA)
        a = children[0]
        self.assertEqual(a.name, "x")
        self.assertEqual(a.a, "ax")

        a_children = a.a_set.all()
        self.assertEqual(len(a_children), 1)
        self.assertIsInstance(a_children[0], ALevelTwoD)
        self.assertEqual(a_children[0].name, "y")
        self.assertEqual(a_children[0].ad, "ady")

        gfk_children = a_children[0].x_set.all()
        self.assertEqual(len(gfk_children), 1)
        self.assertEqual(gfk_children[0].name, "Z")
