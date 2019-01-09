import six
from unittest import SkipTest

import django
from django.conf import settings
from django.apps import apps
from polymorphic.utils import get_base_polymorphic_model

from nested_admin.tests.base import BaseNestedAdminTestCase
from nested_admin.tests.utils import xpath_item, xpath_cls, is_sequence, is_integer, is_str


class BaseNestedPolymorphicTestCase(BaseNestedAdminTestCase):

    @classmethod
    def setUpClass(cls):
        if django.VERSION > (2, 2):
            raise SkipTest(
                'django-polymorphic not yet compatible with Django 2.2 and 3.0')
        if 'suit' in settings.INSTALLED_APPS:
            raise SkipTest('Skipping for django-suit')
        super(BaseNestedPolymorphicTestCase, cls).setUpClass()

    def get_inline_model_names(self):
        return self.selenium.execute_script("""
          return (function getGroup($group) {
            $group = (typeof $group === 'undefined') ? $('.djn-group-root') : $($group);
            var $djnItems = $group.find('> .djn-fieldset > .djn-items, > .djn-items');
            var $forms = $djnItems.find('> .djn-inline-form:not(.djn-empty-form)');
            return {
              model: $group.attr('data-inline-model'),
              items: $forms.toArray().map(el => ({
                model: el.getAttribute('data-inline-model'),
                groups: $(el).nearest('.djn-group:not([id*="-empty-"])').toArray().map(
                  g => getGroup(g)),
              }))
            }
          })()""")

    def _normalize_indexes(self, indexes, is_group=False, named_models=True):
        norm_indexes = []

        indexes = list(indexes or [])

        group_index = None
        if is_group:
            if len(indexes) and is_sequence(indexes[-1]) and len(indexes[-1]) == 1:
                group_index = indexes.pop()[0]
            elif len(indexes) and is_str(indexes[-1]):
                group_index = indexes.pop()
            else:
                indexes.append(None)
        elif not indexes:
            return indexes

        inline_model_names = [self.get_inline_model_names()]

        for level, level_indexes in enumerate(indexes):
            if len(inline_model_names) == 0:
                raise ValueError("Indexes depth greater than inline depth")
            if level_indexes is None:
                if not is_group:
                    raise ValueError("Unexpected None found in indexes")
                if len(inline_model_names) > 1:
                    raise ValueError(
                        "Terminal index to inline class omitted in group-level "
                        "operation, but parent has more than one inline")
                if named_models:
                    norm_indexes.append(inline_model_names[0]['model'])
                else:
                    norm_indexes.append(0)
                break
            if not is_sequence(level_indexes) and not is_integer(level_indexes):
                raise ValueError("Unexpected type %s in list of indexes" % (
                    type(level_indexes).__name__))
            if is_integer(level_indexes):
                if len(inline_model_names) > 1:
                    raise ValueError((
                        "indexes[%d] using shorthand integer value, but more "
                        "than one inline to choose from") % (level))
                level_indexes = [0, level_indexes]
            if is_sequence(level_indexes):
                if len(level_indexes) != 2:
                    raise ValueError("Expected indexes[%d] to have len 2, got %d" % (
                        level, len(level_indexes)))

                inline_index, inline_item = level_indexes
                if is_str(inline_index):
                    lookup = inline_index
                    inline_index = None

                    for i, group in enumerate(inline_model_names):
                        if group['model'] == lookup:
                            inline_index = i
                            break
                        if any(i for i in group['items'] if i['model'] == lookup):
                            inline_index = i
                            break

                inline_data = inline_model_names[inline_index]['items'][inline_item]
                inline_model_name = inline_data['model']
                inline_model_names = inline_data['groups']
                if named_models:
                    norm_indexes.append([inline_model_name, inline_item])
                else:
                    norm_indexes.append([inline_index, inline_item])

        if group_index is not None:
            if is_str(group_index):
                lookup = group_index
                group_index = None
                for i, group in enumerate(inline_model_names):
                    if group['model'] == lookup:
                        group_index = i
                        break
                    if any(i for i in group['items'] if i['model'] == lookup):
                        group_index = i
                        break

            if named_models:
                norm_indexes.append(inline_model_names[group_index]['model'])
            else:
                norm_indexes.append(group_index)

        return norm_indexes

    def get_item(self, indexes):
        indexes = self._normalize_indexes(indexes)
        group_indexes = indexes[:-1]
        model_id, item_index = indexes[-1]
        app_label, model_name = model_id.split('-')
        model_cls = apps.get_model(app_label, model_name)
        base_model_cls = get_base_polymorphic_model(model_cls)
        base_model_id = "%s-%s" % (
            base_model_cls._meta.app_label, base_model_cls._meta.model_name)
        group_indexes.append(base_model_id)
        group = self.get_group(indexes=group_indexes)
        group_id = group.get_attribute('id')
        djn_items = self.selenium.find_element_by_css_selector(
            "#%(id)s > .djn-fieldset > .djn-items, "
            "#%(id)s > .djn-items" % {'id': group_id})
        model_name, item_index = indexes[-1]
        return djn_items.find_element_by_xpath(
            "./*[%s][%d]" % (xpath_item(), item_index + 1))

    def add_inline(self, indexes=None, model=None, **kwargs):
        model_name = "%s-%s" % (model._meta.app_label, model._meta.model_name)
        base_model = get_base_polymorphic_model(model)
        base_model_identifier = "%s-%s" % (
            base_model._meta.app_label, base_model._meta.model_name)

        if indexes:
            item = self.get_item(indexes)
            group_el = self.selenium.execute_script(
                'return $(arguments[0]).closest(".djn-group")[0]', item)
        else:
            group_el = self.get_group([base_model_identifier])

        group_id = group_el.get_attribute('id')

        error_desc = "%s in inline %s" % (model, indexes)

        add_selector = "#%s .djn-add-item a.djn-add-handler.djn-model-%s" % (
            group_id, base_model_identifier)
        add_els = self.selenium.find_elements_by_css_selector(add_selector)
        self.assertNotEqual(len(add_els), 0,
            "No inline add handlers found for %s" % (error_desc))
        self.click(add_els[0])

        add_link_selector = "return $('.polymorphic-type-menu:visible [data-type=\"%s\"]')[0]" % (
            model_name)
        poly_add_link = self.selenium.execute_script(add_link_selector)
        poly_add_link.click()

        indexes = self._normalize_indexes(indexes)

        group_el = self.selenium.execute_script(
            'return $(arguments[0]).closest(".djn-group")[0]', add_els[0])
        group_id = group_el.get_attribute('id')

        items_el = self.selenium.find_element_by_css_selector(
            '#%(id)s > .djn-fieldset > .djn-items, '
            '#%(id)s > .djn-items' % {'id': group_id})

        num_inlines = len(items_el.find_elements_by_xpath(
            './*[%s and not(%s)]' % (xpath_item(), xpath_cls('djn-empty-form'))))

        new_index = num_inlines - 1

        indexes.append([model_name, new_index])
        for field_name, val in six.iteritems(kwargs):
            self.set_field(field_name, val, indexes=indexes)
        return indexes

    def get_num_inlines(self, indexes=None):
        group = self.get_group(indexes=indexes)
        group_id = group.get_attribute('id')
        djn_items = self.selenium.find_element_by_css_selector(
            "#%(id)s > .djn-fieldset > .djn-items, "
            "#%(id)s > .djn-items" % {'id': group_id})
        selector = "> .djn-item:not(.djn-no-drag,.djn-item-dragging,.djn-thead,.djn-empty-form)"
        return self.selenium.execute_script(
            "return $(arguments[0]).find(arguments[1]).length",
            djn_items, selector)

    def get_group(self, indexes=None):
        indexes = self._normalize_indexes(indexes, is_group=True)
        model_name = indexes.pop()
        expr_parts = []
        for parent_model, parent_item_index in indexes:
            expr_parts += ["/*[%s][%d]" % (xpath_item(parent_model), parent_item_index + 1)]
        expr_parts += ["/*[@data-inline-model='%s' and %s]"
            % (model_name, xpath_cls('djn-group'))]
        expr = "/%s" % ("/".join(expr_parts))
        return self.selenium.find_element_by_xpath(expr)
