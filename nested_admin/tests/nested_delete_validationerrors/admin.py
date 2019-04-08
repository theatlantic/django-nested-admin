from django.contrib import admin
import nested_admin
from .models import Parent, Child, GrandChild


class GrandChildInline(nested_admin.NestedStackedInline):
    model = GrandChild
    extra = 0
    min_num = 1


class ChildInline(nested_admin.NestedStackedInline):
    model = Child
    inlines = [GrandChildInline]
    extra = 0


@admin.register(Parent)
class ParentAdmin(nested_admin.NestedModelAdmin):
    inlines = [ChildInline]
