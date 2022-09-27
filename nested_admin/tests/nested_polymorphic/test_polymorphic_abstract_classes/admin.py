from django.contrib import admin
from django.db import models
from django import forms

import nested_admin

from .models import (
    FreeTextBlock, PollBlock, QuestionBlock, Survey, SurveyBlock, )


class SurveyBlockInline(nested_admin.NestedStackedPolymorphicInline):
    class QuestionInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = QuestionBlock
        sortable_field_name = "position"
        formfield_overrides = {
            models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
        }

    class FreeTextInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = FreeTextBlock
        sortable_field_name = "position"
        formfield_overrides = {
            models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
        }

    class PollInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = PollBlock
        sortable_field_name = "position"
        formfield_overrides = {
            models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
        }

    model = SurveyBlock
    extra = 0
    sortable_field_name = "position"
    child_inlines = (FreeTextInline, PollInline, QuestionInline)
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


@admin.register(Survey)
class SurveyAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = (SurveyBlockInline,)
