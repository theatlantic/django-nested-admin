from django.contrib import admin
from django import forms
import nested_admin

from .models import Root, A, AX, AY, B, BX, BY


class BXModelForm(forms.ModelForm):
    class Meta:
        model = BX
        exclude = ['b_type']


class BYModelForm(forms.ModelForm):
    class Meta:
        model = BY
        exclude = ['b_type']


class BInline(nested_admin.NestedStackedInline):
    model = B
    extra = 0
    sortable_field_name = "position"
    inline_classes = ("collapse", "open", )

    def get_queryset(self, request):
        qset = super(BInline, self).get_queryset(request)
        return qset.filter(b_type=self.model.default_b_type)


class BXInline(BInline):
    model = BX
    form = BXModelForm


class BYInline(BInline):
    model = BY
    form = BYModelForm
    extra = 0


class AXModelForm(forms.ModelForm):
    class Meta:
        model = AX
        exclude = ['a_type']


class AYModelForm(forms.ModelForm):
    class Meta:
        model = AY
        exclude = ['a_type']


class AInline(nested_admin.NestedStackedInline):
    model = A
    extra = 0
    inlines = [BXInline, BYInline]
    sortable_field_name = "position"
    inline_classes = ("collapse", "open", )

    def get_queryset(self, request):
        qset = super(AInline, self).get_queryset(request)
        return qset.filter(a_type=self.model.default_a_type)


class AXInline(AInline):
    model = AX
    form = AXModelForm


class AYInline(AInline):
    model = AY
    form = AYModelForm
    extra = 0


@admin.register(Root)
class RootAdmin(nested_admin.NestedModelAdmin):

    inlines = [AXInline, AYInline]
