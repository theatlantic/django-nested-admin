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

Above, you will find a feature comparison of all other implementations of nested inlines in the
django admin of which I am aware. `django-nested-inline`_, `django-nested-inlines`_, and
`dj-nested-inlines`_ are all variations upon
`a patch <https://code.djangoproject.com/attachment/ticket/9025/nested_inlines_finished.diff>`_
posted to Django `ticket #9025 <https://code.djangoproject.com/ticket/9025>`_.
`django-nested-inlines`_ has had no commits since 2013 and appears to be abandoned.
`dj-nested-inlines`_ picked up the baton, and made numerous bug fixes, but then stopped receiving
updates in 2016. `django-nested-inline`_ is the best variation upon the original patch; it has
recently gained a new maintainer, and now even supports the latest version of Django.
`django-super-inlines`_ is a
fresh take on the problem, and had initially appeared promising, but it has since lapsed into an
unmaintained state.

The largest functional difference between `django-nested-admin`_ and these other projects is its
support for drag-and-drop sorting functionality within and between inlines, similar to
Grappelli’s sortable inline feature (though it does not require Grappelli). It also has fairly
extensive test coverage. And lastly `django-nested-admin`_ is and will remain an integral part
of the CMS that powers `TheAtlantic.com`_ where it is used by editors to curate the homepages,
email newsletters, and landing pages for special projects and site sections (the way we used
`django-nested-admin`_ to power the curation of `TheAtlantic.com`_’s homepage was the subject of
`a talk we gave at the 2015 Djangocon <https://www.youtube.com/watch?v=RWLQTCUpyWw>`_).


.. _django-nested-admin: https://github.com/theatlantic/django-nested-admin
.. _django-nested-inline: https://github.com/s-block/django-nested-inline
.. _django-nested-inlines: https://github.com/Soaa-/django-nested-inlines
.. _dj-nested-inlines: https://github.com/silverfix/dj-nested-inlines
.. _django-super-inlines: https://github.com/BertrandBordage/django-super-inlines
.. _TheAtlantic.com: http://www.theatlantic.com/
