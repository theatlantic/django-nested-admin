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
            if (!elem.hasClass('djnesting-stacked')) {
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
                var re = new RegExp('^' + options.prefix + '-\\d+-', 'g'),
                    i = 0;
                inline.find("." + options.formCssClass).each(function() {
                    updateFormIndex($(this), options, re, options.prefix + "-" + i + "-");
                    i++;
                });
                /* ====== End modified code ======= */

                // callback
                options.onAfterRemoved(inline);
            });
        };
    }

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);