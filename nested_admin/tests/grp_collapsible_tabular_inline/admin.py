from django.contrib import admin
import nested_admin
from .models import User, Project, Document


class DocumentInline(nested_admin.NestedTabularInline):
    model = Document
    extra = 0
    classes = ("grp-collapse grp-closed",)


class ProjectInline(nested_admin.NestedStackedInline):
    model = Project
    inlines = [DocumentInline]


@admin.register(User)
class UserAdmin(nested_admin.NestedModelAdmin):
    inlines = [ProjectInline]


class DocumentNonNestedInline(admin.TabularInline):
    model = Document
    extra = 0
    classes = ("grp-collapse grp-closed",)
    sortable_field_name = ""


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    inlines = [DocumentNonNestedInline]
