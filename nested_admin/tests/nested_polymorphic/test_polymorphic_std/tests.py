from unittest import SkipTest
from django.test import TestCase

from .models import (
    # LevelOneA, LevelTwoC, LevelTwoD, ALevelTwo, ALevelTwoC, ALevelTwoD, BLevelTwo, LevelTwoC
    TopLevel, LevelOne, LevelOneB, LevelTwo, BLevelTwoC, BLevelTwoD)

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
            raise SkipTest('django-polymorphic unavailable')
        super(PolymorphicStdTestCase, cls).setUpClass()

    def test_add_level_one_to_empty(self):
        obj = self.root_model.objects.create(name='test')
        self.load_admin(obj)
        self.add_inline(model=LevelOneB, name='x', b='bx')
        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        self.assertEqual(children[0].name, 'x')
        self.assertEqual(children[0].b, 'bx')

    def test_add_level_two_to_empty(self):
        obj = self.root_model.objects.create(name='test')
        self.load_admin(obj)

        indexes = self.add_inline(model=LevelOneB, name='x', b='bx')

        self.add_inline(indexes, model=BLevelTwoC, name='y', bc='bcy')

        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        b = children[0]
        self.assertEqual(b.name, 'x')
        self.assertEqual(b.b, 'bx')

        b_children = b.b_set.all()
        self.assertEqual(len(b_children), 1)
        self.assertIsInstance(b_children[0], BLevelTwoC)
        self.assertEqual(b_children[0].name, 'y')
        self.assertEqual(b_children[0].bc, 'bcy')

    def test_add_level_two_to_empty_drag_and_drop(self):
        obj = self.root_model.objects.create(name='test')
        self.load_admin(obj)

        indexes = self.add_inline(model=LevelOneB, name='x', b='bx')
        from_indexes = self.add_inline(indexes, model=BLevelTwoC, name='y', bc='bcy')
        to_indexes = self.add_inline(indexes, model=BLevelTwoD, name='z', bd='bdz')

        self.drag_and_drop_item(from_indexes, to_indexes)

        self.save_form()

        children = obj.children.all()
        self.assertEqual(len(children), 1)
        self.assertIsInstance(children[0], LevelOneB)
        b = children[0]
        self.assertEqual(b.name, 'x')
        self.assertEqual(b.b, 'bx')

        b_children = b.b_set.all()
        self.assertEqual(len(b_children), 2)
        self.assertIsInstance(b_children[0], BLevelTwoD)
        self.assertNotEqual(b_children[0].name, 'y', 'Dragged BLevelTwoD inline did not move')
        self.assertEqual(b_children[0].name, 'z')
        self.assertEqual(b_children[0].bd, 'bdz')
        self.assertIsInstance(b_children[1], BLevelTwoC)
        self.assertEqual(b_children[1].name, 'y')
        self.assertEqual(b_children[1].bc, 'bcy')
