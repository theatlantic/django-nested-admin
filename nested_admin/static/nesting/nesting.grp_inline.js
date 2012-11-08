var DJNesting = (typeof window.DJNesting != "undefined")
               ? DJNesting : {};

(function($) {

    // The "closure" functions in grappelli's $.fn.grp_inline()
    // (jquery.grp_inline.js) are actually global, since they aren't declared
    // with "var", so we can override them on the window object.
    if (window.initInlineForms) {
        var _initInlineForms = window.initInlineForms;
        window.initInlineForms = function(elem, options) {
            // Use original if not a nested inline
            if (!elem.hasClass('djnesting-stacked')) {
                return _initInlineForms(elem, options);
            }
            elem.find("div.module").each(function() {

                /* ====== Start modified code ======= */
                var id = this.getAttribute('id');
                if (typeof(id) != 'string') {
                    return true;
                }
                // continue to next element if prefix doesn't match
                if (id.indexOf(options.prefix) !== 0) {
                    return true;
                }
                // If we remove the prefix from the id and we still have
                // '_set-' in the string, this means that this div is for
                // of a nested form, not the current form.
                // For example, this condition would match if
                //     prefix = 'tocmainsection_set'
                //     id     = 'tocmainsection_set-0-tocarticle_set-3'
                if (id.replace(options.prefix, '').indexOf('_set-') != -1) {
                    return true;
                }
                /* ====== End modified code ======= */

                var form = $(this);
                // callback
                options.onBeforeInit(form);
                // add options.formCssClass to all forms in the inline
                // except table/theader/add-item
                if (id !== "") {
                    form.not("." + options.emptyCssClass).not(".table").not(".thead").not(".add-item").addClass(options.formCssClass);
                }
                // add options.predeleteCssClass to forms with the delete checkbox checked
                form.find("li.delete-handler-container input").each(function() {
                    if ($(this).attr("checked") && form.hasClass("has_original")) {
                        form.toggleClass(options.predeleteCssClass);
                    }
                });
                // callback
                options.onAfterInit(form);
            });
            elem.trigger('djnesting:init');
        };
    }

    if (window.addButtonHandler) {
        var _addButtonHandler = window.addButtonHandler;
        window.addButtonHandler = function(elem, options) {
            // Use original if not a nested model
            var $group = elem.closest('.group');
            if (!$group.hasClass('djnesting-stacked')) {
                return _addButtonHandler(elem, options);
            }

            var isNested = $group.hasClass('djnesting-stacked-nested');

            elem.bind("click", function() {
                var inline = elem.closest("div.group"), // <== MODIFIED, formerly parents()
                    totalForms = inline.find("#id_" + options.prefix + "-TOTAL_FORMS"),
                    maxForms = inline.find("#id_" + options.prefix + "-MAX_NUM_FORMS"),
                    empty_template = inline.find("#" + options.prefix + "-empty");
                // callback
                options.onBeforeAdded(inline);
                // create new form
                var index = parseInt(totalForms.val(), 10),
                    form = empty_template.clone(true);
                /* ====== Start modified code ======= */
                form.removeClass(options.emptyCssClass)
                    .attr("id", empty_template.attr('id').replace("-empty", index))
                    .addClass(options.formCssClass);
                if (isNested) {
                    form.wrap('<div></div>')
                        .parent()
                        .insertBefore(empty_template.parent());
                } else {
                    form.insertBefore(empty_template);
                }
                /* ====== End modified code ======= */

                // update form index
                var re = /__prefix__/g;
                updateFormIndex(form, options, re, index);
                // update total forms
                totalForms.val(index + 1);
                // hide add button in case we've hit the max, except we want to add infinitely
                if ((maxForms.val() !== 0) && (maxForms.val() !== "") && (maxForms.val() - totalForms.val()) <= 0) {
                    hideAddBottons(inline, options);
                }
                
                // callback
                options.onAfterAdded(form);
            });
        };
    }

    if (window.removeButtonHandler) {
        var _removeButtonHandler = window.removeButtonHandler;
        window.removeButtonHandler = function(elem, options) {
            // Use original if not a nested model
            if (!elem.hasClass('djnesting-icon')) {
                return _removeButtonHandler(elem, options);
            }
            elem.bind("click", function() {
                var inline = elem.closest("div.group"),                 // <== Modified, formerly parents()
                    form = $(this).closest("." + options.formCssClass), // <== Modified, formerly parents().first()
                    totalForms = inline.find("#id_" + options.prefix + "-TOTAL_FORMS"),
                    maxForms = inline.find("#id_" + options.prefix + "-MAX_NUM_FORMS");
                // callback
                options.onBeforeRemoved(form);
                // remove form
                form.remove();
                // update total forms
                var index = parseInt(totalForms.val(), 10);
                totalForms.val(index - 1);
                // show add button in case we've dropped below max
                if ((maxForms.val() !== 0) && (maxForms.val() - totalForms.val()) > 0) {
                    showAddButtons(inline, options);
                }

                /* ====== Start modified code ======= */
                // update form index (for all forms)
                // var re = new RegExp('^' + options.prefix + '-\\d+-', 'g'),
                //     i = 0;
                // inline.find("." + options.formCssClass).each(function() {
                //     updateFormIndex($(this), options, re, options.prefix + "-" + i + "-");
                //     i++;
                // });
                /* ====== End modified code ======= */

                // callback
                options.onAfterRemoved(inline);
            });
        };
    }

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
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find('input[name^="' + prefix + '"][name$="' + this + '"]')
            .grp_related_fk({lookup_url: lookup_urls.related});
        });
        $.each(lookup_fields.related_m2m, function() {
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find('input[name^="' + prefix + '"][name$="' + this + '"]')
            .grp_related_m2m({lookup_url: lookup_urls.m2m});
        });
        $.each(lookup_fields.related_generic, function() {
            var content_type = this[0],
                object_id = this[1];
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find('input[name^="' + prefix + '"][name$="' + this[1] + '"]')
            .each(function() {
                var $this = $(this);
                var id = $this.attr('id');
                var idRegex = new RegExp("(\\-\\d+\\-)" + object_id + "$");
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

        $.each(lookup_fields.autocomplete_fk, function() {
            form.find("input[name^='" + prefix + "'][name$='" + this + "']")
            .each(function() {
                $(this).grp_autocomplete_fk({
                    lookup_url: lookup_urls.related,
                    autocomplete_lookup_url: lookup_urls.autocomplete
                });
            });
        });
        $.each(lookup_fields.autocomplete_m2m, function() {
            form.find("input[name^='" + prefix + "'][name$='" + this + "']")
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
            form.find("input[name^='" + prefix + "'][name$='" + this[1] + "']")
            .each(function() {
                var i = $(this).attr("id").match(/-\d+-/);
                if (i) {
                    var ct_id = "#id_" + prefix + i[0] + content_type,
                        obj_id = "#id_" + prefix + i[0] + object_id;
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

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);