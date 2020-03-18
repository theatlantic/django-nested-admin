from django.conf import settings
from django.contrib import admin

import nested_admin

from .models import (
    PlainStackedRoot, PlainStackedChild, PlainTabularRoot, PlainTabularChild,
    NestedStackedRoot, NestedStackedChild, NestedTabularRoot, NestedTabularChild)


class InlineMixin(object):
    extra = 0
    if 'grappelli' in settings.INSTALLED_APPS:
        sortable_field_name = "position"
    else:
        is_sortable = False
    inline_classes = ("collapse", "open", )
    readonly_fields = ("readonly", )


class PlainTabularChildInline(InlineMixin, admin.TabularInline):
    model = PlainTabularChild

@admin.register(PlainTabularRoot)
class PlainTabularRootAdmin(admin.ModelAdmin):
    inlines = [PlainTabularChildInline]

    class Media:
        css = {'all': ['one_deep/grp-normalize.css']}


class PlainStackedChildInline(InlineMixin, admin.StackedInline):
    model = PlainStackedChild

@admin.register(PlainStackedRoot)
class PlainStackedRootAdmin(admin.ModelAdmin):
    inlines = [PlainStackedChildInline]



class NestedStackedChildInline(InlineMixin, nested_admin.NestedStackedInline):
    model = NestedStackedChild

@admin.register(NestedStackedRoot)
class NestedStackedRootAdmin(nested_admin.NestedModelAdmin):
    inlines = [NestedStackedChildInline]


class NestedTabularChildInline(InlineMixin, nested_admin.NestedTabularInline):
    model = NestedTabularChild

@admin.register(NestedTabularRoot)
class NestedTabularRootAdmin(nested_admin.NestedModelAdmin):
    inlines = [NestedTabularChildInline]
