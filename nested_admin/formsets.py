from __future__ import absolute_import, unicode_literals

import contextlib

import django
from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.contenttypes.forms import BaseGenericInlineFormSet
from django.contrib.contenttypes.models import ContentType
from django.forms.models import BaseInlineFormSet
from django.utils.encoding import force_text
from django.utils import six
from django.utils.six.moves import xrange


@contextlib.contextmanager
def mutable_querydict(qd):
    orig_mutable = None
    if getattr(qd, '_mutable', None) is False:
        orig_mutable = False
        qd._mutable = True
    yield
    if orig_mutable is not None:
        qd._mutable = orig_mutable


class NestedInlineFormSetMixin(object):

    is_nested = False

    def _construct_form(self, i, **kwargs):
        defaults = {}
        if '-empty-' in self.prefix:
            defaults['empty_permitted'] = True
        defaults.update(kwargs)
        return super(NestedInlineFormSetMixin, self)._construct_form(i, **defaults)

    def save(self, commit=True):
        """
        Saves model instances for every form, adding and changing instances
        as necessary, and returns the list of instances.
        """
        self.changed_objects = []
        self.deleted_objects = []
        self.new_objects = []

        # Copied lines are from BaseModelFormSet.save()
        if not commit:
            self.saved_forms = []
            def save_m2m():
                for form in self.saved_forms:
                    form.save_m2m()
            self.save_m2m = save_m2m
        # End copied lines from BaseModelFormSet.save()

        # The above if clause is the entirety of BaseModelFormSet.save(),
        # along with the following return:
        # return self.save_existing_objects(commit) + self.save_new_objects(commit)

        # Iterate through self.forms and add properties `_list_position`
        # and `_is_initial` so that the forms can be put back in the
        # proper order at the end of the save method.
        #
        # We need to re-sort the forms because we can get ForeignKey
        # constraint errors if we save nested formsets in their default order.
        initial_form_count = self.initial_form_count()
        forms = []
        for i, form in enumerate(self.forms):
            form._list_position = i
            form._is_initial = bool(i < initial_form_count)
            forms.append(form)

        # Perform the sort (and allow extended logic in child classes)
        forms = self.process_forms_pre_save(forms)

        form_instances = []
        saved_instances = []

        for form in forms:
            instance = self.get_saved_instance_for_form(form, commit, form_instances)
            if instance is not None:
                # Copy _list_position to instance
                instance._list_position = form._list_position

                # Store saved instances so we can reference it for
                # sub-instanced nested beneath not-yet-saved instances.
                saved_instances += [instance]
            else:
                instance = form.instance
            if not self._should_delete_form(form):
                form_instances.append(instance)

        # Re-sort back to original order
        saved_instances.sort(key=lambda i: i._list_position)
        return saved_instances

    def process_forms_pre_save(self, forms):
        """
        Sort by the sortable_field_name of the formset, if it has been set,
        and re-index the form positions (to account for gaps caused by blank
        or deleted forms)

        Allows customizable sorting and modification of self.forms before
        they're iterated through in save().

        Returns list of forms.
        """
        sort_field = getattr(self, 'sortable_field_name', None)

        def get_position(form):
            return getattr(form, 'cleaned_data', {sort_field: 0}).get(sort_field, 0)

        if sort_field is not None:
            forms.sort(key=get_position)

            i = 0
            for form in forms:
                if self._should_delete_form(form):
                    # Skip deleted forms
                    continue

                original_position = form.data.get(form.add_prefix(sort_field))

                if ("%s" % i) != original_position:
                    # If this is an unchanged extra form, continue because
                    # this form will be skipped when saving
                    if not form.changed_data and not form._is_initial:
                        continue

                    # Set the sort field on the instance and in the form data
                    setattr(form.instance, sort_field, i)
                    with mutable_querydict(form.data):
                        form.data[form.add_prefix(sort_field)] = six.text_type(i)

                    # Force recalculation of changed_data
                    if django.VERSION > (1, 9):
                        form.__dict__.pop('changed_data', None)
                    else:
                        form._changed_data = None

                i += 1

        return forms

    def get_saved_instance_for_form(self, form, commit, form_instances=None):
        pk_name = None
        if form.instance and form.instance._meta.pk:
            pk_name = form.instance._meta.pk.name
        pk_val = None
        if not form.errors and hasattr(form, 'cleaned_data'):
            pk_val = form.cleaned_data.get(pk_name)
        # Inherited models will show up as instances of the parent in
        # cleaned_data
        if isinstance(pk_val, models.Model):
            pk_val = pk_val.pk
        if pk_val is not None:
            try:
                setattr(form.instance, pk_name, pk_val)
            except ValueError:
                pk_attname = form.instance._meta.pk.get_attname()
                setattr(form.instance, pk_attname, pk_val)

        if form._is_initial:
            instances = self.save_existing_objects([form], commit)
        else:
            instances = self.save_new_objects([form], commit)
        if len(instances):
            instance = instances[0]
            instance._list_position = form._list_position
            return instance
        else:
            return None

    def get_queryset(self):
        """
        TODO: document this extended method
        """
        if not self.data:
            return super(NestedInlineFormSetMixin, self).get_queryset()

        if not hasattr(self, '__queryset'):
            pk_keys = ["%s-%s" % (self.add_prefix(i), self.model._meta.pk.name)
                       for i in xrange(0, self.initial_form_count())]
            pk_vals = [self.data.get(pk_key) for pk_key in pk_keys if self.data.get(pk_key)]

            qs = self.model._default_manager.get_queryset()
            qs = qs.filter(pk__in=pk_vals)

            # If the queryset isn't already ordered we need to add an
            # artificial ordering here to make sure that all formsets
            # constructed from this queryset have the same form order.
            if not qs.ordered:
                qs = qs.order_by(self.model._meta.pk.name)

            self.__queryset = qs
        return self.__queryset

    def save_existing_objects(self, initial_forms=None, commit=True):
        """
        Identical to parent class, except ``self.initial_forms`` is replaced
        with ``initial_forms``, passed as parameter.
        """
        if not initial_forms:
            return []

        saved_instances = []

        forms_to_delete = self.deleted_forms

        for form in initial_forms:
            pk_name = self._pk_field.name

            if not hasattr(form, '_raw_value'):
                # Django 1.9+
                raw_pk_value = form.fields[pk_name].widget.value_from_datadict(
                    form.data, form.files, form.add_prefix(pk_name))
            else:
                raw_pk_value = form._raw_value(pk_name)

            # clean() for different types of PK fields can sometimes return
            # the model instance, and sometimes the PK. Handle either.
            if self._should_delete_form(form):
                pk_value = raw_pk_value
            else:
                try:
                    pk_value = form.fields[pk_name].clean(raw_pk_value)
                except ValidationError:
                    # The current form's instance was initially nested under
                    # a form that was deleted, which causes the pk clean to
                    # fail (because the instance has been deleted). To get
                    # around this we clear the pk and save it as if it were new.
                    with mutable_querydict(form.data):
                        form.data[form.add_prefix(pk_name)] = ''

                    if not form.has_changed():
                        if django.VERSION > (1, 9):
                            form.__dict__['changed_data'].append(pk_name)
                        else:
                            form._changed_data.append(pk_name)

                    saved_instances.extend(self.save_new_objects([form], commit))
                    continue
                pk_value = getattr(pk_value, 'pk', pk_value)

            obj = None
            if obj is None and form.instance and pk_value:
                model_cls = form.instance.__class__
                try:
                    obj = model_cls.objects.get(pk=pk_value)
                except model_cls.DoesNotExist:
                    if pk_value and force_text(form.instance.pk) == force_text(pk_value):
                        obj = form.instance
            if obj is None:
                obj = self._existing_object(pk_value)

            if form in forms_to_delete:
                self.deleted_objects.append(obj)
                if hasattr(self, 'delete_existing'):
                    self.delete_existing(obj, commit=commit)
                else:
                    if commit:
                        obj.delete()
                continue

            # fk_val: The value one should find in the form's foreign key field
            old_ct_val = ct_val = ContentType.objects.get_for_model(self.instance.__class__).pk
            old_fk_val = fk_val = self.instance.pk
            if form.instance.pk:
                original_instance = self.model.objects.get(pk=form.instance.pk)
                fk_field = getattr(self, 'fk', getattr(self, 'ct_fk_field', None))
                if fk_field:
                    old_fk_val = getattr(original_instance, fk_field.get_attname())
                ct_field = getattr(self, 'ct_field', None)
                if ct_field:
                    old_ct_val = getattr(original_instance, ct_field.get_attname())

            if form.has_changed() or fk_val != old_fk_val or ct_val != old_ct_val:
                self.changed_objects.append((obj, form.changed_data))
                saved_instances.append(self.save_existing(form, obj, commit=commit))
                if not commit:
                    self.saved_forms.append(form)
        return saved_instances

    def save_new_objects(self, extra_forms=None, commit=True):
        """
        Identical to parent class, except ``self.extra_forms`` is replaced
        with ``extra_forms``, passed as parameter, and self.new_objects is
        replaced with ``new_objects``.
        """
        new_objects = []

        if extra_forms is None:
            return new_objects

        for form in extra_forms:
            if not form.has_changed():
                continue
            # If someone has marked an add form for deletion, don't save the
            # object.
            if self.can_delete and self._should_delete_form(form):
                continue
            new_objects.append(self.save_new(form, commit=commit))
            if not commit:
                self.saved_forms.append(form)

        self.new_objects.extend(new_objects)
        return new_objects


class NestedInlineFormSet(NestedInlineFormSetMixin, BaseInlineFormSet):
    """
    The nested InlineFormSet for the common case (ForeignKey inlines)
    """
    pass


class NestedBaseGenericInlineFormSet(NestedInlineFormSetMixin, BaseGenericInlineFormSet):
    """
    The nested InlineFormSet for inlines of generic content-type relations
    """

    def save_existing(self, form, instance, commit=True):
        """Saves and returns an existing model instance for the given form."""
        setattr(form.instance, self.ct_field.get_attname(),
            ContentType.objects.get_for_model(self.instance).pk)
        setattr(form.instance, self.ct_fk_field.get_attname(),
            self.instance.pk)
        return form.save(commit=commit)
