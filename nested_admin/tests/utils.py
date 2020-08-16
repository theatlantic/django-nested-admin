from collections import namedtuple
try:
    from collections.abc import Sequence
except ImportError:
    from collections import Sequence

import six
from nested_admin.tests.compat import python_2_unicode_compatible


def xpath_cls(classname):
    return 'contains(concat(" ", @class, " "), " %s ")' % classname


def xpath_item(model_name=None):
    xpath_item_predicate = 'not(contains(@class, "-drag")) and not(contains(@class, "thead"))'
    expr = "%s and %s" % (xpath_cls('djn-item'), xpath_item_predicate)
    if model_name:
        expr += (' and (@data-inline-model="%s" or %s)'
            % (model_name, xpath_cls("djn-dynamic-form-%s" % model_name)))
    return expr


def is_sequence(o):
    return isinstance(o, Sequence)


def is_integer(o):
    return isinstance(o, six.integer_types)


def is_str(o):
    return isinstance(o, six.string_types)


Position = namedtuple('Position', ['x', 'y'])


class Size(namedtuple('Size', ['width', 'height'])):
    w = property(lambda self: self.width)
    h = property(lambda self: self.height)


class Rect(namedtuple('Rect', [
        'left', 'top', 'right', 'bottom', 'width', 'height', 'visible'])):
    x = property(lambda self: self.left)
    y = property(lambda self: self.top)
    r = property(lambda self: self.right)
    b = property(lambda self: self.bottom)
    w = property(lambda self: self.width)
    h = property(lambda self: self.height)


@python_2_unicode_compatible
class ElementRect(object):

    def __init__(self, element, aliases=None):
        default_aliases = {
            't': 'top',
            'l': 'left',
            'x': 'left',
            'y': 'top',
            'w': 'width',
            'h': 'height',
            'r': 'right',
            'b': 'bottom',
        }
        aliases = dict(default_aliases, **(aliases or {}))
        self.alias_map = {}
        for k, v in six.iteritems(aliases):
            self.alias_map.setdefault(v, [])
            self.alias_map[v].append(k)

        self._element = element
        self.selenium = element.parent
        self.refresh()

    def refresh(self):
        rect_dict = (self.selenium.execute_script("""
            return (function(e, w, de) {
                var r = e.getBoundingClientRect(),
                    wh = (w.innerHeight || de.clientHeight),
                    ww = (w.innerWidth || de.clientWidth),
                    visible = (r.top <= wh) && ((r.top + r.height) >= 0)
                        && (r.left <= ww) && ((r.left + r.width) >= 0);
                return {
                    visible: visible,
                    top: r.top,
                    left: r.left,
                    width: r.width,
                    height: r.height,
                    right: r.right,
                    bottom: r.bottom
                };
            })(arguments[0], window, document.documentElement)
            """, self._element))
        self.rect = Rect(**rect_dict)
        for k, v in six.iteritems(rect_dict):
            setattr(self, k, v)
            for alias in (self.alias_map.get(k) or []):
                setattr(self, alias, v)

    def __str__(self):
        return "%s" % self.rect

    def __repr__(self):
        return repr(self.rect)


def ensure_element_is_in_view(element):
    if not ElementRect(element).visible:
        element.parent.execute_script(
            'arguments[0].scrollIntoView()',
            element)
