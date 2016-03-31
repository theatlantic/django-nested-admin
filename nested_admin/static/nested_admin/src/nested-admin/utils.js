'use strict';

import $ from './django-jquery';
import './jquery.djnutils.js';
import {createSortable, updatePositions} from './sortable';
import regexQuote from './regexquote';

var DJNesting = (typeof window.DJNesting != 'undefined')
               ? window.DJNesting : {};

DJNesting.regexQuote = regexQuote;
DJNesting.createSortable = createSortable;
DJNesting.updatePositions = updatePositions;

/**
 * Update attributes based on a regular expression
 */
DJNesting.updateFormAttributes = function($elem, search, replace, selector) {
    if (!selector) {
        selector = ':input,span,table,iframe,label,a,ul,p,img,div.grp-module,div.module,div.group';
    }
    $elem.find(selector).andSelf().each(function() {
        var $node = $(this),
            attrs = ['id', 'name', 'for'];

        $.each(attrs, function(i, attrName) {
            var attrVal = $node.attr(attrName);
            if (attrVal) {
                $node.attr(attrName, attrVal.replace(search, replace));
            }
        });

        if ($node.attr('id') && $node.is('.module,.grp-module')) {
            $node.attr('id', $node.attr('id').replace(/([^\-\d])\-(\d+)$/, '$1$2'));
        }
    });
};



DJNesting.createContainerElement = function() {
    return;
};

// Slight tweaks to the grappelli functions of the same name
// (initRelatedFields and initAutocompleteFields).
//
// The most notable tweak is the call to $.fn.grp_related_generic() (a
// jQuery method provided by django-curated) and the use of
// DJNesting.LOOKUP_URLS to determine the ajax lookup urls.
//
// We abstract this out using form prefix because the way grappelli does it
// (adding javascript at the bottom of each formset) doesn't really scale
// with nested formsets.

// The second parameter (groupData) is optional, and only exists to prevent
// redundant calls to jQuery() and jQuery.fn.data() in the calling context
DJNesting.initRelatedFields = function(prefix, groupData) {
    if (typeof DJNesting.LOOKUP_URLS != 'object' || !DJNesting.LOOKUP_URLS.related) {
        return;
    }
    var lookup_urls = DJNesting.LOOKUP_URLS;

    if (!groupData) {
        groupData = $('#' + prefix + '-group').data();
    }
    var lookup_fields = {
        related_fk:       groupData.lookupRelatedFk,
        related_m2m:      groupData.lookupRelatedM2m,
        related_generic:  groupData.lookupRelatedGeneric,
        autocomplete_fk:  groupData.lookupAutocompleteFk,
        autocomplete_m2m: groupData.lookupAutocompleteM2m,
        autocomplete_generic: groupData.lookupAutocompleteGeneric
    };

    $.each(lookup_fields.related_fk, function() {
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .grp_related_fk({lookup_url: lookup_urls.related});
    });
    $.each(lookup_fields.related_m2m, function() {
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .grp_related_m2m({lookup_url: lookup_urls.m2m});
    });
    $.each(lookup_fields.related_generic, function() {
        var content_type = this[0],
            object_id = this[1];
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this[1] + '"]')
        .each(function() {
            var $this = $(this);
            var id = $this.attr('id');
            var idRegex = new RegExp('(\\-\\d+\\-)' + object_id + '$');
            var i = id.match(idRegex);
            if (i) {
                var ct_id = '#id_' + prefix + i[1] + content_type,
                    obj_id = '#id_' + prefix + i[1] + object_id;
                $this.grp_related_generic({
                    content_type:ct_id,
                    object_id:obj_id,
                    lookup_url:lookup_urls.related
                });
            }
        });
    });
};

