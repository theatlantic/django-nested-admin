.. _quickstart:

=================
Quick start guide
=================

`Django <http://www.djangoproject.com>`_ (version 2.2+) needs to be installed to use django-nested-admin.

Installation
============

.. code-block:: bash

    pip install django-nested-admin

Go to `GitHub <https://github.com/theatlantic/django-nested-admin>`_ if you need to download or install from source.

Setup
=====

Open ``settings.py`` and add ``nested_admin`` to your ``INSTALLED_APPS``

.. code-block:: python

    INSTALLED_APPS = (
        # ...
        'nested_admin',
    )

If you're using django-grappelli, you’ll need to add URL-patterns:

.. code-block:: python

    urlpatterns = [
        # ...
        path('_nested_admin/', include('nested_admin.urls)),
    ]

Example Usage
=============

In order to use ``django-nested-admin``, use the following classes in
place of their django admin equivalents:

========================  ======================
**django.contrib.admin**  **nested_admin**      
------------------------  ----------------------
ModelAdmin                NestedModelAdmin           
InlineModelAdmin          NestedInlineModelAdmin
StackedInline             NestedStackedInline   
TabularInline             NestedTabularInline
========================  ======================

There is also ``nested_admin.NestedGenericStackedInline`` and
``nested_admin.NestedGenericTabularInline`` which are the nesting-capable
versions of ``GenericStackedInline`` and ``GenericTabularInline`` in
``django.contrib.contenttypes.admin``.

.. code-block:: python

    # An example admin.py for a Table of Contents app

    from django.contrib import admin
    import nested_admin

    from .models import TableOfContents, TocArticle, TocSection

    class TocArticleInline(nested_admin.NestedStackedInline):
        model = TocArticle
        sortable_field_name = "position"

    class TocSectionInline(nested_admin.NestedStackedInline):
        model = TocSection
        sortable_field_name = "position"
        inlines = [TocArticleInline]

    class TableOfContentsAdmin(nested_admin.NestedModelAdmin):
        inlines = [TocSectionInline]

    admin.site.register(TableOfContents, TableOfContentsAdmin)
