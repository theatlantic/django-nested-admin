.. _customization:

=============
Customization
=============

Sortables
=========

The steps for enabling drag-and-drop sorting functionality is identical to Grappelli’s (even with the vanilla Django admin), so the `Grappelli documentation <http://django-grappelli.readthedocs.org/en/latest/customization.html#inline-sortables>`_ for this feature is the best reference. This is equally true of sortables in Django Suit—do not follow Django Suit’s instructions for sortables, as they will not work. The `other features of Grappelli <http://django-grappelli.readthedocs.org/en/latest/customization.html>`_ have not been ported to work with vanilla Django, but in principle they should all still work with nested inlines using django-nested-admin if Grappelli is installed. If you run into any difficulty with this, please `create an issue <https://github.com/theatlantic/django-nested-admin/issues>`_ on this project’s Github.

Events
======

Adding or removing an inline fires the ``formset:added`` and ``formset:removed`` events, respectively, that `were added to Django in 1.9 <https://docs.djangoproject.com/en/1.9/ref/contrib/admin/javascript/>`_ (`#15760 <https://code.djangoproject.com/ticket/15760>`_). This is particularly useful for when you need to execute javascript upon an inline being added (for instance, to initialize a custom widget). The API is the same as Django 1.9, so reference the `official Django docs <https://docs.djangoproject.com/en/1.9/ref/contrib/admin/javascript/>`_ for information about how to use these events. In addition, django-nested-admin also emits events for when the delete checkbox (or button, in Grappelli) is toggled with the ``formset:deleted`` and ``formset:undeleted`` events. Less likely to be used, but still available, are the following events:

``djnesting:mutate``
	Fired whenever the state of a formset changes

``djnesting:initialized``
	Fired after an inline has been initialized, either on load or after being added

``djnesting::attrchanged``
	Fired whenever a drag-and-drop operation or removal necessitates changing the ``name``, ``id``, and ``for`` attributes of the elements within a form or formset. Ideally custom Django widgets with javascript hooks should be written so that they do not need to be reinitialized if a form field’s ``id`` or ``name`` changes, but in cases where they do, use this event to refresh or reinitialize the bindings.
