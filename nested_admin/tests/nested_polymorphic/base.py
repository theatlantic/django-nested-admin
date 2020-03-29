import six
from unittest import SkipTest

import django
from django.conf import settings
from django.apps import apps
from polymorphic.utils import get_base_polymorphic_model

from nested_admin.tests.base import BaseNestedAdminTestCase
from nested_admin.tests.utils import xpath_item, xpath_cls, is_sequence, is_integer, is_str

try:
    from polymorphic.models import PolymorphicModel
except:
    # Temporary until django-polymorphic supports django 3.0
    if django.VERSION < (3, 0):
        raise
    else:
        class PolymorphicModel(object):
            pass


class BaseNestedPolymorphicTestCase(BaseNestedAdminTestCase):

    @classmethod
    def setUpClass(cls):
        if django.VERSION >= (3, 0):
            raise SkipTest(
                'django-polymorphic not yet compatible with Django 3.0')
        super(BaseNestedPolymorphicTestCase, cls).setUpClass()

    def get_inline_model_names(self):
        return self.selenium.execute_script("""
          return (function getGroup($group) {
            $group = (typeof $group === 'undefined') ? $('.djn-group-root') : $($group);
            var $djnItems = $group.find([
              '> .djn-fieldset > .djn-items',
              '> .djn-items',
              '> .tabular.inline-related > .djn-fieldset > .djn-items'
             ].join(', '));
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
        if issubclass(model_cls, PolymorphicModel):
            base_model_cls = get_base_polymorphic_model(model_cls)
        else:
            base_model_cls = model_cls
        base_model_id = "%s-%s" % (
            base_model_cls._meta.app_label, base_model_cls._meta.model_name)
        try:
            group = self.get_group(indexes=group_indexes + [base_model_id])
        except TypeError:
            group = self.get_group(indexes=group_indexes + [model_id])
        group_id = group.get_attribute('id')
        djn_items = self.selenium.find_element_by_css_selector(
            "#%(id)s > .djn-fieldset > .djn-items, "
            "#%(id)s > .tabular.inline-related > .djn-fieldset > .djn-items, "
            "#%(id)s > .djn-items" % {'id': group_id})
        model_name, item_index = indexes[-1]
        return djn_items.find_element_by_xpath(
            "./*[%s][%d]" % (xpath_item(), item_index + 1))

    def delete_inline(self, indexes):
        indexes = self._normalize_indexes(indexes)
        model_id = indexes[-1][0]
        app_label, model_name = model_id.split('-')
        model_cls = apps.get_model(app_label, model_name)
        if issubclass(model_cls, PolymorphicModel):
            base_model_cls = get_base_polymorphic_model(model_cls)
        else:
            base_model_cls = model_cls
        base_model_id = "%s-%s" % (
            base_model_cls._meta.app_label, base_model_cls._meta.model_name)
        item_id = self.get_item(indexes).get_attribute('id')
        delete_selector = "#%s .djn-delete-handler.djn-model-%s" % (
            item_id, base_model_id)
        with self.clickable_selector(delete_selector) as el:
            self.click(el)
        if self.has_grappelli:
            undelete_selector = "#%s.grp-predelete .grp-delete-handler.djn-model-%s" % (
                item_id, base_model_id)
            self.wait_until_clickable_selector(undelete_selector)

    def add_inline(self, indexes=None, model=None, **kwargs):
        model_name = "%s-%s" % (model._meta.app_label, model._meta.model_name)
        if issubclass(model, PolymorphicModel):
            base_model = get_base_polymorphic_model(model)
        else:
            base_model = model
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

        if poly_add_link:
            poly_add_link.click()

        indexes = self._normalize_indexes(indexes)

        group_el = self.selenium.execute_script(
            'return $(arguments[0]).closest(".djn-group")[0]', add_els[0])
        group_id = group_el.get_attribute('id')

        items_el = self.selenium.find_element_by_css_selector(
            '#%(id)s > .djn-fieldset > .djn-items, '
            "#%(id)s > .tabular.inline-related > .djn-fieldset > .djn-items, "
            '#%(id)s > .djn-items' % {'id': group_id})

        num_inlines = len(items_el.find_elements_by_xpath(
            './*[%s and not(%s)]' % (xpath_item(), xpath_cls('djn-empty-form'))))

        new_index = num_inlines - 1

        indexes.append([model_name, new_index])
        for field_name, val in six.iteritems(kwargs):
            self.set_field(field_name, val, indexes=indexes)
        return indexes

    def remove_inline(self, indexes):
        item = self.get_item(indexes)
        remove_handler = self.selenium.execute_script(
            "return $(arguments[0]).nearest('.djn-remove-handler')[0]",
            item)
        self.click(remove_handler)

    def get_num_inlines(self, indexes=None):
        group = self.get_group(indexes=indexes)
        group_id = group.get_attribute('id')
        djn_items = self.selenium.find_element_by_css_selector(
            "#%(id)s > .djn-fieldset > .djn-items, "
            "#%(id)s > .tabular.inline-related > .djn-fieldset > .djn-items, "
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
            expr_parts += ["/*[%s][count(preceding-sibling::*[%s]) = %d]" % (
                xpath_item(parent_model), xpath_item(), parent_item_index)]
        expr_parts += ["/*[@data-inline-model='%s' and %s]"
            % (model_name, xpath_cls('djn-group'))]
        expr = "/%s" % ("/".join(expr_parts))
        return self.selenium.find_element_by_xpath(expr)
