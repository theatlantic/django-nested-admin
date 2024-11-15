from django.contrib import admin
from nested_admin import NestedGenericStackedInline, NestedModelAdmin
from .models import GFKRoot, GFKA, GFKB


class GFKBInline(NestedGenericStackedInline):
    model = GFKB
    extra = 0
    sortable_field_name = "position"
    inline_classes = (
        "collapse",
        "open",
        "grp-collapse",
        "grp-open",
    )


class GFKAInline(NestedGenericStackedInline):
    model = GFKA
    extra = 0
    sortable_field_name = "position"
    inlines = [GFKBInline]
    inline_classes = (
        "collapse",
        "open",
        "grp-collapse",
        "grp-open",
    )


@admin.register(GFKRoot)
class GFKRootAdmin(NestedModelAdmin):
    inlines = [GFKAInline]
