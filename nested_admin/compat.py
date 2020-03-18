"""
A backport of the fix in Django 2.0 that retains the order of form media.

See https://github.com/django/django/commit/c19b56f633e172b3c02094cbe12d28865ee57772
and https://code.djangoproject.com/ticket/28377
"""
import warnings

import django
import django.forms

try:
    from django.forms.widgets import MediaOrderConflictWarning
except ImportError:
    class MediaOrderConflictWarning(RuntimeWarning):
        pass

    MergeSafeMedia = None
else:
    MergeSafeMedia = django.forms.Media


if MergeSafeMedia is None:
    class MergeSafeMedia(django.forms.Media):
        def __init__(self, media=None, css=None, js=None):
            if media is not None:
                css = getattr(media, '_css', {})
                js = getattr(media, '_js', [])
            else:
                if css is None:
                    css = {}
                if js is None:
                    js = []
            self._css = css
            self._js = js

        @staticmethod
        def merge(list_1, list_2):
            """
            Merge two lists while trying to keep the relative order of the elements.
            Warn if the lists have the same two elements in a different relative
            order.

            For static assets it can be important to have them included in the DOM
            in a certain order. In JavaScript you may not be able to reference a
            global or in CSS you might want to override a style.
            """
            # Start with a copy of list_1.
            combined_list = list(list_1)
            last_insert_index = len(list_1)
            # Walk list_2 in reverse, inserting each element into combined_list if
            # it doesn't already exist.
            for path in reversed(list_2):
                try:
                    # Does path already exist in the list?
                    index = combined_list.index(path)
                except ValueError:
                    # Add path to combined_list since it doesn't exist.
                    combined_list.insert(last_insert_index, path)
                else:
                    if index > last_insert_index:
                        warnings.warn(
                            'Detected duplicate Media files in an opposite order:\n'
                            '%s\n%s' % (combined_list[last_insert_index], combined_list[index]),
                            MediaOrderConflictWarning,
                        )
                    # path already exists in the list. Update last_insert_index so
                    # that the following elements are inserted in front of this one.
                    last_insert_index = index
            return combined_list

        def __add__(self, other):
            combined = MergeSafeMedia()
            combined._js = self.merge(self._js, other._js)
            combined._css = {
                medium: self.merge(self._css.get(medium, []), other._css.get(medium, []))
                for medium in set(self._css.keys()) | set(other._css.keys())
            }
            return combined

        def add_js(self, data):
            if data:
                new_media = self + MergeSafeMedia(js=data)
                self._js = new_media._js

        def add_css(self, data):
            if data:
                new_media = self + MergeSafeMedia(css=data)
                self._css = new_media._css
