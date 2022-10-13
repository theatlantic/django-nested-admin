from unittest import SkipTest
from django.test import TestCase

from .models import (
    FreeTextBlock, PollBlock, QuestionBlock, Survey, SurveyBlock, )


try:
    from nested_admin.tests.nested_polymorphic.base import BaseNestedPolymorphicTestCase
except ImportError:
    BaseNestedPolymorphicTestCase = TestCase
    has_polymorphic = False
else:
    has_polymorphic = True


class PolymorphicAbstractClassesTestCase(BaseNestedPolymorphicTestCase):
    root_model = Survey
    nested_models = (SurveyBlock, )

    @classmethod
    def setUpClass(cls):
        if not has_polymorphic:
            raise SkipTest('django-polymorphic unavailable')
        super(PolymorphicAbstractClassesTestCase, cls).setUpClass()

    def test_add_level_one_to_empty(self):
        obj = self.root_model.objects.create(title='test')
        self.load_admin(obj)
        self.add_inline(model=QuestionBlock, label='x')
        self.save_form()

        blocks = obj.blocks.all()
        self.assertEqual(len(blocks), 1)
        self.assertIsInstance(blocks[0], QuestionBlock)
        self.assertEqual(blocks[0].label, 'x')
        self.assertEqual(blocks[0].is_required, False)

    def test_can_move_children_of_abstract(self):
        obj = self.root_model.objects.create(title='test')
        self.load_admin(obj)
        self.add_inline(model=PollBlock, label='poll')
        self.add_inline(model=QuestionBlock, label='question')
        self.add_inline(model=FreeTextBlock, label='free')
        self.save_form()

        blocks = obj.blocks.all()
        self.assertEqual(len(blocks), 3)
        self.assertIsInstance(blocks[0], PollBlock)
        self.assertEqual(blocks[0].label, 'poll')
        self.assertEqual(blocks[0].position, 0)
        self.assertIsInstance(blocks[1], QuestionBlock)
        self.assertEqual(blocks[1].label, 'question')
        self.assertEqual(blocks[1].position, 1)
        self.assertEqual(blocks[1].is_required, False)
        self.assertIsInstance(blocks[2], FreeTextBlock)
        self.assertEqual(blocks[2].label, 'free')
        self.assertEqual(blocks[2].position, 2)

        # Move question block to top
        self.drag_and_drop_item([1], [0], screenshot_hack=True)

        self.save_form()

        blocks = obj.blocks.all()
        self.assertEqual(len(blocks), 3)
        self.assertIsInstance(blocks[0], QuestionBlock)
        self.assertEqual(blocks[0].label, 'question')
        self.assertEqual(blocks[0].position, 0)
        self.assertEqual(blocks[0].is_required, False)
        self.assertIsInstance(blocks[1], PollBlock)
        self.assertEqual(blocks[1].label, 'poll')
        self.assertEqual(blocks[1].position, 1)
        self.assertIsInstance(blocks[2], FreeTextBlock)
        self.assertEqual(blocks[2].label, 'free')
        self.assertEqual(blocks[2].position, 2)