DJNesting.initAutocompleteFields = function(prefix, groupData) {
    if (typeof DJNesting.LOOKUP_URLS != 'object' || !DJNesting.LOOKUP_URLS.related) {
        return;
    }
    var lookup_urls = DJNesting.LOOKUP_URLS;

    var $inline = $('#' + prefix + '-group');

    if (!groupData) {
        groupData = $inline.data();
    }
    var lookup_fields = {
        related_fk:       groupData.lookupRelatedFk,
        related_m2m:      groupData.lookupRelatedM2m,
        related_generic:  groupData.lookupRelatedGeneric,
        autocomplete_fk:  groupData.lookupAutocompleteFk,
        autocomplete_m2m: groupData.lookupAutocompleteM2m,
        autocomplete_generic: groupData.lookupAutocompleteGeneric
    };

    $.each(lookup_fields.autocomplete_fk, function() {
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .each(function() {
            $(this).grp_autocomplete_fk({
                lookup_url: lookup_urls.related,
                autocomplete_lookup_url: lookup_urls.autocomplete
            });
        });
    });
    $.each(lookup_fields.autocomplete_m2m, function() {
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .each(function() {
            $(this).grp_autocomplete_m2m({
                lookup_url: lookup_urls.m2m,
                autocomplete_lookup_url: lookup_urls.autocomplete
            });
        });
    });
    $.each(lookup_fields.autocomplete_generic, function() {
        var content_type = this[0],
            object_id = this[1];
        $('#' + prefix + '-group > .djn-items > *:not(.empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this[1] + '"]')
        .each(function() {
            var i = $(this).attr('id').match(/-\d+-/);
            if (i) {
                var ct_id = '#id_' + prefix + i[0] + content_type,
                    obj_id = '#id_' + prefix + i[0] + object_id;
                $(this).grp_autocomplete_generic({
                    content_type:ct_id,
                    object_id:obj_id,
                    lookup_url:lookup_urls.related,
                    autocomplete_lookup_url:lookup_urls.m2m
                });
            }
        });
    });
};

// This function will update the position prefix for empty-form elements
// in nested forms.
DJNesting.updateNestedFormIndex = function updateNestedFormIndex(form, prefix) {
    var index = form.attr('id').replace(prefix, '');
    var elems = form.find('*[id^="' + prefix + '-empty-"]')
                     .add('*[id^="id_' + prefix + '-empty-"]', form)
                     .add('*[id^="lookup_id_' + prefix + '-empty-"]', form)
                     .add('label[for^="id_' + prefix + '-empty-"]', form);
    elems.each(function(i, elem) {
        var emptyLen = '-empty'.length;
        var attrs = ['id', 'name', 'for'];
        $.each(attrs, function(i, attr) {
            var val = elem.getAttribute(attr) || '',
                emptyPos = val.indexOf('-empty');
            if (emptyPos > 0) {
                var beforeEmpty = val.substr(0, emptyPos+1),
                    afterEmpty = val.substr(emptyPos+emptyLen),
                    newVal = beforeEmpty + index + afterEmpty;
                elem.setAttribute(attr, newVal);
            }
        });
    });
};

// I very much regret that these are basically copy-pasted from django's
// inlines.js, but they're hidden in closure scope so I don't have much choice.
DJNesting.DjangoInlines = {
    initPrepopulatedFields: function(row) {
        row.find('.prepopulated_field').each(function() {
            var field = $(this),
                input = field.find('input, select, textarea'),
                dependency_list = input.data('dependency_list') || [],
                formPrefix = input.djangoFormPrefix(),
                dependencies = [];
            if (!formPrefix || formPrefix.match(/__prefix__/)) {
                return;
            }
            $.each(dependency_list, function(i, field_name) {
                dependencies.push('#id_' + formPrefix + field_name);
            });
            if (dependencies.length) {
                input.prepopulate(dependencies, input.attr('maxlength'));
            }
        });
    },
    reinitDateTimeShortCuts: function() {
        // Reinitialize the calendar and clock widgets by force
        if (typeof window.DateTimeShortcuts !== 'undefined') {
            $('.datetimeshortcuts').remove();
            window.DateTimeShortcuts.init();
        }
    },
    updateSelectFilter: function($form) {
        // If any SelectFilter widgets are a part of the new form,
        // instantiate a new SelectFilter instance for it.
        if (typeof window.SelectFilter !== 'undefined') {
            $form.find('.selectfilter').each(function(index, value) {
                var namearr = value.name.split('-');
                window.SelectFilter.init(value.id, namearr[namearr.length - 1], false, DJNesting.adminStaticPrefix);
            });
            $form.find('.selectfilterstacked').each(function(index, value) {
                var namearr = value.name.split('-');
                window.SelectFilter.init(value.id, namearr[namearr.length - 1], true, DJNesting.adminStaticPrefix);
            });
        }
    }
};

window.DJNesting = DJNesting;

export default DJNesting;
