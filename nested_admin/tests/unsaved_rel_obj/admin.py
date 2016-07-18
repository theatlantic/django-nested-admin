from django.contrib import admin
import nested_admin
from .models import Main, Level1, Level2


class Level2InlineAdmin (nested_admin.NestedTabularInline):

    model = Level2
    extra = 0


class Level1InlineAdmin (nested_admin.NestedStackedInline):

    model = Level1
    extra = 0
    inlines = [Level2InlineAdmin]


@admin.register(Main)
class MainAdmin (nested_admin.NestedModelAdmin):

    inlines = [Level1InlineAdmin]
