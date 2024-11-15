from django.contrib import admin
import nested_admin
from .models import MenuItem


class Level2Inline(nested_admin.NestedTabularInline):
    model = MenuItem
    extra = 0
    min_num = 0
    title = "Level 2"


class Level1Inline(nested_admin.NestedTabularInline):
    model = MenuItem
    inlines = [Level2Inline]
    extra = 0
    min_num = 1
    max_num = 2
    title = "Level 1"


@admin.register(MenuItem)
class ParentAdmin(nested_admin.NestedModelAdmin):
    inlines = [Level1Inline]
    title = "Menu"
    fields = ["label"]
