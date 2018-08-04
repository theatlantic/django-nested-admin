'use strict';

import $ from 'jquery';
import regexQuote from './regexquote';
import DJNesting from './utils';
import grappelli from 'grappelli';

var pluginName = 'djangoFormset';

class DjangoFormset {
    constructor(inline) {
        this.opts = {
            emptyClass: 'empty-form grp-empty-form djn-empty-form',
            predeleteClass: 'grp-predelete'
        };
        this.$inline = $(inline);
        this.prefix = this.$inline.djangoFormsetPrefix();
        this._$totalForms = this.$inline.find('#id_' + this.prefix + '-TOTAL_FORMS');
        this._$totalForms.attr('autocomplete', 'off');
        this._$template = $('#' + this.prefix + '-empty');

        var inlineModelClassName = this.$inline.djnData('inlineModel');

        this.opts = $.extend({}, this.opts, {
            addButtonSelector: '.djn-add-handler.djn-model-' + inlineModelClassName,
            removeButtonSelector: '.djn-remove-handler.djn-model-' + inlineModelClassName,
            deleteButtonSelector: '.djn-delete-handler.djn-model-' + inlineModelClassName,
            formClass: 'dynamic-form grp-dynamic-form djn-dynamic-form-' + inlineModelClassName,
            formClassSelector: '.djn-dynamic-form-' + inlineModelClassName
        });

        DJNesting.initRelatedFields(this.prefix, this.$inline.djnData());
        DJNesting.initAutocompleteFields(this.prefix, this.$inline.djnData());

        this._bindEvents();

        this._initializeForms();

        this.$inline.find('.djn-items:not([id*="-empty"])').trigger('djnesting:init');

        // initialize nested formsets
        this.$inline.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function() {
            $(this)[pluginName]();
        });

        if (this.$inline.is('.djn-group-root')) {
            DJNesting.createSortable(this.$inline);
        }

