(function($) {

    var pluginName = "djangoFormset";

    var DjangoFormset = Class.extend({
        opts: {
            emptyClass: 'empty-form grp-empty-form',
            predeleteClass: 'grp-predelete'
        },
        init: function(inline) {
            this.$inline = $(inline);
            this.prefix = this.$inline.djangoFormsetPrefix();
            this._$totalForms = this.$inline.find('#id_' + this.prefix + '-TOTAL_FORMS');
            this._$totalForms.attr('autocomplete', 'off');
            this._$template = $('#' + this.prefix + '-empty');

            var inlineModelClassName = this.$inline.data('inlineModel');

            this.opts = $.extend({}, this.opts, {
                addButtonSelector: '.add-handler.' + inlineModelClassName,
                removeButtonSelector: '.remove-handler.' + inlineModelClassName,
                deleteButtonSelector: '.delete-handler.' + inlineModelClassName,
                formClass: 'dynamic-form-' + inlineModelClassName
            });

            DJNesting.initRelatedFields(this.prefix, this.$inline.data());
            DJNesting.initAutocompleteFields(this.prefix, this.$inline.data());

            this._bindEvents();

            this._initializeForms();

            this.$inline.find('.nested-sortable-container:not([id*="-empty"])').trigger('djnesting:init');

            // initialize nested formsets
            this.$inline.find('.group[id$="-group"][id^="' + this.prefix + '"][data-field-names]:not([id*="-empty"])').each(function() {
                $(this)[pluginName]();
            });

            if (this.$inline.is('.djnesting-stacked-root')) {
                DJNesting.createSortable(this.$inline);
            }

            $(document).trigger('djnesting:initialized', [this.$inline, this]);
        },
        _initializeForms: function() {
            var totalForms = this.mgmtVal('TOTAL_FORMS');
            for (var i = 0; i < totalForms; i++) {
                this._initializeForm('#' + this.prefix + i);
            }
        },
        _initializeForm: function(form) {
            var $form = $(form);
            var formPrefix = $form.djangoFormPrefix();
            $form.addClass(this.opts.formClass);
            if ($form.hasClass('has_original')) {
                $('#id_' + formPrefix + 'DELETE:checked').toggleClass(this.opts.predeleteClass);
            }
        },
        _bindEvents: function($el) {
            var self = this;
            if (typeof $el == 'undefined') {
                $el = this.$inline;
            }
            $el.find(this.opts.addButtonSelector).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                self.add();
            });
            $el.find(this.opts.removeButtonSelector).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $form = $(this).closest('.' + self.opts.formClass);
                self.remove($form);
            });
            $el.find(this.opts.deleteButtonSelector).click(function(e) {
                e.preventDefault();
                e.stopPropagation();
                var $form = $(this).closest('.' + self.opts.formClass);
                var $deleteInput = $('#id_' + $form.djangoFormPrefix() + 'DELETE');
                if (!$deleteInput.is(':checked')) {
                    self['delete']($form);
                } else {
                    self.undelete($form);
                }
            });
        },
        remove: function(form) {
            var $form = $(form);
            var totalForms = this.mgmtVal('TOTAL_FORMS');
            var maxForms = this.mgmtVal('MAX_NUM_FORMS') || Infinity;
            var index = $form.djangoFormIndex();
            var isInitial = $form.data('isInitial');

            $form.parent().remove();

            this.mgmtVal('TOTAL_FORMS', totalForms - 1);

            if (maxForms - totalForms >= 0) {
                this.$inline.find(this.opts.addButtonSelector).parents('.grp-add-item').show();
            }

            this._fillGap(index, isInitial);

            DJNesting.updatePositions(this.prefix);
            $(document).trigger('djnesting:mutate', [this.$formset]);
        },
        "delete": function(form) {
            var self = this,
                $form = $(form),
                formPrefix = $form.djangoFormPrefix(),
                $deleteInput = $('#id_' + formPrefix + 'DELETE');

            if ($form.hasClass(this.opts.predeleteClass)) {
                return;
            }

            if (!$form.data('isInitial')) {
                return;
            }
            $deleteInput.attr('checked', 'checked');
            $form.addClass(this.opts.predeleteClass);

            $form.find('.djnesting-stacked').each(function() {
                var $childInline = $(this);
                var childFormset = $childInline.djangoFormset();
                $childInline.djangoFormsetForms().each(function() {
                    if ($(this).hasClass(self.opts.predeleteClass)) {
                        $(this).data('alreadyDeleted', true);
                    } else {
                        childFormset.delete(this);
                    }
                });
            });
            DJNesting.updatePositions(this.prefix);
            $(document).trigger('djnesting:mutate', [this.$formset]);
        },
        undelete: function(form) {
            var $form = $(form),
                formPrefix = $form.djangoFormPrefix(),
                $deleteInput = $('#id_' + formPrefix + 'DELETE');

            if ($form.parent().closest('.' + this.opts.predeleteClass).length) {
                return;
            }
            if ($form.hasClass('has_original')) {
                $deleteInput.removeAttr('checked');
                $form.removeClass(this.opts.predeleteClass);
            }
            $form.data('alreadyDeleted', false);
            $form.find('.djnesting-stacked').each(function() {
                var $childInline = $(this);
                var childFormset = $childInline.djangoFormset();
                $childInline.djangoFormsetForms().each(function() {
                    if ($(this).data('alreadyDeleted')) {
                        $(this).data('alreadyDeleted', false);
                    } else {
                        childFormset.undelete(this);
                    }
                });
            });
            DJNesting.updatePositions(this.prefix);
            $(document).trigger('djnesting:mutate', [this.$formset]);
        },
        add: function(spliceIndex) {
            var self = this;
            var $form = this._$template.clone(true);
            var index = this.mgmtVal('TOTAL_FORMS');
            var maxForms = this.mgmtVal('MAX_NUM_FORMS') || Infinity;
            var isNested = this.$inline.hasClass('djnesting-stacked');

            $form.removeClass(this.opts.emptyClass);
            $form.attr('id', $form.attr('id').replace("-empty", index));

            if (isNested) {
                $form.wrap('<div class="nested-sortable-item"></div>').parent().insertBefore(this._$template.parent());
                $form.parent().append(DJNesting.createContainerElement());
            } else {
                $form.insertBefore(this._$template);
                $form.parent.addClass('nested-sortable-item');
            }

            this.mgmtVal('TOTAL_FORMS', index + 1);
            if (maxForms - index <= 0) {
                this.$inline.find(this.opts.addButtonSelector).parents('.grp-add-item').hide();
            }

            DJNesting.updateFormAttributes($form, /__prefix__/, index);

            DJNesting.updateNestedFormIndex($form, this.prefix);
            DJNesting.updatePositions(this.prefix);

            if ($.isNumeric(spliceIndex)) {
                this.spliceInto($form, spliceIndex, true);
            } else {
                $(document).trigger('djnesting:mutate', [this.$formset]);
            }

            grappelli.reinitDateTimeFields($form);
            grappelli.updateSelectFilter($form);
            DJNesting.initRelatedFields(this.prefix);
            DJNesting.initAutocompleteFields(this.prefix);
            $form.find(".collapse").andSelf().grp_collapsible({
                toggle_handler_slctr: ".collapse-handler:first",
                closed_css: "closed grp-closed",
                open_css: "open grp-open",
                on_toggle: function() {
                    $(document).trigger('djnesting:toggle', [self.$inline]);
                }
            });
            if (typeof $.fn.curated_content_type == 'function') {
                $form.find('.curated-content-type-select').each(function() {
                    $(this).curated_content_type();
                });
            }

            this._initializeForm($form);
            this._bindEvents($form);

            // find any nested formsets
            $form.find('.group[id$="-group"][id^="' + this.prefix + '"][data-field-names]:not([id*="-empty"])').each(function() {
                $(this)[pluginName]();
            });

            // Fire an event on the document so other javascript applications
            // can be alerted to the newly inserted inline
            $(document).trigger('djnesting:added', [this.$inline, $form]);

            return $form;
        },
        _fillGap: function(index, isInitial) {
            var $initialForm, $newForm;
            var formsets = this.$inline.djangoFormsetForms().toArray();
            // Sort formsets in index order, so that we get the last indexed form for the swap.
            formsets.sort(function(a, b) { return $(a).djangoFormIndex() - $(b).djangoFormIndex(); });
            formsets.forEach(function(form) {
                var $form = $(form);
                var i = $form.djangoFormIndex();
                if (i <= index) {
                    return;
                }
                if ($form.data('isInitial')) {
                    $initialForm = $form;
                } else {
                    $newForm = $form;
                }
            });
            var $form = (isInitial) ? $initialForm || $newForm : $newForm;
            if (!$form) {
                return;
            }
            var oldIndex = $form.djangoFormIndex();
            var oldFormPrefixRegex = new RegExp("^(id_)?"
                + DJNesting.regexQuote(this.prefix + "-" + oldIndex));
            $form.attr('id', this.prefix + index);
            DJNesting.updateFormAttributes($form, oldFormPrefixRegex, "$1" + this.prefix + "-" + index);
            $(document).trigger('djnesting:attrchange', [this.$inline, $form]);

            if (isInitial && $initialForm && $newForm) {
                this._fillGap(oldIndex, false);
            }
        },
        _makeRoomForInsert: function() {
            var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
                totalFormCount = this.mgmtVal('TOTAL_FORMS'),
                gapIndex = initialFormCount,
                $existingForm = $('#' + this.prefix + gapIndex);

            if (!$existingForm.length) {
                return;
            }

            var oldFormPrefixRegex = new RegExp("^(id_)?"
                + DJNesting.regexQuote(this.prefix) + "-" + gapIndex);
            $existingForm.attr('id', this.prefix + totalFormCount);
            DJNesting.updateFormAttributes($existingForm, oldFormPrefixRegex, "$1" + this.prefix + "-" + totalFormCount);
            $(document).trigger('djnesting:attrchange', [this.$inline, $existingForm]);
        },
        /**
         * Splice a form into the current formset at new position `index`.
         */
        spliceInto: function($form, index, isNewAddition) {
            var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
                totalFormCount = this.mgmtVal('TOTAL_FORMS'),
                oldFormsetPrefix = $form.djangoFormsetPrefix(),
                newFormsetPrefix = this.prefix,
                isInitial = $form.data('isInitial'),
                newIndex, $item, $before;

            // Make sure the form being spliced is from a different inline
            if ($form.djangoFormsetPrefix() == this.prefix) {
                var currentPosition = $form.parent().prevAll('.nested-sortable-item:not(.nested-do-not-drag)').length;
                if (currentPosition === index) {
                    DJNesting.updatePositions(newFormsetPrefix);
                    return;
                }
                $item = $form.parent().remove();
                $before = this.$inline.find('> .nested-sortable-container > .nested-sortable-item').eq(index);
                $before.after($item);
            } else {
                var $oldInline = $('#' + oldFormsetPrefix + '-group');
                var $currentFormInline = $form.closest('.djnesting-stacked');

                if ($currentFormInline.djangoFormsetPrefix() != newFormsetPrefix) {
                    $item = $form.parent().remove();
                    $before = this.$inline.find('> .nested-sortable-container').find('.nested-sortable-item').eq(index);
                    $before.after($item);
                }

                var oldDjangoFormset = $oldInline.djangoFormset();
                oldDjangoFormset.mgmtVal('TOTAL_FORMS', oldDjangoFormset.mgmtVal('TOTAL_FORMS') - 1);
                oldDjangoFormset._fillGap($form.djangoFormIndex(), isInitial);

                if (isInitial) {
                    oldDjangoFormset.mgmtVal('INITIAL_FORMS', oldDjangoFormset.mgmtVal('INITIAL_FORMS') - 1);

                    var $parentInline = this.$inline.parent().closest('.djnesting-stacked');
                    if ($parentInline.length) {
                        var $parentForm = this.$inline.closest('.nested-inline-form');
                        var parentPkField = $parentInline.data('fieldNames').pk;
                        var $parentPk = $parentForm.djangoFormField(parentPkField);
                        if (!$parentPk.val()) {
                            isInitial = false;
                        }
                    }
                }

                if (isInitial) {
                    this._makeRoomForInsert();
                }

                // Replace the ids for the splice form
                var oldFormPrefixRegex = new RegExp("^(id_)?"
                    + DJNesting.regexQuote($form.attr('id').replace(/_set(\d+)$/, '_set-$1')));
                newIndex = (isInitial) ? initialFormCount : totalFormCount;
                $form.attr('id', newFormsetPrefix + newIndex);
                DJNesting.updateFormAttributes($form, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex);
                $(document).trigger('djnesting:attrchange', [this.$inline, $form]);

                if (isInitial) {
                    this.mgmtVal('INITIAL_FORMS', initialFormCount + 1);
                }
                this.mgmtVal('TOTAL_FORMS', totalFormCount + 1);

                DJNesting.updatePositions(oldFormsetPrefix);
                $(document).trigger('djnesting:mutate', [$oldInline]);
            }

            DJNesting.updatePositions(newFormsetPrefix);
            if (!isNewAddition) {
                $(document).trigger('djnesting:mutate', [this.$formset]);
            }
        },
        mgmtVal: function(name, newValue) {
            var $field = this.$inline.find('#id_' + this.prefix + '-' + name);
            if (typeof newValue == 'undefined') {
                return parseInt($field.val(), 10);
            } else {
                return parseInt($field.val(newValue).val(), 10);
            }
        }
    });

    $.fn[pluginName] = function() {
        var options, fn, args;
        var $el = this.eq(0);

        if (arguments.length === 0 || (arguments.length === 1 && $.type(arguments[0]) != 'string')) {
            options = arguments[0];
            var djangoFormset = $el.data(pluginName);
            if (!djangoFormset) {
                djangoFormset = new DjangoFormset($el, options);
                $el.data(pluginName, djangoFormset);
            }
            return djangoFormset;
        }

        fn = arguments[0];
        args = $.makeArray(arguments).slice(1);

        if (fn in DjangoFormset.prototype) {
            return $el.data(pluginName)[fn](args);
        } else {
            throw new Error("Unknown function call " + fn + " for $.fn." + pluginName);
        }
    };

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
