Changelog
=========

**3.3.2 (unreleased)**

* Fixed: Resolved sporadic MediaOrderConflictWarning issues on Django 2.2
  Fixes `#141`_.
* Fixed: Improved media dependency ordering of widgets and nested_admin.js

.. _#141: https://github.com/theatlantic/django-nested-admin/issues/141

**3.3.1 (Jun 1, 2020)**

* Fixed: ``show_change_link`` support in django-grappelli. Fixes `#173`_,
  merge of `#174`_. Thanks `@Safrone`_!
* Fixed: support for Grappelli with Django 3.0 (django-grappelli 2.14). Fixes
  `#178`_.
* Fixed: issue with ``field-box`` class name rename to ``fieldBox`` in
  Django 2.1+. Closes `#157`_.

.. _#173: https://github.com/theatlantic/django-nested-admin/issues/173
.. _#174: https://github.com/theatlantic/django-nested-admin/pull/174
.. _@Safrone: https://github.com/Safrone
.. _#178: https://github.com/theatlantic/django-nested-admin/issues/178
.. _#157: https://github.com/theatlantic/django-nested-admin/pull/157

**3.3.0 (Apr 19, 2020)**

* Fixed: Possible ``ManagementFormError`` when adding inlines to a formset
  that had a ``ValidationError`` on a prior save. (`#164`_)
* Fixed: ``nested_admin.SortableHiddenMixin`` convenience import. (`#165`_)
* Official support for Django 3.0
* Removed requirement to include urlpatterns for non-grappelli installs
* Dropped support for Django versions prior to 1.11
* Dropped support for django-suit
* Switch test runner to pytest

.. _#164: https://github.com/theatlantic/django-nested-admin/issues/164
.. _#165: https://github.com/theatlantic/django-nested-admin/issues/165


**3.2.4 (Aug 27, 2019)**

* Fixed: Django 2.x ``autocomplete_fields`` deeply-nested initialization
  (`#151`_)
* Fixed: Bug that prevented a user from saving edits to nested inlines if
  they did not have add permissions to parent inlines. (`#144`_)
* Fixed: Removed runtime dependency on setuptools (`#150`_).
  Thanks `@tari`_!

.. _#144: https://github.com/theatlantic/django-nested-admin/issues/144
.. _#151: https://github.com/theatlantic/django-nested-admin/issues/151
.. _#150: https://github.com/theatlantic/django-nested-admin/pull/150
.. _@tari: https://github.com/tari

**3.2.3 (Apr 28, 2019)**

* Fixed: visual inconsistencies in grappelli tabular inline styles (`#136`_)
* Fixed: numerous issues with django-polymorphic integration (`#138`_)
* Feature: Added ``SortableHiddenMixin`` akin to grappelli’s
  `GrappelliSortableHiddenMixin`_ (`#123`_). Thanks `@brandenhall`_!

.. _#136: https://github.com/theatlantic/django-nested-admin/issues/136
.. _#138: https://github.com/theatlantic/django-nested-admin/issues/138
.. _GrappelliSortableHiddenMixin: https://django-grappelli.readthedocs.io/en/2.12.2/customization.html#grappellisortablehiddenmixin
.. _#123: https://github.com/theatlantic/django-nested-admin/pull/123
.. _@brandenhall: https://github.com/brandenhall

**3.2.2 (Apr 9, 2019)**

* Fixed: Django 2.x ``autocomplete_fields`` support (`#118`_)
* Fixed: (grappelli) proper initialization of admin widgets in deeply nested
  inlines (`#122`_)
* Fixed: (grappelli) generic ``related_lookup`` and
  ``autocomplete_lookup_fields`` (`#114`_)
* Fixed: (grappelli) Collapsible tabular inlines with
  ``NestedTabularInline.classes`` now work. (`#90`_)
* Fixed: Suppress validation errors of inlines nested beneath deleted inlines
  (`#101`_)

.. _#90: https://github.com/theatlantic/django-nested-admin/issues/90
.. _#101: https://github.com/theatlantic/django-nested-admin/issues/101
.. _#114: https://github.com/theatlantic/django-nested-admin/issues/114
.. _#118: https://github.com/theatlantic/django-nested-admin/issues/118
.. _#122: https://github.com/theatlantic/django-nested-admin/issues/122

**3.2.0 (Apr 3, 2019)**

* Feature: Added beta support for django-polymorphic admin (`#86`_)
* Feature: Made compatible with Django 2.2 and 3.0. Django 3.0 is still
  in alpha, so the django-nested-admin compatibility is likewise not yet
  stable
* Fixed: django-nested-admin now respects permissions for inline model admins
  in Django 2.1+, including the new 'view' permission.
* Fixed: (grappelli) Collapsing inline groups now works for stacked inlines
  (thanks `@maldn`_) (`#121`_)
* Fixed: FileFields in deeply nested inlines now work in Django 2.1+ (thanks
  `@btknu`_) (`#111`_, `#127`_)
* Fixed: Use correct translation for 'Delete?' text in templates (thanks
  `@kigawas`_) (`#116`_)

