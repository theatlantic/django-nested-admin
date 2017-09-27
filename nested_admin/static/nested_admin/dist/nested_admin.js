(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _regexquote = require('./regexquote');

var _regexquote2 = _interopRequireDefault(_regexquote);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _grappelli = (typeof window !== "undefined" ? window['grappelli'] : typeof global !== "undefined" ? global['grappelli'] : null);

var _grappelli2 = _interopRequireDefault(_grappelli);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var pluginName = 'djangoFormset';

var DjangoFormset = function () {
    function DjangoFormset(inline) {
        _classCallCheck(this, DjangoFormset);

        this.opts = {
            emptyClass: 'empty-form grp-empty-form djn-empty-form',
            predeleteClass: 'grp-predelete'
        };
        this.$inline = (0, _jquery2.default)(inline);
        this.prefix = this.$inline.djangoFormsetPrefix();
        this._$totalForms = this.$inline.find('#id_' + this.prefix + '-TOTAL_FORMS');
        this._$totalForms.attr('autocomplete', 'off');
        this._$template = (0, _jquery2.default)('#' + this.prefix + '-empty');

        var inlineModelClassName = this.$inline.djnData('inlineModel');

        this.opts = _jquery2.default.extend({}, this.opts, {
            addButtonSelector: '.djn-add-handler.djn-model-' + inlineModelClassName,
            removeButtonSelector: '.djn-remove-handler.djn-model-' + inlineModelClassName,
            deleteButtonSelector: '.djn-delete-handler.djn-model-' + inlineModelClassName,
            formClass: 'dynamic-form grp-dynamic-form djn-dynamic-form-' + inlineModelClassName,
            formClassSelector: '.djn-dynamic-form-' + inlineModelClassName
        });

        _utils2.default.initRelatedFields(this.prefix, this.$inline.djnData());
        _utils2.default.initAutocompleteFields(this.prefix, this.$inline.djnData());

        this._bindEvents();

        this._initializeForms();

        this.$inline.find('.djn-items:not([id*="-empty"])').trigger('djnesting:init');

        // initialize nested formsets
        this.$inline.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function () {
            (0, _jquery2.default)(this)[pluginName]();
        });

        if (this.$inline.is('.djn-group-root')) {
            _utils2.default.createSortable(this.$inline);
        }

        (0, _jquery2.default)(document).trigger('djnesting:initialized', [this.$inline, this]);
    }

    _createClass(DjangoFormset, [{
        key: '_initializeForms',
        value: function _initializeForms() {
            var totalForms = this.mgmtVal('TOTAL_FORMS');
            var maxForms = this.mgmtVal('MAX_NUM_FORMS');
            if (maxForms <= totalForms) {
                this.$inline.find(this.opts.addButtonSelector).parents('.djn-add-item').hide();
            }
            for (var i = 0; i < totalForms; i++) {
                this._initializeForm('#' + this.prefix + '-' + i);
            }
        }
    }, {
        key: '_initializeForm',
        value: function _initializeForm(form) {
            var $form = (0, _jquery2.default)(form);
            var formPrefix = $form.djangoFormPrefix();
            $form.addClass(this.opts.formClass);
            if ($form.hasClass('has_original')) {
                (0, _jquery2.default)('#id_' + formPrefix + 'DELETE:checked').toggleClass(this.opts.predeleteClass);
            }
            var minForms = this.mgmtVal('MIN_NUM_FORMS');
            var totalForms = this.mgmtVal('TOTAL_FORMS');
            var self = this;
            var hideRemoveButton = totalForms <= minForms;
            this.$inline.djangoFormsetForms().each(function () {
                var showHideMethod = hideRemoveButton ? 'hide' : 'show';
                (0, _jquery2.default)(this).find(self.opts.removeButtonSelector)[showHideMethod]();
            });
        }
    }, {
        key: '_bindEvents',
        value: function _bindEvents($el) {
            var self = this;
            if (typeof $el == 'undefined') {
                $el = this.$inline;
            }
            $el.find(this.opts.addButtonSelector).off('click.djnesting').on('click.djnesting', function (e) {
                e.preventDefault();
                e.stopPropagation();
                self.add();
            });
            $el.find(this.opts.removeButtonSelector).filter(function () {
                return !(0, _jquery2.default)(this).closest('.djn-empty-form').length;
            }).off('click.djnesting').on('click.djnesting', function (e) {
                e.preventDefault();
                e.stopPropagation();
                var $form = (0, _jquery2.default)(this).closest(self.opts.formClassSelector);
                self.remove($form);
            });

            var deleteClickHandler = function deleteClickHandler(e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                var $form = (0, _jquery2.default)(this).closest(self.opts.formClassSelector);
                var $deleteInput = (0, _jquery2.default)('#id_' + $form.djangoFormPrefix() + 'DELETE');
                if (!$deleteInput.is(':checked')) {
                    self['delete']($form);
                } else {
                    self.undelete($form);
                }
            };

            var $deleteButton = $el.find(this.opts.deleteButtonSelector).filter(function () {
                return !(0, _jquery2.default)(this).closest('.djn-empty-form').length;
            });

            $deleteButton.off('click.djnesting').on('click.djnesting', deleteClickHandler);
            $deleteButton.find('[id$="-DELETE"]').on('mousedown.djnesting', deleteClickHandler);
        }
    }, {
        key: 'remove',
        value: function remove(form) {
            var $form = (0, _jquery2.default)(form);
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
            var hideRemoveButton = totalForms <= minForms;
            this.$inline.djangoFormsetForms().each(function () {
                var showHideMethod = hideRemoveButton ? 'hide' : 'show';
                (0, _jquery2.default)(this).find(self.opts.removeButtonSelector)[showHideMethod]();
            });

            _utils2.default.updatePositions(this.prefix);
            (0, _jquery2.default)(document).trigger('djnesting:mutate', [this.$inline]);

            // Also fire using the events that were added in Django 1.9
            (0, _jquery2.default)(document).trigger('formset:removed', [$form, this.prefix]);
        }
    }, {
        key: 'delete',
        value: function _delete(form) {
            var self = this,
                $form = (0, _jquery2.default)(form),
                formPrefix = $form.djangoFormPrefix(),
                $deleteInput = (0, _jquery2.default)('#id_' + formPrefix + 'DELETE');

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

            $form.find('.djn-group').each(function () {
                var $childInline = (0, _jquery2.default)(this);
                var childFormset = $childInline.djangoFormset();
                $childInline.djangoFormsetForms().each(function () {
                    if ((0, _jquery2.default)(this).hasClass(self.opts.predeleteClass)) {
                        (0, _jquery2.default)(this).data('alreadyDeleted', true);
                    } else {
                        childFormset.delete(this);
                    }
                });
            });
            $form.find('.cropduster-form').each(function () {
                var formPrefix = (0, _jquery2.default)(this).djangoFormsetPrefix() + '-0-';
                var $deleteInput = (0, _jquery2.default)('#id_' + formPrefix + 'DELETE');
                $deleteInput.attr('checked', 'checked');
                if ($deleteInput.length) {
                    $deleteInput[0].checked = true;
                }
            });
            _utils2.default.updatePositions(this.prefix);
            (0, _jquery2.default)(document).trigger('djnesting:mutate', [this.$inline]);
            (0, _jquery2.default)(document).trigger('formset:deleted', [$form, this.prefix]);
        }
    }, {
        key: 'undelete',
        value: function undelete(form) {
            var $form = (0, _jquery2.default)(form),
                formPrefix = $form.djangoFormPrefix(),
                $deleteInput = (0, _jquery2.default)('#id_' + formPrefix + 'DELETE');

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
            $form.find('.djn-group').each(function () {
                var $childInline = (0, _jquery2.default)(this);
                var childFormset = $childInline.djangoFormset();
                $childInline.djangoFormsetForms().each(function () {
                    if ((0, _jquery2.default)(this).data('alreadyDeleted')) {
                        (0, _jquery2.default)(this).data('alreadyDeleted', false);
                    } else {
                        childFormset.undelete(this);
                    }
                });
            });
            $form.find('.cropduster-form').each(function () {
                var formPrefix = (0, _jquery2.default)(this).djangoFormsetPrefix() + '-0-';
                var $deleteInput = (0, _jquery2.default)('#id_' + formPrefix + 'DELETE');
                $deleteInput.removeAttr('checked');
                if ($deleteInput.length) {
                    $deleteInput[0].checked = false;
                }
            });
            _utils2.default.updatePositions(this.prefix);
            (0, _jquery2.default)(document).trigger('djnesting:mutate', [this.$inline]);
            (0, _jquery2.default)(document).trigger('formset:undeleted', [$form, this.prefix]);
        }
    }, {
        key: 'add',
        value: function add(spliceIndex) {
            var self = this;
            var $form = this._$template.clone(true);
            var index = this.mgmtVal('TOTAL_FORMS');
            var maxForms = this.mgmtVal('MAX_NUM_FORMS');
            var isNested = this.$inline.hasClass('djn-group-nested');

            (0, _jquery2.default)(document).trigger('djnesting:beforeadded', [this.$inline, $form]);

            $form.removeClass(this.opts.emptyClass);
            $form.addClass('djn-item');
            $form.attr('id', $form.attr('id').replace('-empty', '-' + index));

            if (isNested) {
                $form.append(_utils2.default.createContainerElement());
            }

            _utils2.default.updateFormAttributes($form, new RegExp('([\\#_]|^)' + (0, _regexquote2.default)(this.prefix) + '\\-(?:__prefix__|empty)\\-', 'g'), '$1' + this.prefix + '-' + index + '-');

            $form.insertBefore(this._$template);

            this.mgmtVal('TOTAL_FORMS', index + 1);
            if (maxForms - (index + 1) <= 0) {
                this.$inline.find(this.opts.addButtonSelector).parents('.djn-add-item').hide();
            }

            _utils2.default.updatePositions(this.prefix);

            if (_jquery2.default.isNumeric(spliceIndex)) {
                this.spliceInto($form, spliceIndex, true);
            } else {
                (0, _jquery2.default)(document).trigger('djnesting:mutate', [this.$inline]);
            }

            if (_grappelli2.default) {
                _grappelli2.default.reinitDateTimeFields($form);
            }
            _utils2.default.DjangoInlines.initPrepopulatedFields($form);
            _utils2.default.DjangoInlines.reinitDateTimeShortCuts();
            _utils2.default.DjangoInlines.updateSelectFilter($form);
            _utils2.default.initRelatedFields(this.prefix);
            _utils2.default.initAutocompleteFields(this.prefix);
            if (_jquery2.default.fn.grp_collapsible) {
                $form.find('.collapse').andSelf().grp_collapsible({
                    toggle_handler_slctr: '.grp-collapse-handler:first',
                    closed_css: 'closed grp-closed',
                    open_css: 'open grp-open',
                    on_toggle: function on_toggle() {
                        (0, _jquery2.default)(document).trigger('djnesting:toggle', [self.$inline]);
                    }
                });
            }
            if (typeof _jquery2.default.fn.curated_content_type == 'function') {
                $form.find('.curated-content-type-select').each(function () {
                    (0, _jquery2.default)(this).curated_content_type();
                });
            }

            this._initializeForm($form);
            this._bindEvents($form);

            // find any nested formsets
            $form.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function () {
                (0, _jquery2.default)(this)[pluginName]();
            });

            // Fire an event on the document so other javascript applications
            // can be alerted to the newly inserted inline
            (0, _jquery2.default)(document).trigger('djnesting:added', [this.$inline, $form]);

            // Also fire using the events that were added in Django 1.9
            (0, _jquery2.default)(document).trigger('formset:added', [$form, this.prefix]);

            return $form;
        }
    }, {
        key: '_fillGap',
        value: function _fillGap(index, isInitial) {
            var $initialForm, $newForm;
            var formsets = this.$inline.djangoFormsetForms().toArray();
            // Sort formsets in index order, so that we get the last indexed form for the swap.
            formsets.sort(function (a, b) {
                return (0, _jquery2.default)(a).djangoFormIndex() - (0, _jquery2.default)(b).djangoFormIndex();
            });
            formsets.forEach(function (form) {
                var $form = (0, _jquery2.default)(form);
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
            var $form = isInitial ? $initialForm || $newForm : $newForm;
            if (!$form) {
                return;
            }
            var oldIndex = $form.djangoFormIndex();
            var oldFormPrefixRegex = new RegExp('([\\#_]|^)' + (0, _regexquote2.default)(this.prefix + '-' + oldIndex) + '(?!\\-\\d)');
            $form.attr('id', this.prefix + '-' + index);
            _utils2.default.updateFormAttributes($form, oldFormPrefixRegex, '$1' + this.prefix + '-' + index);

            // Update prefixes on nested DjangoFormset objects
            $form.find('.djn-group').each(function () {
                var $childInline = (0, _jquery2.default)(this);
                var childFormset = $childInline.djangoFormset();
                childFormset.prefix = $childInline.djangoFormsetPrefix();
            });

            (0, _jquery2.default)(document).trigger('djnesting:attrchange', [this.$inline, $form]);

            if (isInitial && $initialForm && $newForm) {
                this._fillGap(oldIndex, false);
            }
        }
    }, {
        key: '_makeRoomForInsert',
        value: function _makeRoomForInsert() {
            var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
                totalFormCount = this.mgmtVal('TOTAL_FORMS'),
                gapIndex = initialFormCount,
                $existingForm = (0, _jquery2.default)('#' + this.prefix + '-' + gapIndex);

            if (!$existingForm.length) {
                return;
            }

            var oldFormPrefixRegex = new RegExp('([\\#_]|^)' + (0, _regexquote2.default)(this.prefix) + '-' + gapIndex + '(?!\\-\\d)');
            $existingForm.attr('id', this.prefix + '-' + totalFormCount);
            _utils2.default.updateFormAttributes($existingForm, oldFormPrefixRegex, '$1' + this.prefix + '-' + totalFormCount);

            // Update prefixes on nested DjangoFormset objects
            $existingForm.find('.djn-group').each(function () {
                var $childInline = (0, _jquery2.default)(this);
                var childFormset = $childInline.djangoFormset();
                childFormset.prefix = $childInline.djangoFormsetPrefix();
            });

            (0, _jquery2.default)(document).trigger('djnesting:attrchange', [this.$inline, $existingForm]);
        }
        /**
         * Splice a form into the current formset at new position `index`.
         */

    }, {
        key: 'spliceInto',
        value: function spliceInto($form, index, isNewAddition) {
            var initialFormCount = this.mgmtVal('INITIAL_FORMS'),
                totalFormCount = this.mgmtVal('TOTAL_FORMS'),
                oldFormsetPrefix = $form.djangoFormsetPrefix(),
                newFormsetPrefix = this.prefix,
                isInitial = $form.data('isInitial'),
                newIndex,
                $before;

            // Make sure the form being spliced is from a different inline
            if ($form.djangoFormsetPrefix() == this.prefix) {
                var currentPosition = $form.prevAll('.djn-item:not(.djn-no-drag,.djn-thead)').length;
                if (currentPosition === index || typeof index == 'undefined') {
                    _utils2.default.updatePositions(newFormsetPrefix);
                    return;
                }
                $before = this.$inline.find('> .djn-items, > .tabular > .module > .djn-items').find('> .djn-item:not(#' + $form.attr('id') + ')').eq(index);
                $before.after($form);
            } else {
                var $oldInline = (0, _jquery2.default)('#' + oldFormsetPrefix + '-group');
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
                            setTimeout(function () {
                                $form.find('[name^="' + $form.djangoFormPrefix() + '"][name$="-INITIAL_FORMS"]').val('0').trigger('change');
                            }, 0);
                        }
                    }
                }

                if (isInitial) {
                    this._makeRoomForInsert();
                }

                // Replace the ids for the splice form
                var oldFormPrefixRegex = new RegExp('([\\#_]|^)' + (0, _regexquote2.default)($form.attr('id')) + '(?!\\-\\d)');
                newIndex = isInitial ? initialFormCount : totalFormCount;
                $form.attr('id', newFormsetPrefix + '-' + newIndex);
                _utils2.default.updateFormAttributes($form, oldFormPrefixRegex, '$1' + newFormsetPrefix + '-' + newIndex);

                // Update prefixes on nested DjangoFormset objects
                $form.find('.djn-group').each(function () {
                    var $childInline = (0, _jquery2.default)(this);
                    var childFormset = $childInline.djangoFormset();
                    childFormset.prefix = $childInline.djangoFormsetPrefix();
                });

                (0, _jquery2.default)(document).trigger('djnesting:attrchange', [this.$inline, $form]);

                if (isInitial) {
                    this.mgmtVal('INITIAL_FORMS', initialFormCount + 1);
                }
                this.mgmtVal('TOTAL_FORMS', totalFormCount + 1);

                _utils2.default.updatePositions(oldFormsetPrefix);
                (0, _jquery2.default)(document).trigger('djnesting:mutate', [$oldInline]);
            }

            _utils2.default.updatePositions(newFormsetPrefix);
            if (!isNewAddition) {
                (0, _jquery2.default)(document).trigger('djnesting:mutate', [this.$inline]);
            }
        }
    }, {
        key: 'mgmtVal',
        value: function mgmtVal(name, newValue) {
            var $field = this.$inline.find('#id_' + this.prefix + '-' + name);
            if (typeof newValue == 'undefined') {
                return parseInt($field.val(), 10);
            } else {
                return parseInt($field.val(newValue).trigger('change').val(), 10);
            }
        }
    }]);

    return DjangoFormset;
}();

