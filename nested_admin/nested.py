from django.conf import settings
from django.contrib.admin import helpers
from django.core.urlresolvers import reverse
from django import forms

from .formsets import NestedInlineFormSet
from .options import ModelAdmin, InlineModelAdmin


class NestedAdmin(ModelAdmin):

    @property
    def media(self):
        media = getattr(super(NestedAdmin, self), 'media', forms.Media())

        server_data_js = reverse('nesting_server_data')
        media.add_js((server_data_js,))

        version = 8

        js_files = (
            'jquery.class.js',
            'jquery.ui.sortable.js',
            'jquery.ui.nestedSortable.js',
            'nesting.grp_inline.js',
            'nesting.js',)

        for js_file in js_files:
            js_file_url = u'%s/nesting/%s?v=%d' % (settings.STATIC_URL, js_file, version)
            media.add_js((js_file_url,))

        media.add_css({
            'all': (
                u'%s/nesting/nesting.css?v=%d' % (settings.STATIC_URL, version),
            )})
        return media

    def get_formset_instances(self, request, instance, is_new=False):
        obj = None
        if not is_new:
            obj = instance

        formset_kwargs = {}
        if request.method == 'POST':
            formset_kwargs.update({
                'data': request.POST,
                'files': request.FILES, })

            if is_new:
                formset_kwargs.update({
                    'save_as_new': request.POST.has_key('_saveasnew')})

        formset_iterator = super(NestedAdmin, self).get_formset_instances(
            request, instance, is_new)
        inline_iterator = self.get_inline_instances(request, obj)

        try:
            while True:
                formset = formset_iterator.next()
                if not hasattr(formset, 'nesting_depth'):
                    formset.nesting_depth = 1
                inline = inline_iterator.next()
                yield formset
                if getattr(inline, 'inlines', []) and request.method == 'POST':
                    for form in formset.forms:
                        for nested in inline.get_inline_instances(request):
                            InlineFormSet = nested.get_formset(request, form.instance)
                            prefix = '%s-%s' % (form.prefix, InlineFormSet.get_default_prefix())
                            nested_formset = InlineFormSet(instance=form.instance, prefix=prefix,
                                **formset_kwargs)
                            # We set `is_nested` to True so that we have a way
                            # to identify this formset as such and skip it if
                            # there is an error in the POST and we have to create
                            # inline admin formsets.
                            nested_formset.is_nested = True
                            nested_formset.nesting_depth = formset.nesting_depth + 1
                            yield nested_formset            
        except StopIteration:
            raise

    def get_nested_inlines(self, request, prefix, inline, parent_formset=None, obj=None):
        nested_inline_formsets = []
        for nested in inline.get_inline_instances(request):
            InlineFormSet = nested.get_formset(request, obj)
            nested_prefix = '%s-%s' % (prefix, InlineFormSet.get_default_prefix())
            nested_formset_kwargs = {
                'instance': obj,
                'prefix': nested_prefix,
            }
            if request.method == 'POST' and not prefix.endswith('-empty'):
                nested_formset_kwargs.update({
                    'data': request.POST,
                    'files': request.FILES,
                })
            nested_formset = InlineFormSet(**nested_formset_kwargs)
            nested_formset.is_nested = True
            if parent_formset is not None:
                nested_formset.nesting_depth = 1 + getattr(parent_formset.formset, 'nesting_depth', 1)
            nested_inline = self.get_nested_inline_admin_formset(request, nested,
                nested_formset, obj)
            nested_inline_formsets.append(nested_inline)
        return nested_inline_formsets

    def get_nested_inline_admin_formset(self, request, inline, formset, obj=None):
        return helpers.InlineAdminFormSet(inline, formset,
            inline.get_fieldsets(request, obj))

    def get_inline_admin_formsets(self, request, formsets, obj=None):
        inline_iterator = self.get_inline_instances(request, obj)
        # The only reason a nested inline admin formset would show up
        # here is if there was an error in the POST.
        # inline_admin_formsets are for display, not data submission,
        # and the way the nested forms are displayed is by setting the
        # 'inlines' attribute on inline_admin_formset.formset.forms items.
        # So we iterate through to find any `is_nested` formsets and save
        # them in dict `orig_nested_formsets`, keyed on the formset prefix,
        # as we'll need to swap out the nested formsets in the
        # InlineAdminFormSet.inlines if we want error messages to appear.
        orig_nested_formsets = {}
        non_nested_formsets = []
        for formset in formsets:
            if getattr(formset, 'is_nested', False):
                orig_nested_formsets[formset.prefix] = formset
            else:
                non_nested_formsets.append(formset)
        super_iterator = super(NestedAdmin, self).get_inline_admin_formsets(request,
            non_nested_formsets, obj)
        formset_iterator = iter(non_nested_formsets)
        try:
            while True:
                formset = formset_iterator.next()
                inline = inline_iterator.next()
                inline_admin_formset = super_iterator.next()

                for form in inline_admin_formset.formset.forms:
                    if form.instance.pk:
                        instance = form.instance
                    else:
                        instance = None
                    form_inlines = self.get_nested_inlines(request, form.prefix, inline,
                        parent_formset=inline_admin_formset, obj=instance)
                    # Check whether nested inline formsets were already submitted.
                    # If so, use the submitted formset instead of the freshly generated
                    # one since it will contain error information and non-saved data
                    # changes.
                    nested_inline_cls_iterator = inline.get_inline_instances(request)
                    for i, form_inline in enumerate(form_inlines):
                        try:
                            nested_inline_cls = nested_inline_cls_iterator.next()
                        except StopIteration:
                            break
                        if form_inline.formset.prefix in orig_nested_formsets:
                            orig_nested_formset = orig_nested_formsets[form_inline.formset.prefix]
                            form_inlines[i] = self.get_nested_inline_admin_formset(request,
                                inline=nested_inline_cls,
                                formset=orig_nested_formset,
                                obj=form_inline.formset.instance)
                    form.inlines = form_inlines
                # The empty prefix is used by django javascript when it tries
                # to determine the ids to give to the fields of newly created
                # instances in the form.
                empty_prefix = formset.add_prefix('empty')
                inline_admin_formset.inlines = self.get_nested_inlines(
                    request, empty_prefix, inline, parent_formset=inline_admin_formset)
                yield inline_admin_formset
        except StopIteration:
            raise


class NestedInlineModelAdmin(InlineModelAdmin):

    default_sortable_options = {
        'disabled': False,
    }

    def __init__(self, *args, **kwargs):
        sortable_options = {}
        sortable_options.update(self.default_sortable_options)
        if hasattr(self, 'sortable_options'):
            sortable_options.update(self.sortable_options)
        self.sortable_options = sortable_options
        super(NestedInlineModelAdmin, self).__init__(*args, **kwargs)

    formset = NestedInlineFormSet


class NestedStackedInline(NestedInlineModelAdmin):

    template = 'nesting/admin/inlines/stacked.html'
