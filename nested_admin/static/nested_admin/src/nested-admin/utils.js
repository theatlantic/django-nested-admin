'use strict';

import $ from 'jquery';
import './jquery.djnutils.js';
import {createSortable, updatePositions} from './sortable';
import regexQuote from './regexquote';
import DateTimeShortcuts from 'django/date-time-shortcuts';
import SelectFilter from 'django/select-filter';

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
        selector = ':input,span,table,iframe,label,a,ul,p,img,div.grp-module,div.module,.djn-group,.djn-item';
    }
    $elem.find(selector).andSelf().each(function() {
        var $node = $(this),
            attrs = ['id', 'name', 'for', 'href', 'class', 'onclick'];

        $.each(attrs, function(i, attrName) {
            var attrVal = $node.attr(attrName);
            if (attrVal) {
                $node.attr(attrName, attrVal.replace(search, replace));
            }
        });

        if ($node.attr('id') && $node.is('.djn-item')) {
            $node.attr('id', $node.attr('id').replace(/([^\-\d])\-(\d+)$/, '$1$2'));
        }
    });
    // update prepopulate ids for function initPrepopulatedFields
    $elem.find('.prepopulated_field').each(function() {
        var $node = $(this);
        var dependencyIds = $.makeArray($node.data('dependency_ids') || []);
        $node.data('dependency_ids', $.map(dependencyIds, function(id) {
            return id.replace(search, replace);
        }));
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
    var lookupUrls = DJNesting.LOOKUP_URLS;

    if (!groupData) {
        groupData = $('#' + prefix + '-group').djnData();
    }
    var lookupFields = groupData.lookupRelated;

    $.each(lookupFields.fk || [], function() {
        if ($(this).next('a').hasClass('related-lookup')) return;
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .grp_related_fk({lookup_url: lookupUrls.related});
    });
    $.each(lookupFields.m2m || [], function() {
        if ($(this).next('a').hasClass('related-lookup')) return;
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .grp_related_m2m({lookup_url: lookupUrls.m2m});
    });
    $.each(lookupFields.generic || [], function() {
        var [contentType, objectId] = this;
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + objectId + '"]')
        .each(function() {
            var $this = $(this);
            var id = $this.attr('id');
            var idRegex = new RegExp('(\\-\\d+\\-)' + objectId + '$');
            var [, index] = id.match(idRegex) || [];
            if (index) {
                if ($this.hasClass('grp-has-related-lookup')) {
                    $this.parent().find('a.related-lookup').remove();
                    $this.parent().find('.grp-placeholder-related-generic').remove();
                }
                $this.grp_related_generic({
                    content_type: '#id_' + prefix + index + contentType,
                    object_id: '#id_' + prefix + index + objectId,
                    lookup_url: lookupUrls.related
                });
            }
        });
    });
};

DJNesting.initAutocompleteFields = function(prefix, groupData) {
    if (typeof DJNesting.LOOKUP_URLS != 'object' || !DJNesting.LOOKUP_URLS.related) {
        return;
    }
    var lookupUrls = DJNesting.LOOKUP_URLS;

    var $inline = $('#' + prefix + '-group');

    if (!groupData) {
        groupData = $inline.djnData();
    }
    var lookupFields = groupData.lookupAutocomplete;

    $.each(lookupFields.fk || [], function() {
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .each(function() {
            $(this).grp_autocomplete_fk({
                lookup_url: lookupUrls.related,
                autocomplete_lookup_url: lookupUrls.autocomplete
            });
        });
    });
    $.each(lookupFields.m2m || [], function() {
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + this + '"]')
        .each(function() {
            $(this).grp_autocomplete_m2m({
                lookup_url: lookupUrls.m2m,
                autocomplete_lookup_url: lookupUrls.autocomplete
            });
        });
    });
    $.each(lookupFields.generic || [], function() {
        var [contentType, objectId] = this;
        $('#' + prefix + '-group > .djn-items > *:not(.djn-empty-form)')
        .find('input[name^="' + prefix + '"][name$="' + objectId + '"]')
        .each(function() {
            var idRegex = new RegExp('(\\-\\d+\\-)' + objectId + '$');
            var [, index] = $(this).attr('id').match(idRegex) || [];
            if (index) {
                $(this).grp_autocomplete_generic({
                    content_type: '#id_' + prefix + index + contentType,
                    object_id: '#id_' + prefix + index + objectId,
                    lookup_url: lookupUrls.related,
                    autocomplete_lookup_url: lookupUrls.m2m
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
                input = (field.is(':input') ? field : field.find(':input')),
                dependencyList = input.data('dependency_list') || [],
                formPrefix = input.djangoFormPrefix(),
                dependencies = [];
            if (!formPrefix || formPrefix.match(/__prefix__/)) {
                return;
            }
            $.each(dependencyList, function(i, fieldName) {
                dependencies.push('#id_' + formPrefix + fieldName);
            });
            if (dependencies.length) {
                input.prepopulate(dependencies, input.attr('maxlength'));
            }
        });
    },
    reinitDateTimeShortCuts: function() {
        // Reinitialize the calendar and clock widgets by force
        if (typeof DateTimeShortcuts !== 'undefined') {
            $('.datetimeshortcuts').remove();
            DateTimeShortcuts.init();
        }
    },
    updateSelectFilter: function($form) {
        // If any SelectFilter widgets are a part of the new form,
        // instantiate a new SelectFilter instance for it.
        if (typeof SelectFilter !== 'undefined') {
            $form.find('.selectfilter').each(function(index, value) {
                var namearr = value.name.split('-');
                SelectFilter.init(value.id, namearr[namearr.length - 1], false, DJNesting.adminStaticPrefix);
            });
            $form.find('.selectfilterstacked').each(function(index, value) {
                var namearr = value.name.split('-');
                SelectFilter.init(value.id, namearr[namearr.length - 1], true, DJNesting.adminStaticPrefix);
            });
        }
    }
};

window.DJNesting = DJNesting;

export default DJNesting;
