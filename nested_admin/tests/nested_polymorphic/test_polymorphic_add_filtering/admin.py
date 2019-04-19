from django.contrib import admin
from django.db import models
from django import forms

import nested_admin

from .models import (
    FreeText, Poll, Question, MultipleChoiceGroup, MultipleChoice, Survey, Text, Textarea)


class TextInline(nested_admin.NestedTabularInline):
    model = Text
    extra = 1
    min_num = 1
    max_num = 1
    sortable_field_name = "position"
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class TextareaInline(nested_admin.NestedTabularInline):
    model = Textarea
    extra = 1
    min_num = 1
    max_num = 1
    sortable_field_name = "position"
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class RadioInline(nested_admin.NestedTabularInline):
    model = MultipleChoice
    sortable_field_name = "position"
    extra = 0
    min_num = 1
    max_num = 8
    radio_fields = {'style': admin.HORIZONTAL}
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class RadioGroupInline(nested_admin.NestedTabularInline):
    model = MultipleChoiceGroup
    inlines = (RadioInline,)
    extra = 0
    min_num = 1
    max_num = 1
    sortable_field_name = "position"
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class DropDownInline(nested_admin.NestedTabularInline):
    model = MultipleChoice
    sortable_field_name = "position"
    extra = 0
    min_num = 1
    max_num = 8
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class DropDownGroupInline(nested_admin.NestedTabularInline):
    model = MultipleChoiceGroup
    inlines = (DropDownInline,)
    extra = 0
    min_num = 1
    max_num = 1
    sortable_field_name = "position"
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


class QuestionInline(nested_admin.NestedStackedPolymorphicInline):
    class FreeTextInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = FreeText
        inlines = (TextInline, TextareaInline, DropDownGroupInline)
        sortable_field_name = "position"
        formfield_overrides = {
            models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
        }

    class PollInline(nested_admin.NestedStackedPolymorphicInline.Child):
        model = Poll
        inlines = (TextInline, RadioGroupInline,)
        sortable_field_name = "position"
        formfield_overrides = {
            models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
        }

    model = Question
    extra = 0
    sortable_field_name = "position"
    child_inlines = (FreeTextInline, PollInline,)
    formfield_overrides = {
        models.PositiveSmallIntegerField: {'widget': forms.HiddenInput},
    }


@admin.register(Survey)
class SurveyAdmin(nested_admin.NestedPolymorphicModelAdmin):
    inlines = (QuestionInline,)