        $(document).trigger('djnesting:initialized', [this.$inline, this]);
    }
    _initializeForms() {
        var totalForms = this.mgmtVal('TOTAL_FORMS');
        var maxForms = this.mgmtVal('MAX_NUM_FORMS');
        if (maxForms <= totalForms) {
            this.$inline.find(this.opts.addButtonSelector).parents('.djn-add-item').hide();
        }
        for (var i = 0; i < totalForms; i++) {
            this._initializeForm('#' + this.prefix + '-' + i);
        }
    }
    _initializeForm(form) {
        var $form = $(form);
        var formPrefix = $form.djangoFormPrefix();
        $form.addClass(this.opts.formClass);
        if ($form.hasClass('has_original')) {
            $('#id_' + formPrefix + 'DELETE:checked').toggleClass(this.opts.predeleteClass);
        }
        var minForms = this.mgmtVal('MIN_NUM_FORMS');
        var totalForms = this.mgmtVal('TOTAL_FORMS');
        var self = this;
        var hideRemoveButton = (totalForms <= minForms);
        this.$inline.djangoFormsetForms().each(function() {
            var showHideMethod = (hideRemoveButton) ? 'hide' : 'show';
            $(this).find(self.opts.removeButtonSelector)[showHideMethod]();
        });
    }
    _bindEvents($el) {
        var self = this;
        if (typeof $el == 'undefined') {
            $el = this.$inline;
        }
        $el.find(this.opts.addButtonSelector).off('click.djnesting').on('click.djnesting', function(e) {
            e.preventDefault();
            e.stopPropagation();
            self.add();
        });
        $el.find(this.opts.removeButtonSelector).filter(function() {
            return !$(this).closest('.djn-empty-form').length;
        }).off('click.djnesting').on('click.djnesting', function(e) {
            e.preventDefault();
            e.stopPropagation();
            var $form = $(this).closest(self.opts.formClassSelector);
            self.remove($form);
        });

        var deleteClickHandler = function(e) {
            e.preventDefault();
            e.stopImmediatePropagation();
            var $form = $(this).closest(self.opts.formClassSelector);
            var $deleteInput = $('#id_' + $form.djangoFormPrefix() + 'DELETE');
            if (!$deleteInput.is(':checked')) {
                self['delete']($form);
            } else {
                self.undelete($form);
            }
        };

        var $deleteButton = $el.find(this.opts.deleteButtonSelector)
           .filter(function() { return !$(this).closest('.djn-empty-form').length; });

        $deleteButton.off('click.djnesting').on('click.djnesting', deleteClickHandler);
        $deleteButton.find('[id$="-DELETE"]').on('mousedown.djnesting', deleteClickHandler);
    }
    remove(form) {
        var $form = $(form);
        var totalForms = this.mgmtVal('TOTAL_FORMS');
        var minForms = this.mgmtVal('MIN_NUM_FORMS');
        var maxForms = this.mgmtVal('MAX_NUM_FORMS');
        var index = $form.djangoFormIndex();
        var isInitial = $form.data('isInitial');

        $form.remove();

        totalForms -= 1;
        this.mgmtVal('TOTAL_FORMS', totalForms);

        if (maxForms - totalForms >= 0) {
            this.$inline.find(this.opts.addButtonSelector).parents('.djn-add-item').show();
        }

        this._fillGap(index, isInitial);

        var self = this;
        var hideRemoveButton = (totalForms <= minForms);
        this.$inline.djangoFormsetForms().each(function() {
            var showHideMethod = (hideRemoveButton) ? 'hide' : 'show';
            $(this).find(self.opts.removeButtonSelector)[showHideMethod]();
        });

        DJNesting.updatePositions(this.prefix);
        $(document).trigger('djnesting:mutate', [this.$inline]);

        // Also fire using the events that were added in Django 1.9
        $(document).trigger('formset:removed', [$form, this.prefix]);
    }
    delete(form) {
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
        if ($deleteInput.length) {
            $deleteInput[0].checked = true;
        }
        $form.addClass(this.opts.predeleteClass);

        $form.find('.djn-group').each(function() {
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
        $form.find('.cropduster-form').each(function() {
            var formPrefix = $(this).djangoFormsetPrefix() + '-0-';
            var $deleteInput = $('#id_' + formPrefix + 'DELETE');
            $deleteInput.attr('checked', 'checked');
            if ($deleteInput.length) {
                $deleteInput[0].checked = true;
            }
        });
        DJNesting.updatePositions(this.prefix);
        $(document).trigger('djnesting:mutate', [this.$inline]);
        $(document).trigger('formset:deleted', [$form, this.prefix]);
    }
    undelete(form) {
        var $form = $(form),
            formPrefix = $form.djangoFormPrefix(),
            $deleteInput = $('#id_' + formPrefix + 'DELETE');

        if ($form.parent().closest('.' + this.opts.predeleteClass).length) {
            return;
        }
        if ($form.hasClass('has_original')) {
            $deleteInput.removeAttr('checked');
            if ($deleteInput.length) {
                $deleteInput[0].checked = false;
            }
            $form.removeClass(this.opts.predeleteClass);
        }
        $form.data('alreadyDeleted', false);
        $form.find('.djn-group').each(function() {
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
        $form.find('.cropduster-form').each(function() {
            var formPrefix = $(this).djangoFormsetPrefix() + '-0-';
            var $deleteInput = $('#id_' + formPrefix + 'DELETE');
            $deleteInput.removeAttr('checked');
            if ($deleteInput.length) {
                $deleteInput[0].checked = false;
            }
        });
        DJNesting.updatePositions(this.prefix);
        $(document).trigger('djnesting:mutate', [this.$inline]);
        $(document).trigger('formset:undeleted', [$form, this.prefix]);
    }
    add(spliceIndex) {
        var self = this;
        var $form = this._$template.clone(true);
        var index = this.mgmtVal('TOTAL_FORMS');
        var maxForms = this.mgmtVal('MAX_NUM_FORMS');
        var isNested = this.$inline.hasClass('djn-group-nested');

        $(document).trigger('djnesting:beforeadded', [this.$inline, $form]);

        $form.removeClass(this.opts.emptyClass);
        $form.addClass('djn-item');
        $form.attr('id', $form.attr('id').replace('-empty', '-' + index));

        if (isNested) {
            $form.append(DJNesting.createContainerElement());
        }

        DJNesting.updateFormAttributes($form,
            new RegExp('([\\#_]|^)' + regexQuote(this.prefix) + '\\-(?:__prefix__|empty)\\-', 'g'),
            '$1' + this.prefix + '-' + index + '-');

        $form.insertBefore(this._$template);

        this.mgmtVal('TOTAL_FORMS', index + 1);
        if ((maxForms - (index + 1)) <= 0) {
            this.$inline.find(this.opts.addButtonSelector).parents('.djn-add-item').hide();
        }

        DJNesting.updatePositions(this.prefix);

        if ($.isNumeric(spliceIndex)) {
            this.spliceInto($form, spliceIndex, true);
        } else {
            $(document).trigger('djnesting:mutate', [this.$inline]);
        }

        if (grappelli) {
            grappelli.reinitDateTimeFields($form);
        }
        DJNesting.DjangoInlines.initPrepopulatedFields($form);
        DJNesting.DjangoInlines.reinitDateTimeShortCuts();
        DJNesting.DjangoInlines.updateSelectFilter($form);
        DJNesting.initRelatedFields(this.prefix);
        DJNesting.initAutocompleteFields(this.prefix);
        if ($.fn.grp_collapsible) {
            $form.find('.collapse').addBack().grp_collapsible({
                toggle_handler_slctr: '.grp-collapse-handler:first',
                closed_css: 'closed grp-closed',
                open_css: 'open grp-open',
                on_toggle: function() {
                    $(document).trigger('djnesting:toggle', [self.$inline]);
                }
            });
        }
        if (typeof $.fn.curated_content_type == 'function') {
            $form.find('.curated-content-type-select').each(function() {
                $(this).curated_content_type();
            });
        }

        this._initializeForm($form);
        this._bindEvents($form);

        // find any nested formsets
        $form.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function() {
            $(this)[pluginName]();
        });

        // Fire an event on the document so other javascript applications
        // can be alerted to the newly inserted inline
        $(document).trigger('djnesting:added', [this.$inline, $form]);

        // Also fire using the events that were added in Django 1.9
        $(document).trigger('formset:added', [$form, this.prefix]);

        return $form;
    }
    _fillGap(index, isInitial) {
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
        var oldFormPrefixRegex = new RegExp('([\\#_]|^)'
            + regexQuote(this.prefix + '-' + oldIndex) + '(?!\\-\\d)');
        $form.attr('id', this.prefix + '-' + index);
        DJNesting.updateFormAttributes($form, oldFormPrefixRegex, '$1' + this.prefix + '-' + index);

        // Update prefixes on nested DjangoFormset objects
        $form.find('.djn-group').each(function() {
            var $childInline = $(this);
            var childFormset = $childInline.djangoFormset();
            childFormset.prefix = $childInline.djangoFormsetPrefix();
        });

        $(document).trigger('djnesting:attrchange', [this.$inline, $form]);

        if (isInitial && $initialForm && $newForm) {
            this._fillGap(oldIndex, false);
        }
    }
    _makeRoomForInsert() {
        var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
            totalFormCount = this.mgmtVal('TOTAL_FORMS'),
            gapIndex = initialFormCount,
            $existingForm = $('#' + this.prefix + '-' + gapIndex);

        if (!$existingForm.length) {
            return;
        }

        var oldFormPrefixRegex = new RegExp('([\\#_]|^)'
            + regexQuote(this.prefix) + '-' + gapIndex + '(?!\\-\\d)');
        $existingForm.attr('id', this.prefix + '-' + totalFormCount);
        DJNesting.updateFormAttributes($existingForm, oldFormPrefixRegex, '$1' + this.prefix + '-' + totalFormCount);

        // Update prefixes on nested DjangoFormset objects
        $existingForm.find('.djn-group').each(function() {
            var $childInline = $(this);
            var childFormset = $childInline.djangoFormset();
            childFormset.prefix = $childInline.djangoFormsetPrefix();
        });

        $(document).trigger('djnesting:attrchange', [this.$inline, $existingForm]);
    }
    /**
     * Splice a form into the current formset at new position `index`.
     */
    spliceInto($form, index, isNewAddition) {
        var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
            totalFormCount = this.mgmtVal('TOTAL_FORMS'),
            oldFormsetPrefix = $form.djangoFormsetPrefix(),
            newFormsetPrefix = this.prefix,
            isInitial = $form.data('isInitial'),
            newIndex, $before;

        // Make sure the form being spliced is from a different inline
        if ($form.djangoFormsetPrefix() == this.prefix) {
            var currentPosition = $form.prevAll('.djn-item:not(.djn-no-drag,.djn-thead)').length;
            if (currentPosition === index || typeof index == 'undefined') {
                DJNesting.updatePositions(newFormsetPrefix);
                return;
            }
            $before = this.$inline.find('> .djn-items, > .tabular > .module > .djn-items').find('> .djn-item:not(#' + $form.attr('id') + ')').eq(index);
            $before.after($form);
        } else {
            var $oldInline = $('#' + oldFormsetPrefix + '-group');
            var $currentFormInline = $form.closest('.djn-group');

            if ($currentFormInline.djangoFormsetPrefix() != newFormsetPrefix) {
                $before = this.$inline.find('> .djn-items, > .tabular > .module > .djn-items').find('> .djn-item').eq(index);
                $before.after($form);
            }

            var oldDjangoFormset = $oldInline.djangoFormset();
            oldDjangoFormset.mgmtVal('TOTAL_FORMS', oldDjangoFormset.mgmtVal('TOTAL_FORMS') - 1);
            oldDjangoFormset._fillGap($form.djangoFormIndex(), isInitial);

            if (isInitial) {
                oldDjangoFormset.mgmtVal('INITIAL_FORMS', oldDjangoFormset.mgmtVal('INITIAL_FORMS') - 1);

                var $parentInline = this.$inline.parent().closest('.djn-group');
                if ($parentInline.length) {
                    var $parentForm = this.$inline.closest('.djn-inline-form');
                    var parentPkField = ($parentInline.djnData('fieldNames') || {}).pk;
                    var $parentPk = $parentForm.djangoFormField(parentPkField);
                    if (!$parentPk.val()) {
                        $form.data('isInitial', false);
                        $form.attr('data-is-initial', 'false');
                        isInitial = false;
                        // Set initial form counts to 0 on nested DjangoFormsets
                        setTimeout(function() {
                            $form.find('[name^="' + $form.djangoFormPrefix() + '"][name$="-INITIAL_FORMS"]')
                                 .val('0').trigger('change');
                        }, 0);
                    }
                }
            }

            if (isInitial) {
                this._makeRoomForInsert();
            }

            // Replace the ids for the splice form
            var oldFormPrefixRegex = new RegExp('([\\#_]|^)' + regexQuote($form.attr('id')) + '(?!\\-\\d)');
            newIndex = (isInitial) ? initialFormCount : totalFormCount;
            $form.attr('id', newFormsetPrefix + '-' + newIndex);
            DJNesting.updateFormAttributes($form, oldFormPrefixRegex, '$1' + newFormsetPrefix + '-' + newIndex);

            // Update prefixes on nested DjangoFormset objects
            $form.find('.djn-group').each(function() {
                var $childInline = $(this);
                var childFormset = $childInline.djangoFormset();
                childFormset.prefix = $childInline.djangoFormsetPrefix();
            });

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
            $(document).trigger('djnesting:mutate', [this.$inline]);
        }
    }
    mgmtVal(name, newValue) {
        var $field = this.$inline.find('#id_' + this.prefix + '-' + name);
        if (typeof newValue == 'undefined') {
            return parseInt($field.val(), 10);
        } else {
            return parseInt($field.val(newValue).trigger('change').val(), 10);
        }
    }
}

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
        throw new Error('Unknown function call ' + fn + ' for $.fn.' + pluginName);
    }
};

export default DjangoFormset;
