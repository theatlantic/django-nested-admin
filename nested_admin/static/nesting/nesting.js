(function($) {

    $(document).ready(function() {
        // Remove the border on any empty fieldsets
        $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
            return element.childNodes.length == 0;
        }).css('border-width', '0');

        // Set predelete class on any form elements with the DELETE input checked.
        // These can occur on forms rendered after a validation error.
        $('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest('.djn-inline-form').addClass('predelete');

        // Register the nested formset on top level djnesting-stacked elements.
        // It will handle recursing down the nested inlines.
        $('.djn-group-root').each(function(i, rootGroup) {
            $(rootGroup).djangoFormset();
        });
        $('form').on('submit.djnesting', function(e) {
            $('.djn-group').each(function() {
                DJNesting.updatePositions($(this).djangoFormsetPrefix(), true);
                $(document).trigger('djnesting:mutate', [$(this).djangoFormset().$inline]);
            });
        });
    });


})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
