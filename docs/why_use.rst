.. _why_use:

============================
Why use django-nested-admin?
============================

.. rst-class:: feature-grid

+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
|                         | `django-nested-admin`_ | `django-super-inlines`_ | `django-nested-inlines`_ | `dj-nested-inlines`_ | `django-nested-inline`_ |
+=========================+========================+=========================+==========================+======================+=========================+
| Nested inlines          | ✓                      | ✓                       | ✓                        | ✓                    | ✓                       |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
| Grappelli support       | ✓                      | ✓                       |                          |                      |                         |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
| Generic inlines support | ✓                      | ✓                       |                          |                      |                         |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
| Drag-and-drop sorting   | ✓                      |                         |                          |                      |                         |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
| Selenium Tests          | ✓                      |                         |                          |                      |                         |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+
| Django Version support  | 3.0                    | 1.11                    | 1.4?                     | 1.9                  | 3.0                     |
+-------------------------+------------------------+-------------------------+--------------------------+----------------------+-------------------------+

Above, you will find a feature comparison of all other implementations of nested inlines in the django admin of which I am aware. `django-nested-inline`_, `django-nested-inlines`_, and `dj-nested-inlines`_ are all variations upon `a patch <https://code.djangoproject.com/attachment/ticket/9025/nested_inlines_finished.diff>`_ posted to Django `ticket #9025 <https://code.djangoproject.com/ticket/9025>`_. `django-nested-inlines`_ has had no commits since 2013 and appears to be abandoned, with `dj-nested-inlines`_ being a better maintained fork. It, along with `django-nested-inline`_, are maintained insofar as the maintainers merge in pull requests and update PyPI, but they do not appear to be working on improving these implementations themselves. `django-super-inlines`_ is a fresher take on the problem, and looks to be more promising.

The largest functional difference between `django-nested-admin`_ and these other projects is its support for drag-and-drop sorting functionality within and between inlines, similar to Grappelli’s sortable inline feature (though it does not require Grappelli). It also has fairly extensive test coverage. And lastly `django-nested-admin`_ is and will remain an integral part of the CMS that powers `TheAtlantic.com`_ (and `CityLab.com`_) where it is used by editors to curate the homepages, email newsletters, and landing pages for special projects and site sections (the way we used `django-nested-admin`_ to power the curation of `TheAtlantic.com`_’s homepage was the subject of `a talk we gave at the 2015 Djangocon <https://www.youtube.com/watch?v=RWLQTCUpyWw>`_).


.. _django-nested-admin: https://github.com/theatlantic/django-nested-admin
.. _django-nested-inline: https://github.com/s-block/django-nested-inline
.. _django-nested-inlines: https://github.com/Soaa-/django-nested-inlines
.. _dj-nested-inlines: https://github.com/silverfix/dj-nested-inlines
.. _django-super-inlines: https://github.com/BertrandBordage/django-super-inlines
.. _TheAtlantic.com: http://www.theatlantic.com/
.. _CityLab.com: http://www.citylab.com/
