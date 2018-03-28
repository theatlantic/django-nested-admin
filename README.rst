django-nested-admin
###################

|build_badge| |docs_badge|

**django-nested-admin** is a project that makes it possible to nest
admin inlines (that is, to define inlines on InlineModelAdmin classes).
This is a fork is compatible with Django 2.0.

Installation
============

The recommended way to install django-nested-admin is from
`PyPI <https://pypi.python.org/pypi/django-nested-admin>`_::

        pip install django-nested-admin

Alternatively, one can install a development copy of django-nested-admin
from source::

        pip install -e git+git://github.com/theatlantic/django-nested-admin.git#egg=django-nested-admin

If the source is already checked out, use setuptools to install::

        python setup.py develop

Configuration
=============

To use django-nested-admin in your project, ``"nested_admin"`` must be added
to the ``INSTALLED_APPS`` in your settings and you must include
``nested_admin.urls`` in your django urlpatterns. `django-grappelli
<https://github.com/sehmaschine/django-grappelli>`_ is an optional dependency
of django-nested-admin. If using Grappelli, make sure the `appropriate version
<http://django-grappelli.readthedocs.org/en/latest/#versions>`_ of Grappelli
is installed for your version of Django.

.. code-block:: python

    # settings.py

    INSTALLED_APPS = (
        # ...
        'nested_admin',
    )

    # urls.py

    if 'nested_admin' in settings.INSTALLED_APPS:
        import nested_admin.views
        urlpatterns += path('server-data\.js', nested_admin.views.server_data_js,
                            name="nesting_server_data"),

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

Testing
=======

django-nested-admin has fairly extensive test coverage.
The best way to run the tests is with `tox <https://testrun.org/tox/latest/>`_,
which runs the tests against all supported Django installs. To run the tests
within a virtualenv run ``python runtests.py`` from the repository directory.
The tests require a selenium webdriver to be installed. By default the tests
run with phantomjs, but it is also possible to run the tests with the chrome
webdriver by passing ``--selenium=chrome`` to runtests.py or, if running with tox,
running ``tox -- --selenium=chrome``. See ``runtests.py --help`` for a complete
list of the options available.

Contributing
============

This project uses `gulp <http://gulpjs.com/>`_, `babel <https://babeljs.io/>`_,
`browserify <http://browserify.org/>`_, and `scss <http://sass-lang.com/>`_ for
building its javascript and css. To install the dependencies for the build
process, run ``npm install`` from the root of the repository. You can then run
``gulp`` to rebuild the static files, or ``gulp watch`` when actively editing
these files to detect changes and rebuild automatically.

License
=======

The django code is licensed under the `Simplified BSD
License <http://opensource.org/licenses/BSD-2-Clause>`_. View the
``LICENSE`` file under the root directory for complete license and
copyright information.

.. |build_badge| image:: https://travis-ci.org/theatlantic/django-nested-admin.svg?branch=master
    :target: https://travis-ci.org/theatlantic/django-nested-admin
.. |docs_badge| image:: https://readthedocs.org/projects/django-nested-admin/badge/?version=latest
    :target: http://django-nested-admin.readthedocs.org/en/latest/
