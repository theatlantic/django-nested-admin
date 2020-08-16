import django
from django.db import models

from nested_admin.tests.compat import python_2_unicode_compatible

try:
    from polymorphic.models import PolymorphicModel
except:
    # Temporary until django-polymorphic supports django 3.1
    if django.VERSION < (3, 1):
        raise
    else:
        PolymorphicModel = models.Model


class SurveyStep(models.Model):
    position = models.PositiveIntegerField()
    survey = models.ForeignKey("Questionnaire", models.CASCADE)
    title = models.CharField(max_length=255)

    class Meta:
        ordering = ['position']

    def serialize(self):
        blocks = [b.serialize() for b in self.block_set.all()]
        return {
            "title": self.title,
            "blocks": blocks,
        }


class Block(PolymorphicModel):
    position = models.PositiveIntegerField()
    survey_step = models.ForeignKey("SurveyStep", models.CASCADE)

    class Meta:
        ordering = ['position']


class BlockMarkdown(Block):
    value = models.TextField()

    def serialize(self):
        return {
            "type": "markdown",
            "value": self.value,
        }


class BlockRadioGroup(Block):
    label = models.CharField(max_length=255)

    def serialize(self):
        buttons = [b.serialize() for b in self.blockradiobutton_set.all()]
        return {
            "type": "radiogroup",
            "label": self.label,
            "buttons": buttons,
        }


class BlockRadioButton(models.Model):
    radio_group = models.ForeignKey(Block, models.CASCADE)
    label = models.CharField(max_length=255)
    position = models.PositiveIntegerField()

    class Meta:
        ordering = ['position']

    def serialize(self):
        return self.label


@python_2_unicode_compatible
class Questionnaire(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    def serialize(self):
        steps = [s.serialize() for s in self.surveystep_set.all()]
        return {
            "title": self.title,
            "steps": steps,
        }
