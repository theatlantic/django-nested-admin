.. _contributing:

Contributing
============

Editing javascript and css
--------------------------

This project uses `webpack <https://webpack.js.org/>`_ for building its
javascript and css. To install the dependencies for the build process, run
``npm install`` from the root of the repository. You can then run
``npm run build`` to rebuild the static files.

Running tests
-------------

django-nested-admin has fairly extensive test coverage.
The best way to run the tests is with `tox <https://testrun.org/tox/latest/>`_,
which runs the tests against all supported Django installs. To run the tests
within a virtualenv run ``pytest`` from the repository directory. The tests
require a selenium webdriver to be installed. By default the tests run with
phantomjs, but it is also possible to run the tests with the chrome webdriver
by passing ``--selenosis-driver=chrome`` to ``pytest`` or, if running with
tox, running ``tox -- --selenosis-driver=chrome``. See ``pytest --help`` for
a complete list of the options available.

Pull requests are automatically run through Travis CI upon submission to
verify that the changes do not introduce regressions.

Writing tests
-------------

.. currentmodule:: nested_admin.tests

The tests for this project are patterned off of the system that the Django
project itself uses for tests (including the changes that are being made in
1.10), so `Django’s guide on writing unit tests <https://docs.djangoproject.com/en/dev/internals/contributing/writing-code/unit-tests/>`_
is a good place to start.

Selenium tests are difficult to write, particularly for complicated user
interactions such as drag-and-drop. To assist in writing tests for the
functionality of nested inlines, a base TestCase with methods for
executing the possible user interactions with inlines (e.g.
adding inlines, removing inlines, setting field values, drag-and-drop re-ordering)
is provided with :class:`.base.BaseNestedAdminTestCase`.

Depending on what you are trying to test, it might make sense to add the test
to one of the existing “test apps” in django-nested-admin. These include:

:mod:`.admin_widgets`
	Integration tests for built-in Django widgets that use javascript, e.g.
	``prepopulated_fields`` or ManyToManyFields with ``filter_horizontal``.

:mod:`.gfk`
	Tests for :class:`nested_admin.NestedGenericStackedInline` and
	:class:`nested_admin.NestedGenericTabularInline`

:mod:`.one_deep`
	Tests that compare screenshots of standard, non-nested inlines using the
	standard inline classes and their nested equivalents (but without any
	actual nesting), to ensure that the custom templates, css, and javascript
	used by django-nested-admin looks the same as their non-nested Django
	or Grappelli equivalents.

:mod:`.two_deep`
	Tests for :class:`nested_admin.NestedStackedInline` and
	:class:`nested_admin.NestedTabularInline` where there is only one
	“nested” inline (using two levels of inlines, hence “two deep”).

:mod:`.three_deep`
	Tests the same things as :mod:`.two_deep`, except with inlines
	nested “three deep.”

If your test requires the creation of new test models, then it may make sense
to write a new test app. Create a new subdirectory under ``nested_admin/tests``
with an ``__init__.py``, ``admin.py``, ``models.py``, and ``tests.py``. The
test runner will automatically add this to the list of ``INSTALLED_APPS``
and execute the tests defined in ``tests.py``. The tests in :mod:`.two_deep`
are the most complete, and can serve as a reference for how to use the
helper methods for simulating user interactions.
