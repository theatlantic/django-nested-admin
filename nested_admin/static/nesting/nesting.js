(function($) {

    $(document).ready(function() {
        // Remove the border on any empty fieldsets
        $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
            return element.childNodes.length == 0;
        }).css('border-width', '0');

        // Set predelete class on any form elements with the DELETE input checked.
        // These can occur on forms rendered after a validation error.
        $('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest('.nested-inline-form').addClass('predelete');

        // Register the DJNesting.NestedAdmin on top level djnesting-stacked elements.
        // It will handle recursing down the nested inlines.
        $('.djnesting-stacked-root').each(function(i, rootGroup) {
            var $rootGroup = $(rootGroup);
            // var nestedAdmin = new DJNesting.NestedAdmin($rootGroup);
            $rootGroup.nestedFormset();
            $rootGroup.find('.djnesting-stacked').andSelf().each(function(i, group) {
                var groupId = group.getAttribute('id');
                if (!groupId || groupId.indexOf('-empty') > -1 || groupId.indexOf('__prefix__') > -1) {
                    return;
                }
                DJNesting.updatePositions(groupId.replace(/-group$/, ''));
            });
        });
        $('form').submit(function() {
            $('.djnesting-stacked').each(function() {
                DJNesting.updatePositions($(this).djangoFormsetPrefix());
            });
        });
    });


})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
