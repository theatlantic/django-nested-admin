(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

    var regexQuote = function(str) {
        return (str+'').replace(/([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g, "\\$1");
    };

    // Utility jQuery functions for nested inlines
    (function() {
        if (typeof($.fn.setDjangoBooleanInput) != 'function') {
            $.fn.setDjangoBooleanInput = function(boolVal) {
                var i, input;
                for (i = 0; i < this.length; i++) {
                    input = this[i];
                    if (input.nodeName != 'INPUT') {
                        continue;
                    }
                    if (input.type == 'hidden') {
                        input.value = (boolVal) ? 'True' : 'False';
                    } else if (input.type == 'checkbox') {
                        input.checked = boolVal;
                    }
                }
            };
        }

        var prefixCache = {};

        $.fn.djangoPrefixIndex = function() {
            var $this = (this.length > 1) ? this.first() : this;
            var id = $this.attr('id'),
                name = $this.attr('name'),
                forattr = $this.attr('for'),
                inlineRegex = /^(.+_set)(?:(\d+)|\-(\d+)\-(?!.*_set\d)[^\-]+|\-group)$/,
                matches = [null, undefined, undefined],
                prefix, $group, groupId, cacheKey, match;

            if ((match = prefixCache[id]) || (match = prefixCache[name]) || (match = prefixCache[forattr])) {
                return match;
            }

            if ((id && (matches = id.match(inlineRegex)))
              || (name && (matches = name.match(inlineRegex)))
              || (forattr && (matches = forattr.match(inlineRegex)))) {
                cacheKey = matches[0];
                prefix = matches[1];
                index = (typeof(matches[2]) == 'string') ? matches[2] : matches[3];
            }

            if (!prefix) {
                $group = $this.closest('.group,.grp-group');
                if (!$group.length) {
                    return null;
                }
                groupId = $group.attr('id') || '';
                prefix = (groupId.match(/^(.*_set)-group$/) || [null, null])[1];
            } else {
                if (prefix.substr(0, 3) == 'id_') {
                    prefix = prefix.substr(3);
                }

                if (!document.getElementById(prefix + '-group')) {
                    return null;
                }
            }

            prefixCache[cacheKey] = [prefix, index];
            return prefixCache[cacheKey];
        };

        $.fn.djangoFormPrefix = function() {
            var prefixIndex = this.djangoPrefixIndex();
            if (!prefixIndex || !prefixIndex[1]) {
                return null;
            }
            return prefixIndex[0] + '-' + prefixIndex[1] + '-';
        };

        $.fn.djangoFormsetPrefix = function() {
            var prefixIndex = this.djangoPrefixIndex();
            if (!prefixIndex) {
                return null;
            } else {
                return prefixIndex[0];
            }
        };

        var filterDjangoFormsetForms = function(form, $group, formsetPrefix) {
            var formId = form.getAttribute('id'),
                formIndex;

            // Check if form id matches /{prefix}\d+/
            if (formId.indexOf(formsetPrefix) !== 0) return false;

            var formIndex = formId.substr(formsetPrefix.length);

            return (!formIndex.match(/\D/));
        };

        // Selects all initial forms within the same formset as the
        // element the method is being called on.
        $.fn.djangoFormsetForms = function() {
            var forms = [];
            this.each(function() {
                var $this = $(this),
                    formsetPrefix = $this.djangoFormsetPrefix(),
                    $group = (formsetPrefix) ? $('#' + formsetPrefix + '-group') : null,
                    $forms;

                if (!formsetPrefix || !$group.length) return;

                $forms = $group.find('.inline-related').filter(function() {
                    return filterDjangoFormsetForms(this, $group, formsetPrefix);
                });

                Array.prototype.push.apply(forms, $forms.get());
            });
            return this.pushStack(forms);
        };

        if (typeof($.djangoFormField) != 'function') {
            $.djangoFormField = function(fieldName, prefix, index) {
                var $empty = $([]), matches;
                if (matches = prefix.match(/^(.+)\-(\d+)\-$/)) {
                    prefix = matches[1];
                    index = matches[2];
                }
                index = parseInt(index, 10);
                if (isNaN(index)) {
                    return $empty;
                }
                if (fieldName == 'pk' || fieldName == 'position') {
                    var $group = $('#' + prefix + '-group'),
                        fieldNameData = $group.data('fieldNames') || {};
                    fieldName = fieldNameData[fieldName];
                    if (!fieldName) { return $empty; }
                }
                return $('#id_' + prefix + '-' + index + '-' + fieldName);
            };
        }

        if (typeof($.fn.djangoFormField) != 'function') {
            /**
             * Given a django model's field name, and the forms index in the
             * formset, returns the field's input element, or an empty jQuery
             * object on failure.
             *
             * @param String fieldName - "pk", "position", or the field's
             *                           name in django (e.g. 'content_type',
             *                           'url', etc.)
             * @return jQuery object containing the field's input element, or
             *         an empty jQuery object on failure
             */
            $.fn.djangoFormField = function(fieldName, index) {
                var prefixAndIndex = this.djangoPrefixIndex();
                var $empty = $([]);
                if (!prefixAndIndex) {
                    return $empty;
                }
                var prefix = prefixAndIndex[0];
                if (typeof(index) == 'undefined') {
                    index = prefixAndIndex[1];
                    if (typeof(index) == 'undefined') {
                        return $empty;
                    }
                }
                return $.djangoFormField(fieldName, prefix, index);
            };
        }

        if (typeof($.fn.filterDjangoField) != 'function') {
            var djRegexCache = {};
            $.fn.filterDjangoField = function(prefix, fieldName, index) {
                if (typeof index != 'undefined') {
                    if (typeof index == 'string') {
                        index = parseInt(index, 10);
                    }
                    if (typeof index == 'number' && !isNaN(index)) {
                        var fieldId = 'id_' + prefix + '-' + index + '-' + fieldName;
                        return $('#' + fieldId);
                    }
                }
                if (typeof(djRegexCache[prefix]) != 'object') {
                    djRegexCache[prefix] = {};
                }
                if (typeof(djRegexCache[prefix][fieldName]) == 'undefined') {
                    djRegexCache[prefix][fieldName] = new RegExp('^' + prefix + '-\\d+-' + fieldName + '$');
                }
                return this.find('input[name$="'+fieldName+'"]').filter(function(index) {
                    return this.getAttribute("name").match(djRegexCache[prefix][fieldName]);
                });
            };
        }
    })();
    // End utility functions

    /**
     * Update attributes based on a regular expression
     */
    var updateFormAttributes = function(elem, replace_regex, replace_with, selector) {
        if (!selector) {
            selector = ':input,span,table,iframe,label,a,ul,p,img,div.grp-module,div.module';
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
            if (node.is('.module,.grp-module')) {
                node_id.replace(/_set-(\d+)$/, '_set$1');
            }
        });
    };

    var updatePositions = function(prefix) {
        var position = 0;
        if (!prefix) {
            prefix = this.prefix;
        }

        var $group = $('#' + prefix + '-group');
        var fieldNames = $group.data('fieldNames');

        var formSearch = new RegExp('(' + regexQuote(prefix) + '\\-?)(\\d+)(\\-)');

        // The field name on the fieldset which is a ForeignKey to the parent model
        var groupFkName = $group.data('formsetFkName');
        var parentPkVal;
        var parentIdMatches = prefix.match(/^(.*_set)\-(\d+)-[^\-]+_set$/);
        if (parentIdMatches) {
            var parentPrefix = parentIdMatches[1];
            var index = parentIdMatches[2];
            var $parentGroup = $('#' + parentPrefix + '-group');
            var parentFieldNames = $parentGroup.data('fieldNames');
            var parentPkFieldName = parentFieldNames.pk;
            var parentPkField = $parentGroup.filterDjangoField(parentPrefix, parentPkFieldName, index);
            parentPkVal = parentPkField.val();
        }

        var initialForms = [],
            newForms = [];

        $group.djangoFormsetForms().each(function() {
            var form = this;
            if (form.getAttribute('data-is-initial') == 'true') {
                initialForms.push(form);
            } else if (form.getAttribute('data-is-initial') == 'false') {
                newForms.push(form);
            }
        });

        var initialFormCount = initialForms.length;

        $(initialForms).each(function(i, form) {
            var $form = $(form),
                currentFormId = $form.attr('id'),
                newFormId = currentFormId.replace(/set(\d+)$/, 'set' + i.toString()),
                formReplace = '$1' + i.toString() + '$3';
            $form.attr('id', newFormId);
            updateFormAttributes($form, formSearch, formReplace);
            if (groupFkName && parentPkVal) {
                $group.filterDjangoField(prefix, groupFkName, i).val(parentPkVal);
            }
        });

        $(newForms).each(function(i, form) {
            i += initialFormCount;
            var $form = $(form),
                currentFormId = $form.attr('id'),
                newFormId = currentFormId.replace(/set(\d+)$/, 'set' + i.toString()),
                formReplace = '$1' + i.toString() + '$3';
            $form.attr('id', newFormId);
            updateFormAttributes($form, formSearch, formReplace);
            if (groupFkName && parentPkVal) {
                $group.filterDjangoField(prefix, groupFkName, i).val(parentPkVal);
            }
        });

        // Tracks whether the current/last element is marked for deletion
        var markedForDeletion = false;

        $group.find('.module.inline-related').each(function() {
            if (!this.id || this.id.substr(-6) == '-empty') {
                return true; // Same as continue
            }
            var regex = new RegExp('^(?:id_)?' + regexQuote(prefix) + '\\d+$');

            if (!this.id.match(regex)) {
                return true;
            }
            // Cache jQuery object
            var $this = $(this);
            // Skip the element if it's marked to be deleted
            if ($this.hasClass('predelete')) {
                // This means that an item that was marked delete because
                // it was a child of another element marked deleted, but
                // that it has been moved
                if ($this.hasClass('nested-delete') && !markedForDeletion) {
                    $this.removeClass('predelete nested-delete');
                    $this.filterDjangoField(prefix, 'DELETE').setDjangoBooleanInput(false);
                } else {
                    $this.filterDjangoField(prefix, fieldNames.position).val('');
                    markedForDeletion = true;
                    return true;
                }
            }

            if (!markedForDeletion) {
                $this.filterDjangoField(prefix, fieldNames.position).val(position);
            }
            markedForDeletion = false;
            position++;
        });

    };

    var reorderFields = function reorderFields(prefix) {
        var $group = $('#' + prefix + '-group');
        var sortableFieldName = $group.data('sortableFieldName');
        if (!$group.length || !sortableFieldName) { return; }
        var regexp = new RegExp('^' + prefix + '-\\d+-' + sortableFieldName + '$');
        var i = 0;
        $group.find('> div.items > div.nested-sortable-item').each(function(n, form){
            // Skip the element if it's marked to be deleted
            var $form = $(form);
            if ($form.hasClass('predelete')) {
                return true;
            }
            $form.find('input[name$="'+sortableFieldName+'"]').each(function(m, input) {
                if (input.getAttribute("name").match(regexp)) {
                    input.setAttribute('value', i.toString());
                    i++;
                }
            });
        });
    };

    DJNesting.NestedInline = Class.extend({
        $group: null,      // The element with id '#{prefix}-group'
        $container: null,  // The child of $group matching selector "div.items".
                           // Contains all formsets.
        sortable: null,    // The ui.nestedSortable object
        prefix: null,      // Prefix to $group
        fieldNames: {},
        opts: {
            fieldNames: {
                position: null,
                isSortable: null,
                parentFk: null,
                pk: null,
                nestedPosition: null,
                parentPosition: null
            }
        },
        uniqueId: null,
        init: function($group) {
            this.uniqueId = this.registerUniqueId($group);
            if (DJNesting.NestedInline.instances[this.uniqueId]) {
                return;
                // throw "DJNesting.NestedInline already created for " + this.prefix;
            }
            this.$group = $group;
            this.prefix = $group.djangoFormsetPrefix();
            if (!this.prefix || this.prefix.indexOf('-empty') != -1) {
                return;
            }
            this.fieldNames = $.extend({}, this.opts.fieldNames, $group.data().fieldNames || {});
            this.$container = this.$group.children('div.items');

            this.initSubArticleNesting();
            DJNesting.NestedInline.instances[this.uniqueId] = this;
        },
        registerUniqueId: function($group) {
            var uniqueId = $group.data('nestedInlineUniqueId');
            if (!uniqueId) {
                uniqueId = ("00000000000000" + Math.random().toString().replace('.', '')).substr(-14);
                $group.data('nestedInlineUniqueId', uniqueId);
            }
            return uniqueId;
        },
        /**
         * When the form loads, the formset is flat. This wraps any
         * inlines with is_subarticle = True in a
         * '<div class="subarticle-wrapper nested-sortable-container"></div>'
         * and appends it to the <div class="nested-sortable-item"/> of its
         * parent article.
         */
        initSubArticleNesting: function() {
            if (!this.fieldNames.isSubarticle) {
                return;
            }
            // Depending on whether subarticles are hidden or checkboxes, the selector
            // could be input[value=True] or input:checked
            var $subarticleInputs = this.$group.find('.row.' + this.fieldNames.isSubarticle)
                                                   .find('input[value=True], input:checked');
            $subarticleInputs.closest('.nested-sortable-item').each(function(i, subarticle) {
                var $subarticle = $(subarticle);
                if ($subarticle.parent().hasClass('.nested-sortable-container')) {
                    return;
                }
                var $parentArticle = $subarticle.prev('.nested-sortable-item');
                // This should never happen (a sub-article without a parent before it)
                // but if it did, we should bail.
                if (!$parentArticle.length) {
                    return;
                }
                // Move under the parent article
                $parentArticle[0].appendChild(subarticle);
                // Wrap in a new container element
                $subarticle.wrapAll('<div class="subarticle-wrapper nested-sortable-container" />');
            });
        }
    });

    var spliceInitialForm = function(oldFormsetPrefix, newFormsetPrefix, $splicingForm) {
        var newFormsetPrefixLen = newFormsetPrefix.length,
            $group = $('#' + newFormsetPrefix + '-group'),
            oldFormId = ($splicingForm) ? $splicingForm.attr('id') : undefined,
            forms = {},
            initialForms = [],
            newForms = [],
            index, totalFormCount;

        $group.find('.inline-related').each(function(i, form) {
            var formId = form.getAttribute('id'),
                formIndex = formId.substr(newFormsetPrefixLen),
                matches;
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
            var form = (formData) ? formData.form : undefined;
            var isInitial = (formData) ? formData.isInitial : undefined;
            if (!formData) {
                continue;
            }
            if (!formData.isInitial) {
                var $form = formData.form;
                var oldFormPrefix = $form.attr('id').replace(/_set(\d+)$/, '_set-$1');
                var oldFormsetPrefixRegex = new RegExp(regexQuote(oldFormPrefix));
                updateFormAttributes($form, oldFormsetPrefixRegex, newFormsetPrefix + "-" + newIndex);
                $form.attr('id', newFormsetPrefix + newIndex);
            } else {
                break;
            }
        }

        var $form = $splicingForm;
        // Replace the ids for the splice form, then stop iterating
        var oldFormPrefix = oldFormId.replace(/_set(\d+)$/, '_set-$1');
        var splicedFormOldIndex = parseInt(oldFormId.substr(oldFormsetPrefix), 10);
        var oldFormsetPrefixRegex = new RegExp(regexQuote(oldFormPrefix));
        var newIndex = initialForms.length - 1;
        updateFormAttributes($form, oldFormsetPrefixRegex, newFormsetPrefix + "-" + newIndex);
        $form.attr('id', newFormsetPrefix + newIndex);
    };

    DJNesting.NestedAdmin = DJNesting.NestedInline.extend({
        init: function($group) {
            this._super($group);
            if (DJNesting.NestedAdmin.instances[this.jquery]) {
                throw "DJNesting.NestedAdmin already created for " + this.prefix;
            }
            this.createSortable();
            DJNesting.NestedAdmin.instances[this.prefix] = this;
        },

        /**
         * NOTE: This is where most everything related to nested inlines takes place.
         * See jquery.ui.nestedSortable.js for reference.
         */
        createSortable: function() {
            this.sortable = this.$group.children('div.items').nestedSortable({
                handle: '> div > h3.djnesting-drag-handler',
                /**
                 * items: The selector for ONLY the items underneath a given
                 *        container at that level. Not to be confused with
                 *        listItemSelector, which is the selector for all list
                 *        items in the nestedSortable
                 */
                items: '> .nested-sortable-item',
                forcePlaceholderSize: true,
                placeholder: 'ui-sortable-placeholder',///nested-placeholder
                helper: 'clone',
                opacity: 0.6,
                maxLevels: 3,
                tolerance: 'pointer',
                axis: 'y',
                // maintainNestingLevel: not a standard ui.sortable parameter.
                // Prevents dragging items up or down levels
                maintainNestingLevel: true,
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
                createContainerElement: function(parent, insertType) {
                    var newContainer = document.createElement('DIV');
                    newContainer.setAttribute('class', 'nested-sortable-container');
                    return newContainer;
                },
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
                    var $this = $(this);
                    var $TOTAL_FORMS = $this.prevAll('input[name$="TOTAL_FORMS"]').first();
                    if ($TOTAL_FORMS.length) {
                        var previousTotalForms = parseInt($TOTAL_FORMS.val(), 10);
                        if (!isNaN(previousTotalForms) && previousTotalForms > 0) {
                            $TOTAL_FORMS.val(previousTotalForms - 1);
                        }
                    }
                    var $INITIAL_FORMS = $this.prevAll('input[name$="INITIAL_FORMS"]').first();
                    if ($INITIAL_FORMS.length) {
                        var previousInitialForms = parseInt($INITIAL_FORMS.val(), 10);
                        if (!isNaN(previousInitialForms) && previousInitialForms > 0) {
                            $INITIAL_FORMS.val(previousInitialForms - 1);
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
                 *     the new parent formset's prefix.
                 *
                 * @param event - A jQuery Event
                 * @param ui - An instance of the ui.nestedSortable widget
                 */
                receive: function(event, ui) {
                    var $form = ui.item.find('> .module'),
                        $this = $(this),
                        $TOTAL_FORMS = $this.prevAll('input[name$="TOTAL_FORMS"]').first(),
                        previousTotalFormCount = 0,
                        totalFormCount = 0,
                        previousInitialFormCount = 0,
                        initialFormCount = 0;

                    if ($TOTAL_FORMS.length) {
                        previousTotalFormCount = totalFormCount = parseInt($TOTAL_FORMS.val(), 10);
                        if (!isNaN(previousTotalFormCount)) {
                            totalFormCount++;
                            $TOTAL_FORMS.val(totalFormCount);
                        }
                    }

                    if ($TOTAL_FORMS.length && $form.length) {
                        $form = ($form.length == 1) ? $form : $form.first();
                        var oldFormsetPrefix = ($form.attr('id').match(/^(.+)\d+$/) || [null, null])[1];
                        var newFormsetPrefix = ($TOTAL_FORMS.attr('id').match(/^id_(.+)-TOTAL_FORMS$/) || [null, null])[1];
                        if (oldFormsetPrefix && newFormsetPrefix && oldFormsetPrefix != newFormsetPrefix) {
                            var $INITIAL_FORMS = $this.prevAll('input[name$="INITIAL_FORMS"]').first(),
                                isInitial = $form.data('isInitial');

                            if ($INITIAL_FORMS.length) {
                                previousInitialFormCount = initialFormCount = parseInt($INITIAL_FORMS.val(), 10);
                                if (isInitial && !isNaN(initialFormCount)) {
                                    initialFormCount++;
                                    $INITIAL_FORMS.val(initialFormCount);
                                }
                            }

                            if (isInitial) {
                                spliceInitialForm(oldFormsetPrefix, newFormsetPrefix, $form);
                            } else {
                                var oldFormsetPrefixRegex = new RegExp(regexQuote(oldFormsetPrefix));
                                updateFormAttributes(ui.item, oldFormsetPrefixRegex, newFormsetPrefix);
                            }
                        }
                        if (oldFormsetPrefix) {
                            updatePositions(oldFormsetPrefix);
                        }
                    }
                },
                update: function(event, ui) {
                    var $TOTAL_FORMS = $(this).prevAll('input[name$="TOTAL_FORMS"]').first();
                    if (!$TOTAL_FORMS.length) {
                        return;
                    }
                    var newPrefix = ($TOTAL_FORMS.attr('id').match(/^id_(.+)-TOTAL_FORMS$/) || [null, null])[1];
                    if (!newPrefix) { return; }
                    updatePositions(newPrefix);
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
                }
            });
        },
        /**
         * Refresh sortable with new items
         */
         refresh: function(prefix) {
             if (!prefix) {
                 prefix = this.prefix;
             }
             if (!this.sortable) {
                 return;
             }
             updatePositions(prefix);
             this.sortable.nestedSortable('refresh');
         },
         /**
          * Destroy sortable
          */
          destroy: function() {
              if (!this.sortable) {
                  return;
              }
              this.sortable.nestedSortable('destroy');
              this.sortable = undefined;
          }
    });

    // Static property, keyed on prefix. Used to prevent duplicate calls
    // to DJNesting.NestedAdmin constructor on the same elements and
    // allow instance lookup.
    DJNesting.NestedAdmin.instances = {};
    DJNesting.NestedInline.instances = {};

    // The function called by the popup window when the user clicks on a row's
    // link in the changelist for a foreignkey or generic foreign key lookup.
    window.dismissRelatedLookupPopup = function(win, chosenId, targetElement) {
        var name = windowname_to_id(win.name);
        var elem = document.getElementById(name);
        if (elem.className.indexOf('vManyToManyRawIdAdminField') != -1 && elem.value) {
            elem.value += ',' + chosenId;
        } else {
            elem.value = chosenId;
        }
        var $elem = $(elem);
        $elem.trigger('change');
        var title = (typeof targetElement == 'object') ? targetElement.innerHTML : null;
        win.close();
        if (title) {
            var $elem = $(elem);
            var $group = $elem.closest('.group');
            var $lookupButton = $elem.next('a.related-lookup');
            if (title && $lookupButton) {
                $lookupButton.next('strong').remove();
                $('<strong>' + title + '</strong>').insertAfter($lookupButton);
                // If this is a related on a nested inline
                if ($group && $group.length && group.hasClass('djnesting-stacked-nested')) {
                    var $inline = $elem.closest('.module.inline-related');
                    var $handler = $inline.find('> h3.collapse-handler');
                    var customTitle = $inline.find('input[name$="custom_title"]').val();
                    var newHandlerTitle = (customTitle) ? customTitle : title;
                    $handler.html(newHandlerTitle);
                    $handler.attr('data-article-title', title);
                }
            }
        }
        // GRAPPELLI CUSTOM: element focus
        elem.focus();
        win.close();
    };

    /**
     * Registers a formset with all handlers based on the form prefix.
     * All formsets' should be registered with this function (it currently
     * handles the case of formsets added after load via sortable-moves and
     * the "Add" links/buttons).
     */
    DJNesting.register_formset = function(prefix) {
        if (prefix.substr(-6) == '-empty') {
            return;
        }

        if (prefix.indexOf('-empty-') != -1) {
            return;
        }

        var $group = $('#' + prefix + '-group');
        var groupData = $group.data();

        var isNested = ($group.hasClass('djnesting-stacked-nested'));
        if (isNested) {
            new DJNesting.NestedInline($group);
        }

        DJNesting.initRelatedFields(prefix, groupData);
        DJNesting.initAutocompleteFields(prefix, groupData);

        // This function will update the position prefix for empty-form elements
        // in nested forms.
        var updateNestedFormIndex = function updateNestedFormIndex(form, prefix) {
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
                            newVal = beforeEmpty + index + afterEmpty.replace(index, '__prefix__');
                        elem.setAttribute(attr, newVal);
                    }
                });
            });
        };


        var grpInlineOpts = {
            prefix: prefix,
            removeCssClass: 'remove-handler.' + groupData.inlineModel,
            addCssClass: 'add-handler.' + groupData.inlineModel,
            deleteCssClass: 'delete-handler.' + groupData.inlineModel,
            formCssClass: 'dynamic-form-' + groupData.inlineModel
        };


        $group.grp_inline($.extend(grpInlineOpts, {
            emptyCssClass: 'empty-form',
            predeleteCssClass: 'predelete',
            onAfterRemoved: function(inline) {
                var inlinePrefix = inline.djangoFormsetPrefix();
                var index = 0;
                inline.find('.' + grpInlineOpts.formCssClass).each(function(i, form) {
                    var id = (typeof(form.id) == 'string') ? form.id : '';
                    if (id && id.replace(inlinePrefix, '').match(/^\d+$/)) {
                        // The inlinePrefix should be of the form:
                        //    'firstmodelname_set-0-secondmodelname_set'
                        // and the form id should be of the form:
                        //    'firstmodelname_set-0-secondmodelname_set1'
                        // where that '1' is the zero-indexed position of the
                        // inline form relative to its previous sibling forms.
                        //
                        // After an inline is removed, the id/name/for
                        // attributes need to have their indexes changed where
                        // appropriate. e.g. if the first form was deleted,
                        // (id=firstmodelname_set-0-secondmodelname_set0), then
                        // the second form (which would now be the first form)
                        // needs to take the id
                        // firstmodelname_set-0-secondmodelname_set0
                        // and its child elements need to use the prefix
                        // firstmodelname_set-0-secondmodelname_set-0
                        var newFormId = inlinePrefix + index.toString();
                        if (id != newFormId) {
                            var $form = $(form);
                            $form.attr('id', newFormId);
                            updateNestedFormIndex($form, inlinePrefix);
                        }
                        index++;
                    }
                });

                if (isNested) {
                    var instance,
                        inlinePrefix = inline.djangoFormsetPrefix(),
                        $group = $('#' + inlinePrefix + '-group');
                    try {
                        instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                    } catch(e) {}
                    if (instance) {
                        instance.refresh(inlinePrefix);
                    }
                }
            },
            onAfterDeleted: function(form) {
                var formPrefix = form.djangoFormsetPrefix();
                if (isNested) {
                    var instance, $group = $('#' + formPrefix + '-group');
                    try {
                        instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                    } catch(e) {}
                    if (instance) {
                        instance.refresh(formPrefix);
                    }
                } else {
                    reorderFields(formPrefix);
                }
            },
            onBeforeRemoved: function(form) {
                var formPrefix = form.djangoFormsetPrefix(),
                    $group = $('#' + formPrefix + '-group'),
                    uniqueId = $group.data('nestedInlineUniqueId');
                if ($group.length) {
                    if (DJNesting.NestedAdmin.instances[uniqueId]) {
                        delete DJNesting.NestedAdmin.instances[uniqueId];
                    }
                    if (DJNesting.NestedInline.instances[uniqueId]) {
                        delete DJNesting.NestedInline.instances[uniqueId];
                    }
                }
            },
            onAfterAdded: function(form) {
                var formPrefix = form.djangoFormsetPrefix();
                var $group = form.parent();
                if (formPrefix) {
                    updatePositions(formPrefix);
                }
                updateNestedFormIndex(form, formPrefix);
                var instance;
                if (isNested) {
                    // Add nested-sortable-item class to parent div
                    form.parent().addClass('nested-sortable-item');

                    var instance, $group = $('#' + formPrefix + '-group');
                    try {
                        instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                    } catch(e) {}
                }
                if (instance) {
                    instance.refresh(formPrefix);
                } else {
                    reorderFields(formPrefix);
                }
                // Initialize any nested formsets
                form.find('div.group').each(function(i, nestedGroup) {
                    var $nestedGroup = $(nestedGroup);
                    var nestedGroupId = $nestedGroup.attr('id');
                    if (nestedGroupId.substr(-10) != '_set-group') {
                        return true; // Skip to next
                    }
                    // Extra check that it is nested (i.e. that there are
                    // two '_set-' strings in the id)
                    if (nestedGroupId.substr(0, nestedGroupId.length - 10).indexOf('_set-') == -1) {
                        return true;
                    }
                    var nestedGroupPrefix = $nestedGroup.djangoFormsetPrefix();
                    if ($nestedGroup.data('fieldNames')) {
                        DJNesting.register_formset(nestedGroupPrefix);
                        // Initializing this event adds the divs to the existing
                        // nestedSortable object
                        $nestedGroup.find('> div.items').trigger('djnesting:init');
                    }
                });
                grappelli.reinitDateTimeFields(form);
                grappelli.updateSelectFilter(form);
                DJNesting.initRelatedFields(formPrefix);
                DJNesting.initAutocompleteFields(formPrefix);
                form.find(".collapse").andSelf().grp_collapsible({
                    toggle_handler_slctr: ".collapse-handler:first",
                    closed_css: "closed grp-closed",
                    open_css: "open grp-open"
                });
                if (typeof $.fn.curated_content_type == 'function') {
                    form.find('.curated-content-type-select').each(function(index, element) {
                        $(element).curated_content_type();
                    });
                }
                // Fire an event on the document so other javascript applications
                // can be alerted to the newly inserted inline
                $(document).trigger('djnesting:added', $group);
            }
        }));

    };

    $(document).ready(function() {
        // Remove the border on any empty fieldsets
        $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
            return element.childNodes.length == 0;
        }).css('border-width', '0');

        // Register the DJNesting.NestedAdmin on top level djnesting-stacked elements.
        // It will handle recursing down the nested inlines.
        $('.djnesting-stacked-root').each(function(i, rootGroup) {
            var $rootGroup = $(rootGroup);
            nestedAdmin = new DJNesting.NestedAdmin($rootGroup);
            $rootGroup.find('.djnesting-stacked').andSelf().each(function(i, group) {
                var groupId = group.getAttribute('id');
                if (!groupId || groupId.indexOf('-empty') > -1 || groupId.indexOf('__prefix__') > -1) {
                    return;
                }
                var prefix = groupId.replace(/-group$/, '');
                reorderFields(prefix);
            });
        });
    });

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);