_jquery2.default.fn[pluginName] = function () {
    var options, fn, args;
    var $el = this.eq(0);

    if (arguments.length === 0 || arguments.length === 1 && _jquery2.default.type(arguments[0]) != 'string') {
        options = arguments[0];
        var djangoFormset = $el.data(pluginName);
        if (!djangoFormset) {
            djangoFormset = new DjangoFormset($el, options);
            $el.data(pluginName, djangoFormset);
        }
        return djangoFormset;
    }

    fn = arguments[0];
    args = _jquery2.default.makeArray(arguments).slice(1);

    if (fn in DjangoFormset.prototype) {
        return $el.data(pluginName)[fn](args);
    } else {
        throw new Error('Unknown function call ' + fn + ' for $.fn.' + pluginName);
    }
};

exports.default = DjangoFormset;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./regexquote":5,"./utils":7}],2:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prefixCache = {};

_jquery2.default.fn.djnData = function (name) {
    var inlineFormsetData = (0, _jquery2.default)(this).data('inlineFormset') || {},
        nestedOptions = inlineFormsetData.nestedOptions || {};
    if (!name) {
        return nestedOptions;
    } else {
        return nestedOptions[name];
    }
};

_jquery2.default.fn.djangoPrefixIndex = function () {
    var $this = this.length > 1 ? this.first() : this;
    var id = $this.attr('id'),
        name = $this.attr('name'),
        forattr = $this.attr('for'),
        prefix,
        $form,
        $group,
        groupId,
        cacheKey,
        match,
        index;

    if ((match = prefixCache[id]) || (match = prefixCache[name]) || (match = prefixCache[forattr])) {
        return match;
    }

    if (id && !prefix) {
        prefix = (id.match(/^(.*)\-group$/) || [null, null])[1];
    }

    if (id && !prefix && $this.is('.djn-item') && id.match(/\d+$/)) {
        var _ref = id.match(/(.*?)\-(\d+)$/) || [null, null, null];

        var _ref2 = _slicedToArray(_ref, 3);

        cacheKey = _ref2[0];
        prefix = _ref2[1];
        index = _ref2[2];
    }

    if (!prefix) {
        $form = $this.closest('.djn-inline-form');
        if ($form.length) {
            var _ref3 = $form.attr('id').match(/(.*?)\-(\d+)$/) || [null, null, null];

            var _ref4 = _slicedToArray(_ref3, 3);

            cacheKey = _ref4[0];
            prefix = _ref4[1];
            index = _ref4[2];
        } else {
            $group = $this.closest('.djn-group');
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

_jquery2.default.fn.djangoFormPrefix = function () {
    var prefixIndex = this.djangoPrefixIndex();
    if (!prefixIndex || !prefixIndex[1]) {
        return null;
    }
    return prefixIndex[0] + '-' + prefixIndex[1] + '-';
};

_jquery2.default.fn.djangoFormIndex = function () {
    var prefixIndex = this.djangoPrefixIndex();
    return !prefixIndex || !prefixIndex[1] ? null : parseInt(prefixIndex[1], 10);
};

_jquery2.default.fn.djangoFormsetPrefix = function () {
    var prefixIndex = this.djangoPrefixIndex();
    return !prefixIndex ? null : prefixIndex[0];
};

var filterDjangoFormsetForms = function filterDjangoFormsetForms(form, $group, formsetPrefix) {
    var formId = form.getAttribute('id'),
        formIndex = formId.substr(formsetPrefix.length + 1);

    // Check if form id matches /{prefix}-\d+/
    if (formId.indexOf(formsetPrefix) !== 0) {
        return false;
    }
    return !formIndex.match(/\D/);
};

// Selects all initial forms within the same formset as the
// element the method is being called on.
_jquery2.default.fn.djangoFormsetForms = function () {
    var forms = [];
    this.each(function () {
        var $this = (0, _jquery2.default)(this),
            formsetPrefix = $this.djangoFormsetPrefix(),
            $group = formsetPrefix ? (0, _jquery2.default)('#' + formsetPrefix + '-group') : null,
            $forms;

        if (!formsetPrefix || !$group.length) return;

        $forms = $group.find('.djn-inline-form').filter(function () {
            return filterDjangoFormsetForms(this, $group, formsetPrefix);
        });
        var sortedForms = $forms.toArray().sort(function (a, b) {
            return (0, _jquery2.default)(a).djangoFormIndex() - (0, _jquery2.default)(b).djangoFormIndex;
        });
        Array.prototype.push.apply(forms, sortedForms);
    });
    return this.pushStack(forms);
};

if (typeof _jquery2.default.djangoFormField != 'function') {
    _jquery2.default.djangoFormField = function (fieldName, prefix, index) {
        var $empty = (0, _jquery2.default)([]),
            matches;
        if (matches = prefix.match(/^(.+)\-(\d+)\-$/)) {
            prefix = matches[1];
            index = matches[2];
        }
        index = parseInt(index, 10);
        if (isNaN(index)) {
            return $empty;
        }
        var namePrefix = prefix + '-' + index + '-';
        if (fieldName == '*') {
            return (0, _jquery2.default)('*[name^="' + namePrefix + '"]').filter(function () {
                var fieldPart = (0, _jquery2.default)(this).attr('name').substring(namePrefix.length);
                return fieldPart.indexOf('-') === -1;
            });
        }
        var $field = (0, _jquery2.default)('#id_' + namePrefix + fieldName);
        if (!$field.length && (fieldName == 'pk' || fieldName == 'position')) {
            var $group = (0, _jquery2.default)('#' + prefix + '-group'),
                fieldNameData = $group.djnData('fieldNames') || {};
            fieldName = fieldNameData[fieldName];
            if (!fieldName) {
                return $empty;
            }
            $field = (0, _jquery2.default)('#id_' + namePrefix + fieldName);
        }
        return $field;
    };
}

if (typeof _jquery2.default.fn.djangoFormField != 'function') {
    /**
     * Given a django model's field name, and the forms index in the
     * formset, returns the field's input element, or an empty jQuery
     * object on failure.
     *
     * @param String fieldName - 'pk', 'position', or the field's
     *                           name in django (e.g. 'content_type',
     *                           'url', etc.)
     * @return jQuery object containing the field's input element, or
     *         an empty jQuery object on failure
     */
    _jquery2.default.fn.djangoFormField = function (fieldName, index) {
        var prefixAndIndex = this.djangoPrefixIndex();
        var $empty = (0, _jquery2.default)([]);
        if (!prefixAndIndex) {
            return $empty;
        }
        var prefix = prefixAndIndex[0];
        if (typeof index == 'undefined') {
            index = prefixAndIndex[1];
            if (typeof index == 'undefined') {
                return $empty;
            }
        }
        return _jquery2.default.djangoFormField(fieldName, prefix, index);
    };
}

if (typeof _jquery2.default.fn.filterDjangoField != 'function') {
    var djRegexCache = {};
    _jquery2.default.fn.filterDjangoField = function (prefix, fieldName, index) {
        var $field, fieldNameData;
        if (typeof index != 'undefined') {
            if (typeof index == 'string') {
                index = parseInt(index, 10);
            }
            if (typeof index == 'number' && !isNaN(index)) {
                var fieldId = 'id_' + prefix + '-' + index + '-' + fieldName;
                $field = (0, _jquery2.default)('#' + fieldId);
            }
        } else {
            if (_typeof(djRegexCache[prefix]) != 'object') {
                djRegexCache[prefix] = {};
            }
            if (typeof djRegexCache[prefix][fieldName] == 'undefined') {
                djRegexCache[prefix][fieldName] = new RegExp('^' + prefix + '-\\d+-' + fieldName + '$');
            }
            $field = this.find('input[name$="' + fieldName + '"]').filter(function () {
                return this.getAttribute('name').match(djRegexCache[prefix][fieldName]);
            });
        }
        if (!$field.length && (fieldName == 'pk' || fieldName == 'position')) {
            fieldNameData = (0, _jquery2.default)('#' + prefix + '-group').djnData('fieldNames') || {};
            if (_typeof(fieldNameData[fieldName]) && fieldNameData[fieldName] != fieldName) {
                $field = (0, _jquery2.default)(this).filterDjangoField(prefix, fieldNameData[fieldName], index);
            }
        }
        return $field;
    };
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*!
 * jQuery UI Sortable @VERSION
 * http://jqueryui.com
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license.
 * http://jquery.org/license
 *
 * http://api.jqueryui.com/sortable/
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
if (_jquery2.default.ui === undefined) {
	var jQuery = _jquery2.default;
	(function (e, t) {
		function i(t, i) {
			var s,
			    n,
			    r,
			    o = t.nodeName.toLowerCase();return "area" === o ? (s = t.parentNode, n = s.name, t.href && n && "map" === s.nodeName.toLowerCase() ? (r = e("img[usemap=#" + n + "]")[0], !!r && a(r)) : !1) : (/input|select|textarea|button|object/.test(o) ? !t.disabled : "a" === o ? t.href || i : i) && a(t);
		}function a(t) {
			return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
				return "hidden" === e.css(this, "visibility");
			}).length;
		}var s = 0,
		    n = /^ui-id-\d+$/;e.ui = e.ui || {}, e.extend(e.ui, { version: "1.10.3", keyCode: { BACKSPACE: 8, COMMA: 188, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, LEFT: 37, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SPACE: 32, TAB: 9, UP: 38 } }), e.fn.extend({ focus: function (t) {
				return function (i, a) {
					return "number" == typeof i ? this.each(function () {
						var t = this;setTimeout(function () {
							e(t).focus(), a && a.call(t);
						}, i);
					}) : t.apply(this, arguments);
				};
			}(e.fn.focus), scrollParent: function scrollParent() {
				var t;return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
					return (/(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
					);
				}).eq(0) : this.parents().filter(function () {
					return (/(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"))
					);
				}).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t;
			}, zIndex: function zIndex(i) {
				if (i !== t) return this.css("zIndex", i);if (this.length) for (var a, s, n = e(this[0]); n.length && n[0] !== document;) {
					if (a = n.css("position"), ("absolute" === a || "relative" === a || "fixed" === a) && (s = parseInt(n.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;n = n.parent();
				}return 0;
			}, uniqueId: function uniqueId() {
				return this.each(function () {
					this.id || (this.id = "ui-id-" + ++s);
				});
			}, removeUniqueId: function removeUniqueId() {
				return this.each(function () {
					n.test(this.id) && e(this).removeAttr("id");
				});
			} }), e.extend(e.expr[":"], { data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
				return function (i) {
					return !!e.data(i, t);
				};
			}) : function (t, i, a) {
				return !!e.data(t, a[3]);
			}, focusable: function focusable(t) {
				return i(t, !isNaN(e.attr(t, "tabindex")));
			}, tabbable: function tabbable(t) {
				var a = e.attr(t, "tabindex"),
				    s = isNaN(a);return (s || a >= 0) && i(t, !s);
			} }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, a) {
			function s(t, i, a, s) {
				return e.each(n, function () {
					i -= parseFloat(e.css(t, "padding" + this)) || 0, a && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0);
				}), i;
			}var n = "Width" === a ? ["Left", "Right"] : ["Top", "Bottom"],
			    r = a.toLowerCase(),
			    o = { innerWidth: e.fn.innerWidth, innerHeight: e.fn.innerHeight, outerWidth: e.fn.outerWidth, outerHeight: e.fn.outerHeight };e.fn["inner" + a] = function (i) {
				return i === t ? o["inner" + a].call(this) : this.each(function () {
					e(this).css(r, s(this, i) + "px");
				});
			}, e.fn["outer" + a] = function (t, i) {
				return "number" != typeof t ? o["outer" + a].call(this, t) : this.each(function () {
					e(this).css(r, s(this, t, !0, i) + "px");
				});
			};
		}), e.fn.addBack || (e.fn.addBack = function (e) {
			return this.add(null == e ? this.prevObject : this.prevObject.filter(e));
		}), e("<a>").data("a-b", "a").removeData("a-b").data("a-b") && (e.fn.removeData = function (t) {
			return function (i) {
				return arguments.length ? t.call(this, e.camelCase(i)) : t.call(this);
			};
		}(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({ disableSelection: function disableSelection() {
				return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
					e.preventDefault();
				});
			}, enableSelection: function enableSelection() {
				return this.unbind(".ui-disableSelection");
			} }), e.extend(e.ui, { plugin: { add: function add(t, i, a) {
					var s,
					    n = e.ui[t].prototype;for (s in a) {
						n.plugins[s] = n.plugins[s] || [], n.plugins[s].push([i, a[s]]);
					}
				}, call: function call(e, t, i) {
					var a,
					    s = e.plugins[t];if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (a = 0; s.length > a; a++) {
						e.options[s[a][0]] && s[a][1].apply(e.element, i);
					}
				} }, hasScroll: function hasScroll(t, i) {
				if ("hidden" === e(t).css("overflow")) return !1;var a = i && "left" === i ? "scrollLeft" : "scrollTop",
				    s = !1;return t[a] > 0 ? !0 : (t[a] = 1, s = t[a] > 0, t[a] = 0, s);
			} });
	})(jQuery);(function (e, t) {
		var i = 0,
		    s = Array.prototype.slice,
		    a = e.cleanData;e.cleanData = function (t) {
			for (var i, s = 0; null != (i = t[s]); s++) {
				try {
					e(i).triggerHandler("remove");
				} catch (n) {}
			}a(t);
		}, e.widget = function (i, s, a) {
			var n,
			    r,
			    o,
			    h,
			    l = {},
			    u = i.split(".")[0];i = i.split(".")[1], n = u + "-" + i, a || (a = s, s = e.Widget), e.expr[":"][n.toLowerCase()] = function (t) {
				return !!e.data(t, n);
			}, e[u] = e[u] || {}, r = e[u][i], o = e[u][i] = function (e, i) {
				return this._createWidget ? (arguments.length && this._createWidget(e, i), t) : new o(e, i);
			}, e.extend(o, r, { version: a.version, _proto: e.extend({}, a), _childConstructors: [] }), h = new s(), h.options = e.widget.extend({}, h.options), e.each(a, function (i, a) {
				return e.isFunction(a) ? (l[i] = function () {
					var e = function e() {
						return s.prototype[i].apply(this, arguments);
					},
					    t = function t(e) {
						return s.prototype[i].apply(this, e);
					};return function () {
						var i,
						    s = this._super,
						    n = this._superApply;return this._super = e, this._superApply = t, i = a.apply(this, arguments), this._super = s, this._superApply = n, i;
					};
				}(), t) : (l[i] = a, t);
			}), o.prototype = e.widget.extend(h, { widgetEventPrefix: r ? h.widgetEventPrefix : i }, l, { constructor: o, namespace: u, widgetName: i, widgetFullName: n }), r ? (e.each(r._childConstructors, function (t, i) {
				var s = i.prototype;e.widget(s.namespace + "." + s.widgetName, o, i._proto);
			}), delete r._childConstructors) : s._childConstructors.push(o), e.widget.bridge(i, o);
		}, e.widget.extend = function (i) {
			for (var a, n, r = s.call(arguments, 1), o = 0, h = r.length; h > o; o++) {
				for (a in r[o]) {
					n = r[o][a], r[o].hasOwnProperty(a) && n !== t && (i[a] = e.isPlainObject(n) ? e.isPlainObject(i[a]) ? e.widget.extend({}, i[a], n) : e.widget.extend({}, n) : n);
				}
			}return i;
		}, e.widget.bridge = function (i, a) {
			var n = a.prototype.widgetFullName || i;e.fn[i] = function (r) {
				var o = "string" == typeof r,
				    h = s.call(arguments, 1),
				    l = this;return r = !o && h.length ? e.widget.extend.apply(null, [r].concat(h)) : r, o ? this.each(function () {
					var s,
					    a = e.data(this, n);return a ? e.isFunction(a[r]) && "_" !== r.charAt(0) ? (s = a[r].apply(a, h), s !== a && s !== t ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : t) : e.error("no such method '" + r + "' for " + i + " widget instance") : e.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + r + "'");
				}) : this.each(function () {
					var t = e.data(this, n);t ? t.option(r || {})._init() : e.data(this, n, new a(r, this));
				}), l;
			};
		}, e.Widget = function () {}, e.Widget._childConstructors = [], e.Widget.prototype = { widgetName: "widget", widgetEventPrefix: "", defaultElement: "<div>", options: { disabled: !1, create: null }, _createWidget: function _createWidget(t, s) {
				s = e(s || this.defaultElement || this)[0], this.element = e(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), s !== this && (e.data(s, this.widgetFullName, this), this._on(!0, this.element, { remove: function remove(e) {
						e.target === s && this.destroy();
					} }), this.document = e(s.style ? s.ownerDocument : s.document || s), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
			}, _getCreateOptions: e.noop, _getCreateEventData: e.noop, _create: e.noop, _init: e.noop, destroy: function destroy() {
				this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
			}, _destroy: e.noop, widget: function widget() {
				return this.element;
			}, option: function option(i, s) {
				var a,
				    n,
				    r,
				    o = i;if (0 === arguments.length) return e.widget.extend({}, this.options);if ("string" == typeof i) if (o = {}, a = i.split("."), i = a.shift(), a.length) {
					for (n = o[i] = e.widget.extend({}, this.options[i]), r = 0; a.length - 1 > r; r++) {
						n[a[r]] = n[a[r]] || {}, n = n[a[r]];
					}if (i = a.pop(), s === t) return n[i] === t ? null : n[i];n[i] = s;
				} else {
					if (s === t) return this.options[i] === t ? null : this.options[i];o[i] = s;
				}return this._setOptions(o), this;
			}, _setOptions: function _setOptions(e) {
				var t;for (t in e) {
					this._setOption(t, e[t]);
				}return this;
			}, _setOption: function _setOption(e, t) {
				return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
			}, enable: function enable() {
				return this._setOption("disabled", !1);
			}, disable: function disable() {
				return this._setOption("disabled", !0);
			}, _on: function _on(i, s, a) {
				var n,
				    r = this;"boolean" != typeof i && (a = s, s = i, i = !1), a ? (s = n = e(s), this.bindings = this.bindings.add(s)) : (a = s, s = this.element, n = this.widget()), e.each(a, function (a, o) {
					function h() {
						return i || r.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? r[o] : o).apply(r, arguments) : t;
					}"string" != typeof o && (h.guid = o.guid = o.guid || h.guid || e.guid++);var l = a.match(/^(\w+)\s*(.*)$/),
					    u = l[1] + r.eventNamespace,
					    c = l[2];c ? n.delegate(c, u, h) : s.bind(u, h);
				});
			}, _off: function _off(e, t) {
				t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t);
			}, _delay: function _delay(e, t) {
				function i() {
					return ("string" == typeof e ? s[e] : e).apply(s, arguments);
				}var s = this;return setTimeout(i, t || 0);
			}, _hoverable: function _hoverable(t) {
				this.hoverable = this.hoverable.add(t), this._on(t, { mouseenter: function mouseenter(t) {
						e(t.currentTarget).addClass("ui-state-hover");
					}, mouseleave: function mouseleave(t) {
						e(t.currentTarget).removeClass("ui-state-hover");
					} });
			}, _focusable: function _focusable(t) {
				this.focusable = this.focusable.add(t), this._on(t, { focusin: function focusin(t) {
						e(t.currentTarget).addClass("ui-state-focus");
					}, focusout: function focusout(t) {
						e(t.currentTarget).removeClass("ui-state-focus");
					} });
			}, _trigger: function _trigger(t, i, s) {
				var a,
				    n,
				    r = this.options[t];if (s = s || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], n = i.originalEvent) for (a in n) {
					a in i || (i[a] = n[a]);
				}return this.element.trigger(i, s), !(e.isFunction(r) && r.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented());
			} }, e.each({ show: "fadeIn", hide: "fadeOut" }, function (t, i) {
			e.Widget.prototype["_" + t] = function (s, a, n) {
				"string" == typeof a && (a = { effect: a });var r,
				    o = a ? a === !0 || "number" == typeof a ? i : a.effect || i : t;a = a || {}, "number" == typeof a && (a = { duration: a }), r = !e.isEmptyObject(a), a.complete = n, a.delay && s.delay(a.delay), r && e.effects && e.effects.effect[o] ? s[t](a) : o !== t && s[o] ? s[o](a.duration, a.easing, n) : s.queue(function (i) {
					e(this)[t](), n && n.call(s[0]), i();
				});
			};
		});
	})(jQuery);(function (e) {
		var t = !1;e(document).mouseup(function () {
			t = !1;
		}), e.widget("ui.mouse", { version: "1.10.3", options: { cancel: "input,textarea,button,select,option", distance: 1, delay: 0 }, _mouseInit: function _mouseInit() {
				var t = this;this.element.bind("mousedown." + this.widgetName, function (e) {
					return t._mouseDown(e);
				}).bind("click." + this.widgetName, function (i) {
					return !0 === e.data(i.target, t.widgetName + ".preventClickEvent") ? (e.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined;
				}), this.started = !1;
			}, _mouseDestroy: function _mouseDestroy() {
				this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
			}, _mouseDown: function _mouseDown(i) {
				if (!t) {
					this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;var s = this,
					    a = 1 === i.which,
					    n = "string" == typeof this.options.cancel && i.target.nodeName ? e(i.target).closest(this.options.cancel).length : !1;return a && !n && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
						s.mouseDelayMet = !0;
					}, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === e.data(i.target, this.widgetName + ".preventClickEvent") && e.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
						return s._mouseMove(e);
					}, this._mouseUpDelegate = function (e) {
						return s._mouseUp(e);
					}, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), t = !0, !0)) : !0;
				}
			}, _mouseMove: function _mouseMove(t) {
				return e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted);
			}, _mouseUp: function _mouseUp(t) {
				return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1;
			}, _mouseDistanceMet: function _mouseDistanceMet(e) {
				return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance;
			}, _mouseDelayMet: function _mouseDelayMet() {
				return this.mouseDelayMet;
			}, _mouseStart: function _mouseStart() {}, _mouseDrag: function _mouseDrag() {}, _mouseStop: function _mouseStop() {}, _mouseCapture: function _mouseCapture() {
				return !0;
			} });
	})(jQuery);(function (e, t) {
		function i(e, t, i) {
			return [parseFloat(e[0]) * (p.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (p.test(e[1]) ? i / 100 : 1)];
		}function s(t, i) {
			return parseInt(e.css(t, i), 10) || 0;
		}function a(t) {
			var i = t[0];return 9 === i.nodeType ? { width: t.width(), height: t.height(), offset: { top: 0, left: 0 } } : e.isWindow(i) ? { width: t.width(), height: t.height(), offset: { top: t.scrollTop(), left: t.scrollLeft() } } : i.preventDefault ? { width: 0, height: 0, offset: { top: i.pageY, left: i.pageX } } : { width: t.outerWidth(), height: t.outerHeight(), offset: t.offset() };
		}e.ui = e.ui || {};var n,
		    r = Math.max,
		    o = Math.abs,
		    h = Math.round,
		    l = /left|center|right/,
		    u = /top|center|bottom/,
		    c = /[\+\-]\d+(\.[\d]+)?%?/,
		    d = /^\w+/,
		    p = /%$/,
		    f = e.fn.position;e.position = { scrollbarWidth: function scrollbarWidth() {
				if (n !== t) return n;var i,
				    s,
				    a = e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
				    r = a.children()[0];return e("body").append(a), i = r.offsetWidth, a.css("overflow", "scroll"), s = r.offsetWidth, i === s && (s = a[0].clientWidth), a.remove(), n = i - s;
			}, getScrollInfo: function getScrollInfo(t) {
				var i = t.isWindow ? "" : t.element.css("overflow-x"),
				    s = t.isWindow ? "" : t.element.css("overflow-y"),
				    a = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
				    n = "scroll" === s || "auto" === s && t.height < t.element[0].scrollHeight;return { width: n ? e.position.scrollbarWidth() : 0, height: a ? e.position.scrollbarWidth() : 0 };
			}, getWithinInfo: function getWithinInfo(t) {
				var i = e(t || window),
				    s = e.isWindow(i[0]);return { element: i, isWindow: s, offset: i.offset() || { left: 0, top: 0 }, scrollLeft: i.scrollLeft(), scrollTop: i.scrollTop(), width: s ? i.width() : i.outerWidth(), height: s ? i.height() : i.outerHeight() };
			} }, e.fn.position = function (t) {
			if (!t || !t.of) return f.apply(this, arguments);t = e.extend({}, t);var n,
			    p,
			    m,
			    g,
			    v,
			    y,
			    b = e(t.of),
			    _ = e.position.getWithinInfo(t.within),
			    x = e.position.getScrollInfo(_),
			    k = (t.collision || "flip").split(" "),
			    w = {};return y = a(b), b[0].preventDefault && (t.at = "left top"), p = y.width, m = y.height, g = y.offset, v = e.extend({}, g), e.each(["my", "at"], function () {
				var e,
				    i,
				    s = (t[this] || "").split(" ");1 === s.length && (s = l.test(s[0]) ? s.concat(["center"]) : u.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = l.test(s[0]) ? s[0] : "center", s[1] = u.test(s[1]) ? s[1] : "center", e = c.exec(s[0]), i = c.exec(s[1]), w[this] = [e ? e[0] : 0, i ? i[0] : 0], t[this] = [d.exec(s[0])[0], d.exec(s[1])[0]];
			}), 1 === k.length && (k[1] = k[0]), "right" === t.at[0] ? v.left += p : "center" === t.at[0] && (v.left += p / 2), "bottom" === t.at[1] ? v.top += m : "center" === t.at[1] && (v.top += m / 2), n = i(w.at, p, m), v.left += n[0], v.top += n[1], this.each(function () {
				var a,
				    l,
				    u = e(this),
				    c = u.outerWidth(),
				    d = u.outerHeight(),
				    f = s(this, "marginLeft"),
				    y = s(this, "marginTop"),
				    D = c + f + s(this, "marginRight") + x.width,
				    T = d + y + s(this, "marginBottom") + x.height,
				    M = e.extend({}, v),
				    S = i(w.my, u.outerWidth(), u.outerHeight());"right" === t.my[0] ? M.left -= c : "center" === t.my[0] && (M.left -= c / 2), "bottom" === t.my[1] ? M.top -= d : "center" === t.my[1] && (M.top -= d / 2), M.left += S[0], M.top += S[1], e.support.offsetFractions || (M.left = h(M.left), M.top = h(M.top)), a = { marginLeft: f, marginTop: y }, e.each(["left", "top"], function (i, s) {
					e.ui.position[k[i]] && e.ui.position[k[i]][s](M, { targetWidth: p, targetHeight: m, elemWidth: c, elemHeight: d, collisionPosition: a, collisionWidth: D, collisionHeight: T, offset: [n[0] + S[0], n[1] + S[1]], my: t.my, at: t.at, within: _, elem: u });
				}), t.using && (l = function l(e) {
					var i = g.left - M.left,
					    s = i + p - c,
					    a = g.top - M.top,
					    n = a + m - d,
					    h = { target: { element: b, left: g.left, top: g.top, width: p, height: m }, element: { element: u, left: M.left, top: M.top, width: c, height: d }, horizontal: 0 > s ? "left" : i > 0 ? "right" : "center", vertical: 0 > n ? "top" : a > 0 ? "bottom" : "middle" };c > p && p > o(i + s) && (h.horizontal = "center"), d > m && m > o(a + n) && (h.vertical = "middle"), h.important = r(o(i), o(s)) > r(o(a), o(n)) ? "horizontal" : "vertical", t.using.call(this, e, h);
				}), u.offset(e.extend(M, { using: l }));
			});
		}, e.ui.position = { fit: { left: function left(e, t) {
					var i,
					    s = t.within,
					    a = s.isWindow ? s.scrollLeft : s.offset.left,
					    n = s.width,
					    o = e.left - t.collisionPosition.marginLeft,
					    h = a - o,
					    l = o + t.collisionWidth - n - a;t.collisionWidth > n ? h > 0 && 0 >= l ? (i = e.left + h + t.collisionWidth - n - a, e.left += h - i) : e.left = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionWidth : a : h > 0 ? e.left += h : l > 0 ? e.left -= l : e.left = r(e.left - o, e.left);
				}, top: function top(e, t) {
					var i,
					    s = t.within,
					    a = s.isWindow ? s.scrollTop : s.offset.top,
					    n = t.within.height,
					    o = e.top - t.collisionPosition.marginTop,
					    h = a - o,
					    l = o + t.collisionHeight - n - a;t.collisionHeight > n ? h > 0 && 0 >= l ? (i = e.top + h + t.collisionHeight - n - a, e.top += h - i) : e.top = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionHeight : a : h > 0 ? e.top += h : l > 0 ? e.top -= l : e.top = r(e.top - o, e.top);
				} }, flip: { left: function left(e, t) {
					var i,
					    s,
					    a = t.within,
					    n = a.offset.left + a.scrollLeft,
					    r = a.width,
					    h = a.isWindow ? a.scrollLeft : a.offset.left,
					    l = e.left - t.collisionPosition.marginLeft,
					    u = l - h,
					    c = l + t.collisionWidth - r - h,
					    d = "left" === t.my[0] ? -t.elemWidth : "right" === t.my[0] ? t.elemWidth : 0,
					    p = "left" === t.at[0] ? t.targetWidth : "right" === t.at[0] ? -t.targetWidth : 0,
					    f = -2 * t.offset[0];0 > u ? (i = e.left + d + p + f + t.collisionWidth - r - n, (0 > i || o(u) > i) && (e.left += d + p + f)) : c > 0 && (s = e.left - t.collisionPosition.marginLeft + d + p + f - h, (s > 0 || c > o(s)) && (e.left += d + p + f));
				}, top: function top(e, t) {
					var i,
					    s,
					    a = t.within,
					    n = a.offset.top + a.scrollTop,
					    r = a.height,
					    h = a.isWindow ? a.scrollTop : a.offset.top,
					    l = e.top - t.collisionPosition.marginTop,
					    u = l - h,
					    c = l + t.collisionHeight - r - h,
					    d = "top" === t.my[1],
					    p = d ? -t.elemHeight : "bottom" === t.my[1] ? t.elemHeight : 0,
					    f = "top" === t.at[1] ? t.targetHeight : "bottom" === t.at[1] ? -t.targetHeight : 0,
					    m = -2 * t.offset[1];0 > u ? (s = e.top + p + f + m + t.collisionHeight - r - n, e.top + p + f + m > u && (0 > s || o(u) > s) && (e.top += p + f + m)) : c > 0 && (i = e.top - t.collisionPosition.marginTop + p + f + m - h, e.top + p + f + m > c && (i > 0 || c > o(i)) && (e.top += p + f + m));
				} }, flipfit: { left: function left() {
					e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments);
				}, top: function top() {
					e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments);
				} } }, function () {
			var t,
			    i,
			    s,
			    a,
			    n,
			    r = document.getElementsByTagName("body")[0],
			    o = document.createElement("div");t = document.createElement(r ? "div" : "body"), s = { visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none" }, r && e.extend(s, { position: "absolute", left: "-1000px", top: "-1000px" });for (n in s) {
				t.style[n] = s[n];
			}t.appendChild(o), i = r || document.documentElement, i.insertBefore(t, i.firstChild), o.style.cssText = "position: absolute; left: 10.7432222px;", a = e(o).offset().left, e.support.offsetFractions = a > 10 && 11 > a, t.innerHTML = "", i.removeChild(t);
		}();
	})(jQuery);
}

