from django.contrib import admin
from nested_admin import NestedStackedInline, NestedAdmin

from .models import Group, Section, Item


class ItemInline(NestedStackedInline):

    model = Item
    extra = 0
    sortable_field_name = "position"
    inline_classes = ("collapse open",)


class SectionInline(NestedStackedInline):

    model = Section
    extra = 0
    sortable_field_name = "position"

    inlines = [ItemInline]
    inline_classes = ("collapse open",)


class GroupAdmin(NestedAdmin):

    inlines = [SectionInline]


admin.site.register(Group, GroupAdmin)
