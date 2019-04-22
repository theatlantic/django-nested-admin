from django.db import models
from django.db.models import ForeignKey, CASCADE
from polymorphic.models import PolymorphicModel


def NON_POLYMORPHIC_CASCADE(collector, field, sub_objs, using):
    return CASCADE(collector, field, sub_objs.non_polymorphic(), using)


class Survey(models.Model):
    title = models.CharField(max_length=255)


class Question(PolymorphicModel):
    survey = ForeignKey(Survey, on_delete=NON_POLYMORPHIC_CASCADE)
    position = models.PositiveSmallIntegerField(null=True)

    class Meta:
        ordering = ["position"]


class FreeText(Question):
    pass


class Poll(Question):
    pass


class QuestionComponent(PolymorphicModel):
    question = ForeignKey(Question, on_delete=NON_POLYMORPHIC_CASCADE)
    position = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        ordering = ["position"]


class Text(QuestionComponent):
    value = models.CharField(max_length=255)


class Textarea(QuestionComponent):
    value = models.TextField()


class MultipleChoiceGroup(QuestionComponent):
    title = models.CharField(max_length=255)


class MultipleChoice(models.Model):
    group = ForeignKey(MultipleChoiceGroup, on_delete=NON_POLYMORPHIC_CASCADE)
    label = models.CharField(max_length=255)
    style = models.CharField(max_length=255, choices=(
        ('radio', 'radio'),
        ('dropdown', 'dropdown'),
        ('checkboxes', 'checkboxes'),
    ))
    value = models.CharField(max_length=255)
    position = models.PositiveSmallIntegerField(null=True)

    class Meta:
        ordering = ['position']
