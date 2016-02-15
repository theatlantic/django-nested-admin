(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

    DJNesting.createSortable = function($group) {
        return $group.children('.djn-items').nestedSortable({
            handle: '> div > h3.djn-drag-handler, > div > .tools .drag-handler',
            /**
             * items: The selector for ONLY the items underneath a given
             *        container at that level. Not to be confused with
             *        listItemSelector, which is the selector for all list
             *        items in the nestedSortable
             */
            items: '> .djn-item',
            forcePlaceholderSize: true,
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            opacity: 0.6,
            maxLevels: 3,
            connectWith: '.djn-group-root > .djn-items',
            tolerance: 'intersection',
            cursorAt: {left: 5},
            // Don't allow dragging beneath an inline that is marked for deletion
            isAllowed: function(currentItem, parentItem, placeholder) {
                if (parentItem && parentItem.children('.djn-inline-form').hasClass('predelete')) {
                    return false;
                }
                return true;
            },
            // fixedNestingDepth: not a standard ui.sortable parameter.
            // Prevents dragging items up or down levels
            fixedNestingDepth: true,
            // The selector for ALL list containers in the nested sortable.
            containerElementSelector: '.djn-items',
            // The selector for ALL list items in the nested sortable.
            listItemSelector: '.djn-item',
            start: function(event, ui) {
                ui.item.addClass('djn-item-dragging');
                ui.item.show();
            },
            stop: function(event, ui) {
                ui.item.removeClass('djn-item-dragging');
            },
            /**
             * Triggered when a sortable is dropped into a container
             */
            receive: function(event, ui) {
                var $form = ui.item.find('> .module').first(),
                    $inline = $(this).closest('.djn-group');
                $inline.djangoFormset().spliceInto($form);
                DJNesting.updatePositions($form.djangoFormsetPrefix());
            },
            update: function(event, ui) {
                // Ensure that <div class="djn-item djn-no-drag"/>
                // is the first child of the djn-items. If there
                // is another <div class="djn-item"/> before the
                // .do-not-drag element then the drag-and-drop placeholder
                // margins don't work correctly.
                var $nextItem = ui.item.nextAll('.djn-item').first();
                if ($nextItem.hasClass('djn-no-drag')) {
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