_jquery2.default.widget("ui.djnsortable", _jquery2.default.ui.mouse, {
	version: "@VERSION",
	widgetEventPrefix: "sort",
	ready: false,
	options: {
		appendTo: "parent",
		axis: false,
		connectWith: false,
		containment: false,
		cursor: 'auto',
		cursorAt: false,
		dropOnEmpty: true,
		forcePlaceholderSize: false,
		forceHelperSize: false,
		grid: false,
		handle: false,
		helper: "original",
		items: '> *',
		opacity: false,
		placeholder: false,
		revert: false,
		scroll: true,
		scrollSensitivity: 20,
		scrollSpeed: 20,
		scope: "default",
		tolerance: "intersect",
		zIndex: 1000
	},

	_isOverAxis: function _isOverAxis(x, reference, size) {
		return x >= reference && x < reference + size;
	},

	_create: function _create() {

		var o = this.options;
		this.containerCache = {};
		this.element.addClass("ui-sortable");

		//Get the items
		this.refresh();

		//Let's determine if the items are being displayed horizontally
		this.floating = this.items.length ? o.axis === 'x' || /left|right/.test(this.items[0].item.css('float')) || /inline|table-cell/.test(this.items[0].item.css('display')) : false;

		//Let's determine the parent's offset
		this.offset = this.element.offset();

		//Initialize mouse events for interaction
		this._mouseInit();

		//We're ready to go
		this.ready = true;
	},

	_destroy: function _destroy() {
		this.element.removeClass("ui-sortable ui-sortable-disabled");
		this._mouseDestroy();

		for (var i = this.items.length - 1; i >= 0; i--) {
			this.items[i].item.removeData(this.widgetName + "-item");
		}return this;
	},

	_setOption: function _setOption(key, value) {
		if (key === "disabled") {
			this.options[key] = value;

			this.widget().toggleClass("ui-sortable-disabled", !!value);
		} else {
			// Don't call widget base _setOption for disable as it adds ui-state-disabled class
			_jquery2.default.Widget.prototype._setOption.apply(this, arguments);
		}
	},

	_mouseCapture: function _mouseCapture(event, overrideHandle) {
		var that = this;

		if (this.reverting) {
			return false;
		}

		if (this.options.disabled || this.options.type == 'static') return false;

		//We have to refresh the items data once first
		this._refreshItems(event);

		//Find out if the clicked node (or one of its parents) is a actual item in this.items
		var currentItem = null,
		    nodes = (0, _jquery2.default)(event.target).parents().each(function () {
			if (_jquery2.default.data(this, that.widgetName + '-item') == that) {
				currentItem = (0, _jquery2.default)(this);
				return false;
			}
		});
		if (_jquery2.default.data(event.target, that.widgetName + '-item') == that) currentItem = (0, _jquery2.default)(event.target);

		if (!currentItem) return false;
		if (this.options.handle && !overrideHandle) {
			var validHandle = false;

			(0, _jquery2.default)(this.options.handle, currentItem).find("*").andSelf().each(function () {
				if (this == event.target) validHandle = true;
			});
			if (!validHandle) return false;
		}

		this.currentItem = currentItem;
		this._removeCurrentsFromItems();
		return true;
	},

	_mouseStart: function _mouseStart(event, overrideHandle, noActivation) {

		var o = this.options;
		this.currentContainer = this;

		//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
		this.refreshPositions();

		//Create and append the visible helper
		this.helper = this._createHelper(event);

		//Cache the helper size
		this._cacheHelperProportions();

		/*
   * - Position generation -
   * This block generates everything position related - it's the core of draggables.
   */

		//Cache the margins of the original element
		this._cacheMargins();

		//Get the next scrolling parent
		this.scrollParent = this.helper.scrollParent();

		//The element's absolute position on the page minus margins
		this.offset = this.currentItem.offset();
		this.offset = {
			top: this.offset.top - this.margins.top,
			left: this.offset.left - this.margins.left
		};

		_jquery2.default.extend(this.offset, {
			click: { //Where the click happened, relative to the element
				left: event.pageX - this.offset.left,
				top: event.pageY - this.offset.top
			},
			parent: this._getParentOffset(),
			relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
		});

		// Only after we got the offset, we can change the helper's position to absolute
		// TODO: Still need to figure out a way to make relative sorting possible
		this.helper.css("position", "absolute");
		this.cssPosition = this.helper.css("position");

		//Generate the original position
		this.originalPosition = this._generatePosition(event);
		this.originalPageX = event.pageX;
		this.originalPageY = event.pageY;

		//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
		o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt);

		//Cache the former DOM position
		this.domPosition = { prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0] };

		//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
		if (this.helper[0] != this.currentItem[0]) {
			this.currentItem.hide();
		}

		//Create the placeholder
		this._createPlaceholder();

		//Set a containment if given in the options
		if (o.containment) this._setContainment();

		if (o.cursor) {
			// cursor option
			if ((0, _jquery2.default)('body').css("cursor")) this._storedCursor = (0, _jquery2.default)('body').css("cursor");
			(0, _jquery2.default)('body').css("cursor", o.cursor);
		}

		if (o.opacity) {
			// opacity option
			if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
			this.helper.css("opacity", o.opacity);
		}

		if (o.zIndex) {
			// zIndex option
			if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
			this.helper.css("zIndex", o.zIndex);
		}

		//Prepare scrolling
		if (this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') this.overflowOffset = this.scrollParent.offset();

		//Call callbacks
		this._trigger("start", event, this._uiHash());

		//Recache the helper size
		if (!this._preserveHelperProportions) this._cacheHelperProportions();

		//Post 'activate' events to possible containers
		if (!noActivation) {
			for (var i = this.containers.length - 1; i >= 0; i--) {
				this.containers[i]._trigger("activate", event, this._uiHash(this));
			}
		}

		//Prepare possible droppables
		if (_jquery2.default.ui.ddmanager) _jquery2.default.ui.ddmanager.current = this;

		if (_jquery2.default.ui.ddmanager && !o.dropBehaviour) _jquery2.default.ui.ddmanager.prepareOffsets(this, event);

		this.dragging = true;

		this.helper.addClass("ui-sortable-helper");
		this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
		return true;
	},

	_mouseDrag: function _mouseDrag(event) {

		//Compute the helpers position
		this.position = this._generatePosition(event);
		this.positionAbs = this._convertPositionTo("absolute");

		if (!this.lastPositionAbs) {
			this.lastPositionAbs = this.positionAbs;
		}

		//Do scrolling
		if (this.options.scroll) {
			var o = this.options,
			    scrolled = false;
			if (this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

				if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

				if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
			} else {

				if (event.pageY - (0, _jquery2.default)(document).scrollTop() < o.scrollSensitivity) scrolled = (0, _jquery2.default)(document).scrollTop((0, _jquery2.default)(document).scrollTop() - o.scrollSpeed);else if ((0, _jquery2.default)(window).height() - (event.pageY - (0, _jquery2.default)(document).scrollTop()) < o.scrollSensitivity) scrolled = (0, _jquery2.default)(document).scrollTop((0, _jquery2.default)(document).scrollTop() + o.scrollSpeed);

				if (event.pageX - (0, _jquery2.default)(document).scrollLeft() < o.scrollSensitivity) scrolled = (0, _jquery2.default)(document).scrollLeft((0, _jquery2.default)(document).scrollLeft() - o.scrollSpeed);else if ((0, _jquery2.default)(window).width() - (event.pageX - (0, _jquery2.default)(document).scrollLeft()) < o.scrollSensitivity) scrolled = (0, _jquery2.default)(document).scrollLeft((0, _jquery2.default)(document).scrollLeft() + o.scrollSpeed);
			}

			if (scrolled !== false && _jquery2.default.ui.ddmanager && !o.dropBehaviour) _jquery2.default.ui.ddmanager.prepareOffsets(this, event);
		}

		//Regenerate the absolute position used for position checks
		this.positionAbs = this._convertPositionTo("absolute");

		//Set the helper position
		if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + 'px';
		if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + 'px';

		//Rearrange
		for (var i = this.items.length - 1; i >= 0; i--) {

			//Cache variables and intersection, continue if no intersection
			var item = this.items[i],
			    itemElement = item.item[0],
			    intersection = this._intersectsWithPointer(item);
			if (!intersection) continue;

			// Only put the placeholder inside the current Container, skip all
			// items form other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this moving items in "sub-sortables" can cause the placeholder to jitter
			// beetween the outer and inner container.
			if (item.instance !== this.currentContainer) continue;

			if (itemElement != this.currentItem[0] //cannot intersect with itself
			&& this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
			&& !_jquery2.default.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
			&& (this.options.type == 'semi-dynamic' ? !_jquery2.default.contains(this.element[0], itemElement) : true)
			//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
			) {

					this.direction = intersection == 1 ? "down" : "up";

					if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
						this._rearrange(event, item);
					} else {
						break;
					}

					this._trigger("change", event, this._uiHash());
					break;
				}
		}

		//Post events to containers
		this._contactContainers(event);

		//Interconnect with droppables
		if (_jquery2.default.ui.ddmanager) _jquery2.default.ui.ddmanager.drag(this, event);

		//Call callbacks
		this._trigger('sort', event, this._uiHash());

		this.lastPositionAbs = this.positionAbs;
		return false;
	},

	_mouseStop: function _mouseStop(event, noPropagation) {

		if (!event) return;

		//If we are using droppables, inform the manager about the drop
		if (_jquery2.default.ui.ddmanager && !this.options.dropBehaviour) _jquery2.default.ui.ddmanager.drop(this, event);

		if (this.options.revert) {
			var that = this;
			var cur = this.placeholder.offset();

			this.reverting = true;

			(0, _jquery2.default)(this.helper).animate({
				left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
				top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
			}, parseInt(this.options.revert, 10) || 500, function () {
				that._clear(event);
			});
		} else {
			this._clear(event, noPropagation);
		}

		return false;
	},

	cancel: function cancel() {

		if (this.dragging) {

			this._mouseUp({ target: null });

			if (this.options.helper == "original") this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");else this.currentItem.show();

			//Post deactivating events to containers
			for (var i = this.containers.length - 1; i >= 0; i--) {
				this.containers[i]._trigger("deactivate", null, this._uiHash(this));
				if (this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", null, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}
		}

		if (this.placeholder) {
			//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
			if (this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
			if (this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

			_jquery2.default.extend(this, {
				helper: null,
				dragging: false,
				reverting: false,
				_noFinalSort: null
			});

			if (this.domPosition.prev) {
				(0, _jquery2.default)(this.domPosition.prev).after(this.currentItem);
			} else {
				(0, _jquery2.default)(this.domPosition.parent).prepend(this.currentItem);
			}
		}

		return this;
	},

	serialize: function serialize(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var str = [];o = o || {};

		(0, _jquery2.default)(items).each(function () {
			var res = ((0, _jquery2.default)(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || /(.+)[-=_](.+)/);
			if (res) str.push((o.key || res[1] + '[]') + '=' + (o.key && o.expression ? res[1] : res[2]));
		});

		if (!str.length && o.key) {
			str.push(o.key + '=');
		}

		return str.join('&');
	},

	toArray: function toArray(o) {

		var items = this._getItemsAsjQuery(o && o.connected);
		var ret = [];o = o || {};

		items.each(function () {
			ret.push((0, _jquery2.default)(o.item || this).attr(o.attribute || 'id') || '');
		});
		return ret;
	},

	/* Be careful with the following core functions */
	_intersectsWith: function _intersectsWith(item) {

		var x1 = this.positionAbs.left,
		    x2 = x1 + this.helperProportions.width,
		    y1 = this.positionAbs.top,
		    y2 = y1 + this.helperProportions.height;

		var l = item.left,
		    r = l + item.width,
		    t = item.top,
		    b = t + Math.max(10, item.height);

		var dyClick = this.offset.click.top,
		    dxClick = this.offset.click.left;

		var isOverElement = y1 + dyClick > t && y1 + dyClick < b && x1 + dxClick > l && x1 + dxClick < r;

		if (this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height']) {
			return isOverElement;
		} else {

			return l < x1 + this.helperProportions.width / 2 // Right Half
			&& x2 - this.helperProportions.width / 2 < r // Left Half
			&& t < y1 + this.helperProportions.height / 2 // Bottom Half
			&& y2 - this.helperProportions.height / 2 < b; // Top Half
		}
	},

	_intersectsWithPointer: function _intersectsWithPointer(item) {

		var isOverElementHeight = this.options.axis === 'x' || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, Math.max(10, item.height)),
		    isOverElementWidth = this.options.axis === 'y' || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
		    isOverElement = isOverElementHeight && isOverElementWidth,
		    verticalDirection = this._getDragVerticalDirection(),
		    horizontalDirection = this._getDragHorizontalDirection();

		if (!isOverElement) return false;

		return this.floating ? horizontalDirection && horizontalDirection == "right" || verticalDirection == "down" ? 2 : 1 : verticalDirection && (verticalDirection == "down" ? 2 : 1);
	},

	_intersectsWithSides: function _intersectsWithSides(item) {

		var isOverBottomHalf = this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + Math.max(10, item.height) / 2, Math.max(10, item.height)),
		    isOverRightHalf = this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + item.width / 2, item.width),
		    verticalDirection = this._getDragVerticalDirection(),
		    horizontalDirection = this._getDragHorizontalDirection();

		if (this.floating && horizontalDirection) {
			return horizontalDirection == "right" && isOverRightHalf || horizontalDirection == "left" && !isOverRightHalf;
		} else {
			return verticalDirection && (verticalDirection == "down" && isOverBottomHalf || verticalDirection == "up" && !isOverBottomHalf);
		}
	},

	_getDragVerticalDirection: function _getDragVerticalDirection() {
		var delta = this.positionAbs.top - this.lastPositionAbs.top;
		return delta != 0 && (delta > 0 ? "down" : "up");
	},

	_getDragHorizontalDirection: function _getDragHorizontalDirection() {
		var delta = this.positionAbs.left - this.lastPositionAbs.left;
		return delta != 0 && (delta > 0 ? "right" : "left");
	},

	refresh: function refresh(event) {
		this._refreshItems(event);
		this.refreshPositions();
		return this;
	},

	_connectWith: function _connectWith() {
		var options = this.options;
		return options.connectWith.constructor == String ? [options.connectWith] : options.connectWith;
	},

	_getItemsAsjQuery: function _getItemsAsjQuery(connected) {

		var items = [];
		var queries = [];
		var connectWith = this._connectWith();

		if (connectWith && connected) {
			for (var i = connectWith.length - 1; i >= 0; i--) {
				var cur = (0, _jquery2.default)(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--) {
					var inst = _jquery2.default.data(cur[j], this.widgetName);
					if (inst && inst != this && !inst.options.disabled) {
						queries.push([_jquery2.default.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : (0, _jquery2.default)(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
					}
				};
			};
		}

		queries.push([_jquery2.default.isFunction(this.options.items) ? this.options.items.call(this.element, null, { options: this.options, item: this.currentItem }) : (0, _jquery2.default)(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

		for (var i = queries.length - 1; i >= 0; i--) {
			queries[i][0].each(function () {
				items.push(this);
			});
		};

		return (0, _jquery2.default)(items);
	},

	_removeCurrentsFromItems: function _removeCurrentsFromItems() {

		var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

		this.items = _jquery2.default.grep(this.items, function (item) {
			for (var j = 0; j < list.length; j++) {
				if (list[j] == item.item[0]) return false;
			};
			return true;
		});
	},

	_refreshItems: function _refreshItems(event) {

		this.items = [];
		this.containers = [this];
		var items = this.items;
		var queries = [[_jquery2.default.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, { item: this.currentItem }) : (0, _jquery2.default)(this.options.items, this.element), this]];
		var connectWith = this._connectWith();

		if (connectWith && this.ready) {
			//Shouldn't be run the first time through due to massive slow-down
			for (var i = connectWith.length - 1; i >= 0; i--) {
				var cur = (0, _jquery2.default)(connectWith[i]);
				for (var j = cur.length - 1; j >= 0; j--) {
					var inst = _jquery2.default.data(cur[j], this.widgetName);
					if (inst && inst != this && !inst.options.disabled) {
						queries.push([_jquery2.default.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, { item: this.currentItem }) : (0, _jquery2.default)(inst.options.items, inst.element), inst]);
						this.containers.push(inst);
					}
				};
			};
		}

		for (var i = queries.length - 1; i >= 0; i--) {
			var targetData = queries[i][1];
			var _queries = queries[i][0];

			for (var j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
				var item = (0, _jquery2.default)(_queries[j]);

				item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)

				items.push({
					item: item,
					instance: targetData,
					width: 0, height: 0,
					left: 0, top: 0
				});
			};
		};
	},

	refreshPositions: function refreshPositions(fast) {

		//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
		if (this.offsetParent && this.helper) {
			this.offset.parent = this._getParentOffset();
		}

		for (var i = this.items.length - 1; i >= 0; i--) {
			var item = this.items[i];

			//We ignore calculating positions of all connected containers when we're not over them
			if (item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0]) continue;

			var t = this.options.toleranceElement ? (0, _jquery2.default)(this.options.toleranceElement, item.item) : item.item;

			if (!fast) {
				item.width = t.outerWidth();
				item.height = t.outerHeight();
			}

			var p = t.offset();
			item.left = p.left;
			item.top = p.top;
		};

		if (this.options.custom && this.options.custom.refreshContainers) {
			this.options.custom.refreshContainers.call(this);
		} else {
			for (var i = this.containers.length - 1; i >= 0; i--) {
				var p = this.containers[i].element.offset();
				this.containers[i].containerCache.left = p.left;
				this.containers[i].containerCache.top = p.top;
				this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
				this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
			};
		}

		return this;
	},

	_createPlaceholder: function _createPlaceholder(that) {
		that = that || this;
		var o = that.options;

		if (!o.placeholder || o.placeholder.constructor == String) {
			var className = o.placeholder;
			o.placeholder = {
				element: function element() {

					var el = (0, _jquery2.default)(document.createElement(that.currentItem[0].nodeName)).addClass(className || that.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];

					if (!className) el.style.visibility = "hidden";

					return el;
				},
				update: function update(container, p) {

					// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
					// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
					if (className && !o.forcePlaceholderSize) return;

					//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
					if (!p.height()) {
						p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css('paddingTop') || 0, 10) - parseInt(that.currentItem.css('paddingBottom') || 0, 10));
					};
					if (!p.width()) {
						p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css('paddingLeft') || 0, 10) - parseInt(that.currentItem.css('paddingRight') || 0, 10));
					};
				}
			};
		}

		//Create the placeholder
		that.placeholder = (0, _jquery2.default)(o.placeholder.element.call(that.element, that.currentItem));

		//Append it after the actual current item
		that.currentItem.after(that.placeholder);

		//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
		o.placeholder.update(that, that.placeholder);
	},

	_contactContainers: function _contactContainers(event) {

		// get innermost container that intersects with item
		var innermostContainer = null,
		    innermostIndex = null;

		for (var i = this.containers.length - 1; i >= 0; i--) {

			// never consider a container that's located within the item itself
			if (_jquery2.default.contains(this.currentItem[0], this.containers[i].element[0])) continue;

			if (this._intersectsWith(this.containers[i].containerCache)) {

				// if we've already found a container and it's more "inner" than this, then continue
				if (innermostContainer && _jquery2.default.contains(this.containers[i].element[0], innermostContainer.element[0])) continue;

				innermostContainer = this.containers[i];
				innermostIndex = i;
			} else {
				// container doesn't intersect. trigger "out" event if necessary
				if (this.containers[i].containerCache.over) {
					this.containers[i]._trigger("out", event, this._uiHash(this));
					this.containers[i].containerCache.over = 0;
				}
			}
		}

		// if no intersecting containers found, return
		if (!innermostContainer) return;

		// move the item into the container if it's not there already
		if (this.containers.length === 1) {
			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		} else {

			//When entering a new container, we will find the item with the least distance and append our item near it
			var dist = 10000;var itemWithLeastDistance = null;
			var posProperty = this.containers[innermostIndex].floating ? 'left' : 'top';
			var sizeProperty = this.containers[innermostIndex].floating ? 'width' : 'height';
			var base = this.positionAbs[posProperty] + this.offset.click[posProperty];
			for (var j = this.items.length - 1; j >= 0; j--) {
				if (!_jquery2.default.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue;
				if (this.items[j].item[0] == this.currentItem[0]) continue;
				var cur = this.items[j].item.offset()[posProperty];
				var nearBottom = false;
				if (Math.abs(cur - base) > Math.abs(cur + Math.max(10, this.items[j][sizeProperty]) - base)) {
					nearBottom = true;
					cur += this.items[j][sizeProperty];
				}

				if (Math.abs(cur - base) < dist) {
					dist = Math.abs(cur - base);itemWithLeastDistance = this.items[j];
					this.direction = nearBottom ? "up" : "down";
				}
			}

			if (!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
				return;

			this.currentContainer = this.containers[innermostIndex];
			itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
			this._trigger("change", event, this._uiHash());
			this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

			//Update the placeholder
			this.options.placeholder.update(this.currentContainer, this.placeholder);

			this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
			this.containers[innermostIndex].containerCache.over = 1;
		}
	},

	_createHelper: function _createHelper(event) {

		var o = this.options;
		var helper = _jquery2.default.isFunction(o.helper) ? (0, _jquery2.default)(o.helper.apply(this.element[0], [event, this.currentItem])) : o.helper == 'clone' ? this.currentItem.clone() : this.currentItem;

		if (!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
			(0, _jquery2.default)(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

		if (helper[0] == this.currentItem[0]) this._storedCSS = { width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left") };

		if (helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
		if (helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

		return helper;
	},

	_adjustOffsetFromHelper: function _adjustOffsetFromHelper(obj) {
		if (typeof obj == 'string') {
			obj = obj.split(' ');
		}
		if (_jquery2.default.isArray(obj)) {
			obj = { left: +obj[0], top: +obj[1] || 0 };
		}
		if ('left' in obj) {
			this.offset.click.left = obj.left + this.margins.left;
		}
		if ('right' in obj) {
			this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
		}
		if ('top' in obj) {
			this.offset.click.top = obj.top + this.margins.top;
		}
		if ('bottom' in obj) {
			this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
		}
	},

	_getParentOffset: function _getParentOffset() {

		//Get the offsetParent and cache its position
		this.offsetParent = this.helper.offsetParent();
		var po = this.offsetParent.offset();

		// This is a special case where we need to modify a offset calculated on start, since the following happened:
		// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
		// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
		//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
		if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && _jquery2.default.contains(this.scrollParent[0], this.offsetParent[0])) {
			po.left += this.scrollParent.scrollLeft();
			po.top += this.scrollParent.scrollTop();
		}

		if (this.offsetParent[0] == document.body || //This needs to be actually done for all browsers, since pageX/pageY includes this information
		this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && _jquery2.default.ui.ie) //Ugly IE fix
			po = { top: 0, left: 0 };

		return {
			top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
			left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
		};
	},

	_getRelativeOffset: function _getRelativeOffset() {

		if (this.cssPosition == "relative") {
			var p = this.currentItem.position();
			return {
				top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
				left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
			};
		} else {
			return { top: 0, left: 0 };
		}
	},

	_cacheMargins: function _cacheMargins() {
		this.margins = {
			left: parseInt(this.currentItem.css("marginLeft"), 10) || 0,
			top: parseInt(this.currentItem.css("marginTop"), 10) || 0
		};
	},

	_cacheHelperProportions: function _cacheHelperProportions() {
		this.helperProportions = {
			width: this.helper.outerWidth(),
			height: this.helper.outerHeight()
		};
	},

	_setContainment: function _setContainment() {

		var o = this.options;
		if (o.containment == 'parent') o.containment = this.helper[0].parentNode;
		if (o.containment == 'document' || o.containment == 'window') this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, (0, _jquery2.default)(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, ((0, _jquery2.default)(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];

		if (!/^(document|window|parent)$/.test(o.containment)) {
			var ce = (0, _jquery2.default)(o.containment)[0];
			var co = (0, _jquery2.default)(o.containment).offset();
			var over = (0, _jquery2.default)(ce).css("overflow") != 'hidden';

			this.containment = [co.left + (parseInt((0, _jquery2.default)(ce).css("borderLeftWidth"), 10) || 0) + (parseInt((0, _jquery2.default)(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt((0, _jquery2.default)(ce).css("borderTopWidth"), 10) || 0) + (parseInt((0, _jquery2.default)(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt((0, _jquery2.default)(ce).css("borderLeftWidth"), 10) || 0) - (parseInt((0, _jquery2.default)(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt((0, _jquery2.default)(ce).css("borderTopWidth"), 10) || 0) - (parseInt((0, _jquery2.default)(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
		}
	},

	_convertPositionTo: function _convertPositionTo(d, pos) {

		if (!pos) pos = this.position;
		var mod = d == "absolute" ? 1 : -1;
		var o = this.options,
		    scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && _jquery2.default.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
		    scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);

		return {
			top: pos.top // The absolute mouse position
			+ this.offset.relative.top * mod // Only for relative positioned nodes: Relative offset from element to offset parent
			+ this.offset.parent.top * mod // The offsetParent's offset without borders (offset + border)
			- (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()) * mod,
			left: pos.left // The absolute mouse position
			+ this.offset.relative.left * mod // Only for relative positioned nodes: Relative offset from element to offset parent
			+ this.offset.parent.left * mod // The offsetParent's offset without borders (offset + border)
			- (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod
		};
	},

	_generatePosition: function _generatePosition(event) {

		var o = this.options,
		    scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && _jquery2.default.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
		    scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);

		// This is another very weird special case that only happens for relative elements:
		// 1. If the css position is relative
		// 2. and the scroll parent is the document or similar to the offset parent
		// we have to refresh the relative offset during the scroll so there are no jumps
		if (this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
			this.offset.relative = this._getRelativeOffset();
		}

		var pageX = event.pageX;
		var pageY = event.pageY;

		/*
   * - Position constraining -
   * Constrain the position to a mix of grid, containment.
   */

		if (this.originalPosition) {
			//If we are not dragging yet, we won't check for options

			if (this.containment) {
				if (event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
				if (event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
				if (event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
				if (event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
			}

			if (o.grid) {
				var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
				pageY = this.containment ? !(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : !(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1] : top;

				var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
				pageX = this.containment ? !(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : !(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0] : left;
			}
		}

		return {
			top: pageY // The absolute mouse position
			- this.offset.click.top // Click offset (relative to the element)
			- this.offset.relative.top // Only for relative positioned nodes: Relative offset from element to offset parent
			- this.offset.parent.top // The offsetParent's offset without borders (offset + border)
			+ (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()),
			left: pageX // The absolute mouse position
			- this.offset.click.left // Click offset (relative to the element)
			- this.offset.relative.left // Only for relative positioned nodes: Relative offset from element to offset parent
			- this.offset.parent.left // The offsetParent's offset without borders (offset + border)
			+ (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())
		};
	},

	_rearrange: function _rearrange(event, i, a, hardRefresh) {

		a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == 'down' ? i.item[0] : i.item[0].nextSibling);

		//Various things done here to improve the performance:
		// 1. we create a setTimeout, that calls refreshPositions
		// 2. on the instance, we have a counter variable, that get's higher after every append
		// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
		// 4. this lets only the last addition to the timeout stack through
		this.counter = this.counter ? ++this.counter : 1;
		var counter = this.counter;

		this._delay(function () {
			if (counter == this.counter) this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
		});
	},

	_clear: function _clear(event, noPropagation) {

		this.reverting = false;
		// We delay all events that have to be triggered to after the point where the placeholder has been removed and
		// everything else normalized again
		var delayedTriggers = [];

		// We first have to update the dom position of the actual currentItem
		// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
		if (!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
		this._noFinalSort = null;

		if (this.helper[0] == this.currentItem[0]) {
			for (var i in this._storedCSS) {
				if (this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
			}
			this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
		} else {
			this.currentItem.show();
		}

		if (this.fromOutside && !noPropagation) delayedTriggers.push(function (event) {
			this._trigger("receive", event, this._uiHash(this.fromOutside));
		});
		if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function (event) {
			this._trigger("update", event, this._uiHash());
		}); //Trigger update callback if the DOM position has changed

		// Check if the items Container has Changed and trigger appropriate
		// events.
		if (this !== this.currentContainer) {
			if (!noPropagation) {
				delayedTriggers.push(function (event) {
					this._trigger("remove", event, this._uiHash());
				});
				delayedTriggers.push(function (c) {
					return function (event) {
						c._trigger("receive", event, this._uiHash(this));
					};
				}.call(this, this.currentContainer));
				delayedTriggers.push(function (c) {
					return function (event) {
						c._trigger("update", event, this._uiHash(this));
					};
				}.call(this, this.currentContainer));
			}
		}

		//Post events to containers
		for (var i = this.containers.length - 1; i >= 0; i--) {
			if (!noPropagation) delayedTriggers.push(function (c) {
				return function (event) {
					c._trigger("deactivate", event, this._uiHash(this));
				};
			}.call(this, this.containers[i]));
			if (this.containers[i].containerCache.over) {
				delayedTriggers.push(function (c) {
					return function (event) {
						c._trigger("out", event, this._uiHash(this));
					};
				}.call(this, this.containers[i]));
				this.containers[i].containerCache.over = 0;
			}
		}

		//Do what was originally in plugins
		if (this._storedCursor) (0, _jquery2.default)('body').css("cursor", this._storedCursor); //Reset cursor
		if (this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
		if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

		this.dragging = false;
		if (this.cancelHelperRemoval) {
			if (!noPropagation) {
				this._trigger("beforeStop", event, this._uiHash());
				for (var i = 0; i < delayedTriggers.length; i++) {
					delayedTriggers[i].call(this, event);
				}; //Trigger all delayed events
				this._trigger("stop", event, this._uiHash());
			}

			this.fromOutside = false;
			return false;
		}

		if (!noPropagation) this._trigger("beforeStop", event, this._uiHash());

		//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
		this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

		if (this.helper[0] != this.currentItem[0]) this.helper.remove();this.helper = null;

		if (!noPropagation) {
			for (var i = 0; i < delayedTriggers.length; i++) {
				delayedTriggers[i].call(this, event);
			}; //Trigger all delayed events
			this._trigger("stop", event, this._uiHash());
		}

		this.fromOutside = false;
		return true;
	},

	_trigger: function _trigger() {
		if (_jquery2.default.Widget.prototype._trigger.apply(this, arguments) === false) {
			this.cancel();
		}
	},

	_delay: function _delay(handler, delay) {
		function handlerProxy() {
			return (typeof handler === "string" ? instance[handler] : handler).apply(instance, arguments);
		}
		var instance = this;
		return setTimeout(handlerProxy, delay || 0);
	},

	_uiHash: function _uiHash(_inst) {
		var inst = _inst || this;
		return {
			helper: inst.helper,
			placeholder: inst.placeholder || (0, _jquery2.default)([]),
			position: inst.position,
			originalPosition: inst.originalPosition,
			offset: inst.positionAbs,
			item: inst.currentItem,
			sender: _inst ? _inst.element : null
		};
	}

});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],4:[function(require,module,exports){
(function (global){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

require('./jquery.ui.djnsortable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * jQuery UI Nested Sortable
 * v 1.3.4 / 28 apr 2011
 * http://mjsarfatti.com/sandbox/nestedSortable
 *
 * Depends:
 *    jquery.ui.sortable.js 1.8+
 *
 * License CC BY-SA 3.0
 * Copyright 2010-2011, Manuele J Sarfatti
 */
if (typeof _jquery2.default.fn.nearest != 'function') {
    /**
     * Returns the descendant(s) matching a given selector which are the
     * shortest distance from the search context element (in otherwords,
     * $.fn.closest(), in reverse).
     */
    _jquery2.default.fn.nearest = function (selector) {
        var nearest = (0, _jquery2.default)([]),
            node = this,
            distance = 10000;
        node.find(selector).each(function () {
            var n = (0, _jquery2.default)(this),
                d = n.parentsUntil(node).size();
            if (d < distance) {
                distance = d;
                nearest = n;
            } else if (d == distance) {
                nearest.add(this);
            }
        });
        return this.pushStack(nearest.get());
    };
}

var counter = 0;
var expando = "djn" + ("" + Math.random()).replace(/\D/g, "");

var createChildNestedSortable = function createChildNestedSortable(parent, childContainer) {
    // Don't continue if the new element is the same as the old
    if (parent && parent.element && parent.element[0] == childContainer) {
        return;
    }
    var $childContainer = (0, _jquery2.default)(childContainer),
        options = _jquery2.default.extend({}, parent.options);
    options.connectWith = [parent.element];

    if ($childContainer.data(parent.widgetName)) {
        return;
    }

    var widgetConstructor = $childContainer[parent.widgetName];
    widgetConstructor.call($childContainer, options);
    var newInstance = $childContainer.data(parent.widgetName);
    for (var i = 0; i < parent.options.connectWith.length; i++) {
        var $otherContainer = parent.options.connectWith[i];
        newInstance.addToConnectWith($otherContainer);
        var otherInstance = $otherContainer.data(parent.widgetName);
        if (otherInstance) {
            otherInstance.addToConnectWith($childContainer);
        }
    }
    parent.addToConnectWith($childContainer);
    return newInstance;
};

_jquery2.default.widget("ui.nestedSortable", _jquery2.default.ui.djnsortable, {

    options: {
        tabSize: 20,
        disableNesting: 'ui-nestedSortable-no-nesting',
        errorClass: 'ui-nestedSortable-error',
        nestedContainerSelector: ':not(*)',
        // Whether to clear empty list item and container elements
        doNotClear: false,
        /**
         * Create a list container element if the draggable was dragged
         * to the top or bottom of the elements at its level.
         *
         * @param DOMElement parent - The element relative to which the
         *      new element will be inserted.
         * @return DOMElement - The new element.
         */
        createContainerElement: function createContainerElement(parent) {
            return (0, _jquery2.default)(document.createElement('ol'));
        },
        // Selector which matches all container elements in the nestedSortable
        containerElementSelector: 'ol',
        // Selector which matches all list items (draggables) in the nestedSortable
        listItemSelector: 'li',
        // Selector which, when applied to a container, returns its child list items
        items: '> li',
        maxLevels: 0,
        revertOnError: 1,
        protectRoot: false,
        rootID: null,
        rtl: false,
        // if true, you can not move nodes to different levels of nesting
        fixedNestingDepth: false,
        // show the error div or just not show a drop area
        showErrorDiv: true,
        // if true only allows you to rearrange within its parent container
        keepInParent: false,
        isAllowed: function isAllowed(item, parent) {
            return true;
        },
        canConnectWith: function canConnectWith(container1, container2, instance) {
            var instance2 = container2.data(instance.widgetName);
            if (!instance.options.fixedNestingDepth) {
                if (!instance2 || !instance2.options.fixedNestingDepth) {
                    return true;
                }
            }
            var container1Level = instance._getLevel(container1);
            var container2Level = instance._getLevel(container2);
            return container1Level === container2Level;
        }
    },

    _createWidget: function _createWidget(options, element) {
        var $element = (0, _jquery2.default)(element || this.defaultElement || this),
            dataOptions = $element.data('djnsortableOptions');
        element = $element[0];
        if (dataOptions) {
            options = _jquery2.default.extend({}, options, dataOptions);
        }
        return _jquery2.default.ui.djnsortable.prototype._createWidget.call(this, options, element);
    },

    _create: function _create() {
        if (this.element.data('uiNestedSortable')) {
            this.element.data('nestedSortable', this.element.data('uiNestedSortable'));
        }
        if (this.element.data('ui-nestedSortable')) {
            this.element.data('nestedSortable', this.element.data('ui-nestedSortable'));
        }
        this.element.data('djnsortable', this.element.data('nestedSortable'));
        if (this.element.data('uiNestedSortable')) {
            this.element.data('uiSortable', this.element.data('nestedSortable'));
        }
        // if (!this.element.is(this.options.containerElementSelector)) {
        //  throw new Error('nestedSortable: Please check that the ' +
        //                  'containerElementSelector option matches ' +
        //                  'the element passed to the constructor.');
        //             }

        _jquery2.default.ui.djnsortable.prototype._create.apply(this, arguments);

        this._connectWithMap = {};

        var self = this,
            o = this.options,
            $document = (0, _jquery2.default)(document);

        var originalConnectWith = o.connectWith;
        if (!originalConnectWith || typeof originalConnectWith == 'string') {
            this.options.connectWith = [];
            if (typeof originalConnectWith == 'string') {
                var connected = this._connectWith();
                for (var i = 0; i < connected.length; i++) {
                    this.addToConnectWith((0, _jquery2.default)(connected[i]));
                }
            }

            // HACK!! FIX!! (django-specific logic)
            $document.on('djnesting:init.nestedSortable', o.containerElementSelector, function (event) {
                createChildNestedSortable(self, this);
            });
            this.element.find(o.containerElementSelector + ':not(.subarticle-wrapper)').each(function (i, el) {
                if ((0, _jquery2.default)(el).closest('[data-inline-formset]').attr('id').indexOf('-empty') > -1) {
                    return;
                }
                createChildNestedSortable(self, el);
            });
        }
        $document.trigger('nestedSortable:created', [this]);
        $document.on('nestedSortable:created.nestedSortable', function (e, instance) {
            instance.addToConnectWith(self.element);
            self.addToConnectWith(instance.element);
        });
    },

    addToConnectWith: function addToConnectWith(element) {
        var self = this,
            $element = typeof element.selector != 'undefined' ? element : (0, _jquery2.default)(element),
            uniqueId;

        if ($element.length > 1) {
            $element.each(function (i, el) {
                self.addToConnectWith((0, _jquery2.default)(el));
            });
            return;
        }
        uniqueId = element[0][expando];
        if (typeof uniqueId == 'undefined') {
            uniqueId = element[0][expando] = ++counter;
        }
        if (typeof this.options.connectWith == 'string') {
            return;
        }
        if (this._connectWithMap[uniqueId]) {
            return;
        }
        this.options.connectWith.push(element);
        this._connectWithMap[uniqueId] = 1;
    },

    _destroy: function _destroy() {
        this.element.removeData("nestedSortable").unbind(".nestedSortable");
        (0, _jquery2.default)(document).unbind('.nestedSortable');
        return _jquery2.default.ui.djnsortable.prototype.destroy.apply(this, arguments);
    },

    /**
     * Override this method to add extra conditions on an item before it's
     * rearranged.
     */
    _intersectsWithPointer: function _intersectsWithPointer(item) {
        var itemElement = item.item[0],
            o = this.options,
            intersection = _jquery2.default.ui.djnsortable.prototype._intersectsWithPointer.apply(this, arguments);

        this.lastItemElement = null;
        if (!intersection) {
            return intersection;
        }

        // Only put the placeholder inside the current Container, skip all
        // items from other containers. This works because when moving
        // an item from one container to another the
        // currentContainer is switched before the placeholder is moved.
        //
        // Without this moving items in "sub-sortables" can cause the placeholder to jitter
        // between the outer and inner container.
        if (item.instance !== this.currentContainer) {
            return false;
        }
        var $itemElement = (0, _jquery2.default)(itemElement);

        if (o.fixedNestingDepth && this._getLevel(this.currentItem) === 1 + this._getLevel($itemElement)) {
            $itemElement = function () {
                var containerSel = o.containerElementSelector;
                var $childItems = $itemElement.find('.djn-item');
                if ($childItems.length != 1) {
                    return $itemElement;
                }
                if (!$childItems.is('.djn-no-drag,.djn-thead')) {
                    return $itemElement;
                }
                var itemElementClosestContainer = $itemElement.closest(containerSel);
                if (!itemElementClosestContainer.length) {
                    return $itemElement;
                }
                // Make sure the item is only one level deeper
                if (itemElementClosestContainer[0] != $childItems.closest(containerSel).closest(containerSel)[0]) {
                    return $itemElement;
                }
                return (0, _jquery2.default)($childItems[0]);
            }();
            itemElement = $itemElement[0];
        }

        if (itemElement != this.currentItem[0] //cannot intersect with itself
        && this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
        && !_jquery2.default.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
        && (this.options.type == 'semi-dynamic' ? !_jquery2.default.contains(this.element[0], itemElement) : true) && (!o.keepInParent || itemElement.parentNode == this.placeholder[0].parentNode) //only rearrange items within the same container
        && (!o.fixedNestingDepth || this._getLevel(this.currentItem) === this._getLevel($itemElement)) //maintain the nesting level of node
        && (o.showErrorDiv || o.isAllowed.call(this, this.currentItem[0], itemElement.parentNode, this.placeholder))) {
            this.lastItemElement = itemElement;
            return intersection;
        } else {
            return false;
        }
    },

    // This method is called after items have been iterated through.
    // Overriding this is cleaner than copying and pasting _mouseDrag()
    // and inserting logic in the middle.
    _contactContainers: function _contactContainers(event) {
        if (this.lastItemElement) {
            this._clearEmpty(this.lastItemElement);
        }

        if (this.options.fixedNestingDepth) {
            return _jquery2.default.ui.djnsortable.prototype._contactContainers.apply(this, arguments);
        }

        var o = this.options,
            _parentItem = this.placeholder.closest(o.listItemSelector),
            parentItem = _parentItem.length && _parentItem.closest('.ui-sortable').length ? _parentItem : null,
            level = this._getLevel(this.placeholder),
            childLevels = this._getChildLevels(this.helper);

        var placeholderClassName = this.placeholder.attr('class');
        var phClassSearch = " " + placeholderClassName + " ";
        // If the current level class isn't already set
        if (phClassSearch.indexOf(" ui-sortable-nested-level-" + level + " ") == -1) {
            var phOrigClassName;
            // Check if another level class is set
            var phOrigClassNameEndPos = phClassSearch.indexOf(" ui-sortable-nested-level-") - 1;
            if (phOrigClassNameEndPos > -1) {
                phOrigClassName = placeholderClassName.substring(0, phOrigClassNameEndPos);
            } else {
                phOrigClassName = placeholderClassName;
            }
            // Add new level to class
            this.placeholder.attr('class', phOrigClassName + ' ui-sortable-nested-level-' + level);
        }

        // To find the previous sibling in the list, keep backtracking until we hit a valid list item.
        var previousItem = this.placeholder[0].previousSibling ? (0, _jquery2.default)(this.placeholder[0].previousSibling) : null;
        if (previousItem != null) {
            while (!previousItem.is(this.options.listItemSelector) || previousItem[0] == this.currentItem[0] || previousItem[0] == this.helper[0]) {
                if (previousItem[0].previousSibling) {
                    previousItem = (0, _jquery2.default)(previousItem[0].previousSibling);
                } else {
                    previousItem = null;
                    break;
                }
            }
        }
        // To find the next sibling in the list, keep stepping forward until we hit a valid list item.
        var nextItem = this.placeholder[0].nextSibling ? (0, _jquery2.default)(this.placeholder[0].nextSibling) : null;
        if (nextItem != null) {
            while (!nextItem.is(this.options.listItemSelector) || nextItem[0] == this.currentItem[0] || nextItem[0] == this.helper[0]) {
                if (nextItem[0].nextSibling) {
                    nextItem = (0, _jquery2.default)(nextItem[0].nextSibling);
                } else {
                    nextItem = null;
                    break;
                }
            }
        }

        this.beyondMaxLevels = 0;

        // We will change this to the instance of the nested container if
        // appropriate, so that the appropriate context is applied to the
        // super _contactContainers prototype method
        var containerInstance = this;
        this.refreshPositions();

        // If the item is moved to the left, send it to its parent's level unless there are siblings below it.
        if (!o.fixedNestingDepth && parentItem != null && nextItem == null && (o.rtl && this.positionAbs.left + this.helper.outerWidth() > parentItem.offset().left + parentItem.outerWidth() || !o.rtl && this.positionAbs.left < parentItem.offset().left)) {
            parentItem.after(this.placeholder[0]);
            containerInstance = parentItem.closest(o.containerElementSelector).data(this.widgetName) || containerInstance;
            this._clearEmpty(parentItem[0]);
            this.refreshPositions();
            this._trigger("change", event, this._uiHash());
        }
        // If the item is below a sibling and is moved to the right, make it a child of that sibling.
        else if (!o.fixedNestingDepth && previousItem != null && !previousItem.is('.djn-no-drag,.djn-thead') && (o.rtl && this.positionAbs.left + this.helper.outerWidth() < previousItem.offset().left + previousItem.outerWidth() - o.tabSize || !o.rtl && this.positionAbs.left > previousItem.offset().left + o.tabSize)) {
                this._isAllowed(previousItem, level, level + childLevels);

                if (this.beyondMaxLevels > 0) {
                    return _jquery2.default.ui.djnsortable.prototype._contactContainers.apply(this, arguments);
                }
                var $previousItemChildContainer;
                $previousItemChildContainer = previousItem.nearest(o.containerElementSelector).first();

                if (!$previousItemChildContainer.length && !previousItem.closest(o.nestedContainerSelector).length) {
                    $previousItemChildContainer = this.options.createContainerElement(previousItem[0]);
                    previousItem.append($previousItemChildContainer);
                }
                if ($previousItemChildContainer.length) {
                    $previousItemChildContainer.append(this.placeholder);
                    containerInstance = $previousItemChildContainer.data(this.widgetName);
                    if (!containerInstance) {
                        containerInstance = createChildNestedSortable(this, $previousItemChildContainer[0]);
                    }
                    this.refreshPositions();
                }
                this._trigger("change", event, this._uiHash());
            } else {
                this._isAllowed(parentItem, level, level + childLevels);
            }

        _jquery2.default.ui.djnsortable.prototype._contactContainers.call(this, event);
    },

    _rearrange: function _rearrange(event, item, a, hardRefresh) {
        // Cache the rearranged element for the call to _clear()
        var o = this.options;
        if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && item.item) {
            this.lastRearrangedElement = item.item[0];
        }
        if (item && (typeof item === 'undefined' ? 'undefined' : _typeof(item)) == 'object' && item.item && this.placeholder.closest(o.nestedContainerSelector).length) {
            // This means we have been dropped into a nested container down a level
            // from the parent.
            var placeholderParentItem = this.placeholder.closest(o.listItemSelector);
            var comparisonElement = this.direction == 'down' ? placeholderParentItem.next(o.nestedContainerSelector) : placeholderParentItem;
            if (comparisonElement.length && comparisonElement[0] == item.item[0]) {
                //Various things done here to improve the performance:
                // 1. we create a setTimeout, that calls refreshPositions
                // 2. on the instance, we have a counter variable, that get's higher after every append
                // 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
                // 4. this lets only the last addition to the timeout stack through
                this.counter = this.counter ? ++this.counter : 1;
                var counter = this.counter;

                this._delay(function () {
                    if (counter == this.counter) this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
                });
                // The super method will pop the container out of its nested container,
                // which we don't want.
                return;
            }
        }
        _jquery2.default.ui.djnsortable.prototype._rearrange.apply(this, arguments);
    },

    _convertPositionTo: function _convertPositionTo(d, pos) {
        // Cache the top offset before rearrangement
        this.previousTopOffset = this.placeholder.offset().top;
        return _jquery2.default.ui.djnsortable.prototype._convertPositionTo.apply(this, arguments);
    },

    _clear: function _clear() {
        _jquery2.default.ui.djnsortable.prototype._clear.apply(this, arguments);
        // If lastRearrangedElement exists and is still attached to the document
        // (i.e., hasn't been removed)
        if (_typeof(this.lastRearrangedElement) == 'object' && this.lastRearrangedElement.ownerDocument) {
            this._clearEmpty(this.lastRearrangedElement);
        }
    },

    _mouseStop: function _mouseStop(event, noPropagation) {
        // If the item is in a position not allowed, send it back
        if (this.beyondMaxLevels) {
            this.placeholder.removeClass(this.options.errorClass);

            if (this.domPosition.prev) {
                (0, _jquery2.default)(this.domPosition.prev).after(this.placeholder);
            } else {
                (0, _jquery2.default)(this.domPosition.parent).prepend(this.placeholder);
            }
            this._trigger("revert", event, this._uiHash());
        }

        // Clean last empty container/list item
        for (var i = this.items.length - 1; i >= 0; i--) {
            var item = this.items[i].item[0];
            this._clearEmpty(item);
        }

        _jquery2.default.ui.djnsortable.prototype._mouseStop.apply(this, arguments);
    },

    toArray: function toArray(o) {

        o = _jquery2.default.extend(true, {}, this.options, o || {});

        var sDepth = o.startDepthCount || 0,
            ret = [],
            left = 2;

        ret.push({
            "item_id": o.rootID,
            "parent_id": 'none',
            "depth": sDepth,
            "left": '1',
            "right": ((0, _jquery2.default)(o.listItemSelector, this.element).length + 1) * 2
        });

        var _recursiveArray = function _recursiveArray(item, depth, left) {
            var right = left + 1,
                id,
                pid;

            var $childItems = (0, _jquery2.default)(item).children(o.containerElementSelector).find(o.items);

            if ($childItems.length > 0) {
                depth++;
                $childItems.each(function () {
                    right = _recursiveArray((0, _jquery2.default)(this), depth, right);
                });
                depth--;
            }

            id = (0, _jquery2.default)(item).attr(o.attribute || 'id').match(o.expression || /(.+)[-=_](.+)/);

            if (depth === sDepth + 1) {
                pid = o.rootID;
            } else {
                var parentItem = (0, _jquery2.default)(item).parent(o.containerElementSelector).parent(o.items).attr(o.attribute || 'id').match(o.expression || /(.+)[-=_](.+)/);
                pid = parentItem[2];
            }

            if (id) {
                ret.push({ "item_id": id[2], "parent_id": pid, "depth": depth, "left": left, "right": right });
            }

            left = right + 1;
            return left;
        };

        (0, _jquery2.default)(this.element).children(o.listItemSelector).each(function () {
            left = _recursiveArray(this, sDepth + 1, left);
        });

        ret = ret.sort(function (a, b) {
            return a.left - b.left;
        });

        return ret;
    },

    _clearEmpty: function _clearEmpty(item) {
        if (this.options.doNotClear) {
            return;
        }
        var $item = (0, _jquery2.default)(item);
        var childContainers = $item.nearest(this.options.containerElementSelector);
        childContainers.each(function (i, childContainer) {
            var $childContainer = (0, _jquery2.default)(childContainer);
            if (!$childContainer.children().length) {
                var instance = $childContainer.data(this.widgetName);
                if ((typeof instance === 'undefined' ? 'undefined' : _typeof(instance)) == 'object' && instance.destroy) {
                    instance.destroy();
                }
                $childContainer.remove();
            }
        });
        if (!$item.children().length) {
            $item.remove();
        }
    },

    _getLevel: function _getLevel(item) {

        var level = 1,
            o = this.options,
            list;

        if (o.containerElementSelector) {
            list = item.closest(o.containerElementSelector);
            while (list && list.length > 0 && !list.parent().is('.djn-group-root')) {
                // if (!list.is(o.nestedContainerSelector)) {
                level++;
                // }
                list = list.parent().closest(o.containerElementSelector);
            }
        }

        return level;
    },

    _getChildLevels: function _getChildLevels(parent, depth) {
        var self = this,
            o = this.options,
            result = 0;
        depth = depth || 0;

        (0, _jquery2.default)(parent).nearest(o.containerElementSelector).find(o.items).each(function (index, child) {
            if ((0, _jquery2.default)(child).is('.djn-no-drag,.djn-thead')) {
                return;
            }
            result = Math.max(self._getChildLevels(child, depth + 1), result);
        });

        return depth ? result + 1 : result;
    },

    _isAllowed: function _isAllowed(parentItem, level, levels) {
        var o = this.options,
            isRoot = (0, _jquery2.default)(this.domPosition.parent).hasClass('ui-sortable') ? true : false;
        // this takes into account the maxLevels set to the recipient list
        // var maxLevels = this.placeholder.closest('.ui-sortable').nestedSortable('option', 'maxLevels');
        var maxLevels = o.maxLevels;

        // Is the root protected?
        // Are we trying to nest under a no-nest?
        // Are we nesting too deep?
        if (parentItem && (typeof parentItem === 'undefined' ? 'undefined' : _typeof(parentItem)) == 'object' && typeof parentItem.selector == 'undefined') {
            parentItem = (0, _jquery2.default)(parentItem);
        }
        if (!o.isAllowed.call(this, this.currentItem, parentItem, this.placeholder) || parentItem && parentItem.hasClass(o.disableNesting) || o.protectRoot && (parentItem == null && !isRoot || isRoot && level > 1)) {
            this.placeholder.addClass(o.errorClass);
            if (maxLevels < levels && maxLevels != 0) {
                this.beyondMaxLevels = levels - maxLevels;
            } else {
                this.beyondMaxLevels = 1;
            }
        } else {
            if (maxLevels < levels && maxLevels != 0) {
                this.placeholder.addClass(o.errorClass);
                this.beyondMaxLevels = levels - maxLevels;
            } else {
                this.placeholder.removeClass(o.errorClass);
                this.beyondMaxLevels = 0;
            }
        }
    },

    _connectWith: function _connectWith() {
        var origConnectWith = _jquery2.default.ui.djnsortable.prototype._connectWith.apply(this, arguments),
            connectWith = [];
        var self = this;
        for (var i = 0; i < origConnectWith.length; i++) {
            var $elements = (0, _jquery2.default)(origConnectWith[i]);
            $elements.each(function (j, el) {
                if (el == self.element[0]) {
                    return;
                }
                if (!self.options.canConnectWith(self.element, (0, _jquery2.default)(el), self)) {
                    return;
                }
                connectWith.push(el);
            });
        }
        return connectWith;
    },
    _removeCurrentsFromItems: function _removeCurrentsFromItems() {
        var list = this.currentItem.find(":data(sortable-item)");
        for (var i = 0; i < this.items.length; i++) {
            for (var j = 0; j < list.length; j++) {
                if (list[j] == this.items[i].item[0]) {
                    this.items.splice(i, 1);
                    if (i >= this.items.length) {
                        break;
                    }
                }
            }
        }
    },
    createContainerElement: function createContainerElement(parent) {
        if (!parent.childNodes) {
            throw new Error("Invalid element 'parent' passed to " + "createContainerElement.");
        }
        var newContainer = this.options.createContainerElement.apply(this, arguments);
        parent.appendChild(newContainer[0]);
        return (0, _jquery2.default)(newContainer);
    }
});

_jquery2.default.ui.nestedSortable.prototype.options = _jquery2.default.extend({}, _jquery2.default.ui.djnsortable.prototype.options, _jquery2.default.ui.nestedSortable.prototype.options);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./jquery.ui.djnsortable":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = regexQuote;
function regexQuote(str) {
    return (str + '').replace(/([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g, '\\$1');
};
module.exports = exports['default'];

},{}],6:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.updatePositions = updatePositions;
exports.createSortable = createSortable;

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

var _regexquote = require('./regexquote');

var _regexquote2 = _interopRequireDefault(_regexquote);

require('./jquery.ui.nestedsortable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function updatePositions(prefix) {
    var position = 0,
        count = 1,
        $group = (0, _jquery2.default)('#' + prefix + '-group'),
        groupData = $group.djnData(),
        fieldNames = groupData.fieldNames,
        groupFkName = groupData.formsetFkName,
        parentPkVal,
        _ref = prefix.match(/^(.*)\-(\d+)-[^\-]+(?:\-\d+)?$/) || [],
        _ref2 = _slicedToArray(_ref, 3),
        parentPrefix = _ref2[1],
        index = _ref2[2],
        sortableOptions = groupData.sortableOptions,
        sortableExcludes = (sortableOptions || {}).sortableExcludes || [];

    sortableExcludes.push(groupFkName);

    if (parentPrefix) {
        var $parentGroup = (0, _jquery2.default)('#' + parentPrefix + '-group');
        var parentFieldNames = $parentGroup.djnData('fieldNames');
        var parentPkFieldName = parentFieldNames.pk;
        var parentPkField = $parentGroup.filterDjangoField(parentPrefix, parentPkFieldName, index);
        parentPkVal = parentPkField.val();
    }

    if (groupFkName && typeof parentPkVal != 'undefined') {
        $group.filterDjangoField(prefix, groupFkName).val(parentPkVal).trigger('change');
    }

    $group.find('.djn-inline-form').each(function () {
        if (!this.id || this.id.substr(-6) == '-empty') {
            return true; // Same as continue
        }
        var regex = new RegExp('^(?:id_)?' + (0, _regexquote2.default)(prefix) + '\\-\\d+$');

        if (!this.id.match(regex)) {
            return true;
        }
        // Cache jQuery object
        var $this = (0, _jquery2.default)(this),
            _ref3 = $this.djangoPrefixIndex() || [null, null],
            _ref4 = _slicedToArray(_ref3, 2),
            formPrefix = _ref4[0],
            index = _ref4[1],
            namePrefix = formPrefix + '-' + index + '-';


        if (!formPrefix) {
            return;
        }

        // Set header position for stacked inlines in Django 1.9+
        var $inlineLabel = $this.find('> h3 > .inline_label');
        if ($inlineLabel.length) {
            $inlineLabel.html($inlineLabel.html().replace(/(#\d+)/g, '#' + count));
        }
        count++;

        var $fields = $this.djangoFormField('*'),
            $positionField,
            setPosition = false;

        // position is being updated if
        // a) the field has a value
        // b) if the field is not exluded with sortable_excludes (e.g. with default values)
        $fields.each(function () {
            var $field = (0, _jquery2.default)(this);
            if (!$field.is(':input[type!=radio][type!=checkbox],input:checked')) {
                return;
            }
            var hasValue = $field.val() || $field.attr('type') == 'file' && $field.siblings('a').length,
                fieldName = $field.attr('name').substring(namePrefix.length);
            if (fieldName == fieldNames.position) {
                $positionField = $field;
            }
            if (hasValue && _jquery2.default.inArray(fieldName, sortableExcludes) === -1) {
                setPosition = true;
            }
        });

        if (!setPosition || !$positionField) {
            return;
        }

        $positionField.val(position).trigger('change');
        position++;
    });
}

function createSortable($group) {
    return $group.find('> .djn-items, > .djn-fieldset > .djn-items, > .tabular > .module > .djn-items').nestedSortable({
        handle: ['> h3.djn-drag-handler', '> .djn-tools .drag-handler', '> .djn-td > .djn-tools .djn-drag-handler', '> .djn-tr > .is-sortable > .djn-drag-handler', '> .djn-tr > .grp-tools-container .djn-drag-handler'].join(', '),
        /**
         * items: The selector for ONLY the items underneath a given
         *        container at that level. Not to be confused with
         *        listItemSelector, which is the selector for all list
         *        items in the nestedSortable
         */
        items: '> .djn-item',
        forcePlaceholderSize: true,
        placeholder: {
            element: function element($currentItem) {
                var el = (0, _jquery2.default)(document.createElement($currentItem[0].nodeName)).addClass($currentItem[0].className + ' ui-sortable-placeholder').removeClass('ui-sortable-helper')[0];

                if ($currentItem.is('.djn-tbody')) {
                    var $originalTr = $currentItem.children('.djn-tr').eq(0);
                    var trTagName = $originalTr.prop('tagName').toLowerCase();
                    var $tr = (0, _jquery2.default)('<' + trTagName + '></' + trTagName + '>');
                    $tr.addClass($originalTr.attr('class'));
                    var $originalTd = $originalTr.children('.djn-td').eq(0);
                    var tdTagName = $originalTd.prop('tagName').toLowerCase();
                    var numColumns = 0;
                    $originalTr.children('.djn-td').each(function (i, td) {
                        numColumns += parseInt((0, _jquery2.default)(td).attr('colspan'), 10) || 1;
                    });
                    $tr.append((0, _jquery2.default)('<' + tdTagName + ' colspan="' + numColumns + '" class="djn-td grp-td"></' + tdTagName + '>'));
                    el.appendChild($tr[0]);
                }

                return el;
            },
            update: function update(instance, $placeholder) {
                var $currItem = instance.currentItem;
                var opts = instance.options;
                // 1. If a className is set as 'placeholder option, we
                //    don't force sizes - the class is responsible for that
                // 2. The option 'forcePlaceholderSize can be enabled to
                //    force it even if a class name is specified
                if (opts.className && !opts.forcePlaceholderSize) return;

                if ($placeholder.is('.djn-tbody')) {
                    // debugger;
                    $placeholder = $placeholder.children('.djn-tr').eq(0).children('.djn-td').eq(0);
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
        isAllowed: function isAllowed(currentItem, parentItem) {
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
        start: function start(event, ui) {
            ui.item.addClass('djn-item-dragging');
            ui.item.show();
        },
        stop: function stop(event, ui) {
            ui.item.removeClass('djn-item-dragging');
        },
        /**
         * Triggered when a sortable is dropped into a container
         */
        receive: function receive(event, ui) {
            var $inline = (0, _jquery2.default)(this).closest('.djn-group');
            $inline.djangoFormset().spliceInto(ui.item);
            updatePositions(ui.item.djangoFormsetPrefix());
        },
        update: function update(event, ui) {
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
            var groupId = (0, _jquery2.default)(event.target).closest('.djn-group').attr('id'),
                $form = ui.item,
                $parentGroup = $form.closest('#' + groupId);
            if ($form.data('updateOperation') == 'removed') {
                $form.removeAttr('data-update-operation');
            } else if (!$parentGroup.length) {
                $form.attr('data-update-operation', 'removed');
            }
            updatePositions($form.djangoFormsetPrefix());
            (0, _jquery2.default)(document).trigger('djnesting:mutate', [(0, _jquery2.default)('#' + $form.djangoFormsetPrefix() + '-group')]);
        }
    });
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./jquery.ui.nestedsortable":4,"./regexquote":5}],7:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

require('./jquery.djnutils.js');

var _sortable = require('./sortable');

var _regexquote = require('./regexquote');

var _regexquote2 = _interopRequireDefault(_regexquote);

var _dateTimeShortcuts = (typeof window !== "undefined" ? window['DateTimeShortcuts'] : typeof global !== "undefined" ? global['DateTimeShortcuts'] : null);

var _dateTimeShortcuts2 = _interopRequireDefault(_dateTimeShortcuts);

var _selectFilter = (typeof window !== "undefined" ? window['SelectFilter'] : typeof global !== "undefined" ? global['SelectFilter'] : null);

var _selectFilter2 = _interopRequireDefault(_selectFilter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DJNesting = typeof window.DJNesting != 'undefined' ? window.DJNesting : {};

DJNesting.regexQuote = _regexquote2.default;
DJNesting.createSortable = _sortable.createSortable;
DJNesting.updatePositions = _sortable.updatePositions;

/**
 * Update attributes based on a regular expression
 */
DJNesting.updateFormAttributes = function ($elem, search, replace, selector) {
    if (!selector) {
        selector = [':input', 'span', 'table', 'iframe', 'label', 'a', 'ul', 'p', 'img', '.djn-group', '.djn-inline-form', '.cropduster-form', '.dal-forward-conf'].join(',');
    }
    $elem.find(selector).andSelf().each(function () {
        var $node = (0, _jquery2.default)(this),
            attrs = ['id', 'name', 'for', 'href', 'class', 'onclick'];

        _jquery2.default.each(attrs, function (i, attrName) {
            var attrVal = $node.attr(attrName);
            if (attrVal) {
                $node.attr(attrName, attrVal.replace(search, replace));
            }
        });
    });
    // update prepopulate ids for function initPrepopulatedFields
    $elem.find('.prepopulated_field').each(function () {
        var $node = (0, _jquery2.default)(this);
        var dependencyIds = _jquery2.default.makeArray($node.data('dependency_ids') || []);
        $node.data('dependency_ids', _jquery2.default.map(dependencyIds, function (id) {
            return id.replace(search, replace);
        }));
    });
};

DJNesting.createContainerElement = function () {
    return;
};

// Slight tweaks to the grappelli functions of the same name
// (initRelatedFields and initAutocompleteFields).
//
// The most notable tweak is the call to $.fn.grp_related_generic() (a
// jQuery method provided by django-curated) and the use of
// DJNesting.LOOKUP_URLS to determine the ajax lookup urls.
//
// We abstract this out using form prefix because the way grappelli does it
// (adding javascript at the bottom of each formset) doesn't really scale
// with nested formsets.

// The second parameter (groupData) is optional, and only exists to prevent
// redundant calls to jQuery() and jQuery.fn.data() in the calling context
DJNesting.initRelatedFields = function (prefix, groupData) {
    if (_typeof(DJNesting.LOOKUP_URLS) != 'object' || !DJNesting.LOOKUP_URLS.related) {
        return;
    }
    var lookupUrls = DJNesting.LOOKUP_URLS;
    var $inline = (0, _jquery2.default)('#' + prefix + '-group');

    if (!groupData) {
        groupData = $inline.djnData();
    }
    var lookupFields = groupData.lookupRelated;

    $inline.djangoFormsetForms().each(function (i, form) {
        _jquery2.default.each(lookupFields.fk || [], function (i, fk) {
            (0, _jquery2.default)(form).djangoFormField(fk).each(function () {
                (0, _jquery2.default)(this).grp_related_fk({ lookup_url: lookupUrls.related });
            });
        });
        _jquery2.default.each(lookupFields.m2m || [], function (i, m2m) {
            (0, _jquery2.default)(form).djangoFormField(m2m).each(function () {
                (0, _jquery2.default)(this).grp_related_m2m({ lookup_url: lookupUrls.m2m });
            });
        });
        _jquery2.default.each(lookupFields.generic || [], function () {
            var _ref = _slicedToArray(this, 2),
                contentType = _ref[0],
                objectId = _ref[1];

            (0, _jquery2.default)(form).djangoFormField(objectId).each(function () {
                var $this = (0, _jquery2.default)(this);
                var index = $this.djangoFormIndex();
                if ($this.hasClass('grp-has-related-lookup')) {
                    $this.parent().find('a.related-lookup').remove();
                    $this.parent().find('.grp-placeholder-related-generic').remove();
                }
                $this.grp_related_generic({
                    content_type: '#id_' + prefix + index + contentType,
                    object_id: '#id_' + prefix + index + objectId,
                    lookup_url: lookupUrls.related
                });
            });
        });
    });
};

DJNesting.initAutocompleteFields = function (prefix, groupData) {
    if (_typeof(DJNesting.LOOKUP_URLS) != 'object' || !DJNesting.LOOKUP_URLS.related) {
        return;
    }
    var lookupUrls = DJNesting.LOOKUP_URLS;

    var $inline = (0, _jquery2.default)('#' + prefix + '-group');

    if (!groupData) {
        groupData = $inline.djnData();
    }
    var lookupFields = groupData.lookupAutocomplete;

    $inline.djangoFormsetForms().each(function (i, form) {
        _jquery2.default.each(lookupFields.fk || [], function (i, fk) {
            (0, _jquery2.default)(form).djangoFormField(fk).each(function () {
                var $this = (0, _jquery2.default)(this),
                    id = $this.attr('id');
                // An autocomplete widget has already been initialized, return
                if ((0, _jquery2.default)('#' + id + '-autocomplete').length) {
                    return;
                }
                $this.grp_autocomplete_fk({
                    lookup_url: lookupUrls.related,
                    autocomplete_lookup_url: lookupUrls.autocomplete
                });
            });
        });
        _jquery2.default.each(lookupFields.m2m || [], function (i, m2m) {
            (0, _jquery2.default)(form).djangoFormField(m2m).each(function () {
                var $this = (0, _jquery2.default)(this),
                    id = $this.attr('id');
                // An autocomplete widget has already been initialized, return
                if ((0, _jquery2.default)('#' + id + '-autocomplete').length) {
                    return;
                }
                $this.grp_autocomplete_m2m({
                    lookup_url: lookupUrls.m2m,
                    autocomplete_lookup_url: lookupUrls.autocomplete
                });
            });
        });
        _jquery2.default.each(lookupFields.generic || [], function () {
            var _ref2 = _slicedToArray(this, 2),
                contentType = _ref2[0],
                objectId = _ref2[1];

            (0, _jquery2.default)(form).djangoFormField(objectId).each(function () {
                var $this = (0, _jquery2.default)(this);
                var index = $this.djangoFormIndex();
                // An autocomplete widget has already been initialized, return
                if ((0, _jquery2.default)('#' + $this.attr('id') + '-autocomplete').length) {
                    return;
                }
                $this.grp_autocomplete_generic({
                    content_type: '#id_' + prefix + index + contentType,
                    object_id: '#id_' + prefix + index + objectId,
                    lookup_url: lookupUrls.related,
                    autocomplete_lookup_url: lookupUrls.m2m
                });
            });
        });
    });
};

// I very much regret that these are basically copy-pasted from django's
// inlines.js, but they're hidden in closure scope so I don't have much choice.
DJNesting.DjangoInlines = {
    initPrepopulatedFields: function initPrepopulatedFields(row) {
        row.find('.prepopulated_field').each(function () {
            var field = (0, _jquery2.default)(this),
                input = field.is(':input') ? field : field.find(':input'),
                dependencyList = input.data('dependency_list') || [],
                formPrefix = input.djangoFormPrefix(),
                dependencies = [];
            if (!formPrefix || formPrefix.match(/__prefix__/)) {
                return;
            }
            _jquery2.default.each(dependencyList, function (i, fieldName) {
                dependencies.push('#id_' + formPrefix + fieldName);
            });
            if (dependencies.length) {
                input.prepopulate(dependencies, input.attr('maxlength'));
            }
        });
    },
    reinitDateTimeShortCuts: function reinitDateTimeShortCuts() {
        // Reinitialize the calendar and clock widgets by force
        if (typeof _dateTimeShortcuts2.default !== 'undefined') {
            (0, _jquery2.default)('.datetimeshortcuts').remove();
            _dateTimeShortcuts2.default.init();
        }
    },
    updateSelectFilter: function updateSelectFilter($form) {
        // If any SelectFilter widgets are a part of the new form,
        // instantiate a new SelectFilter instance for it.
        if (typeof _selectFilter2.default !== 'undefined') {
            $form.find('.selectfilter').each(function (index, value) {
                var namearr = value.name.split('-');
                _selectFilter2.default.init(value.id, namearr[namearr.length - 1], false, DJNesting.adminStaticPrefix);
            });
            $form.find('.selectfilterstacked').each(function (index, value) {
                var namearr = value.name.split('-');
                _selectFilter2.default.init(value.id, namearr[namearr.length - 1], true, DJNesting.adminStaticPrefix);
            });
        }
    }
};

window.DJNesting = DJNesting;

exports.default = DJNesting;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./jquery.djnutils.js":2,"./regexquote":5,"./sortable":6}],8:[function(require,module,exports){
(function (global){
'use strict';

var _jquery = (typeof window !== "undefined" ? window['django']['jQuery'] : typeof global !== "undefined" ? global['django']['jQuery'] : null);

var _jquery2 = _interopRequireDefault(_jquery);

require('./nested-admin/jquery.djangoformset');

var _utils = require('./nested-admin/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _jquery2.default)(document).ready(function () {
    // Remove the border on any empty fieldsets
    (0, _jquery2.default)('fieldset.grp-module, fieldset.module').filter(function (i, element) {
        return element.childNodes.length == 0;
    }).css('border-width', '0');

    // Set predelete class on any form elements with the DELETE input checked.
    // These can occur on forms rendered after a validation error.
    (0, _jquery2.default)('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest('.djn-inline-form').addClass('grp-predelete');

    (0, _jquery2.default)(document).on('djnesting:initialized djnesting:mutate', function onMutate(e, $inline) {
        var $items = $inline.find('> .djn-items, > .tabular > .module > .djn-items');
        var $rows = $items.children('.djn-tbody');
        $rows.removeClass('row1 row2');
        $rows.each(function (i, row) {
            var n = 1 + i % 2;
            (0, _jquery2.default)(row).addClass('row' + n);
        });
    });

    // Register the nested formset on top level djnesting-stacked elements.
    // It will handle recursing down the nested inlines.
    (0, _jquery2.default)('.djn-group-root').each(function (i, rootGroup) {
        (0, _jquery2.default)(rootGroup).djangoFormset();
    });

    (0, _jquery2.default)('form').on('submit.djnesting', function (e) {
        (0, _jquery2.default)('.djn-group').each(function () {
            _utils2.default.updatePositions((0, _jquery2.default)(this).djangoFormsetPrefix());
            (0, _jquery2.default)(document).trigger('djnesting:mutate', [(0, _jquery2.default)(this).djangoFormset().$inline]);
        });
    });
});

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./nested-admin/jquery.djangoformset":1,"./nested-admin/utils":7}]},{},[8])


//# sourceMappingURL=nested_admin.js.map
