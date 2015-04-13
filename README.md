django-nested-admin
===================

[![Build Status](https://travis-ci.org/theatlantic/django-nested-admin.svg?branch=master)](https://travis-ci.org/theatlantic/django-nested-admin)

**django-nested-admin** is a project that makes it possible to nest admin
inlines (that is, to define inlines on InlineModelAdmin classes). It is
compatible with Django 1.4-1.7 and Python versions 2.7 and 3.4. Django 1.8
support is in beta.

* [Installation](#installation)
* [Configuration](#configuration)
* [Example Usage](#example-usage)
* [License](#license)

Installation
------------

The recommended way to install django-nested-admin is from [PyPI](https://pypi.python.org/pypi/django-nested-admin):

        pip install django-nested-admin

Alternatively, one can install a development copy of django-nested-admin from source:

        pip install -e git+git://github.com/theatlantic/django-nested-admin.git#egg=django-nested-admin

If the source is already checked out, use setuptools to install:

        python setup.py develop

Configuration
-------------

To use django-nested-admin in your project, `"nested_admin"` must be added to
the `INSTALLED_APPS` in your settings and you must include `nested_admin.urls`
in your django urlpatterns. [django-grappelli](https://github.com/sehmaschine/django-grappelli)
is a requirement of django-nested-admin; make sure the
[appropriate version](http://django-grappelli.readthedocs.org/en/latest/#versions)
of Grappelli is installed for your version of Django.

```python
# settings.py

INSTALLED_APPS = (
    # ...
    'nested_admin',
)

# urls.py

urlpatterns = patterns('',
    # ...
    url(r'^nested_admin/', include('nested_admin.urls')),
)
```


Example Usage
-------------

In order to use django-nested-admin, use the following classes in place of their
django admin equivalents:

| **django.contrib.admin** | **nested_admin**       |
| ------------------------ | ---------------------- |
| ModelAdmin               | NestedAdmin            |
| InlineModelAdmin         | NestedInlineModelAdmin |
| StackedInline            | NestedStackedInline    |

```python
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

class TableOfContentsAdmin(nested_admin.NestedAdmin):
    inlines = [TocSectionInline]

admin.site.register(TableOfContents, TableOfContentsAdmin)
```

License
-------
The django code is licensed under the
[Simplified BSD License](http://opensource.org/licenses/BSD-2-Clause). View
the `LICENSE` file under the root directory for complete license and copyright
information.
