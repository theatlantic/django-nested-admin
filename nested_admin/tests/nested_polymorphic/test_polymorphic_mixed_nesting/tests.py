from unittest import SkipTest
from django.test import TestCase

from .models import (
    Block, BlockMarkdown, BlockRadioGroup, BlockRadioButton,
    Questionnaire, SurveyStep)


try:
    from nested_admin.tests.nested_polymorphic.base import BaseNestedPolymorphicTestCase
except ImportError:
    BaseNestedPolymorphicTestCase = TestCase
    has_polymorphic = False
else:
    has_polymorphic = True


class PolymorphicMixedNestingTestCase(BaseNestedPolymorphicTestCase):
    """
    Tests for polymorphic inlines that are nested inside non-polymorphic inlines.
    """
    root_model = Questionnaire

    @classmethod
    def setUpClass(cls):
        if not has_polymorphic:
            raise SkipTest('django-polymorphic unavailable')
        super(PolymorphicMixedNestingTestCase, cls).setUpClass()

    def test_polymorphic_child_formset_rendering(self):
        """The admin should only display one child inline for polymorphic instances"""
        obj = self.root_model.objects.create(title='test')
        self.load_admin(obj)
        step_indexes = self.add_inline(model=SurveyStep, title='Step 1')
        self.add_inline(step_indexes, model=BlockMarkdown, value="Some instructions")
        group_indexes = self.add_inline(step_indexes, model=BlockRadioGroup, label="Select one")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice 1")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice 2")

        inline_ids = [
            el.get_attribute('id') for el in
            self.selenium.find_elements_by_css_selector(
                '.djn-group:not([id*="-empty-"]')]

        expected_inline_ids = [
            "surveystep_set-group",
            "surveystep_set-0-block_set-group",
            "surveystep_set-0-block_set-1-blockradiobutton_set-group"]

        assert inline_ids == expected_inline_ids

        self.save_form()

        inline_ids = [
            el.get_attribute('id') for el in
            self.selenium.find_elements_by_css_selector(
                '.djn-group:not([id*="-empty-"]')]

        assert "surveystep_set-0-block_set-0-blockradiobutton_set-group" not in inline_ids, (
            "Nested polymorphic model erroneously has inlines for both child models")
        assert inline_ids == expected_inline_ids

    def test_add_step_to_empty_survey(self):
        survey = self.root_model.objects.create(title='test')
        self.load_admin(survey)
        self.add_inline(model=SurveyStep, title='Step 1')
        self.save_form()

        steps = survey.surveystep_set.all()

        assert len(steps) == 1
        assert steps[0].title == "Step 1"

    def test_add_blocks_to_empty_survey(self):
        survey = self.root_model.objects.create(title='test')
        self.load_admin(survey)
        step_indexes = self.add_inline(model=SurveyStep, title='Step 1')
        self.add_inline(step_indexes, model=BlockMarkdown, value="Some instructions")
        group_indexes = self.add_inline(step_indexes, model=BlockRadioGroup, label="Select one")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice 1")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice 2")
        self.save_form()

        steps = survey.surveystep_set.all()

        assert len(steps) == 1
        assert steps[0].title == "Step 1"

        blocks = Block.objects.filter(survey_step=steps[0])
        assert len(blocks) == 2
        assert isinstance(blocks[0], BlockMarkdown)
        assert isinstance(blocks[1], BlockRadioGroup)
        assert blocks[0].value == 'Some instructions'
        assert blocks[1].label == 'Select one'

        buttons = blocks[1].blockradiobutton_set.all()
        assert len(buttons) == 2
        assert list(buttons.values_list('label', flat=True)) == ["Choice 1", "Choice 2"]

    def test_add_blocks_to_existing_survey(self):
        survey = self.root_model.objects.create(title='test')
        step = SurveyStep.objects.create(survey=survey, title='Step 1', position=0)
        BlockMarkdown.objects.create(survey_step=step, position=0, value='Some instructions')
        group = BlockRadioGroup.objects.create(survey_step=step, position=1, label='Select one')

        BlockRadioButton.objects.create(radio_group=group, position=0, label='Choice 1')
        BlockRadioButton.objects.create(radio_group=group, position=1, label='Choice 2')

        self.load_admin(survey)

        self.add_inline([[0, 0], [0, 1]], model=BlockRadioButton, label="Choice 3")
        self.add_inline([[0, 0]], model=BlockMarkdown, value="More instructions")

        step_indexes = self.add_inline(model=SurveyStep, title='Step 2')
        self.add_inline(step_indexes, model=BlockMarkdown, value="Other instructions")
        group_indexes = self.add_inline(step_indexes, model=BlockRadioGroup, label="Please choose")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice A")
        self.add_inline(group_indexes, BlockRadioButton, label="Choice B")
        self.save_form()

        assert survey.serialize() == {
            "title": "test",
            "steps": [{
                "title": "Step 1",
                "blocks": [{
                    "type": "markdown",
                    "value": "Some instructions"
                }, {
                    "type": "radiogroup",
                    "label": "Select one",
                    "buttons": ["Choice 1", "Choice 2", "Choice 3"],
                }, {
                    "type": "markdown",
                    "value": "More instructions"
                }],
            }, {
                "title": "Step 2",
                "blocks": [{
                    "type": "markdown",
                    "value": "Other instructions"
                }, {
                    "type": "radiogroup",
                    "label": "Please choose",
                    "buttons": ["Choice A", "Choice B"],
                }],
            }],
        }
