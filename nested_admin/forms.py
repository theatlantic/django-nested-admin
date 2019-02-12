from django.forms.widgets import HiddenInput


class SortableHiddenMixin(object):
    """
    Enables inline sorting and hides the sortable field.

    By default it assumes the field name is ``position``. This can be
    overridden by setting the ``sortable_field_name`` attribute to a
    different value.
    """
    sortable_field_name = "position"

    def formfield_for_dbfield(self, db_field, **kwargs):
        if db_field.name == self.sortable_field_name:
            kwargs["widget"] = HiddenInput()
        return super(SortableHiddenMixin, self).formfield_for_dbfield(
            db_field, **kwargs)
