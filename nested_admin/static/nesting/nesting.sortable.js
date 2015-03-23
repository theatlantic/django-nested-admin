(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

    var spliceForm = function(oldFormsetPrefix, newFormsetPrefix, $splicingForm) {
            var $inline = $('#' + newFormsetPrefix + '-group'),
            nestedFormset = $inline.nestedFormset(),
            index,
            initialFormCount = nestedFormset.mgmtVal('INITIAL_FORMS'),
            totalFormCount = nestedFormset.mgmtVal('TOTAL_FORMS'),
            $form, oldFormPrefixRegex, newIndex;

        if ($splicingForm.data('isInitial')) {
            for (index = totalFormCount - 1; index >= initialFormCount; index--) {
                $form = $('#' + newFormsetPrefix + index);
                newIndex = index + 1;
                oldFormPrefixRegex = new RegExp("^(id_)?"
                    + DJNesting.regexQuote(newFormsetPrefix + "-" + index));
                $form.attr('id', newFormsetPrefix + newIndex);
                DJNesting.updateFormAttributes($form, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
            }
        }

        // Replace the ids for the splice form
        oldFormPrefixRegex = new RegExp("^(id_)?"
            + DJNesting.regexQuote($splicingForm.attr('id').replace(/_set(\d+)$/, '_set-$1')));
        newIndex = ($splicingForm.data('isInitial')) ? initialFormCount : totalFormCount;
        $splicingForm.attr('id', newFormsetPrefix + newIndex);
        DJNesting.updateFormAttributes($splicingForm, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);

        if ($splicingForm.data('isInitial')) {
            nestedFormset.mgmtVal('INITIAL_FORMS', initialFormCount + 1);
        }
        nestedFormset.mgmtVal('TOTAL_FORMS', totalFormCount + 1);

        DJNesting.updatePositions(oldFormsetPrefix);
        DJNesting.updatePositions(newFormsetPrefix);
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
                    oldFormsetPrefix = $form.djangoFormsetPrefix(),
                    newFormsetPrefix = nestedFormset.prefix;

                spliceForm(oldFormsetPrefix, newFormsetPrefix, $form);
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
