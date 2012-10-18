from django.forms.models import BaseInlineFormSet
from django.contrib.contenttypes.generic import BaseGenericInlineFormSet


class NestedInlineFormSetMixin(object):

    def save(self, commit=True):
        """
        Saves model instances for every form, adding and changing instances
        as necessary, and returns the list of instances.
        """
        self.changed_objects = []
        self.deleted_objects = []
        self.new_objects = []
        if not commit:
            self.saved_forms = []
            def save_m2m():
                for form in self.saved_forms:
                    form.save_m2m()
            self.save_m2m = save_m2m

        initial_form_count = self.initial_form_count()
        forms = []
        for i, form in enumerate(self.forms):
            form._list_position = i
            form._is_initial = bool(i < initial_form_count)
            forms.append(form)

        # Sort on position
        sortable_field_name = getattr(self, 'sortable_field_name', None)
        if sortable_field_name is not None:
            default_data = {}
            default_data[sortable_field_name] = 0
            def sort_form(f):
                data = getattr(f, 'cleaned_data', default_data)
                return data.get(sortable_field_name, 0)
            forms.sort(key=sort_form)

        form_instances = []
        saved_instances = []

        for i, form in enumerate(forms):
            # if not self._should_delete_form(form) and form.cleaned_data['is_subarticle']:
            #     if form.cleaned_data['parent_article'] is None:
            #         # Loop backwards until we find the parent instance id
            #         parent_instance = None
            #         for prev_instance in reversed(form_instances):
            #             if not prev_instance.is_subarticle:
            #                 parent_instance = prev_instance
            #                 break
            # 
            #         if parent_instance is None:
            #             raise ValidationError("There was an error saving supporting articles.")
            #         else:
            #             data_key = form.add_prefix('parent_article')
            #             form.data[data_key] = unicode(parent_instance.pk)
            #             form.cleaned_data['parent_article'] = unicode(parent_instance.pk)
            #             # Reset _changed_data so _get_changed_data() gets called again
            #             form._changed_data = None

            if form._is_initial:
                instances = self.save_existing_objects([form], commit)
            else:
                instances = self.save_new_objects([form], commit)
            # Save instances so we can reference it for sub-instanced nested
            # beneath not-yet-saved instanced.
            if len(instances):
                instance = instances[0]
                instance._list_position = form._list_position
                saved_instances += [instance]
            else:
                instance = form.instance
            if not self._should_delete_form(form):
                form_instances.append(instance)

        # Re-sort back to original order
        saved_instances.sort(key=lambda i: i._list_position)
        return saved_instances

    def save_existing_objects(self, initial_forms=[], commit=True):
        """
        Identical to parent class, except ``self.initial_forms`` is replaced
        with ``initial_forms``, passed as parameter.
        """
        if not self.get_queryset():
            return []

        saved_instances = []
        for form in initial_forms:
            pk_name = self._pk_field.name
            raw_pk_value = form._raw_value(pk_name)

            # clean() for different types of PK fields can sometimes return
            # the model instance, and sometimes the PK. Handle either.
            pk_value = form.fields[pk_name].clean(raw_pk_value)
            pk_value = getattr(pk_value, 'pk', pk_value)

            obj = self._existing_object(pk_value)
            if self.can_delete and self._should_delete_form(form):
                self.deleted_objects.append(obj)
                obj.delete()
                continue
            if form.has_changed():
                self.changed_objects.append((obj, form.changed_data))
                saved_instances.append(self.save_existing(form, obj, commit=commit))
                if not commit:
                    self.saved_forms.append(form)
        return saved_instances

    def save_new_objects(self, extra_forms=[], commit=True):
        """
        Identical to parent class, except ``self.extra_forms`` is replaced
        with ``extra_forms``, passed as parameter.
        """
        for form in extra_forms:
            if not form.has_changed():
                continue
            # If someone has marked an add form for deletion, don't save the
            # object.
            if self.can_delete and self._should_delete_form(form):
                continue
            self.new_objects.append(self.save_new(form, commit=commit))
            if not commit:
                self.saved_forms.append(form)
        return self.new_objects


class NestedInlineFormSet(NestedInlineFormSetMixin, BaseInlineFormSet):
    pass


class GenericNestedInlineFormSet(NestedInlineFormSetMixin, BaseGenericInlineFormSet):

    @classmethod
    def get_default_prefix(cls):
        opts = cls.model._meta
        return '-'.join((opts.app_label, opts.object_name.lower(),
                        cls.ct_field.name, cls.ct_fk_field.name))
