(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

    var spliceInitialForm = function(oldFormsetPrefix, newFormsetPrefix, $splicingForm) {
        var newFormsetPrefixLen = newFormsetPrefix.length,
            $group = $('#' + newFormsetPrefix + '-group'),
            oldFormId = ($splicingForm) ? $splicingForm.attr('id') : undefined,
            forms = {},
            initialForms = [],
            newForms = [],
            index, totalFormCount;

        $group.find('.nested-inline-form').each(function(i, form) {
            var formId = form.getAttribute('id'),
                formIndex = formId.substr(newFormsetPrefixLen);
            if (formId == oldFormId) {
                return;
            }
            if (formId.indexOf(newFormsetPrefix) === 0 && !formIndex.match(/\D/)) {
                var $form = $(form),
                    isInitial = $form.data('isInitial');
                formIndex = parseInt(formIndex, 10);
                forms[formId] = {
                    form: $form,
                    isInitial: isInitial,
                    index: formIndex
                };
                if (isInitial) {
                    initialForms.push($form);
                } else {
                    newForms.push($form);
                }
            }
        });
        initialForms.push($splicingForm);

        index = totalFormCount = initialForms.length + newForms.length;

        var $form, oldFormPrefixRegex, newIndex;

        while (index >= 0) {
            index--;
            newIndex = index;
            var oldIndex = newIndex - 1;
            var formData = forms[newFormsetPrefix + oldIndex];
            if (!formData) {
                continue;
            }
            if (!formData.isInitial) {
                $form = formData.form;
                oldFormPrefixRegex = new RegExp("^(id_)?"
                    + DJNesting.regexQuote($form.attr('id').replace(/_set(\d+)$/, '_set-$1')));
                $form.attr('id', newFormsetPrefix + newIndex);
                DJNesting.updateFormAttributes($form, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
            } else {
                break;
            }
        }

        $form = $splicingForm;
        // Replace the ids for the splice form, then stop iterating
        oldFormPrefixRegex = new RegExp("^(id_)?"
            + DJNesting.regexQuote($form.attr('id').replace(/_set(\d+)$/, '_set-$1')));
        newIndex = initialForms.length - 1;
        $form.attr('id', newFormsetPrefix + newIndex);
        DJNesting.updateFormAttributes($form, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
    };

    DJNesting.createSortable = function($group) {
        return $group.children('div.items').nestedSortable({
            handle: '> div > h3.djnesting-drag-handler',
            /**
             * items: The selector for ONLY the items underneath a given
             *        container at that level. Not to be confused with
             *        listItemSelector, which is the selector for all list
             *        items in the nestedSortable
             */
            items: '> .nested-sortable-item',
            forcePlaceholderSize: true,
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            opacity: 0.6,
            maxLevels: 3,
            connectWith: '.djnesting-stacked-root > div.items',
            tolerance: 'intersection',
            cursorAt: {left: 5},
            // Don't allow dragging beneath an inline that is marked for deletion
            isAllowed: function(currentItem, parentItem, placeholder) {
                if (parentItem && parentItem.children('.nested-inline-form').hasClass('predelete')) {
                    return false;
                }
                return true;
            },
            // fixedNestingDepth: not a standard ui.sortable parameter.
            // Prevents dragging items up or down levels
            fixedNestingDepth: true,
            // The selector for ALL list containers in the nested sortable.
            containerElementSelector: '.nested-sortable-container',
            // The selector for ALL list items in the nested sortable.
            listItemSelector: '.nested-sortable-item',
            /**
             * Triggered when a sortable is removed from a container (to be
             * dropped in another; before 'receive' is triggered)
             *
             * This method decrements the TOTAL_FORMS input in the formset
             * from which the form is being removed.
             *
             * @param event - A jQuery Event
             * @param ui - An instance of the ui.nestedSortable widget
             */
            remove: function(event, ui) {
                var $inline = $(this).closest('.djnesting-stacked'),
                    $form = ui.item.find('> .nested-inline-form'),
                    nestedFormset = $inline.nestedFormset(),
                    previousTotalFormCount = nestedFormset.mgmtVal('TOTAL_FORMS'),
                    previousInitialFormCount = nestedFormset.mgmtVal('INITIAL_FORMS');

                nestedFormset.mgmtVal('TOTAL_FORMS', previousTotalFormCount - 1);
                if ($form.data('isInitial')) {
                    nestedFormset.mgmtVal('INITIAL_FORMS', previousInitialFormCount - 1);
                }
            },
            start: function(event, ui) {
                ui.item.addClass('nested-sortable-item-dragging');
                ui.item.show();
            },
            stop: function(event, ui) {
                ui.item.removeClass('nested-sortable-item-dragging');
            },
            /**
             * Triggered when a sortable is dropped into a container
             *
             * This method:
             *   - increments the TOTAL_FORMS input in the formset to
             *     which the form is being added
             *   - updates the position field in both the formset the
             *     sortable was removed from and the formset it has
             *     been added to
             *   - Updates "id", "name", and "for" attributes to match
             *     the new parent formset's prefix and the old parent
             *     formset's prefix.
             *
             * @param event - A jQuery Event
             * @param ui - An instance of the ui.nestedSortable widget
             */
            receive: function(event, ui) {
                var $form = ui.item.find('> .module').first(),
                    $inline = $(this).closest('.djnesting-stacked'),
                    nestedFormset = $inline.nestedFormset(),
                    previousTotalFormCount = nestedFormset.mgmtVal('TOTAL_FORMS'),
                    previousInitialFormCount = nestedFormset.mgmtVal('INITIAL_FORMS'),
                    oldFormsetPrefix = $form.djangoFormsetPrefix(),
                    newFormsetPrefix = nestedFormset.prefix;

                nestedFormset.mgmtVal('TOTAL_FORMS', previousTotalFormCount + 1);

                if ($form.data('isInitial')) {
                    nestedFormset.mgmtVal('INITIAL_FORMS', previousInitialFormCount + 1);
                    spliceInitialForm(oldFormsetPrefix, newFormsetPrefix, $form);
                } else {
                    var oldFormPrefixRegex = new RegExp("^(id_)?"
                        + DJNesting.regexQuote($form.djangoFormPrefix()));
                    var newFormPrefix = newFormsetPrefix + '-' + previousTotalFormCount + "-";
                    $form.attr('id', newFormsetPrefix + previousTotalFormCount);
                    DJNesting.updateFormAttributes($form.parent(), oldFormPrefixRegex, "$1" + newFormPrefix);
                }
                DJNesting.updatePositions(oldFormsetPrefix);
                DJNesting.updatePositions(newFormsetPrefix);
            },
            update: function(event, ui) {
                // Ensure that <div class="nested-sortable-item nested-do-not-drag"/>
                // is the first child of the nested-sortable-container. If there
                // is another <div class="nested-sortable-item"/> before the
                // .do-not-drag element then the drag-and-drop placeholder
                // margins don't work correctly.
                var $nextItem = ui.item.nextAll('.nested-sortable-item').first();
                if ($nextItem.hasClass('nested-do-not-drag')) {
                    var nextItem = $nextItem[0];
                    var parent = nextItem.parentNode;
                    parent.insertBefore(nextItem, parent.firstChild);
                }
                var groupId = $(event.target).parent().attr('id'),
                    $form = ui.item.children('.module'),
                    $parentGroup = $form.closest('#' + groupId);
                if ($form.data('updateOperation') == 'removed') {
                    $form.removeAttr('data-update-operation');
                    return;
                }
                if (!$parentGroup.length) {
                    $form.attr('data-update-operation', 'removed');
                    return;
                }
                DJNesting.updatePositions($form.djangoFormsetPrefix());
            }
        });
    };

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
