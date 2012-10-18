(function($) {

    window.DJNesting = (typeof DJNesting == 'object') ? DJNesting : {};

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

    DJNesting.NestedInline = Class.extend({
        $group: null,      // The element with id '#{prefix}-group'
        $container: null,  // The child of $group matching selector "div.items".
                           // Contains all formsets.
        sortable: null,    // The ui.nestedSortable object
        prefix: null,      // Alias to opts.prefix, because it's used so frequently
        opts: {
            prefix: null,
            fieldNames: {
                position: null,
                isSortable: null,
                parentFk: null,
                pk: null
            },
            sortableFieldName: null,
            nestedFlagFieldName: null,
            nestedSortableFieldName: null,
            parentSortableFieldName: null,
            parentFkFieldName: null,
            pkFieldName: null
        },
        init: function(o) {
            $.extend(this.opts, o);
            this.prefix = this.opts.prefix;
            if (this.prefix.indexOf('-empty') != -1) {
                return;
            }
            if (DJNesting.NestedInline.instances[this.prefix]) {
                throw "DJNesting.NestedInline already created for " + this.prefix;
            }
            this.$group = $('#' + this.prefix + '-group');
            this.$container = $('#' + this.prefix + '-group > div.items');
            this.initSubArticleNesting();
            this.createSortable();
            this.bindSourceFieldHandlers();
            this.bindTitleChangeHandler();
            DJNesting.NestedInline.instances[this.prefix] = this;
        },
        bindTitleChangeHandler: function() {
            var prefix = this.prefix;
            $('#' + this.prefix + '-group > div.items').find('.inline-related').each(function(i, inline) {
                var $inline = $(inline);
                var index = parseInt($inline.attr('id').replace(prefix + '-', ''), 10);
                if (typeof index != 'number' || isNaN(index)) {
                    return;
                }
                var $articleId = $inline.filterDjangoField(prefix, 'article', index);
                var articleTitle = $articleId.nextAll('strong').html();
                if (articleTitle) {
                    var $handler = $inline.find('> h3.collapse-handler');
                    $handler.attr('data-article-title', articleTitle);
                }

                var $customTitle = $inline.filterDjangoField(prefix, 'custom_title', index);
                var onTitleChange = function(event) {
                    var target = event.target;
                    var customTitleVal = $(target).val();
                    if (customTitleVal) {
                        $handler.html(customTitleVal);
                    } else {
                        var articleTitle = $handler.data('articleTitle');
                        if (articleTitle) {
                            $handler.html($handler.data('articleTitle'));
                        } else {
                            $handler.html('Article');
                        }
                    }
                };
                $customTitle.bind('change', onTitleChange);
                $customTitle.bind('keyup', onTitleChange);
            });
        },
        bindSourceFieldHandlers: function() {
            var prefix = this.prefix;
            $('#' + this.prefix + '-group > div.items').find('.inline-related fieldset.module').each(function(i, fieldset) {
                var $fieldset = $(fieldset);
                var $source = $fieldset.find('.row.source').find('select');
                var $url = $fieldset.find('.row.url');
                var $articleId = $fieldset.find('.row.article');
                if ($source.val() === '') {
                    $url.hide();
                    $articleId.hide();
                } else if ($source.val() != 'url') {
                    $url.hide();
                } else {
                    $articleId.hide();
                }
                $source.bind('change', function() {
                    var index = this.id.substring(prefix.length+4, this.id.length-7);
                    $group = $('#' + this.prefix + '-group');
                    $url = $group.filterDjangoField(prefix, 'url', index).closest('.row');
                    $articleId = $group.filterDjangoField(prefix, 'article', index).closest('.row');
                    var $this = $(this);
                    if ($this.val() === '') {
                        $url.hide();
                        $articleId.hide();
                    } else if ($this.val() == 'url') {
                        $url.show();
                        $articleId.hide();
                    } else {
                        $url.hide();
                        $articleId.show();
                    }
                });
            });

        },
        /**
         * When the form loads, the TocArticle formset is flat. This wraps any
         * TocArticle with is_subarticle = True in a
         * '<div class="subarticle-wrapper nested-sortable-container"></div>'
         * and appends it to the <div class="nested-sortable-item"/> of its
         * parent article.
         */
        initSubArticleNesting: function() {
            // Depending on whether subarticles are hidden or checkboxes, the selector
            // could be input[value=True] or input:checked
            var $subarticleInputs = this.$group.find('.row.' + this.opts.fieldNames.isSubarticle)
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
        },
        updatePositions: function() {
            var position = 0;
            var prefix = this.prefix, fieldNames = this.opts.fieldNames;
            // Tracks whether the current/last element is marked for deletion
            var markedForDeletion = false;

            this.$group.find('.module.inline-related').each(function() {
                if (this.id && this.id.substr(-6) == '-empty') {
                    return true; // Same as continue
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
        },
        
        /**
         * Create ui.nestedSortable object
         */
        createSortable: function() {
            var self = this,
                prefix = this.prefix;
            this.sortable = $('#' + prefix + '-group > div.items').nestedSortable({
                handle: '> div > h3.collapse-handler',
                items: '.nested-sortable-item',
                forcePlaceholderSize: true,
                placeholder: 'nested-placeholder',
                helper: 'clone',
                opacity: 0.6,
                maxLevels: 0,
                createContainerElement: function(parent) {
                    var parentContainer = parent.parentNode.parentNode;
                    
                    console.log('parent = ', parent);
                    console.log('parentContainer = ', parentContainer);
                    var newContainer = document.createElement('DIV');
                    newContainer.setAttribute('class', 'nested-sortable-container');
                    // parentContainer.insertBefore(newContainer, parent.parentNode);
                    parent.appendChild(newContainer);
                    return newContainer;
                },
                containerElementSelector: '.nested-sortable-container',
                listItemSelector: '.nested-sortable-item',
            
                update: function(event, ui) {
                    self.updatePositions();
                }
            });
        },
        /**
         * Refresh sortable with new items
         */
         refresh: function() {
             if (!this.sortable) {
                 return;
             }
             this.updatePositions();
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
    // to DJNesting.NestedInline constructor on the same elements and
    // allow instance lookup.
    DJNesting.NestedInline.instances = {};

    window.dismissRelatedLookupPopup = function(win, chosenId, targetElement) {
        var name = windowname_to_id(win.name);
        var elem = document.getElementById(name);
        if (elem.className.indexOf('vManyToManyRawIdAdminField') != -1 && elem.value) {
            elem.value += ',' + chosenId;
        } else {
            document.getElementById(name).value = chosenId;
        }
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

    var lookup_urls = DJNesting.LOOKUP_URLS;

    DJNesting.register_formset = function(prefix) {
        if (prefix.substr(-6) == '-empty') {
            return;
        }
        // if (prefix.indexOf('-empty-tocarticle') != -1) {
        //     return;
        // }

        if (prefix.indexOf('-empty-') != -1) {
            return;
        }

        var $group = $('#' + prefix + '-group');
        var groupData = $group.data();

        var isNested = ($group.hasClass('djnesting-stacked-nested'));

        var lookup_fields = {
            related_fk:       groupData.lookupRelatedFk,
            related_m2m:      groupData.lookupRelatedM2m,
            related_generic:  groupData.lookupRelatedGeneric,
            autocomplete_fk:  groupData.lookupAutocompleteFk,
            autocomplete_m2m: groupData.lookupAutocompleteM2m,
            autocomplete_generic: groupData.lookupAutocompleteGeneric
        };

        var sortable_field_name = null;
        if (groupData.sortableFieldName) {
            sortable_field_name = groupData.sortableFieldName;
        }

        var initRelatedFields = function() {
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
        var initAutocompleteFields = function() {
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

        // This will be null if grappelli is not installed
        if (lookup_urls.related) {
            initRelatedFields();
            initAutocompleteFields();
        }

        var updateNestedFormIndex = function(form) {
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

        var reorderFields = function() {};

        if (sortable_field_name) {
            var regexp = new RegExp('^' + prefix + '-\\d+-' + sortable_field_name + '$');
            reorderFields = function() {
                var i = 0;
                $('#' + prefix + '-group').find('div.' + grpInlineOpts.formCssClass).each(function(n, form){
                    // Skip the element if it's marked to be deleted
                    var $form = $(form);
                    if ($form.hasClass('predelete')) {
                        return true;
                    }
                    $(form).find('input[name$="'+sortable_field_name+'"]').each(function(n, input) {
                        if (input.getAttribute("name").match(regexp)) {
                            input.setAttribute('value', i.toString());
                            i++;
                        }
                    });
                });
            };
        }

        $group.grp_inline($.extend(grpInlineOpts, {
            emptyCssClass: 'empty-form',
            predeleteCssClass: 'predelete',
            onAfterRemoved: function(inline) {
                inline.find('.' + grpInlineOpts.formCssClass).each(function() {
                    var id = (typeof(this.id) == 'string') ? this.id : '';
                    if (id && id.indexOf(prefix) != -1) {
                        if (id.replace(prefix, '').indexOf('_set-') == -1) {
                            updateNestedFormIndex($(this));
                        }
                    }
                });
                if (isNested) {
                    var inlineInstance;
                    try {
                        inlineInstance = DJNesting.NestedInline.instances[prefix];
                    } catch(e) {}
                    if (inlineInstance) {
                        inlineInstance.refresh();
                    }
                } else {
                    reorderFields();
                }
            },
            onAfterDeleted: function(form) {
                if (isNested) {
                    var inlineInstance;
                    try {
                        inlineInstance = DJNesting.NestedInline.instances[prefix];
                    } catch(e) {}
                    if (inlineInstance) {
                        inlineInstance.refresh();
                    }
                } else {
                    reorderFields();
                }
            },
            onAfterAdded: function(form) {
                updateNestedFormIndex(form);
                if (isNested) {
                    // Add nested-sortable-item class to parent div
                    form.parent().addClass('nested-sortable-item');
                    var inlineInstance;
                    try {
                        inlineInstance = DJNesting.NestedInline.instances[prefix];
                    } catch(e) {}
                    if (inlineInstance) {
                        inlineInstance.refresh();
                    }
                } else {
                    reorderFields();
                }
                // Initialize any nested formsets
                form.find('div.group').each(function(i, nestedGroup) {
                    var nestedGroupId = nestedGroup.getAttribute('id');
                    if (nestedGroupId.substr(-10) != '_set-group') {
                        return true; // Skip to next
                    }
                    // Extra check that it is nested (i.e. that there are
                    // two '_set-' strings in the id)
                    if (nestedGroupId.substr(0, nestedGroupId.length - 10).indexOf('_set-') == -1) {
                        return true;
                    }
                    var nestedGroupPrefix = nestedGroupId.substr(0, nestedGroupId.length-6);
                    var $nestedGroup = $(nestedGroup);
                    var nestedGroupData = $nestedGroup.data();
                    if (nestedGroupData.fieldNames) {
                        DJNesting.register_formset(nestedGroupPrefix);
                        new DJNesting.NestedInline({
                            prefix: nestedGroupPrefix,
                            fieldNames: nestedGroupData.fieldNames
                        });
                    }
                });
                grappelli.reinitDateTimeFields(form);
                grappelli.updateSelectFilter(form);
                initRelatedFields();
                initAutocompleteFields();
                form.grp_collapsible({
                    toggle_handler_slctr: ".collapse-handler:first",
                    closed_css: "closed grp-closed",
                    open_css: "open grp-open"
                });
                form.find(".collapse").grp_collapsible({
                    toggle_handler_slctr: ".collapse-handler:first",
                    closed_css: "closed grp-closed",
                    open_css: "open grp-open"
                });
                if (typeof $.fn.curated_content_type == 'function') {
                    form.find('.curated-content-type-select').each(function(index, element) {
                        $(element).curated_content_type();
                    });
                }
            }
        }));

        if (sortable_field_name) {
            $('#' + prefix + '-group').sortable({
                handle: '> ul.tools a.drag-handler',
                items: 'div.' + grpInlineOpts.formCssClass,
                axis: 'y',
                appendTo: 'body',
                forceHelperSize: true,
                placeholder: 'ui-sortable-placeholder',
                forcePlaceholderSize: true,
                containment: '#' + prefix + '-group > div.items',
                tolerance: 'pointer',
                start: function(evt, ui) {
                    ui.placeholder.height(ui.item.height() + 12);
                },
                update: function(event, ui) {
                    reorderFields();
                }
            });
        }
    };

    $(document).ready(function() {
        // Remove the border on any empty fieldsets
        $('fieldset.grp-module, fieldset.module').filter(function(i, element) {
            return element.childNodes.length == 0;
        }).css('border-width', '0');

        $('form').submit(function(e) {
            $.each(DJNesting.NestedInline.instances, function(i, inline) {
                inline.updatePositions();
            });
        });
    });

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);