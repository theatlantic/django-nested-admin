from django.contrib import admin
import nested_admin
from .models import Parent, Child1, Child2


class Child2Inline(nested_admin.NestedStackedInline):
    model = Child2
    extra = 0
    min_num = 1


class Child1Inline(nested_admin.NestedStackedInline):
    model = Child1
    inlines = [Child2Inline]
    extra = 0
    min_num = 1


@admin.register(Parent)
class ParentAdmin(nested_admin.NestedModelAdmin):
    model = Parent
    inlines = [Child1Inline]
    extra = 0
    min_num = 1