.. _#86: https://github.com/theatlantic/django-nested-admin/issues/86
.. _@maldn: https://github.com/maldn
.. _#121: https://github.com/theatlantic/django-nested-admin/pull/121
.. _@btknu: https://github.com/btknu
.. _#111: https://github.com/theatlantic/django-nested-admin/issues/111
.. _#127: https://github.com/theatlantic/django-nested-admin/pull/127
.. _@kigawas: https://github.com/kigawas
.. _#116: https://github.com/theatlantic/django-nested-admin/pull/116

**3.1.3 (Dec 15, 2018)**

* Fixed: Use ``jQuery.fn.length``, not ``.size``, for compatibility with
  jQuery 3, the version bundled with Django 2.1+ (`#109`_)

.. _#109:  https://github.com/theatlantic/django-nested-admin/issues/109

**3.1.2 (Sep 6, 2018)**

* Fixed: Bug with grappelli that prevented deeply nested datepicker and
  timepicker widgets from working.

**3.1.0 (Aug 13, 2018)**

* Fixed: NestedTabularInline support in Django 2.0 (`#97`_)
* Fixed: Ensure correct relative order of js media. (`#71`_)
* Switch js build process to use webpack, without gulp
* Add test coverage reporting for both python and js code

.. _#71: https://github.com/theatlantic/django-nested-admin/issues/71
.. _#97: https://github.com/theatlantic/django-nested-admin/issues/97

**3.0.21 (Nov 1, 2017)**

* Fixed: Bug when saving child models that use django-polymorphic
* Feature: Made compatible with django-autocomplete-light (`#84`_)

.. _#84: https://github.com/theatlantic/django-nested-admin/issues/84

**3.0.20 (Aug 2, 2017)**

* Fixed: Correctly show inline label number in django admin 1.9+ (`#79`_)

.. _#79: https://github.com/theatlantic/django-nested-admin/issues/79

**3.0.16 (Mar 10, 2017)**

* Support Django 2.0

**3.0.15 (Feb 27, 2017)**

* Fixed: bug caused when ``TEMPLATE['OPTIONS']['string_if_invalid']`` is set
  (`#70`_)

.. _#70: https://github.com/theatlantic/django-nested-admin/issues/70

**3.0.13 (Feb 13, 2017)**

* Fixed: grappelli autocomplete widget support (`#57`_)
* Improvement: enforce admin ``min_num`` setting in javascript

.. _#57: https://github.com/theatlantic/django-nested-admin/issues/57

**3.0.11 (Oct 18, 2016)**

* Fixed: bug when multiple inlines share the same prefix (`#60`_)

.. _#60: https://github.com/theatlantic/django-nested-admin/issues/60

**3.0.10 (Sep 13, 2016)**

* Fixed: bug if ``django.contrib.admin`` precedes ``nested_admin`` in
  ``INSTALLED_APPS`` (`#56`_)
* Fixed: don't show add inline link when ``max_num = 0`` (`#54`_)
* Improvement: Added ``'djnesting:beforeadded`` javascript event to ease
  integration with third-party admin widgets. (`#47`_)
* Feature: support Django 1.10 inline classes (for collapsing) (`#32`_, `#52`_)

.. _#32: https://github.com/theatlantic/django-nested-admin/issues/32
.. _#47: https://github.com/theatlantic/django-nested-admin/issues/47
.. _#52: https://github.com/theatlantic/django-nested-admin/issues/52
.. _#54: https://github.com/theatlantic/django-nested-admin/issues/54
.. _#56: https://github.com/theatlantic/django-nested-admin/issues/56

**3.0.8 (Jun 13, 2016)**

* Fixed: ``max_num`` off-by-one error (`#44`_)
* Fixed: saving with a blank intermediate inline now works (`#46`_)

.. _#44: https://github.com/theatlantic/django-nested-admin/issues/44
.. _#46: https://github.com/theatlantic/django-nested-admin/issues/46

**3.0.5 (Jun 7, 2016)**

* Fixed: ForeignKey widget on added inline (`#45`_)

.. _#45: https://github.com/theatlantic/django-nested-admin/issues/44

**3.0.4 (June 3, 2016)**

* Fixed: Support ``prepopulated_fields`` in grappelli (`#43`_)

.. _#43: https://github.com/theatlantic/django-nested-admin/issues/43

**3.0.3 (May 26, 2016)**

* Fixed: Bug with grappelli ForeignKey related lookup widget (thanks @sbussetti)

**3.0.2 (April 17, 2016)**

* Feature: django-suit support
* Fixed: javascript syntax error
* Fixed: bug where tabular inlines without sortables could not be updated

**3.0.0 (April 13, 2016)**

* Added documentation
* Fixed visual discrepancies between the appearance of nested and their usual
  appearance in Django and Grappelli. Added screenshot comparison tests to
  prevent future regressions.
* Support nesting of generic inlines (fixes `#30`_)
* Support for ``show_change_link`` (fixes `#22`_)
* Support for Django 1.10dev
* Dropped support for version of Django prior to 1.8, which greatly simplified
  the Python code.
* Use gulp for building static assets, rewritten with scss and ES6

.. _#22: https://github.com/theatlantic/django-nested-admin/issues/22
.. _#30: https://github.com/theatlantic/django-nested-admin/issues/30
.. _#43: https://github.com/theatlantic/django-nested-admin/issues/43
