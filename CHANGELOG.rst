Changelog
=========

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
