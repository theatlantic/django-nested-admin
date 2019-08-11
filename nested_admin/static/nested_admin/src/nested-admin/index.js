const $ = require('jquery');
const grappelli = require('grappelli');
const DJNesting = require('./utils');
DJNesting.DjangoFormset = require('./jquery.djangoformset');

if (grappelli) {
    // grappelli initializes the jQuery UI datePicker and timePicker widgets
    // on nested inlines of empty inline formsets. This later prevents proper
    // initialization of these elements when they are added. Here, we wrap and
    // override these methods, excluding template forms (i.e., those with
    // '-empty' and '__prefix__' in their names/ids) from the calls to the
    // widget initialization.
    if (typeof $.fn.datepicker === 'function') {
        $.fn.datepicker = ((orig) => function datepicker() {
            orig.apply(this.not('[id*="-empty"]').not('[id*="__prefix__"]'), arguments);
        })($.fn.datepicker);
    }
    if (typeof $.fn.grp_timepicker === 'function') {
        $.fn.grp_timepicker = ((orig) => function grp_timepicker() {
            orig.apply(this.not('[id*="-empty"]').not('[id*="__prefix__"]'), arguments);
        })($.fn.grp_timepicker);
    }
}

if (typeof $.fn.djangoAdminSelect2 === 'function') {
    $.fn.djangoAdminSelect2 = ((orig) => function djangoAdminSelect2() {
        orig.apply(this.not('[id*="-empty"]').not('[id*="__prefix__"]'), arguments);
    })($.fn.djangoAdminSelect2);
}

$(document).ready(function() {
    // Remove the border on any empty fieldsets
    $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
        return element.childNodes.length == 0;
    }).css('border-width', '0');

    // Set predelete class on any form elements with the DELETE input checked.
    // These can occur on forms rendered after a validation error.
    $('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest('.djn-inline-form').addClass('grp-predelete');

    $(document).on('djnesting:initialized djnesting:mutate', function onMutate(e, $inline) {
        var $items = $inline.find('> .djn-items, > .tabular > .module > .djn-items');
        var $rows = $items.children('.djn-tbody');
        $rows.removeClass('row1 row2');
        $rows.each(function(i, row) {
            var n = 1 + (i % 2);
            $(row).addClass('row' + n);
        });
    });

    // Register the nested formset on top level djnesting-stacked elements.
    // It will handle recursing down the nested inlines.
    $('.djn-group-root').each(function(i, rootGroup) {
        $(rootGroup).djangoFormset();
    });

    $('form').on('submit.djnesting', function(e) {
        $('.djn-group').each(function() {
            DJNesting.updatePositions($(this).djangoFormsetPrefix());
            $(document).trigger('djnesting:mutate', [$(this).djangoFormset().$inline]);
        });
    });
});

module.exports = DJNesting;
