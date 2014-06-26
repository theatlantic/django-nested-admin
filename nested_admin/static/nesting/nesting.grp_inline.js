var DJNesting = (typeof window.DJNesting != "undefined")
               ? DJNesting : {};

(function($) {

    var updateFormIndex, initInlineForms, initAddButtons, addButtonHandler, removeButtonHandler, deleteButtonHandler,
    hideAddButtons, showAddButtons,
    addButtonExpandoIds = {},
    removeButtonExpandoIds = {},
    deleteButtonExpandoIds = {};

    updateFormIndex = function(elem, options, replace_regex, replace_with) {
        elem.find(':input,span,table,iframe,label,a,ul,p,img').each(function() {
            var node = $(this),
                node_id = node.attr('id'),
                node_name = node.attr('name'),
                node_for = node.attr('for'),
                node_href = node.attr("href");
            if (node_id) { node.attr('id', node_id.replace(replace_regex, replace_with)); }
            if (node_name) { node.attr('name', node_name.replace(replace_regex, replace_with)); }
            if (node_for) { node.attr('for', node_for.replace(replace_regex, replace_with)); }
            if (node_href) { node.attr('href', node_href.replace(replace_regex, replace_with)); }
        });
    };
    
    initInlineForms = function(elem, options) {
        elem.find("div.module,div.grp-module").each(function() {
            var formId = this.getAttribute('id');
            if (typeof(formId) != 'string') {
                return true;
            }
            // continue to next element if prefix doesn't match
            if (formId.indexOf(options.prefix) !== 0) {
                return true;
            }
            // If we remove the prefix from the id and we still have
            // '_set-' in the string, this means that this div is for
            // of a nested form, not the current form.
            // For example, this condition would match if
            //     prefix = 'tocmainsection_set'
            //     formId = 'tocmainsection_set-0-tocarticle_set-3'
            if (formId.replace(options.prefix, '').indexOf('_set-') != -1) {
                return true;
            }
            var form = $(this);
            // callback
            options.onBeforeInit(form);
            // add options.formCssClass to all forms in the inline
            // except table/theader/add-item
            if (formId !== "") {
                form.not("." + options.emptyCssClass).not(".grp-table").not(".grp-thead").not(".add-item").addClass(options.formCssClass);
            }
            // add options.predeleteCssClass to forms with the delete checkbox checked
            if (form.hasClass('has_original')) {
                form.find("li.grp-delete-handler-container,li.delete-handler-container").find("input:checked").each(function() {
                    var parentForm = $(this).closest('div.module,div.grp-module');
                    if (parentForm.attr('id') != formId) {
                        return;
                    }
                    form.toggleClass(options.predeleteCssClass);
                });
            }
            // callback
            options.onAfterInit(form);
        });
        elem.trigger('djnesting:init');
    };
    
    initAddButtons = function(elem, options) {
        var totalForms = elem.find("#id_" + options.prefix + "-TOTAL_FORMS");
        var maxForms = elem.find("#id_" + options.prefix + "-MAX_NUM_FORMS");
        var addButtons = elem.find("a." + options.addCssClass);
        // hide add button in case we've hit the max, except we want to add infinitely
        if ((maxForms.val() !== '') && (maxForms.val()-totalForms.val()) <= 0) {
            hideAddButtons(elem, options);
        }
    };

    addButtonHandler = function(elem, options) {
        // This initializes the expando property, if it isn't already there
        var $element = (elem), expandoId;
        if ($element && $element.length) {
            $element.data();
            expandoId = $element[0][$.expando];
            // Check if we've seen this element before
            if (addButtonExpandoIds[expandoId]) {
                return;
            } else if (expandoId) {
                addButtonExpandoIds[expandoId] = 1;
            }
        }

        // Use original if not a nested model
        var $group = elem.closest('.group');

        var isNested = $group.hasClass('djnesting-stacked');

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
            var matches = options.emptyCssClass.match(/^grp\-(.+)$/);
            if (matches) {
                form.removeClass(matches[1]);
            } else {
                form.removeClass('grp-' + options.emptyCssClass);
            }
            if (isNested) {
                form.wrap('<div></div>')
                    .parent()
                    .insertBefore(empty_template.parent());
            } else {
                form.insertBefore(empty_template);
            }
            /* ====== End modified code ======= */

            // update form index
            var re = /__prefix__/;
            DJNesting.updateFormAttributes(form, re, index);
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
    
    removeButtonHandler = function(elem, options) {
        // This initializes the expando property, if it isn't already there
        var $element = (elem), expandoId;
        if ($element && $element.length) {
            $element.data();
            expandoId = $element[0][$.expando];
            // Check if we've seen this element before
            if (removeButtonExpandoIds[expandoId]) {
                return;
            } else if (expandoId) {
                removeButtonExpandoIds[expandoId] = 1;
            }
        }
        elem.bind("click", function() {
            var inline = elem.closest("div.group,.grp-group"),
                form = $(this).closest("." + options.formCssClass),
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
            // update form index (for all forms)
            if (!inline.hasClass('djnesting-stacked')) {
                var re = /-\d+-/g,
                    i = 0;
                inline.find("." + options.formCssClass).each(function() {
                    updateFormIndex($(this), options, re, "-" + i + "-");
                    i++;
                });
            }
            // callback
            options.onAfterRemoved(inline);
        });
    };

    deleteButtonHandler = function(elem, options) {
        // This initializes the expando property, if it isn't already there
        var $element = (elem), expandoId;
        if ($element && $element.length) {
            $element.data();
            expandoId = $element[0][$.expando];
            // Check if we've seen this element before
            if (deleteButtonExpandoIds[expandoId]) {
                return;
            } else if (expandoId) {
                deleteButtonExpandoIds[expandoId] = 1;
            }
        }

        elem.bind("click", function() {
            var deleteInput = $(this).prev(),
                inline = elem.closest("div.group,.grp-group"),
                form = $(this).parents("." + options.formCssClass).first();
            
            if (inline.closest('.predelete,.grp-predelete').length) {
                return;
            }
            
            // callback
            options.onBeforeDeleted(form);
            // toggle options.predeleteCssClass and toggle checkbox
            if (form.hasClass("has_original")) {
                form.toggleClass(options.predeleteCssClass);
                if (deleteInput.attr("checked")) {
                    deleteInput.removeAttr("checked");
                } else {
                    deleteInput.attr("checked", 'checked');
                }
            }
            // callback
            options.onAfterDeleted(form);
        });
    };
    
    hideAddButtons = function(elem, options) {
        var addButtons = elem.find("a." + options.addCssClass);
        addButtons.hide().parents('.grp-add-item').hide();
    };
    
    showAddButtons = function(elem, options) {
        var addButtons = elem.find("a." + options.addCssClass);
        addButtons.show().parents('.grp-add-item').show();
    };

    DJNesting.updateFormAttributes = function(elem, replace_regex, replace_with, selector) {
        if (!selector) {
            selector = ':input,span,table,iframe,label,a,ul,p,img,div.grp-module,div.module,div.group';
        }
        elem.find(selector).each(function() {
            var node = $(this),
                node_id = node.attr('id'),
                node_name = node.attr('name'),
                node_for = node.attr('for'),
                node_href = node.attr("href");
            if (node_id) { node.attr('id', node_id.replace(replace_regex, replace_with)); }
            if (node_name) { node.attr('name', node_name.replace(replace_regex, replace_with)); }
            if (node_for) { node.attr('for', node_for.replace(replace_regex, replace_with)); }
            if (node_href) { node.attr('href', node_href.replace(replace_regex, replace_with)); }
            if (node_id && node.is('.module,.grp-module')) {
                node.attr('id', node.attr('id').replace(/_set-(\d+)$/, '_set$1'));
            }
        });
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

    $.fn.nested_grp_inline = function(options) {
        var defaults = {
            prefix: "form",                         // The form prefix for your django formset
            addText: "add another",                 // Text for the add link
            deleteText: "remove",                   // Text for the delete link
            addCssClass: "grp-add-handler",             // CSS class applied to the add link
            removeCssClass: "grp-remove-handler",       // CSS class applied to the remove link
            deleteCssClass: "grp-delete-handler",       // CSS class applied to the delete link
            emptyCssClass: "empty-form",            // CSS class applied to the empty row
            formCssClass: "grp-dynamic-form",           // CSS class applied to each form in a formset
            predeleteCssClass: "grp-predelete",
            onBeforeInit: function(form) {},        // Function called before a form is initialized
            onBeforeAdded: function(inline) {},     // Function called before a form is added
            onBeforeRemoved: function(form) {},     // Function called before a form is removed
            onBeforeDeleted: function(form) {},     // Function called before a form is deleted
            onAfterInit: function(form) {},         // Function called after a form has been initialized
            onAfterAdded: function(form) {},        // Function called after a form has been added
            onAfterRemoved: function(inline) {},    // Function called after a form has been removed
            onAfterDeleted: function(form) {}       // Function called after a form has been deleted
        };
        options = $.extend(defaults, options);
        
        return this.each(function() {
            var inline = $(this); // the current inline node
            var totalForms = inline.find("#id_" + options.prefix + "-TOTAL_FORMS");
            // set autocomplete to off in order to prevent the browser from keeping the current value after reload
            totalForms.attr("autocomplete", "off");
            // init inline and add-buttons
            initInlineForms(inline, options);
            initAddButtons(inline, options);
            // button handlers
            addButtonHandler(inline.find("a." + options.addCssClass), options);
            removeButtonHandler(inline.find("a." + options.removeCssClass), options);
            deleteButtonHandler(inline.find("a." + options.deleteCssClass), options);
        });
    };

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);