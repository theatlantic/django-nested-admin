from unittest import SkipTest
from selenium.webdriver.support.ui import Select

from django.test import TestCase

from nested_admin.nested import get_model_id
from .models import (
    FreeText, Poll, Question, MultipleChoiceGroup, Survey, Text, Textarea)

try:
    from nested_admin.tests.nested_polymorphic.base import BaseNestedPolymorphicTestCase
except ImportError:
    BaseNestedPolymorphicTestCase = TestCase
    has_polymorphic = False
else:
    has_polymorphic = True


class PolymorphicAddFilteringTestCase(BaseNestedPolymorphicTestCase):
    root_model = Survey
    nested_models = (Question,)

    @classmethod
    def setUpClass(cls):
        if not has_polymorphic:
            raise SkipTest('django-polymorphic unavailable')
        super(PolymorphicAddFilteringTestCase, cls).setUpClass()

    def add_inline(self, indexes=None, model=None, **kwargs):
        indexes = super(PolymorphicAddFilteringTestCase, self).add_inline(
            indexes, model, **kwargs)
        if self.has_grappelli:
            item = self.get_item(indexes)
            item_id = item.get_attribute('id')
            with self.clickable_selector("#%s > .djn-collapse-handler" % item_id) as el:
                el.click()
            self.wait_until_element_is(item, '.grp-open',
                message='Collapsible #%s did not open' % item_id)
        return indexes

    def get_element_by_id(self, id):
        return self.selenium.execute_script(
            "return document.getElementById(arguments[0])", id)

    def test_polymorphic_add_inline_filtering(self):
        survey = Survey.objects.create(title='my survey')
        self.load_admin(survey)

        self.add_inline(model=FreeText)

        self.set_field('value', 'a', indexes=[[0, 0], [0, 0]])
        self.set_field('value', 'b', indexes=[[0, 0], [1, 0]])
        self.set_field('title', 'c', indexes=[[0, 0], [2, 0]])
        self.set_field('label', 'd', indexes=[[0, 0], [2, 0], [0, 0]])
        select_field = self.get_field('style', indexes=[[0, 0], [2, 0], [0, 0]])
        Select(select_field).select_by_visible_text('radio')
        self.set_field('value', 'e', indexes=[[0, 0], [2, 0], [0, 0]])
        self.save_form()

        questions = Question.objects.all()
        self.assertEqual(len(questions), 1)
        self.assertIsInstance(questions[0], FreeText)
        free_text = questions[0]

        free_text_components = free_text.questioncomponent_set.all()
        self.assertEqual(len(free_text_components), 3)
        free_text_text = free_text.questioncomponent_set.instance_of(Text).get()
        free_text_textarea = free_text.questioncomponent_set.instance_of(Textarea).get()
        free_text_multichoice_group = (
            free_text.questioncomponent_set.instance_of(MultipleChoiceGroup).get())
        self.assertEqual(free_text_text.value, 'a')
        self.assertEqual(free_text_textarea.value, 'b')
        self.assertEqual(free_text_multichoice_group.title, 'c')
        free_text_multi_choices = free_text_multichoice_group.multiplechoice_set.all()
        self.assertEqual(len(free_text_multi_choices), 1)
        self.assertEqual(free_text_multi_choices[0].label, 'd')
        self.assertEqual(free_text_multi_choices[0].style, 'radio')
        self.assertEqual(free_text_multi_choices[0].value, 'e')

        self.add_inline(model=Poll)

        self.set_field('value', 'f', indexes=[[0, 1], [0, 0]])
        self.set_field('title', 'g', indexes=[[0, 1], [1, 0]])
        form_prefix = self.get_item(indexes=[[0, 1], [1, 0], [0, 0]]).get_attribute('id')
        self.get_element_by_id('id_%s-label' % form_prefix).send_keys('h')
        self.get_element_by_id('id_%s-style_0' % form_prefix).click()
        self.get_element_by_id('id_%s-value' % form_prefix).send_keys('i')
        self.save_form()
        questions = Question.objects.all()
        self.assertEqual(len(questions), 2)
        self.assertIsInstance(questions[0], FreeText)
        self.assertIsInstance(questions[1], Poll)
        free_text = questions[0]

        free_text_components = free_text.questioncomponent_set.all()
        self.assertEqual(len(free_text_components), 3)
        free_text_text = free_text.questioncomponent_set.instance_of(Text).get()
        free_text_textarea = free_text.questioncomponent_set.instance_of(Textarea).get()
        free_text_multichoice_group = (
            free_text.questioncomponent_set.instance_of(MultipleChoiceGroup).get())
        self.assertEqual(free_text_text.value, 'a')
        self.assertEqual(free_text_textarea.value, 'b')
        self.assertEqual(free_text_multichoice_group.title, 'c')
        free_text_multi_choices = free_text_multichoice_group.multiplechoice_set.all()
        self.assertEqual(len(free_text_multi_choices), 1)
        self.assertEqual(free_text_multi_choices[0].label, 'd')
        self.assertEqual(free_text_multi_choices[0].style, 'radio')
        self.assertEqual(free_text_multi_choices[0].value, 'e')

        poll = questions[1]

        poll_components = poll.questioncomponent_set.all()
        self.assertEqual(len(poll_components), 2)
        poll_text = poll.questioncomponent_set.instance_of(Text).get()
        poll_multichoice_group = (
            poll.questioncomponent_set.instance_of(MultipleChoiceGroup).get())
        self.assertEqual(poll_text.value, 'f')
        self.assertEqual(poll_multichoice_group.title, 'g')
        poll_multi_choices = poll_multichoice_group.multiplechoice_set.all()
        self.assertEqual(len(poll_multi_choices), 1)
        self.assertEqual(poll_multi_choices[0].label, 'h')
        self.assertEqual(poll_multi_choices[0].style, 'radio')
        self.assertEqual(poll_multi_choices[0].value, 'i')
