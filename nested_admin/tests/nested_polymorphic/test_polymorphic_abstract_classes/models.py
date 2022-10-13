import django
from django.db import models
from django.db.models import ForeignKey, CASCADE

try:
    from polymorphic.models import PolymorphicModel
except:
    # Temporary until django-polymorphic supports django 3.1
    if django.VERSION < (3, 1):
        raise
    else:
        PolymorphicModel = models.Model


def NON_POLYMORPHIC_CASCADE(collector, field, sub_objs, using):
    return CASCADE(collector, field, sub_objs.non_polymorphic(), using)


class Survey(models.Model):
    title = models.CharField(max_length=255)


class SurveyBlock(PolymorphicModel):
    survey = ForeignKey(Survey, related_name='blocks', on_delete=NON_POLYMORPHIC_CASCADE)
    position = models.PositiveSmallIntegerField(null=True)

    class Meta:
        ordering = ["position"]


class BaseQuestionBlock(SurveyBlock):
    label = models.CharField(max_length=255)

    class Meta:
        abstract = True


class QuestionBlock(BaseQuestionBlock):
    is_required = models.BooleanField()


class FreeTextBlock(BaseQuestionBlock):
    pass


class PollBlock(BaseQuestionBlock):
    pass
