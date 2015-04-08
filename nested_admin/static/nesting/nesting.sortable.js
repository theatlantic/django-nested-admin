(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

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
            start: function(event, ui) {
                ui.item.addClass('nested-sortable-item-dragging');
                ui.item.show();
            },
            stop: function(event, ui) {
                ui.item.removeClass('nested-sortable-item-dragging');
            },
            /**
             * Triggered when a sortable is dropped into a container
             */
            receive: function(event, ui) {
                var $form = ui.item.find('> .module').first(),
                    $inline = $(this).closest('.djnesting-stacked');
                $inline.djangoFormset().spliceInto($form);
                DJNesting.updatePositions($form.djangoFormsetPrefix());
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
                } else if (!$parentGroup.length) {
                    $form.attr('data-update-operation', 'removed');
                }
                DJNesting.updatePositions($form.djangoFormsetPrefix());
                $(document).trigger('djnesting:mutate', [$('#' + $form.djangoFormsetPrefix() + '-group')]);
            }
        });
    };

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
