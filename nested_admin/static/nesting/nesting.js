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
                inlineRegex = /^((?:.+_set|.+content_type.*))(?:(\-?\d+)|\-(\d+)\-(?!.*_set\d+)[^\-]+|\-group)$/,
                matches = [null, undefined, undefined],
                prefix, $form, $group, groupId, cacheKey, match, index;

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

            if (id && !prefix) {
                prefix = (id.match(/^(.*)\-group$/) || [null, null])[1];
            }

            // Handle cases where the related_name does not end with '_set'
            if (id && !prefix && $this.is('.module,.grp-module') && id.match(/\d+$/)) {
                matches = id.match(/(.*?\D)(\d+)$/) || [null, null, null];
                cacheKey = matches[0];
                prefix = matches[1];
                index = matches[2];
            }

            if (!prefix) {
                $form = $this.closest('.nested-inline-form');
                if ($form.length) {
                    matches = $form.attr('id').match(inlineRegex) || [null, null, null, null];
                    if (!matches[0]) {
                        matches = $form.attr('id').match(/(.*?\D)(\d+)$/) || [null, null, null, null];
                    }
                    cacheKey = matches[0];
                    prefix = matches[1];
                    index = (typeof(matches[2]) == 'string') ? matches[2] : matches[3];
                } else {
                    $group = $this.closest('.group,.grp-group');
                    if (!$group.length) {
                        return null;
                    }
                    groupId = $group.attr('id') || '';
                    prefix = (groupId.match(/^(.*)\-group$/) || [null, null])[1];
                }
            } else {
                if (prefix.substr(0, 3) == 'id_') {
                    prefix = prefix.substr(3);
                }

                if (!document.getElementById(prefix + '-group')) {
                    return null;
                }
            }
            if (cacheKey) {
                prefixCache[cacheKey] = [prefix, index];
            }

            return [prefix, index];
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

                $forms = $group.find('.nested-inline-form').filter(function() {
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
            selector = ':input,span,table,iframe,label,a,ul,p,img,div.grp-module,div.module,div.group';
        }
        elem.find(selector).add(elem).each(function() {
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

    var updatePositions = function(prefix) {
        var position = 0, parentPosition = 0, nestedPosition = 0, parentId = '',
            $group = $('#' + prefix + '-group'),
            fieldNames = $group.data('fieldNames'),
            formSearch = new RegExp('(' + regexQuote(prefix) + '\\-?)(\\d+)(\\-?)'),
            // The field name on the fieldset which is a ForeignKey to the parent model
            groupFkName = $group.data('formsetFkName'),
            parentPkVal, parentIdMatches = prefix.match(/^(.*_set)\-(\d+)-[^\-]+_set$/);

        // If this is a formset that uses sub-articles, and they have not yet
        // been initialized, return.
        if (fieldNames.isSubarticle && !$group.data('nestingInitComplete')) {
            return;
        }

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

        $group.find('.module.nested-inline-form').each(function() {
            if (!this.id || this.id.substr(-6) == '-empty') {
                return true; // Same as continue
            }
            var regex = new RegExp('^(?:id_)?' + regexQuote(prefix) + '\\d+$');

            if (!this.id.match(regex)) {
                return true;
            }
            // Cache jQuery object
            var $this = $(this),
                isSubarticle = $this.closest('.nested-sortable-container').hasClass('subarticle-wrapper'),
                prefixAndIndex = $this.djangoPrefixIndex() || [null, null],
                formPrefix = prefixAndIndex[0],
                index = prefixAndIndex[1];
            if (!formPrefix) {
                return;
            }

            // Skip the element if it's marked to be deleted
            if ($this.hasClass('predelete')) {
                // This means that an item that was marked delete because
                // it was a child of another element marked deleted, but
                // that it has been moved
                if ($this.hasClass('nested-delete') && (!isSubarticle || !markedForDeletion)) {
                    $this.removeClass('predelete nested-delete');
                    $this.filterDjangoField(formPrefix, 'DELETE').setDjangoBooleanInput(false);
                } else {
                    $this.filterDjangoField(formPrefix, fieldNames.position, index).val('0');
                    if (fieldNames.parentPosition) {
                        $this.filterDjangoField(formPrefix, fieldNames.parentPosition, index).val('0');
                    }
                    if (fieldNames.nestedPosition) {
                        $this.filterDjangoField(formPrefix, fieldNames.nestedPosition, index).val('0');
                    }
                    if (isSubarticle && !$this.parent().parent().closest('.nested-sortable-item').children('.nested-inline-form').hasClass('predelete')) {
                        markedForDeletion = false;
                    } else {
                        markedForDeletion = true;
                    }
                    return true;
                }
            }

            if (!isSubarticle || !markedForDeletion) {
                $this.filterDjangoField(formPrefix, fieldNames.position, index).val(position);
            }

            if (!isSubarticle && !markedForDeletion) {
                if (fieldNames.parentPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.parentPosition, index).val('0');
                }
                if (fieldNames.nestedPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.nestedPosition, index).val('0');
                }
            }
            if (isSubarticle) {
                if (markedForDeletion) {
                    $this.addClass('predelete nested-delete');
                    $this.filterDjangoField(formPrefix, 'DELETE', index).setDjangoBooleanInput(markedForDeletion);
                    $this.filterDjangoField(formPrefix, fieldNames.position, index).val('');
                    if (fieldNames.parentPosition) {
                        $this.filterDjangoField(formPrefix, fieldNames.parentPosition, index).val('0');
                    }
                    if (fieldNames.nestedPosition) {
                        $this.filterDjangoField(formPrefix, fieldNames.nestedPosition, index).val('0');
                    }
                    return true;
                }
                $this.filterDjangoField(formPrefix, fieldNames.isSubarticle, index).setDjangoBooleanInput(true);
                if (fieldNames.nestedPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.nestedPosition, index).val(nestedPosition);
                }
                if (fieldNames.parentPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.parentPosition, index).val('0');
                }
                if (fieldNames.parentFk) {
                    $this.filterDjangoField(formPrefix, fieldNames.parentFk, index).val(parentId);
                }
                nestedPosition++;
            } else {
                nestedPosition = 0;
                if (fieldNames.parentPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.parentPosition, index).val(parentPosition);
                }
                if (fieldNames.isSubarticle) {
                    $this.filterDjangoField(formPrefix, fieldNames.isSubarticle, index).setDjangoBooleanInput(false);
                }
                if (fieldNames.nestedPosition) {
                    $this.filterDjangoField(formPrefix, fieldNames.nestedPosition, index).val('0');
                }
                parentId = $this.filterDjangoField(formPrefix, fieldNames.pk, index).val();
                parentPosition++;
            }
            position++;
            markedForDeletion = false;
        });

    };

    var createContainerElement = function(parent) {
        var newContainer = document.createElement('DIV'),
            newItem = document.createElement('DIV'),
            emptyItem = document.createElement('DIV');
        newContainer.setAttribute('class', 'nested-sortable-container subarticle-wrapper');
        newItem.setAttribute('class', 'nested-sortable-item nested-do-not-drag');
        newItem.appendChild(emptyItem);
        newContainer.appendChild(newItem);
        return $(newContainer);
    }

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
        /**
         * Refresh sortable with new items
         */
         refresh: function(prefix) {
             if (!prefix) {
                 prefix = this.prefix;
             }
             updatePositions(prefix);
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
            var inputType = this.$group.find('.row.' + this.fieldNames.isSubarticle + ' input').first().prop('type');
            var inputSelector = ' .row.' + this.fieldNames.isSubarticle + ' input';
            var inputTrueSelector, inputFalseSelector;
            if (inputType == 'checkbox') {
                inputTrueSelector = inputSelector + ':checked';
                inputFalseSelector = inputSelector + ':not(:checked)';
            } else {
                inputTrueSelector = inputSelector + '[value="True"]';
                inputFalseSelector = inputSelector + '[value="False"]';
            }

            // var inputTrueSelector = inputSelector + ':checked, ' + inputSelector + '[value="True"]';
            // var inputFalseSelector = inputSelector + ':not(:checked), ' + inputSelector + '[value="False"]';
            var $subarticleInputs = this.$group.find('.row.' + this.fieldNames.isSubarticle)
                                                   .find('input[value="True"], input:checked');
            var $isSubarticleInputs = this.$group.find('.row.' + this.fieldNames.isSubarticle).find('input');

            var formsetPrefix = this.$group.djangoFormsetPrefix();

            $.each($isSubarticleInputs.get().reverse(), function(i, input) {
                var $input = $(input),
                    isSubarticle = ($input.val() == 'True' || $input.is(':checked')),
                    $subarticle = $input.closest('.nested-sortable-item'),
                    $subarticles = $subarticle.prevUntil('.nested-sortable-item:has(' + inputFalseSelector + ')', '.nested-sortable-item:has(' + inputTrueSelector + ')').andSelf(),
                    $parentArticles = $subarticle.first().prevAll('.nested-sortable-item:has(' + inputFalseSelector + ')'),
                    $parentArticle = $parentArticles.first(),
                    parentArticleFormId = $parentArticle.children('.nested-inline-form').attr('id'),
                    $subarticleWrapper, $subarticleItemUndraggable;

                if ($input.djangoFormsetPrefix() != formsetPrefix) {
                    return;
                }
                if ($subarticle.closest('.subarticle-wrapper').length) {
                    return;
                }
                if ($subarticle.parent().hasClass('.nested-sortable-container')) {
                    return;
                }
                if ($subarticle.find('.subarticle-wrapper').length) {
                    return;
                }
                $parentArticle = $subarticle.prev('.nested-sortable-item');
                // This should never happen (a sub-article without a parent before it)
                // but if it did, we'll say that the article is not in fact a sub-article
                if (isSubarticle && !$parentArticle.length) {
                    isSubarticle = false;
                }
                $subarticleWrapper = createContainerElement();
                // $subarticleItemUndraggable = $('<div class="nested-sortable-item nested-do-not-drag"><div/></div>');
                // $subarticleWrapper.prepend($subarticleItemUndraggable);

                if (isSubarticle) {
                    // var $allSubarticles = $subarticles.add($subarticle);
                    // $allSubarticles.wrapAll($subarticleWrapper)
                    // Move under the parent article
                    // $parentArticle.append($subarticles);
                    $parentArticle = $('#' + parentArticleFormId).parent();
                    $parentArticle[0].appendChild($subarticleWrapper[0]);
                    $subarticleWrapper = $parentArticle.children('.subarticle-wrapper').last();
                    $subarticles.each(function() {
                        $subarticleWrapper.append($(this));
                    });

                    // Wrap in a new container element
                    // $subarticles.wrapAll($subarticleWrapper);
                } else {
                    $subarticle.append($subarticleWrapper);
                }

            });

            this.$group.attr('data-nesting-init-complete', 'true');
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
                var oldFormsetPrefixRegex = new RegExp("^(id_)?" + regexQuote(oldFormPrefix));
                $form.attr('id', newFormsetPrefix + newIndex);
                updateFormAttributes($form, oldFormsetPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
            } else {
                break;
            }
        }

        var $form = $splicingForm;
        // Replace the ids for the splice form, then stop iterating
        var oldFormPrefix = oldFormId.replace(/_set(\d+)$/, '_set-$1');
        var oldFormsetPrefixRegex = new RegExp("^(id_)?" + regexQuote(oldFormPrefix));
        var newIndex = initialForms.length - 1;
        $form.attr('id', newFormsetPrefix + newIndex);
        updateFormAttributes($form, oldFormsetPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
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
                createContainerElement: createContainerElement,
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

                            var oldFormsetPrefixRegex = new RegExp("^(id_)?" + regexQuote(oldFormsetPrefix));
                            $form.add($nestedForms).each(function(i, newForm) {
                                var $newForm = $(newForm);
                                if ($newForm.data('isInitial')) {
                                    spliceInitialForm(oldFormsetPrefix, newFormsetPrefix, $newForm);
                                } else {
                                    updateFormAttributes($newForm.parent(), oldFormsetPrefixRegex, "$1" + newFormsetPrefix);
                                }
                            });
                        }
                        if (oldFormsetPrefix) {
                            updatePositions(oldFormsetPrefix);
                        }
                        if (newFormsetPrefix) {
                            updatePositions(newFormsetPrefix);
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
                    updatePositions($form.djangoFormsetPrefix());
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

        var $group = $('#' + prefix + '-group'),
            groupData = $group.data(),
            isNested = $group.hasClass('djnesting-stacked-nested');

        if (isNested) {
            new DJNesting.NestedInline($group);
        }

        DJNesting.initRelatedFields(prefix, groupData);
        DJNesting.initAutocompleteFields(prefix, groupData);

        $group.nested_grp_inline({
            prefix: prefix,
            removeCssClass: 'remove-handler.' + groupData.inlineModel,
            addCssClass: 'add-handler.' + groupData.inlineModel,
            deleteCssClass: 'delete-handler.' + groupData.inlineModel,
            formCssClass: 'dynamic-form-' + groupData.inlineModel,
            emptyCssClass: 'grp-empty-form',
            predeleteCssClass: 'predelete',
            onAfterRemoved: function(inline) {
                var formsetPrefix = inline.djangoFormsetPrefix(),
                    $group = $('#' + formsetPrefix + '-group'),
                    index = 0,
                    instance;

                inline.find('.' + this.formCssClass).each(function(i, form) {
                    var id = form.getAttribute('id'),
                        newFormId, $form;

                    if (id && id.replace(formsetPrefix, '').match(/^\d+$/)) {
                        // The formsetPrefix should be of the form:
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
                        newFormId = formsetPrefix + index.toString();
                        if (id != newFormId) {
                            $form = $(form);
                            $form.attr('id', newFormId);
                            updateNestedFormIndex($form, formsetPrefix);
                        }
                        index++;
                    }
                });

                if ($group.length) {
                    try {
                        instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                    } catch(e) {}
                    if (instance) {
                        instance.refresh(formsetPrefix);
                    } else {
                        updatePositions(formsetPrefix);
                    }
                }
            },
            onAfterDeleted: function(form) {
                var formsetPrefix = form.djangoFormsetPrefix(),
                    $group = $('#' + formsetPrefix + '-group'),
                    instance;

                if ($group.length) {
                    try {
                        instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                    } catch(e) {}
                    if (instance) {
                        instance.refresh(formsetPrefix);
                    } else {
                        updatePositions(formsetPrefix);
                    }
                }
            },
            onBeforeRemoved: function(form) {
                var $group = $('#' + form.djangoFormsetPrefix() + '-group'),
                    uniqueId = $group.data('nestedInlineUniqueId');

                if ($group.length && uniqueId) {
                    if (DJNesting.NestedAdmin.instances[uniqueId]) {
                        delete DJNesting.NestedAdmin.instances[uniqueId];
                    }
                    if (DJNesting.NestedAdmin.instances[uniqueId]) {
                        delete DJNesting.NestedAdmin.instances[uniqueId];
                    }
                }
            },
            onAfterAdded: function(form) {
                var formsetPrefix = form.djangoFormsetPrefix() || this.prefix; // Fallback
                var $group = $('#' + formsetPrefix + '-group');
                var instance;

                var $formParent = form.parent();
                var $subarticleWrapper = createContainerElement();

                updateNestedFormIndex(form, formsetPrefix);

                // Add nested-sortable-item class to parent div
                $formParent.addClass('nested-sortable-item');
                $formParent.append($subarticleWrapper);

                try {
                    instance = DJNesting.NestedAdmin.instances[$group.data('nestedInlineUniqueId')];
                } catch(e) {}
                if (instance) {
                    instance.refresh(formsetPrefix);
                } else {
                    updatePositions(formsetPrefix);
                }
                // Initialize any nested formsets
                form.find('div.group').each(function(i, nestedGroup) {
                    var $nestedGroup = $(nestedGroup),
                        nestedGroupId = $nestedGroup.attr('id');

                    if (nestedGroupId.substr(-10) != '_set-group') {
                        return true; // Skip to next
                    }
                    // Extra check that it is nested (i.e. that there are
                    // two '_set-' strings in the id)
                    if (nestedGroupId.substr(0, nestedGroupId.length - 10).indexOf('_set-') == -1) {
                        return true;
                    }

                    if ($nestedGroup.data('fieldNames')) {
                        DJNesting.register_formset($nestedGroup.djangoFormsetPrefix());
                        $nestedGroup.find('.nested-sortable-container').each(function(i, nestedContainer) {
                            var $nestedContainer = $(nestedContainer);
                            var groupId = $nestedContainer.closest('.djnesting-stacked').attr('id');
                            if (!groupId || groupId.indexOf('-empty') > -1 || groupId.indexOf('__prefix__') > -1) {
                                return;
                            }
                            $nestedContainer.trigger('djnesting:init');
                        });
                    }
                });
                grappelli.reinitDateTimeFields(form);
                grappelli.updateSelectFilter(form);
                DJNesting.initRelatedFields(formsetPrefix);
                DJNesting.initAutocompleteFields(formsetPrefix);
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
                $(document).trigger('djnesting:added', [$group]);
            }
        });
    };

    $(document).ready(function() {
        // Remove the border on any empty fieldsets
        $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
            return element.childNodes.length == 0;
        }).css('border-width', '0');

        // Set predelete class on any form elements with the DELETE input checked.
        // These can occur on forms rendered after a validation error.
        $('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest('.nested-inline-form').addClass('predelete');

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
                updatePositions(groupId.replace(/-group$/, ''));
            });
        });
        $('form').submit(function() {
            $('.djnesting-stacked').each(function() {
                updatePositions($(this).djangoFormsetPrefix());
            });
        });
    });


})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
