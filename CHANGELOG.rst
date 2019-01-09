Changelog
=========

**master (unreleased)**

* Feature: added beta support for django-polymorphic admin (`#86`_)

.. _#86: https://github.com/theatlantic/django-nested-admin/issues/86

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