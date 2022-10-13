"""
A backport of the fix in Django 2.0 that retains the order of form media.

See https://github.com/django/django/commit/c19b56f633e172b3c02094cbe12d28865ee57772
and https://code.djangoproject.com/ticket/28377
"""
from collections import defaultdict, OrderedDict
import warnings

import django
import django.forms
from django.utils.datastructures import OrderedSet as _OrderedSet

try:
    from django.forms.widgets import MediaOrderConflictWarning
except ImportError:

    class MediaOrderConflictWarning(RuntimeWarning):
        pass

    MergeSafeMedia = None
else:
    MergeSafeMedia = django.forms.Media

try:
    from django.utils.topological_sort import (
        CyclicDependencyError,
        stable_topological_sort,
    )
except ImportError:

    class CyclicDependencyError(ValueError):
        pass

    stable_topological_sort = None


class OrderedSet(_OrderedSet):
    def __sub__(self, other):
        return self.__class__([i for i in self if i not in other])

    def __str__(self):
        return "OrderedSet(%r)" % list(self)

    def __repr__(self):
        return "OrderedSet(%r)" % list(self)


if MergeSafeMedia is None or stable_topological_sort is None:

    def linearize_as_needed(l, dependency_graph):
        # Algorithm: DFS Topological sort
        # https://en.wikipedia.org/wiki/Topological_sorting#Depth-first_search
        l = list(dependency_graph)

        temporary = set()
        permanent = set()

        result = []

        def visit(vertices):
            for vertex in vertices:
                if vertex in permanent:
                    pass
                elif vertex in temporary:
                    raise CyclicDependencyError("Cyclic dependency in graph")
                else:
                    temporary.add(vertex)

                    visit(dependency_graph[vertex])

                    result.append(vertex)

                    temporary.remove(vertex)
                    permanent.add(vertex)

        visit(l)
        return result

    class MergeSafeMedia(django.forms.Media):
        def __init__(self, media=None, css=None, js=None):
            if media is not None:
                css = getattr(media, "_css", {})
                js = getattr(media, "_js", [])
            else:
                if css is None:
                    css = {}
                if js is None:
                    js = []
            self._css_lists = [css]
            self._js_lists = [js]

        @property
        def _css(self):
            css = defaultdict(list)
            for css_list in self._css_lists:
                for medium, sublist in css_list.items():
                    css[medium].append(sublist)
            return {medium: self.merge(*lists) for medium, lists in css.items()}

        @_css.setter
        def _css(self, data):
            css_media = ensure_merge_safe_media(django.forms.Media(css=data))
            self._css_lists = css_media._css_lists

        @property
        def _js(self):
            return self.merge(*self._js_lists)

        @_js.setter
        def _js(self, data):
            js_media = ensure_merge_safe_media(django.forms.Media(js=data))
            self._js_lists = js_media._js_lists

        @staticmethod
        def merge(*lists):
            """
            Merge lists while trying to keep the relative order of the elements.
            Warn if the lists have the same elements in a different relative order.

            For static assets it can be important to have them included in the DOM
            in a certain order. In JavaScript you may not be able to reference a
            global or in CSS you might want to override a style.
            """
            dependency_graph = OrderedDict()
            all_items = OrderedSet()

            for list_ in filter(None, lists):
                head = list_[0]
                # The first items depend on nothing but have to be part of the
                # dependency graph to be included in the result.
                dependency_graph.setdefault(head, OrderedSet())
                for item in list_:
                    all_items.add(item)
                    # No self dependencies
                    if head != item:
                        dependency_graph.setdefault(item, OrderedSet())
                        dependency_graph[item].add(head)
                    head = item
            try:
                return linearize_as_needed(all_items, dependency_graph)
            except CyclicDependencyError:
                warnings.warn(
                    "Detected duplicate Media files in an opposite order: {}".format(
                        ", ".join(repr(l) for l in lists)
                    ),
                    MediaOrderConflictWarning,
                )
                return list(all_items)

        def __add__(self, other):
            combined = MergeSafeMedia()
            other_css_lists = getattr(other, "_css_lists", None)
            if other_css_lists is None:
                other_css_lists = []
                for medium, css_list in other._css.items():
                    for css_file in css_list:
                        other_css_lists.append({medium: [css_file]})
            other_js_lists = getattr(other, "_js_lists", None) or [
                [js] for js in other._js
            ]
            combined._css_lists = self._css_lists + other_css_lists
            combined._js_lists = self._js_lists + other_js_lists
            return combined

        def add_js(self, data):
            if data:
                new_media = self + MergeSafeMedia(js=data)
                self._js_lists = new_media._js_lists

        def add_css(self, data):
            if data:
                new_media = self + MergeSafeMedia(css=data)
                self._css_lists = new_media._css_lists


def ensure_merge_safe_media(media):
    if isinstance(media, MergeSafeMedia):
        return media
    safe_media = MergeSafeMedia()
    for js in media._js:
        safe_media += MergeSafeMedia(js=[js])
    for medium, css_files in media._css.items():
        for css_file in css_files:
            safe_media += MergeSafeMedia(css={medium: [css_file]})
    return safe_media


try:
    import polymorphic.admin.inlines
    import polymorphic.formsets.utils
    import polymorphic.formsets.models
except ImportError:
    pass
else:

    def add_media(dest, media):
        return dest + media

    polymorphic.formsets.utils.add_media = add_media
    polymorphic.formsets.utils.add_media = add_media
    polymorphic.formsets.models.add_media = add_media
