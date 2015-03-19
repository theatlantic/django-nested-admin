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

        while (index >= 0) {
            index--;
            var newIndex = index, oldIndex = newIndex - 1;
            var formData = forms[newFormsetPrefix + oldIndex];
            if (!formData) {
                continue;
            }
            if (!formData.isInitial) {
                var $form = formData.form;
                var oldFormPrefix = $form.attr('id').replace(/_set(\d+)$/, '_set-$1');
                var oldFormsetPrefixRegex = new RegExp("^(id_)?" + DJNesting.regexQuote(oldFormPrefix));
                $form.attr('id', newFormsetPrefix + newIndex);
                DJNesting.updateFormAttributes($form, oldFormsetPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
            } else {
                break;
            }
        }

        var $form = $splicingForm;
        // Replace the ids for the splice form, then stop iterating
        var oldFormPrefix = oldFormId.replace(/_set(\d+)$/, '_set-$1');
        var oldFormsetPrefixRegex = new RegExp("^(id_)?" + DJNesting.regexQuote(oldFormPrefix));
        var newIndex = initialForms.length - 1;
        $form.attr('id', newFormsetPrefix + newIndex);
        DJNesting.updateFormAttributes($form, oldFormsetPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
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
            /**
             * The original jquery.ui.nestedSortable assumed that one
             * would only ever deal with <ol> and <li> elements in the
             * sortable, so when a list item was dragged under another item
             * and to the right, such that it needed to create a new list
             * nested one level deeper, it would simply perform
             *    document.createElement('ol')
             *
             * Since we're dealing with the django admin, we use
             * <div class="nested-sortable-container"> and
             * <div class="nested-sortable-item">
             * instead of <ol> and <li>, respectively.
             *
             * This method stands in place of the original plugin's hard-coded
             * document.createElement('ol');
             *
             * The parent element and the insert type (String, 'prepend' or
             * 'append') are passed to the method in case they are useful, but
             * for most purposes they can be ignored.
             */
            createContainerElement:  DJNesting.createContainerElement,
            // The selector for ALL list containers in the nested sortable.
            containerElementSelector: '.nested-sortable-container',
            // The selector for ALL list items in the nested sortable.
            listItemSelector: '.nested-sortable-item',
            nestedContainerSelector: '.subarticle-wrapper',
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
                var $this = $(this);
                var $container = $this.closest('.nested-sortable-container:not(.subarticle-wrapper)');
                var $form = ui.item.find('> .nested-inline-form'),
                    prefix = $form.djangoFormsetPrefix();

                var removedFormCounts = {
                    initial: ($form.data('isInitial')) ? 1 : 0,
                    total: 1
                };

                ui.item.find('.subarticle-wrapper').find('.nested-inline-form').each(function(i, form) {
                    var $nestedForm = $(form);
                    if ($nestedForm.djangoFormsetPrefix() != prefix) {
                        return;
                    }
                    if ($nestedForm.data('isInitial')) {
                        removedFormCounts['initial']++;
                    }
                    removedFormCounts['total']++;
                });

                var $TOTAL_FORMS = $container.prevAll('input[name$="TOTAL_FORMS"]').first();
                if ($TOTAL_FORMS.length) {
                    var previousTotalForms = parseInt($TOTAL_FORMS.val(), 10);
                    if (!isNaN(previousTotalForms)) {
                        $TOTAL_FORMS.val(Math.max(0, previousTotalForms - removedFormCounts['total']));
                    }
                }
                var $INITIAL_FORMS = $container.prevAll('input[name$="INITIAL_FORMS"]').first();
                if ($INITIAL_FORMS.length) {
                    var previousInitialForms = parseInt($INITIAL_FORMS.val(), 10);
                    if (!isNaN(previousInitialForms)) {
                        $INITIAL_FORMS.val(Math.max(0, previousInitialForms - removedFormCounts['initial']));
                    }
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
                var $form = ui.item.find('> .module'),
                    $this = $(this),
                    $container = $this.closest('.nested-sortable-container:not(.subarticle-wrapper)'),
                    $TOTAL_FORMS = $container.prevAll('input[name$="TOTAL_FORMS"]').first(),
                    $INITIAL_FORMS = $container.prevAll('input[name$="INITIAL_FORMS"]').first(),
                    previousTotalFormCount = 0,
                    previousInitialFormCount = 0,
                    prefix = $form.djangoFormsetPrefix();

                $form = ($form.length == 1) ? $form : $form.first();

                var oldFormsetPrefix = $form.djangoFormsetPrefix(),
                    newFormsetPrefix = (!$TOTAL_FORMS.length)
                                     ? oldFormsetPrefix
                                     : ($TOTAL_FORMS.attr('id').match(/^id_(.+)-TOTAL_FORMS$/) || [null, null])[1];

                var addedFormCounts = {
                    total: 1,
                    initial: ($form.data('isInitial')) ? 1 : 0
                };

                var $nestedForms = ui.item.find('.subarticle-wrapper').find('.nested-inline-form').filter(function(i, form) {
                    var $nestedForm = $(form);
                    if ($nestedForm.djangoFormsetPrefix() != prefix) {
                        return false;
                    }
                    if ($nestedForm.data('isInitial')) {
                        addedFormCounts['initial']++;
                    }
                    addedFormCounts['total']++;
                    return true;
                });

                if ($TOTAL_FORMS.length) {
                    previousTotalFormCount = parseInt($TOTAL_FORMS.val(), 10);
                    if (!isNaN(previousTotalFormCount)) {
                        $TOTAL_FORMS.val(previousTotalFormCount + addedFormCounts['total']);
                    }
                }

                if ($TOTAL_FORMS.length && $form.length) {
                    if (oldFormsetPrefix && newFormsetPrefix) {
                        if ($INITIAL_FORMS.length) {
                            previousInitialFormCount = parseInt($INITIAL_FORMS.val(), 10);
                            if (!isNaN(previousInitialFormCount)) {
                                $INITIAL_FORMS.val(previousInitialFormCount + addedFormCounts['initial']);
                            }
                        }

                        var oldFormsetPrefixRegex = new RegExp("^(id_)?" + DJNesting.regexQuote(oldFormsetPrefix));
                        $form.add($nestedForms).each(function(i, newForm) {
                            var $newForm = $(newForm);
                            if ($newForm.data('isInitial')) {
                                spliceInitialForm(oldFormsetPrefix, newFormsetPrefix, $newForm);
                            } else {
                                DJNesting.updateFormAttributes($newForm.parent(), oldFormsetPrefixRegex, "$1" + newFormsetPrefix);
                            }
                        });
                    }
                    if (oldFormsetPrefix) {
                        DJNesting.updatePositions(oldFormsetPrefix);
                    }
                    if (newFormsetPrefix) {
                        DJNesting.updatePositions(newFormsetPrefix);
                    }
                }
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
