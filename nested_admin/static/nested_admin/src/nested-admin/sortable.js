'use strict';

import $ from './django-jquery';
import regexQuote from './regexquote';
import './jquery.ui.nestedsortable';

export function updatePositions(prefix, skipDeleted) {
    var position = 0,
        $group = $('#' + prefix + '-group'),
        fieldNames = $group.data('fieldNames'),
        // The field name on the fieldset which is a ForeignKey to the parent model
        groupFkName = $group.data('formsetFkName'),
        parentPkVal, parentIdMatches = prefix.match(/^(.*)\-(\d+)-[^\-]+$/),
        $items = $group.find('> .djn-items, > .tabular > .module > .djn-items'),
        sortableOptions = $items.data('sortableOptions'),
        sortableExcludes = (sortableOptions || {}).sortableExcludes || [];

    sortableExcludes.push(groupFkName);

    if (parentIdMatches) {
        var parentPrefix = parentIdMatches[1];
        var index = parentIdMatches[2];
        var $parentGroup = $('#' + parentPrefix + '-group');
        var parentFieldNames = $parentGroup.data('fieldNames');
        var parentPkFieldName = parentFieldNames.pk;
        var parentPkField = $parentGroup.filterDjangoField(parentPrefix, parentPkFieldName, index);
        parentPkVal = parentPkField.val();
    }

    if (groupFkName && typeof(parentPkVal) != 'undefined') {
        $group.filterDjangoField(prefix, groupFkName).val(parentPkVal).trigger('change');
    }

    $group.find('.module.djn-inline-form').each(function() {
        if (!this.id || this.id.substr(-6) == '-empty') {
            return true; // Same as continue
        }
        var regex = new RegExp('^(?:id_)?' + regexQuote(prefix) + '\\d+$');

        if (!this.id.match(regex)) {
            return true;
        }
        // Cache jQuery object
        var $this = $(this),
            prefixAndIndex = $this.djangoPrefixIndex() || [null, null],
            formPrefix = prefixAndIndex[0],
            index = prefixAndIndex[1],
            namePrefix = formPrefix + '-' + index + '-';
        if (!formPrefix) {
            return;
        }

        var $fields = $this.djangoFormField('*'),
            $positionField,
            setPosition = false;

        // position is being updated if
        // a) the field has a value
        // b) if the field is not exluded with sortable_excludes (e.g. with default values)
        $fields.each(function() {
            var $field = $(this);
            if (!$field.is(':input[type!=radio][type!=checkbox],input:checked')) {
                return;
            }
            var hasValue = $field.val() || ($field.attr('type') == 'file' && $field.siblings('a').length),
                fieldName = $field.attr('name').substring(namePrefix.length);
            if (fieldName == fieldNames.position) {
                $positionField = $field;
            }
            if (hasValue && $.inArray(fieldName, sortableExcludes) === -1) {
                setPosition = true;
            }
        });

        if (!setPosition || !$positionField) {
            return;
        }

        // Skip the element if it's marked to be deleted
        if (skipDeleted && ($this.hasClass('predelete') || $this.hasClass('grp-predelete'))) {
            $positionField.val('0').trigger('change');
        } else {
            $positionField.val(position).trigger('change');
            position++;
        }
    });
}

export function createSortable($group) {
    return $group.find('> .djn-items, > .tabular > .module > .djn-items').nestedSortable({
        handle: [
            '> h3.djn-drag-handler',
            '> .tools .drag-handler',
            '> .djn-td > .tools .djn-drag-handler',
            '> .djn-tr > td.is-sortable > .djn-drag-handler',
            '> .djn-tr > td.grp-tools-container .djn-drag-handler'
        ].join(', '),
        /**
         * items: The selector for ONLY the items underneath a given
         *        container at that level. Not to be confused with
         *        listItemSelector, which is the selector for all list
         *        items in the nestedSortable
         */
        items: '> .djn-item',
        forcePlaceholderSize: true,
        placeholder: {
            element: function($currentItem) {
                var el = $(document.createElement($currentItem[0].nodeName))
                    .addClass($currentItem[0].className + ' ui-sortable-placeholder')
                    .removeClass('ui-sortable-helper')[0];

                if ($currentItem.is('tbody')) {
                    var $tr = $('<tr></tr>');
                    var $originalTr = $currentItem.children('tr').eq(0);
                    $tr.addClass($originalTr.attr('class'));
                    $originalTr.children('td').each(function(i, td) {
                        $tr.append($('<td></td>').addClass($(td).attr('class')));
                    });
                    el.appendChild($tr[0]);
                }

                return el;
            },
            update: function(instance, $placeholder) {
                var $currItem = instance.currentItem;
                var opts = instance.options;
                // 1. If a className is set as 'placeholder option, we
                //    don't force sizes - the class is responsible for that
                // 2. The option 'forcePlaceholderSize can be enabled to
                //    force it even if a class name is specified
                if (opts.className && !opts.forcePlaceholderSize) return;

                if ($placeholder.is('tbody')) {
                    $placeholder = $placeholder.children('tr').eq(0).children('td').eq(1);
                }

                // If the element doesn't have a actual height by itself
                // (without styles coming from a stylesheet), it receives
                // the inline height from the dragged item
                if (!$placeholder.height()) {
                    var innerHeight = $currItem.innerHeight(),
                        paddingTop = parseInt($currItem.css('paddingTop') || 0, 10),
                        paddingBottom = parseInt($currItem.css('paddingBottom') || 0, 10);
                    $placeholder.height(innerHeight - paddingTop - paddingBottom);
                }
                if (!$placeholder.width()) {
                    var innerWidth = $currItem.innerWidth(),
                        paddingLeft = parseInt($currItem.css('paddingLeft') || 0, 10),
                        paddingRight = parseInt($currItem.css('paddingRight') || 0, 10);
                    $placeholder.width(innerWidth - paddingLeft - paddingRight);
                }
            }
        },
        helper: 'clone',
        opacity: 0.6,
        maxLevels: 3,
        connectWith: '.djn-items',
        tolerance: 'intersection',
        // Don't allow dragging beneath an inline that is marked for deletion
        isAllowed: function(currentItem, parentItem) {
            if (parentItem && parentItem.hasClass('predelete')) {
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
            var $inline = $(this).closest('.djn-group'); // $form = ui.item.find('> .module').first(),
            $inline.djangoFormset().spliceInto(ui.item);
            updatePositions(ui.item.djangoFormsetPrefix());
        },
        update: function(event, ui) {
            // Ensure that <div class='djn-item djn-no-drag'/>
            // is the first child of the djn-items. If there
            // is another <div class='djn-item'/> before the
            // .do-not-drag element then the drag-and-drop placeholder
            // margins don't work correctly.
            var $nextItem = ui.item.nextAll('.djn-item').first();
            if ($nextItem.is('.djn-no-drag,.djn-thead')) {
                var nextItem = $nextItem[0];
                var parent = nextItem.parentNode;
                parent.insertBefore(nextItem, parent.firstChild);
            }
            var groupId = $(event.target).closest('.djn-group').attr('id'),
                $form = ui.item,
                $parentGroup = $form.closest('#' + groupId);
            if ($form.data('updateOperation') == 'removed') {
                $form.removeAttr('data-update-operation');
            } else if (!$parentGroup.length) {
                $form.attr('data-update-operation', 'removed');
            }
            updatePositions($form.djangoFormsetPrefix());
            $(document).trigger('djnesting:mutate', [$('#' + $form.djangoFormsetPrefix() + '-group')]);
        }
    });
}
