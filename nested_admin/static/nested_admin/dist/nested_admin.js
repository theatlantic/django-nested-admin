/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./nested_admin/static/nested_admin/src/nested-admin/django$.js":
/*!**********************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/django$.js ***!
  \**********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");

/**
 * Converts a grp.jQuery instance to a django.jQuery instance.
 */

function django$($sel) {
  if (typeof window.grp === "undefined") {
    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"])($sel);
  }

  if (window.grp.jQuery.fn.init === _jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"].fn.init) {
    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"])($sel);
  }

  var $djangoSel = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"])($sel);

  if ($sel.prevObject) {
    $djangoSel.prevObject = django$($sel.prevObject);
  }

  return $djangoSel;
}

/* harmony default export */ __webpack_exports__["default"] = (django$);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/grp$.js":
/*!*******************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/grp$.js ***!
  \*******************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");

/**
 * For grappelli 2.14, converts a django.jQuery instance to a grp.jQuery
 * instance. Otherwise (if grappelli is not present, or for grappelli <= 2.13,
 * where the grappelli jQuery instance is the same as django's), returns the
 * object that was passed in, unchanged.
 */

function grp$($sel) {
  if (typeof window.grp === "undefined") {
    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"])($sel);
  }

  if (window.grp.jQuery.fn.init === _jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"].fn.init) {
    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_0__["default"])($sel);
  }

  var $grpSel = window.grp.jQuery($sel);

  if ($sel.prevObject) {
    $grpSel.prevObject = grp$($sel.prevObject);
  }

  return $grpSel;
}

/* harmony default export */ __webpack_exports__["default"] = (grp$);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/jquery.djangoformset.js":
/*!***********************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/jquery.djangoformset.js ***!
  \***********************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.function.name.js */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.filter.js */ "./node_modules/core-js/modules/es6.array.filter.js");
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.constructor.js */ "./node_modules/core-js/modules/es6.regexp.constructor.js");
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.array.sort.js */ "./node_modules/core-js/modules/es6.array.sort.js");
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.array.slice.js */ "./node_modules/core-js/modules/es6.array.slice.js");
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");
/* harmony import */ var _regexquote__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./regexquote */ "./nested_admin/static/nested_admin/src/nested-admin/regexquote.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./utils */ "./nested_admin/static/nested_admin/src/nested-admin/utils.js");
/* harmony import */ var grappelli__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! grappelli */ "grappelli");
/* harmony import */ var grappelli__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(grappelli__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var grp__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! grp */ "grp");
/* harmony import */ var grp__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(grp__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var _grp$__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./grp$ */ "./nested_admin/static/nested_admin/src/nested-admin/grp$.js");
/* harmony import */ var _django$__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./django$ */ "./nested_admin/static/nested_admin/src/nested-admin/django$.js");














var pluginName = "djangoFormset";

var DjangoFormset = /*#__PURE__*/function () {
  function DjangoFormset(inline) {
    this.opts = {
      emptyClass: "empty-form grp-empty-form djn-empty-form",
      predeleteClass: "grp-predelete"
    };
    this.$inline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(inline);
    this.prefix = this.$inline.djangoFormsetPrefix();
    this._$totalForms = this.$inline.find("#id_" + this.prefix + "-TOTAL_FORMS");

    this._$totalForms.attr("autocomplete", "off");

    this._$template = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#" + this.prefix + "-empty");
    var inlineModelClassName = this.$inline.djnData("inlineModel");
    var nestingLevel = this.$inline.djnData("nestingLevel");
    var handlerSelector = ".djn-model-" + inlineModelClassName + ".djn-level-" + nestingLevel;
    this.opts = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].extend({}, this.opts, {
      childTypes: this.$inline.data("inlineFormset").options.childTypes,
      formsetFkModel: this.$inline.djnData("formsetFkModel"),
      addButtonSelector: ".djn-add-handler" + handlerSelector,
      removeButtonSelector: ".djn-remove-handler" + handlerSelector,
      deleteButtonSelector: ".djn-delete-handler" + handlerSelector,
      formClass: "dynamic-form grp-dynamic-form djn-dynamic-form-" + inlineModelClassName,
      formClassSelector: ".djn-dynamic-form-" + inlineModelClassName
    });
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].initRelatedFields(this.prefix, this.$inline.djnData());
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].initAutocompleteFields(this.prefix, this.$inline.djnData());

    if (this.opts.childTypes) {
      this._setupPolymorphic();
    }

    this._bindEvents();

    this._initializeForms();

    this.$inline.find('.djn-items:not([id*="-empty"])').trigger("djnesting:init"); // initialize nested formsets

    this.$inline.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function () {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this)[pluginName]();
    });

    if (this.$inline.is(".djn-group-root")) {
      _utils__WEBPACK_IMPORTED_MODULE_9__["default"].createSortable(this.$inline);
    }

    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:initialized", [this.$inline, this]);
  }

  var _proto = DjangoFormset.prototype;

  _proto._setupPolymorphic = function _setupPolymorphic() {
    if (!this.opts.childTypes) {
      throw Error("The polymorphic fieldset options.childTypes is not defined!");
    }

    var menu = '<div class="polymorphic-type-menu" style="display: none"><ul>';
    this.opts.childTypes.forEach(function (c) {
      menu += "<li><a href=\"#\" data-type=\"" + c.type + "\">" + c.name + "</a></li>";
    });
    menu += "</ul></div>";
    var $addButton = this.$inline.find(this.opts.addButtonSelector);
    var $menu = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(menu);
    $addButton.after($menu);
  };

  _proto._initializeForms = function _initializeForms() {
    var totalForms = this.mgmtVal("TOTAL_FORMS");
    var maxForms = this.mgmtVal("MAX_NUM_FORMS");

    if (maxForms <= totalForms) {
      this.$inline.find(this.opts.addButtonSelector).parents(".djn-add-item").hide();
    }

    for (var i = 0; i < totalForms; i++) {
      this._initializeForm("#" + this.prefix + "-" + i);
    }
  };

  _proto._initializeForm = function _initializeForm(form) {
    var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(form);
    var formPrefix = $form.djangoFormPrefix();
    $form.addClass(this.opts.formClass);

    if ($form.hasClass("has_original")) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + formPrefix + "DELETE:checked").toggleClass(this.opts.predeleteClass);
    }

    var minForms = this.mgmtVal("MIN_NUM_FORMS");
    var totalForms = this.mgmtVal("TOTAL_FORMS");
    var self = this;
    var hideRemoveButton = totalForms <= minForms;
    this.$inline.djangoFormsetForms().each(function () {
      var showHideMethod = hideRemoveButton ? "hide" : "show";
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).find(self.opts.removeButtonSelector)[showHideMethod]();
    });
  };

  _proto._bindEvents = function _bindEvents($el) {
    var self = this;

    if (typeof $el == "undefined") {
      $el = this.$inline;
    }

    var $addButton = $el.find(this.opts.addButtonSelector);
    $addButton.off("click.djnesting").on("click.djnesting", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $menu = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).next(".polymorphic-type-menu");

      if (!$menu.length) {
        self.add();
      } else {
        if (!$menu.is(":visible")) {
          var hideMenu = function hideMenu() {
            $menu.hide();
            (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).off("click", hideMenu);
          };

          (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).on("click", hideMenu);
        }

        $menu.show();
      }
    });
    var $menuButtons = $addButton.parent().find("> .polymorphic-type-menu a");
    $menuButtons.off("click.djnesting").on("click.djnesting", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var polymorphicType = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).attr("data-type");
      self.add(null, polymorphicType);
      var $menu = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(e.target).closest(".polymorphic-type-menu");

      if ($menu.is(":visible")) {
        $menu.hide();
      }
    });
    $el.find(this.opts.removeButtonSelector).filter(function () {
      return !(0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).closest(".djn-empty-form").length;
    }).off("click.djnesting").on("click.djnesting", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).closest(self.opts.formClassSelector);
      self.remove($form);
    });

    var deleteClickHandler = function deleteClickHandler(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).closest(self.opts.formClassSelector);
      var $deleteInput = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + $form.djangoFormPrefix() + "DELETE");

      if (!$deleteInput.is(":checked")) {
        self["delete"]($form);
      } else {
        self.undelete($form);
      }
    };

    var $deleteButton = $el.find(this.opts.deleteButtonSelector).filter(function () {
      return !(0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).closest(".djn-empty-form").length;
    });
    $deleteButton.off("click.djnesting").on("click.djnesting", deleteClickHandler);
    $deleteButton.find('[id$="-DELETE"]').on("mousedown.djnesting", deleteClickHandler);
  };

  _proto.remove = function remove(form) {
    var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(form);
    var totalForms = this.mgmtVal("TOTAL_FORMS");
    var minForms = this.mgmtVal("MIN_NUM_FORMS");
    var maxForms = this.mgmtVal("MAX_NUM_FORMS");
    var index = $form.djangoFormIndex();
    var isInitial = $form.data("isInitial"); // Clearing out the form HTML itself using DOM APIs is much faster
    // than using jQuery to remove the element. Using jQuery is so
    // slow that it hangs the page.

    $form[0].innerHTML = "";
    $form.remove();
    totalForms -= 1;
    this.mgmtVal("TOTAL_FORMS", totalForms);

    if (maxForms - totalForms >= 0) {
      this.$inline.find(this.opts.addButtonSelector).parent(".djn-add-item,li").show();
    }

    this._fillGap(index, isInitial);

    var self = this;
    var hideRemoveButton = totalForms <= minForms;
    this.$inline.djangoFormsetForms().each(function () {
      var showHideMethod = hideRemoveButton ? "hide" : "show";
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).find(self.opts.removeButtonSelector)[showHideMethod]();
    });
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(this.prefix);
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [this.$inline]); // Also fire using the events that were added in Django 1.9

    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("formset:removed", [$form, this.prefix]);
    document.dispatchEvent(new CustomEvent("formset:removed", {
      detail: {
        formsetName: this.prefix
      }
    }));
  };

  _proto.delete = function _delete(form) {
    var self = this,
        $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(form),
        formPrefix = $form.djangoFormPrefix(),
        $deleteInput = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + formPrefix + "DELETE");

    if ($form.hasClass(this.opts.predeleteClass)) {
      return;
    }

    if (!$form.data("isInitial")) {
      return;
    }

    $deleteInput.attr("checked", "checked");

    if ($deleteInput.length) {
      $deleteInput[0].checked = true;
    }

    $form.addClass(this.opts.predeleteClass);
    $form.find(".djn-group").each(function () {
      var $childInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this);
      var childFormset = $childInline.djangoFormset();
      $childInline.djangoFormsetForms().each(function () {
        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).hasClass(self.opts.predeleteClass)) {
          (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).data("alreadyDeleted", true);
        } else {
          childFormset.delete(this);
        }
      });
    });
    $form.find(".cropduster-form").each(function () {
      var formPrefix = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).djangoFormsetPrefix() + "-0-";
      var $deleteInput = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + formPrefix + "DELETE");
      $deleteInput.attr("checked", "checked");

      if ($deleteInput.length) {
        $deleteInput[0].checked = true;
      }
    });
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(this.prefix);
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [this.$inline]);
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("formset:deleted", [$form, this.prefix]);
  };

  _proto.undelete = function undelete(form) {
    var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(form),
        formPrefix = $form.djangoFormPrefix(),
        $deleteInput = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + formPrefix + "DELETE");

    if ($form.parent().closest("." + this.opts.predeleteClass).length) {
      return;
    }

    if ($form.hasClass("has_original")) {
      $deleteInput.removeAttr("checked");

      if ($deleteInput.length) {
        $deleteInput[0].checked = false;
      }

      $form.removeClass(this.opts.predeleteClass);
    }

    $form.data("alreadyDeleted", false);
    $form.find(".djn-group").each(function () {
      var $childInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this);
      var childFormset = $childInline.djangoFormset();
      $childInline.djangoFormsetForms().each(function () {
        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).data("alreadyDeleted")) {
          (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).data("alreadyDeleted", false);
        } else {
          childFormset.undelete(this);
        }
      });
    });
    $form.find(".cropduster-form").each(function () {
      var formPrefix = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).djangoFormsetPrefix() + "-0-";
      var $deleteInput = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#id_" + formPrefix + "DELETE");
      $deleteInput.removeAttr("checked");

      if ($deleteInput.length) {
        $deleteInput[0].checked = false;
      }
    });
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(this.prefix);
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [this.$inline]);
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("formset:undeleted", [$form, this.prefix]);
  };

  _proto.add = function add(spliceIndex, ctype) {
    var self = this;
    var $template = ctype ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#" + this.prefix + "-empty-" + ctype) : this._$template;
    var $form = $template.clone(true); // For django-grappelli >= 2.14, where the grp.jQuery instance is not
    // the same as django.jQuery, we must copy any prepopulated_field
    // dependency data from grp.jQuery to the cloned nodes.

    (0,_grp$__WEBPACK_IMPORTED_MODULE_12__["default"])($template).find(":data(dependency_ids)").each(function () {
      var id = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).attr("id");
      var $el = $form.find("#" + id);
      (0,_grp$__WEBPACK_IMPORTED_MODULE_12__["default"])($el).data(_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].extend({}, $el.data(), (0,_grp$__WEBPACK_IMPORTED_MODULE_12__["default"])(this).data()));
    });
    var index = this.mgmtVal("TOTAL_FORMS");
    var maxForms = this.mgmtVal("MAX_NUM_FORMS");
    var isNested = this.$inline.hasClass("djn-group-nested");
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:beforeadded", [this.$inline, $form]);
    $form.removeClass(this.opts.emptyClass);
    $form.addClass("djn-item");
    $form.attr("id", $form.attr("id").replace(/\-empty.*?$/, "-" + index));

    if (isNested) {
      $form.append(_utils__WEBPACK_IMPORTED_MODULE_9__["default"].createContainerElement());
    }

    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updateFormAttributes($form, new RegExp('([#_]id_|[\\#]|^id_|"|^)' + (0,_regexquote__WEBPACK_IMPORTED_MODULE_8__["default"])(this.prefix) + "\\-(?:__prefix__|empty)\\-", "g"), "$1" + this.prefix + "-" + index + "-");
    var $firstTemplate = this._$template;

    if (this.opts.childTypes) {
      $firstTemplate = $template.closest(".djn-group").find('> .djn-items > [id*="-empty"], > .djn-fieldset > .djn-items > [id*="-empty"]').eq(0);
    }

    if (this.opts.childTypes) {
      var compatibleParents = this.$inline.djnData("compatibleParents") || {};
      $form.find("> .djn-group").each(function (i, el) {
        var fkModel = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(el).djnData("formsetFkModel");
        var compatModels = compatibleParents[ctype] || [];
        var $el = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(el);
        var parentModel = $el.djnData("inlineParentModel");
        var isPolymorphic = !!$el.data("inlineFormset").options.childTypes;
        var formPrefix = $el.data("inlineFormset").options.prefix;

        if (parentModel !== ctype || isPolymorphic && fkModel !== ctype && compatModels.indexOf(fkModel) === -1) {
          $el.find('input[id$="_FORMS"]').each(function (i, input) {
            input.value = 0;
            input.setAttribute("value", "0");
            el.parentNode.appendChild(input);
          });
          el.parentNode.removeChild(el);
        }
      });
    }

    $form.insertBefore($firstTemplate);
    this.mgmtVal("TOTAL_FORMS", index + 1);

    if (maxForms - (index + 1) <= 0) {
      this.$inline.find(this.opts.addButtonSelector).parent(".djn-add-item,li").hide();
    }

    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(this.prefix);

    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].isNumeric(spliceIndex)) {
      this.spliceInto($form, spliceIndex, true);
    } else {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [this.$inline]);
    }

    if (grappelli__WEBPACK_IMPORTED_MODULE_10__) {
      grappelli__WEBPACK_IMPORTED_MODULE_10__.reinitDateTimeFields((0,_grp$__WEBPACK_IMPORTED_MODULE_12__["default"])($form));
    }

    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].DjangoInlines.initPrepopulatedFields((0,_django$__WEBPACK_IMPORTED_MODULE_13__["default"])($form));
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].DjangoInlines.reinitDateTimeShortCuts();
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].DjangoInlines.updateSelectFilter($form);
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].initRelatedFields(this.prefix);
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].initAutocompleteFields(this.prefix);

    if ((grp__WEBPACK_IMPORTED_MODULE_11___default()) && (grp__WEBPACK_IMPORTED_MODULE_11___default().jQuery.fn.grp_collapsible)) {
      var addBackMethod = (grp__WEBPACK_IMPORTED_MODULE_11___default().jQuery.fn.addBack) ? "addBack" : "andSelf";
      (0,_grp$__WEBPACK_IMPORTED_MODULE_12__["default"])($form).find('.grp-collapse:not([id$="-empty"]):not([id*="-empty-"])')[addBackMethod]().grp_collapsible({
        toggle_handler_slctr: ".grp-collapse-handler:first",
        closed_css: "closed grp-closed",
        open_css: "open grp-open",
        on_toggle: function on_toggle() {
          (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:toggle", [self.$inline]);
        }
      });
    }

    if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].fn.curated_content_type == "function") {
      $form.find(".curated-content-type-select").each(function () {
        (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this).curated_content_type();
      });
    }

    this._initializeForm($form);

    this._bindEvents($form);

    if (ctype) {
      var formsetModelClassName = this.$inline.djnData("inlineModel");
      var inlineModelClassName = $form.attr("data-inline-model");
      var $buttons = $form.find(".djn-model-" + formsetModelClassName);
      $buttons.addClass("djn-model-" + inlineModelClassName);
      $form.addClass("djn-dynamic-form-" + inlineModelClassName);
    } // find any nested formsets


    $form.find('.djn-group[id$="-group"][id^="' + this.prefix + '"][data-inline-formset]:not([id*="-empty"])').each(function () {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this)[pluginName]();
    }); // Fire an event on the document so other javascript applications
    // can be alerted to the newly inserted inline

    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:added", [this.$inline, $form]); // Also fire using the events that were added in Django 1.9

    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("formset:added", [$form, this.prefix]);

    try {
      $form.get(0).dispatchEvent(new CustomEvent("formset:added", {
        bubbles: true,
        detail: {
          formsetName: this.prefix
        }
      }));
    } catch (e) {}

    return $form;
  };

  _proto._fillGap = function _fillGap(index, isInitial) {
    var $initialForm, $newForm;
    var formsets = this.$inline.djangoFormsetForms().toArray(); // Sort formsets in index order, so that we get the last indexed form for the swap.

    formsets.sort(function (a, b) {
      return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(a).djangoFormIndex() - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(b).djangoFormIndex();
    });
    formsets.forEach(function (form) {
      var $form = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(form);
      var i = $form.djangoFormIndex();

      if (i <= index) {
        return;
      }

      if ($form.data("isInitial")) {
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
    var oldFormPrefixRegex = new RegExp("([\\#_]|^)" + (0,_regexquote__WEBPACK_IMPORTED_MODULE_8__["default"])(this.prefix + "-" + oldIndex) + "(?!\\-\\d)");
    $form.attr("id", this.prefix + "-" + index);
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updateFormAttributes($form, oldFormPrefixRegex, "$1" + this.prefix + "-" + index); // Update prefixes on nested DjangoFormset objects

    $form.find(".djn-group").each(function () {
      var $childInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this);
      var childFormset = $childInline.djangoFormset();
      childFormset.prefix = $childInline.djangoFormsetPrefix();
    });
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:attrchange", [this.$inline, $form]);

    if (isInitial && $initialForm && $newForm) {
      this._fillGap(oldIndex, false);
    }
  };

  _proto._makeRoomForInsert = function _makeRoomForInsert() {
    var initialFormCount = this.mgmtVal("INITIAL_FORMS"),
        totalFormCount = this.mgmtVal("TOTAL_FORMS"),
        gapIndex = initialFormCount,
        $existingForm = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#" + this.prefix + "-" + gapIndex);

    if (!$existingForm.length) {
      return;
    }

    var oldFormPrefixRegex = new RegExp("([\\#_]|^)" + (0,_regexquote__WEBPACK_IMPORTED_MODULE_8__["default"])(this.prefix) + "-" + gapIndex + "(?!\\-\\d)");
    $existingForm.attr("id", this.prefix + "-" + totalFormCount);
    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updateFormAttributes($existingForm, oldFormPrefixRegex, "$1" + this.prefix + "-" + totalFormCount); // Update prefixes on nested DjangoFormset objects

    $existingForm.find(".djn-group").each(function () {
      var $childInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this);
      var childFormset = $childInline.djangoFormset();
      childFormset.prefix = $childInline.djangoFormsetPrefix();
    });
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:attrchange", [this.$inline, $existingForm]);
  }
  /**
   * Splice a form into the current formset at new position `index`.
   */
  ;

  _proto.spliceInto = function spliceInto($form, index, isNewAddition) {
    var initialFormCount = this.mgmtVal("INITIAL_FORMS"),
        totalFormCount = this.mgmtVal("TOTAL_FORMS"),
        oldFormsetPrefix = $form.djangoFormsetPrefix(),
        newFormsetPrefix = this.prefix,
        isInitial = $form.data("isInitial"),
        newIndex,
        $before; // Make sure the form being spliced is from a different inline

    if ($form.djangoFormsetPrefix() == this.prefix) {
      var currentPosition = $form.prevAll(".djn-item:not(.djn-no-drag,.djn-thead)").length;

      if (currentPosition === index || typeof index == "undefined") {
        _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(newFormsetPrefix);
        return;
      }

      $before = this.$inline.find("> .djn-items, > .tabular > .module > .djn-items").find("> .djn-item:not(#" + $form.attr("id") + ")").eq(index);
      $before.after($form);
    } else {
      var $oldInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])("#" + oldFormsetPrefix + "-group");
      var $currentFormInline = $form.closest(".djn-group");

      if ($currentFormInline.djangoFormsetPrefix() != newFormsetPrefix) {
        $before = this.$inline.find("> .djn-items, > .tabular > .module > .djn-items").find("> .djn-item").eq(index);
        $before.after($form);
      }

      var oldDjangoFormset = $oldInline.djangoFormset();
      oldDjangoFormset.mgmtVal("TOTAL_FORMS", oldDjangoFormset.mgmtVal("TOTAL_FORMS") - 1);

      oldDjangoFormset._fillGap($form.djangoFormIndex(), isInitial);

      if (isInitial) {
        oldDjangoFormset.mgmtVal("INITIAL_FORMS", oldDjangoFormset.mgmtVal("INITIAL_FORMS") - 1);
        var $parentInline = this.$inline.parent().closest(".djn-group");

        if ($parentInline.length) {
          var $parentForm = this.$inline.closest(".djn-inline-form");
          var parentPkField = ($parentInline.djnData("fieldNames") || {}).pk;
          var $parentPk = $parentForm.djangoFormField(parentPkField);

          if (!$parentPk.val()) {
            $form.data("isInitial", false);
            $form.attr("data-is-initial", "false");
            isInitial = false; // Set initial form counts to 0 on nested DjangoFormsets

            setTimeout(function () {
              $form.find('[name^="' + $form.djangoFormPrefix() + '"][name$="-INITIAL_FORMS"]').val("0").trigger("change");
            }, 0);
          }
        }
      }

      if (isInitial) {
        this._makeRoomForInsert();
      } // Replace the ids for the splice form


      var oldFormPrefixRegex = new RegExp("([\\#_]|^)" + (0,_regexquote__WEBPACK_IMPORTED_MODULE_8__["default"])($form.attr("id")) + "(?!\\-\\d)");
      newIndex = isInitial ? initialFormCount : totalFormCount;
      $form.attr("id", newFormsetPrefix + "-" + newIndex);
      _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updateFormAttributes($form, oldFormPrefixRegex, "$1" + newFormsetPrefix + "-" + newIndex); // Update prefixes on nested DjangoFormset objects

      $form.find(".djn-group").each(function () {
        var $childInline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(this);
        var childFormset = $childInline.djangoFormset();
        childFormset.prefix = $childInline.djangoFormsetPrefix();
      });
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:attrchange", [this.$inline, $form]);

      if (isInitial) {
        this.mgmtVal("INITIAL_FORMS", initialFormCount + 1);
      }

      this.mgmtVal("TOTAL_FORMS", totalFormCount + 1);
      _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(oldFormsetPrefix);
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [$oldInline]);
    }

    _utils__WEBPACK_IMPORTED_MODULE_9__["default"].updatePositions(newFormsetPrefix);

    if (!isNewAddition) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"])(document).trigger("djnesting:mutate", [this.$inline]);
    }
  };

  _proto.mgmtVal = function mgmtVal(name, newValue) {
    var $field = this.$inline.find("#id_" + this.prefix + "-" + name);

    if (typeof newValue == "undefined") {
      return parseInt($field.val(), 10);
    } else {
      return parseInt($field.val(newValue).trigger("change").val(), 10);
    }
  };

  return DjangoFormset;
}();

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].fn[pluginName] = function () {
  var options, fn, args;
  var $el = this.eq(0);

  if (arguments.length === 0 || arguments.length === 1 && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].type(arguments[0]) != "string") {
    options = arguments[0];
    var djangoFormset = $el.data(pluginName);

    if (!djangoFormset) {
      djangoFormset = new DjangoFormset($el, options);
      $el.data(pluginName, djangoFormset);
    }

    return djangoFormset;
  }

  fn = arguments[0];
  args = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_7__["default"].makeArray(arguments).slice(1);

  if (fn in DjangoFormset.prototype) {
    return $el.data(pluginName)[fn](args);
  } else {
    throw new Error("Unknown function call " + fn + " for $.fn." + pluginName);
  }
};

/* harmony default export */ __webpack_exports__["default"] = (DjangoFormset);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/jquery.djnutils.js":
/*!******************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/jquery.djnutils.js ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.array.filter.js */ "./node_modules/core-js/modules/es6.array.filter.js");
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.array.sort.js */ "./node_modules/core-js/modules/es6.array.sort.js");
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.constructor.js */ "./node_modules/core-js/modules/es6.regexp.constructor.js");
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");






var prefixCache = {};

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djnData = function (name) {
  var inlineFormsetData = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this).data("inlineFormset") || {},
      nestedOptions = inlineFormsetData.nestedOptions || {};

  if (!name) {
    return nestedOptions;
  } else {
    return nestedOptions[name];
  }
};

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoPrefixIndex = function () {
  var $this = this.length > 1 ? this.first() : this;
  var id = $this.attr("id"),
      name = $this.attr("name"),
      forattr = $this.attr("for"),
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

  if (id && !prefix && $this.is(".djn-item") && id.match(/\d+$/)) {
    var _ref = id.match(/(.*?)\-(\d+)$/) || [null, null, null];

    cacheKey = _ref[0];
    prefix = _ref[1];
    index = _ref[2];
  }

  if (!prefix) {
    $form = $this.closest(".djn-inline-form");

    if ($form.length) {
      var _ref2 = $form.attr("id").match(/(.*?)\-(\d+)$/) || [null, null, null];

      cacheKey = _ref2[0];
      prefix = _ref2[1];
      index = _ref2[2];
    } else {
      $group = $this.closest(".djn-group");

      if (!$group.length) {
        return null;
      }

      groupId = $group.attr("id") || "";
      prefix = (groupId.match(/^(.*)\-group$/) || [null, null])[1];
    }
  } else {
    if (prefix.substr(0, 3) == "id_") {
      prefix = prefix.substr(3);
    }

    if (!document.getElementById(prefix + "-group")) {
      return null;
    }
  }

  if (cacheKey) {
    prefixCache[cacheKey] = [prefix, index];
  }

  return [prefix, index];
};

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormPrefix = function () {
  var prefixIndex = this.djangoPrefixIndex();

  if (!prefixIndex || !prefixIndex[1]) {
    return null;
  }

  return prefixIndex[0] + "-" + prefixIndex[1] + "-";
};

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormIndex = function () {
  var prefixIndex = this.djangoPrefixIndex();
  return !prefixIndex || !prefixIndex[1] ? null : parseInt(prefixIndex[1], 10);
};

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormsetPrefix = function () {
  var prefixIndex = this.djangoPrefixIndex();
  return !prefixIndex ? null : prefixIndex[0];
};

var filterDjangoFormsetForms = function filterDjangoFormsetForms(form, $group, formsetPrefix) {
  var formId = form.getAttribute("id"),
      formIndex = formId.substr(formsetPrefix.length + 1); // Check if form id matches /{prefix}-\d+/

  if (formId.indexOf(formsetPrefix) !== 0) {
    return false;
  }

  return !formIndex.match(/\D/);
}; // Selects all initial forms within the same formset as the
// element the method is being called on.


_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormsetForms = function () {
  var forms = [];
  this.each(function () {
    var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this),
        formsetPrefix = $this.djangoFormsetPrefix(),
        $group = formsetPrefix ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#" + formsetPrefix + "-group") : null,
        $forms;
    if (!formsetPrefix || !$group.length) return;
    $forms = $group.find(".djn-inline-form").filter(function () {
      return filterDjangoFormsetForms(this, $group, formsetPrefix);
    });
    var sortedForms = $forms.toArray().sort(function (a, b) {
      return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(a).djangoFormIndex() - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(b).djangoFormIndex;
    });
    Array.prototype.push.apply(forms, sortedForms);
  });
  return this.pushStack(forms);
};

if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].djangoFormField != "function") {
  _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].djangoFormField = function (fieldName, prefix, index) {
    var $empty = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])([]),
        matches;

    if (matches = prefix.match(/^(.+)\-(\d+)\-$/)) {
      prefix = matches[1];
      index = matches[2];
    }

    index = parseInt(index, 10);

    if (isNaN(index)) {
      return $empty;
    }

    var namePrefix = prefix + "-" + index + "-";

    if (fieldName == "*") {
      return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])('*[name^="' + namePrefix + '"]').filter(function () {
        var fieldPart = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this).attr("name").substring(namePrefix.length);
        return fieldPart.indexOf("-") === -1;
      });
    }

    var $field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#id_" + namePrefix + fieldName);

    if (!$field.length && (fieldName == "pk" || fieldName == "position")) {
      var $group = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#" + prefix + "-group"),
          fieldNameData = $group.djnData("fieldNames") || {};
      fieldName = fieldNameData[fieldName];

      if (!fieldName) {
        return $empty;
      }

      $field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#id_" + namePrefix + fieldName);
    }

    return $field;
  };
}

if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormField != "function") {
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
  _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.djangoFormField = function (fieldName, index) {
    var prefixAndIndex = this.djangoPrefixIndex();
    var $empty = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])([]);

    if (!prefixAndIndex) {
      return $empty;
    }

    var prefix = prefixAndIndex[0];

    if (typeof index == "undefined") {
      index = prefixAndIndex[1];

      if (typeof index == "undefined") {
        return $empty;
      }
    }

    return _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].djangoFormField(fieldName, prefix, index);
  };
}

if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.filterDjangoField != "function") {
  var djRegexCache = {};

  _jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"].fn.filterDjangoField = function (prefix, fieldName, index) {
    var $field, fieldNameData;

    if (typeof index != "undefined") {
      if (typeof index == "string") {
        index = parseInt(index, 10);
      }

      if (typeof index == "number" && !isNaN(index)) {
        var fieldId = "id_" + prefix + "-" + index + "-" + fieldName;
        $field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#" + fieldId);
      }
    } else {
      if (typeof djRegexCache[prefix] != "object") {
        djRegexCache[prefix] = {};
      }

      if (typeof djRegexCache[prefix][fieldName] == "undefined") {
        djRegexCache[prefix][fieldName] = new RegExp("^" + prefix + "-\\d+-" + fieldName + "$");
      }

      $field = this.find('input[name$="' + fieldName + '"]').filter(function () {
        return this.getAttribute("name").match(djRegexCache[prefix][fieldName]);
      });
    }

    if (!$field.length && (fieldName == "pk" || fieldName == "position")) {
      fieldNameData = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])("#" + prefix + "-group").djnData("fieldNames") || {};

      if (typeof fieldNameData[fieldName] && fieldNameData[fieldName] != fieldName) {
        $field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_5__["default"])(this).filterDjangoField(prefix, fieldNameData[fieldName], index);
      }
    }

    return $field;
  };
}

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js":
/*!**************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (window.django.jQuery);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.djnsortable.js":
/*!************************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.djnsortable.js ***!
  \************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.function.name.js */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.array.filter.js */ "./node_modules/core-js/modules/es6.array.filter.js");
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.slice.js */ "./node_modules/core-js/modules/es6.array.slice.js");
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.split.js */ "./node_modules/core-js/modules/es6.regexp.split.js");
/* harmony import */ var core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");







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

if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui === undefined) {
  var jQuery = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"];
  /* eslint-disable */

  (function (e, t) {
    function i(t, i) {
      var s,
          n,
          r,
          o = t.nodeName.toLowerCase();
      return "area" === o ? (s = t.parentNode, n = s.name, t.href && n && "map" === s.nodeName.toLowerCase() ? (r = e("img[usemap=#" + n + "]")[0], !!r && a(r)) : !1) : (/input|select|textarea|button|object/.test(o) ? !t.disabled : "a" === o ? t.href || i : i) && a(t);
    }

    function a(t) {
      return e.expr.filters.visible(t) && !e(t).parents().addBack().filter(function () {
        return "hidden" === e.css(this, "visibility");
      }).length;
    }

    var s = 0,
        n = /^ui-id-\d+$/;
    e.ui = e.ui || {}, e.extend(e.ui, {
      version: "1.10.3",
      keyCode: {
        BACKSPACE: 8,
        COMMA: 188,
        DELETE: 46,
        DOWN: 40,
        END: 35,
        ENTER: 13,
        ESCAPE: 27,
        HOME: 36,
        LEFT: 37,
        NUMPAD_ADD: 107,
        NUMPAD_DECIMAL: 110,
        NUMPAD_DIVIDE: 111,
        NUMPAD_ENTER: 108,
        NUMPAD_MULTIPLY: 106,
        NUMPAD_SUBTRACT: 109,
        PAGE_DOWN: 34,
        PAGE_UP: 33,
        PERIOD: 190,
        RIGHT: 39,
        SPACE: 32,
        TAB: 9,
        UP: 38
      }
    }), e.fn.extend({
      focus: function (t) {
        return function (i, a) {
          return "number" == typeof i ? this.each(function () {
            var t = this;
            setTimeout(function () {
              e(t).focus(), a && a.call(t);
            }, i);
          }) : t.apply(this, arguments);
        };
      }(e.fn.focus),
      scrollParent: function scrollParent() {
        var t;
        return t = e.ui.ie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? this.parents().filter(function () {
          return /(relative|absolute|fixed)/.test(e.css(this, "position")) && /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
        }).eq(0) : this.parents().filter(function () {
          return /(auto|scroll)/.test(e.css(this, "overflow") + e.css(this, "overflow-y") + e.css(this, "overflow-x"));
        }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t;
      },
      zIndex: function zIndex(i) {
        if (i !== t) return this.css("zIndex", i);
        if (this.length) for (var a, s, n = e(this[0]); n.length && n[0] !== document;) {
          if (a = n.css("position"), ("absolute" === a || "relative" === a || "fixed" === a) && (s = parseInt(n.css("zIndex"), 10), !isNaN(s) && 0 !== s)) return s;
          n = n.parent();
        }
        return 0;
      },
      uniqueId: function uniqueId() {
        return this.each(function () {
          this.id || (this.id = "ui-id-" + ++s);
        });
      },
      removeUniqueId: function removeUniqueId() {
        return this.each(function () {
          n.test(this.id) && e(this).removeAttr("id");
        });
      }
    }), e.extend(e.expr[":"], {
      data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
        return function (i) {
          return !!e.data(i, t);
        };
      }) : function (t, i, a) {
        return !!e.data(t, a[3]);
      },
      focusable: function focusable(t) {
        return i(t, !isNaN(e.attr(t, "tabindex")));
      },
      tabbable: function tabbable(t) {
        var a = e.attr(t, "tabindex"),
            s = isNaN(a);
        return (s || a >= 0) && i(t, !s);
      }
    }), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (i, a) {
      function s(t, i, a, s) {
        return e.each(n, function () {
          i -= parseFloat(e.css(t, "padding" + this)) || 0, a && (i -= parseFloat(e.css(t, "border" + this + "Width")) || 0), s && (i -= parseFloat(e.css(t, "margin" + this)) || 0);
        }), i;
      }

      var n = "Width" === a ? ["Left", "Right"] : ["Top", "Bottom"],
          r = a.toLowerCase(),
          o = {
        innerWidth: e.fn.innerWidth,
        innerHeight: e.fn.innerHeight,
        outerWidth: e.fn.outerWidth,
        outerHeight: e.fn.outerHeight
      };
      e.fn["inner" + a] = function (i) {
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
    }(e.fn.removeData)), e.ui.ie = !!/msie [\w.]+/.exec(navigator.userAgent.toLowerCase()), e.support.selectstart = "onselectstart" in document.createElement("div"), e.fn.extend({
      disableSelection: function disableSelection() {
        return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
          e.preventDefault();
        });
      },
      enableSelection: function enableSelection() {
        return this.unbind(".ui-disableSelection");
      }
    }), e.extend(e.ui, {
      plugin: {
        add: function add(t, i, a) {
          var s,
              n = e.ui[t].prototype;

          for (s in a) {
            n.plugins[s] = n.plugins[s] || [], n.plugins[s].push([i, a[s]]);
          }
        },
        call: function call(e, t, i) {
          var a,
              s = e.plugins[t];
          if (s && e.element[0].parentNode && 11 !== e.element[0].parentNode.nodeType) for (a = 0; s.length > a; a++) {
            e.options[s[a][0]] && s[a][1].apply(e.element, i);
          }
        }
      },
      hasScroll: function hasScroll(t, i) {
        if ("hidden" === e(t).css("overflow")) return !1;
        var a = i && "left" === i ? "scrollLeft" : "scrollTop",
            s = !1;
        return t[a] > 0 ? !0 : (t[a] = 1, s = t[a] > 0, t[a] = 0, s);
      }
    });
  })(jQuery);

  (function (e, t) {
    var i = 0,
        s = Array.prototype.slice,
        a = e.cleanData;
    e.cleanData = function (t) {
      for (var i, s = 0; null != (i = t[s]); s++) {
        try {
          e(i).triggerHandler("remove");
        } catch (n) {}
      }

      a(t);
    }, e.widget = function (i, s, a) {
      var n,
          r,
          o,
          h,
          l = {},
          u = i.split(".")[0];
      i = i.split(".")[1], n = u + "-" + i, a || (a = s, s = e.Widget), e.expr[":"][n.toLowerCase()] = function (t) {
        return !!e.data(t, n);
      }, e[u] = e[u] || {}, r = e[u][i], o = e[u][i] = function (e, i) {
        return this._createWidget ? (arguments.length && this._createWidget(e, i), t) : new o(e, i);
      }, e.extend(o, r, {
        version: a.version,
        _proto: e.extend({}, a),
        _childConstructors: []
      }), h = new s(), h.options = e.widget.extend({}, h.options), e.each(a, function (i, a) {
        return e.isFunction(a) ? (l[i] = function () {
          var e = function e() {
            return s.prototype[i].apply(this, arguments);
          },
              t = function t(e) {
            return s.prototype[i].apply(this, e);
          };

          return function () {
            var i,
                s = this._super,
                n = this._superApply;
            return this._super = e, this._superApply = t, i = a.apply(this, arguments), this._super = s, this._superApply = n, i;
          };
        }(), t) : (l[i] = a, t);
      }), o.prototype = e.widget.extend(h, {
        widgetEventPrefix: r ? h.widgetEventPrefix : i
      }, l, {
        constructor: o,
        namespace: u,
        widgetName: i,
        widgetFullName: n
      }), r ? (e.each(r._childConstructors, function (t, i) {
        var s = i.prototype;
        e.widget(s.namespace + "." + s.widgetName, o, i._proto);
      }), delete r._childConstructors) : s._childConstructors.push(o), e.widget.bridge(i, o);
    }, e.widget.extend = function (i) {
      for (var a, n, r = s.call(arguments, 1), o = 0, h = r.length; h > o; o++) {
        for (a in r[o]) {
          n = r[o][a], r[o].hasOwnProperty(a) && n !== t && (i[a] = e.isPlainObject(n) ? e.isPlainObject(i[a]) ? e.widget.extend({}, i[a], n) : e.widget.extend({}, n) : n);
        }
      }

      return i;
    }, e.widget.bridge = function (i, a) {
      var n = a.prototype.widgetFullName || i;

      e.fn[i] = function (r) {
        var o = "string" == typeof r,
            h = s.call(arguments, 1),
            l = this;
        return r = !o && h.length ? e.widget.extend.apply(null, [r].concat(h)) : r, o ? this.each(function () {
          var s,
              a = e.data(this, n);
          return a ? e.isFunction(a[r]) && "_" !== r.charAt(0) ? (s = a[r].apply(a, h), s !== a && s !== t ? (l = s && s.jquery ? l.pushStack(s.get()) : s, !1) : t) : e.error("no such method '" + r + "' for " + i + " widget instance") : e.error("cannot call methods on " + i + " prior to initialization; " + "attempted to call method '" + r + "'");
        }) : this.each(function () {
          var t = e.data(this, n);
          t ? t.option(r || {})._init() : e.data(this, n, new a(r, this));
        }), l;
      };
    }, e.Widget = function () {}, e.Widget._childConstructors = [], e.Widget.prototype = {
      widgetName: "widget",
      widgetEventPrefix: "",
      defaultElement: "<div>",
      options: {
        disabled: !1,
        create: null
      },
      _createWidget: function _createWidget(t, s) {
        s = e(s || this.defaultElement || this)[0], this.element = e(s), this.uuid = i++, this.eventNamespace = "." + this.widgetName + this.uuid, this.options = e.widget.extend({}, this.options, this._getCreateOptions(), t), this.bindings = e(), this.hoverable = e(), this.focusable = e(), s !== this && (e.data(s, this.widgetFullName, this), this._on(!0, this.element, {
          remove: function remove(e) {
            e.target === s && this.destroy();
          }
        }), this.document = e(s.style ? s.ownerDocument : s.document || s), this.window = e(this.document[0].defaultView || this.document[0].parentWindow)), this._create(), this._trigger("create", null, this._getCreateEventData()), this._init();
      },
      _getCreateOptions: e.noop,
      _getCreateEventData: e.noop,
      _create: e.noop,
      _init: e.noop,
      destroy: function destroy() {
        this._destroy(), this.element.unbind(this.eventNamespace).removeData(this.widgetName).removeData(this.widgetFullName).removeData(e.camelCase(this.widgetFullName)), this.widget().unbind(this.eventNamespace).removeAttr("aria-disabled").removeClass(this.widgetFullName + "-disabled " + "ui-state-disabled"), this.bindings.unbind(this.eventNamespace), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus");
      },
      _destroy: e.noop,
      widget: function widget() {
        return this.element;
      },
      option: function option(i, s) {
        var a,
            n,
            r,
            o = i;
        if (0 === arguments.length) return e.widget.extend({}, this.options);
        if ("string" == typeof i) if (o = {}, a = i.split("."), i = a.shift(), a.length) {
          for (n = o[i] = e.widget.extend({}, this.options[i]), r = 0; a.length - 1 > r; r++) {
            n[a[r]] = n[a[r]] || {}, n = n[a[r]];
          }

          if (i = a.pop(), s === t) return n[i] === t ? null : n[i];
          n[i] = s;
        } else {
          if (s === t) return this.options[i] === t ? null : this.options[i];
          o[i] = s;
        }
        return this._setOptions(o), this;
      },
      _setOptions: function _setOptions(e) {
        var t;

        for (t in e) {
          this._setOption(t, e[t]);
        }

        return this;
      },
      _setOption: function _setOption(e, t) {
        return this.options[e] = t, "disabled" === e && (this.widget().toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !!t).attr("aria-disabled", t), this.hoverable.removeClass("ui-state-hover"), this.focusable.removeClass("ui-state-focus")), this;
      },
      enable: function enable() {
        return this._setOption("disabled", !1);
      },
      disable: function disable() {
        return this._setOption("disabled", !0);
      },
      _on: function _on(i, s, a) {
        var n,
            r = this;
        "boolean" != typeof i && (a = s, s = i, i = !1), a ? (s = n = e(s), this.bindings = this.bindings.add(s)) : (a = s, s = this.element, n = this.widget()), e.each(a, function (a, o) {
          function h() {
            return i || r.options.disabled !== !0 && !e(this).hasClass("ui-state-disabled") ? ("string" == typeof o ? r[o] : o).apply(r, arguments) : t;
          }

          "string" != typeof o && (h.guid = o.guid = o.guid || h.guid || e.guid++);
          var l = a.match(/^(\w+)\s*(.*)$/),
              u = l[1] + r.eventNamespace,
              c = l[2];
          c ? n.delegate(c, u, h) : s.bind(u, h);
        });
      },
      _off: function _off(e, t) {
        t = (t || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace, e.unbind(t).undelegate(t);
      },
      _delay: function _delay(e, t) {
        function i() {
          return ("string" == typeof e ? s[e] : e).apply(s, arguments);
        }

        var s = this;
        return setTimeout(i, t || 0);
      },
      _hoverable: function _hoverable(t) {
        this.hoverable = this.hoverable.add(t), this._on(t, {
          mouseenter: function mouseenter(t) {
            e(t.currentTarget).addClass("ui-state-hover");
          },
          mouseleave: function mouseleave(t) {
            e(t.currentTarget).removeClass("ui-state-hover");
          }
        });
      },
      _focusable: function _focusable(t) {
        this.focusable = this.focusable.add(t), this._on(t, {
          focusin: function focusin(t) {
            e(t.currentTarget).addClass("ui-state-focus");
          },
          focusout: function focusout(t) {
            e(t.currentTarget).removeClass("ui-state-focus");
          }
        });
      },
      _trigger: function _trigger(t, i, s) {
        var a,
            n,
            r = this.options[t];
        if (s = s || {}, i = e.Event(i), i.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), i.target = this.element[0], n = i.originalEvent) for (a in n) {
          a in i || (i[a] = n[a]);
        }
        return this.element.trigger(i, s), !(e.isFunction(r) && r.apply(this.element[0], [i].concat(s)) === !1 || i.isDefaultPrevented());
      }
    }, e.each({
      show: "fadeIn",
      hide: "fadeOut"
    }, function (t, i) {
      e.Widget.prototype["_" + t] = function (s, a, n) {
        "string" == typeof a && (a = {
          effect: a
        });
        var r,
            o = a ? a === !0 || "number" == typeof a ? i : a.effect || i : t;
        a = a || {}, "number" == typeof a && (a = {
          duration: a
        }), r = !e.isEmptyObject(a), a.complete = n, a.delay && s.delay(a.delay), r && e.effects && e.effects.effect[o] ? s[t](a) : o !== t && s[o] ? s[o](a.duration, a.easing, n) : s.queue(function (i) {
          e(this)[t](), n && n.call(s[0]), i();
        });
      };
    });
  })(jQuery);

  (function (e) {
    var t = !1;
    e(document).mouseup(function () {
      t = !1;
    }), e.widget("ui.mouse", {
      version: "1.10.3",
      options: {
        cancel: "input,textarea,button,select,option",
        distance: 1,
        delay: 0
      },
      _mouseInit: function _mouseInit() {
        var t = this;
        this.element.bind("mousedown." + this.widgetName, function (e) {
          return t._mouseDown(e);
        }).bind("click." + this.widgetName, function (i) {
          return !0 === e.data(i.target, t.widgetName + ".preventClickEvent") ? (e.removeData(i.target, t.widgetName + ".preventClickEvent"), i.stopImmediatePropagation(), !1) : undefined;
        }), this.started = !1;
      },
      _mouseDestroy: function _mouseDestroy() {
        this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate);
      },
      _mouseDown: function _mouseDown(i) {
        if (!t) {
          this._mouseStarted && this._mouseUp(i), this._mouseDownEvent = i;
          var s = this,
              a = 1 === i.which,
              n = "string" == typeof this.options.cancel && i.target.nodeName ? e(i.target).closest(this.options.cancel).length : !1;
          return a && !n && this._mouseCapture(i) ? (this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
            s.mouseDelayMet = !0;
          }, this.options.delay)), this._mouseDistanceMet(i) && this._mouseDelayMet(i) && (this._mouseStarted = this._mouseStart(i) !== !1, !this._mouseStarted) ? (i.preventDefault(), !0) : (!0 === e.data(i.target, this.widgetName + ".preventClickEvent") && e.removeData(i.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
            return s._mouseMove(e);
          }, this._mouseUpDelegate = function (e) {
            return s._mouseUp(e);
          }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), i.preventDefault(), t = !0, !0)) : !0;
        }
      },
      _mouseMove: function _mouseMove(t) {
        return e.ui.ie && (!document.documentMode || 9 > document.documentMode) && !t.button ? this._mouseUp(t) : this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted);
      },
      _mouseUp: function _mouseUp(t) {
        return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target === this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1;
      },
      _mouseDistanceMet: function _mouseDistanceMet(e) {
        return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance;
      },
      _mouseDelayMet: function _mouseDelayMet() {
        return this.mouseDelayMet;
      },
      _mouseStart: function _mouseStart() {},
      _mouseDrag: function _mouseDrag() {},
      _mouseStop: function _mouseStop() {},
      _mouseCapture: function _mouseCapture() {
        return !0;
      }
    });
  })(jQuery);

  (function (e, t) {
    function i(e, t, i) {
      return [parseFloat(e[0]) * (p.test(e[0]) ? t / 100 : 1), parseFloat(e[1]) * (p.test(e[1]) ? i / 100 : 1)];
    }

    function s(t, i) {
      return parseInt(e.css(t, i), 10) || 0;
    }

    function a(t) {
      var i = t[0];
      return 9 === i.nodeType ? {
        width: t.width(),
        height: t.height(),
        offset: {
          top: 0,
          left: 0
        }
      } : e.isWindow(i) ? {
        width: t.width(),
        height: t.height(),
        offset: {
          top: t.scrollTop(),
          left: t.scrollLeft()
        }
      } : i.preventDefault ? {
        width: 0,
        height: 0,
        offset: {
          top: i.pageY,
          left: i.pageX
        }
      } : {
        width: t.outerWidth(),
        height: t.outerHeight(),
        offset: t.offset()
      };
    }

    e.ui = e.ui || {};
    var n,
        r = Math.max,
        o = Math.abs,
        h = Math.round,
        l = /left|center|right/,
        u = /top|center|bottom/,
        c = /[\+\-]\d+(\.[\d]+)?%?/,
        d = /^\w+/,
        p = /%$/,
        f = e.fn.position;
    e.position = {
      scrollbarWidth: function scrollbarWidth() {
        if (n !== t) return n;
        var i,
            s,
            a = e("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
            r = a.children()[0];
        return e("body").append(a), i = r.offsetWidth, a.css("overflow", "scroll"), s = r.offsetWidth, i === s && (s = a[0].clientWidth), a.remove(), n = i - s;
      },
      getScrollInfo: function getScrollInfo(t) {
        var i = t.isWindow ? "" : t.element.css("overflow-x"),
            s = t.isWindow ? "" : t.element.css("overflow-y"),
            a = "scroll" === i || "auto" === i && t.width < t.element[0].scrollWidth,
            n = "scroll" === s || "auto" === s && t.height < t.element[0].scrollHeight;
        return {
          width: n ? e.position.scrollbarWidth() : 0,
          height: a ? e.position.scrollbarWidth() : 0
        };
      },
      getWithinInfo: function getWithinInfo(t) {
        var i = e(t || window),
            s = e.isWindow(i[0]);
        return {
          element: i,
          isWindow: s,
          offset: i.offset() || {
            left: 0,
            top: 0
          },
          scrollLeft: i.scrollLeft(),
          scrollTop: i.scrollTop(),
          width: s ? i.width() : i.outerWidth(),
          height: s ? i.height() : i.outerHeight()
        };
      }
    }, e.fn.position = function (t) {
      if (!t || !t.of) return f.apply(this, arguments);
      t = e.extend({}, t);

      var n,
          p,
          m,
          g,
          v,
          y,
          b = e(t.of),
          _ = e.position.getWithinInfo(t.within),
          x = e.position.getScrollInfo(_),
          k = (t.collision || "flip").split(" "),
          w = {};

      return y = a(b), b[0].preventDefault && (t.at = "left top"), p = y.width, m = y.height, g = y.offset, v = e.extend({}, g), e.each(["my", "at"], function () {
        var e,
            i,
            s = (t[this] || "").split(" ");
        1 === s.length && (s = l.test(s[0]) ? s.concat(["center"]) : u.test(s[0]) ? ["center"].concat(s) : ["center", "center"]), s[0] = l.test(s[0]) ? s[0] : "center", s[1] = u.test(s[1]) ? s[1] : "center", e = c.exec(s[0]), i = c.exec(s[1]), w[this] = [e ? e[0] : 0, i ? i[0] : 0], t[this] = [d.exec(s[0])[0], d.exec(s[1])[0]];
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
            S = i(w.my, u.outerWidth(), u.outerHeight());
        "right" === t.my[0] ? M.left -= c : "center" === t.my[0] && (M.left -= c / 2), "bottom" === t.my[1] ? M.top -= d : "center" === t.my[1] && (M.top -= d / 2), M.left += S[0], M.top += S[1], e.support.offsetFractions || (M.left = h(M.left), M.top = h(M.top)), a = {
          marginLeft: f,
          marginTop: y
        }, e.each(["left", "top"], function (i, s) {
          e.ui.position[k[i]] && e.ui.position[k[i]][s](M, {
            targetWidth: p,
            targetHeight: m,
            elemWidth: c,
            elemHeight: d,
            collisionPosition: a,
            collisionWidth: D,
            collisionHeight: T,
            offset: [n[0] + S[0], n[1] + S[1]],
            my: t.my,
            at: t.at,
            within: _,
            elem: u
          });
        }), t.using && (l = function l(e) {
          var i = g.left - M.left,
              s = i + p - c,
              a = g.top - M.top,
              n = a + m - d,
              h = {
            target: {
              element: b,
              left: g.left,
              top: g.top,
              width: p,
              height: m
            },
            element: {
              element: u,
              left: M.left,
              top: M.top,
              width: c,
              height: d
            },
            horizontal: 0 > s ? "left" : i > 0 ? "right" : "center",
            vertical: 0 > n ? "top" : a > 0 ? "bottom" : "middle"
          };
          c > p && p > o(i + s) && (h.horizontal = "center"), d > m && m > o(a + n) && (h.vertical = "middle"), h.important = r(o(i), o(s)) > r(o(a), o(n)) ? "horizontal" : "vertical", t.using.call(this, e, h);
        }), u.offset(e.extend(M, {
          using: l
        }));
      });
    }, e.ui.position = {
      fit: {
        left: function left(e, t) {
          var i,
              s = t.within,
              a = s.isWindow ? s.scrollLeft : s.offset.left,
              n = s.width,
              o = e.left - t.collisionPosition.marginLeft,
              h = a - o,
              l = o + t.collisionWidth - n - a;
          t.collisionWidth > n ? h > 0 && 0 >= l ? (i = e.left + h + t.collisionWidth - n - a, e.left += h - i) : e.left = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionWidth : a : h > 0 ? e.left += h : l > 0 ? e.left -= l : e.left = r(e.left - o, e.left);
        },
        top: function top(e, t) {
          var i,
              s = t.within,
              a = s.isWindow ? s.scrollTop : s.offset.top,
              n = t.within.height,
              o = e.top - t.collisionPosition.marginTop,
              h = a - o,
              l = o + t.collisionHeight - n - a;
          t.collisionHeight > n ? h > 0 && 0 >= l ? (i = e.top + h + t.collisionHeight - n - a, e.top += h - i) : e.top = l > 0 && 0 >= h ? a : h > l ? a + n - t.collisionHeight : a : h > 0 ? e.top += h : l > 0 ? e.top -= l : e.top = r(e.top - o, e.top);
        }
      },
      flip: {
        left: function left(e, t) {
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
              f = -2 * t.offset[0];
          0 > u ? (i = e.left + d + p + f + t.collisionWidth - r - n, (0 > i || o(u) > i) && (e.left += d + p + f)) : c > 0 && (s = e.left - t.collisionPosition.marginLeft + d + p + f - h, (s > 0 || c > o(s)) && (e.left += d + p + f));
        },
        top: function top(e, t) {
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
              m = -2 * t.offset[1];
          0 > u ? (s = e.top + p + f + m + t.collisionHeight - r - n, e.top + p + f + m > u && (0 > s || o(u) > s) && (e.top += p + f + m)) : c > 0 && (i = e.top - t.collisionPosition.marginTop + p + f + m - h, e.top + p + f + m > c && (i > 0 || c > o(i)) && (e.top += p + f + m));
        }
      },
      flipfit: {
        left: function left() {
          e.ui.position.flip.left.apply(this, arguments), e.ui.position.fit.left.apply(this, arguments);
        },
        top: function top() {
          e.ui.position.flip.top.apply(this, arguments), e.ui.position.fit.top.apply(this, arguments);
        }
      }
    }, function () {
      var t,
          i,
          s,
          a,
          n,
          r = document.getElementsByTagName("body")[0],
          o = document.createElement("div");
      t = document.createElement(r ? "div" : "body"), s = {
        visibility: "hidden",
        width: 0,
        height: 0,
        border: 0,
        margin: 0,
        background: "none"
      }, r && e.extend(s, {
        position: "absolute",
        left: "-1000px",
        top: "-1000px"
      });

      for (n in s) {
        t.style[n] = s[n];
      }

      t.appendChild(o), i = r || document.documentElement, i.insertBefore(t, i.firstChild), o.style.cssText = "position: absolute; left: 10.7432222px;", a = e(o).offset().left, e.support.offsetFractions = a > 10 && 11 > a, t.innerHTML = "", i.removeChild(t);
    }();
  })(jQuery);
  /* eslint-enable */

}

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].widget("ui.djnsortable", _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.mouse, {
  version: "@VERSION",
  widgetEventPrefix: "sort",
  ready: false,
  options: {
    appendTo: "parent",
    axis: false,
    connectWith: false,
    containment: false,
    cursor: "auto",
    cursorAt: false,
    dropOnEmpty: true,
    forcePlaceholderSize: false,
    forceHelperSize: false,
    grid: false,
    handle: false,
    helper: "original",
    items: "> *",
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
    this.element.addClass("ui-sortable"); //Get the items

    this.refresh(); //Let's determine if the items are being displayed horizontally

    this.floating = this.items.length ? o.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : false; //Let's determine the parent's offset

    this.offset = this.element.offset(); //Initialize mouse events for interaction

    this._mouseInit(); //We're ready to go


    this.ready = true;
  },
  _destroy: function _destroy() {
    this.element.removeClass("ui-sortable ui-sortable-disabled");

    this._mouseDestroy();

    for (var i = this.items.length - 1; i >= 0; i--) {
      this.items[i].item.removeData(this.widgetName + "-item");
    }

    return this;
  },
  _setOption: function _setOption(key, value) {
    if (key === "disabled") {
      this.options[key] = value;
      this.widget().toggleClass("ui-sortable-disabled", !!value);
    } else {
      // Don't call widget base _setOption for disable as it adds ui-state-disabled class
      _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].Widget.prototype._setOption.apply(this, arguments);
    }
  },
  _mouseCapture: function _mouseCapture(event, overrideHandle) {
    var that = this;

    if (this.reverting) {
      return false;
    }

    if (this.options.disabled || this.options.type == "static") return false; //We have to refresh the items data once first

    this._refreshItems(event); //Find out if the clicked node (or one of its parents) is a actual item in this.items


    var currentItem = null,
        nodes = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(event.target).parents().each(function () {
      if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].data(this, that.widgetName + "-item") == that) {
        currentItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this);
        return false;
      }
    });
    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].data(event.target, that.widgetName + "-item") == that) currentItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(event.target);
    if (!currentItem) return false;

    if (this.options.handle && !overrideHandle) {
      var validHandle = false;
      var addBackMethod = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].fn.addBack ? "addBack" : "andSelf";
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.options.handle, currentItem).find("*")[addBackMethod]().each(function () {
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
    this.currentContainer = this; //We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture

    this.refreshPositions(); //Create and append the visible helper

    this.helper = this._createHelper(event); //Cache the helper size

    this._cacheHelperProportions();
    /*
     * - Position generation -
     * This block generates everything position related - it's the core of draggables.
     */
    //Cache the margins of the original element


    this._cacheMargins(); //Get the next scrolling parent


    this.scrollParent = this.helper.scrollParent(); //The element's absolute position on the page minus margins

    this.offset = this.currentItem.offset();
    this.offset = {
      top: this.offset.top - this.margins.top,
      left: this.offset.left - this.margins.left
    };
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].extend(this.offset, {
      click: {
        //Where the click happened, relative to the element
        left: event.pageX - this.offset.left,
        top: event.pageY - this.offset.top
      },
      parent: this._getParentOffset(),
      relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper

    }); // Only after we got the offset, we can change the helper's position to absolute
    // TODO: Still need to figure out a way to make relative sorting possible

    this.helper.css("position", "absolute");
    this.cssPosition = this.helper.css("position"); //Generate the original position

    this.originalPosition = this._generatePosition(event);
    this.originalPageX = event.pageX;
    this.originalPageY = event.pageY; //Adjust the mouse offset relative to the helper if 'cursorAt' is supplied

    o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt); //Cache the former DOM position

    this.domPosition = {
      prev: this.currentItem.prev()[0],
      parent: this.currentItem.parent()[0]
    }; //If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way

    if (this.helper[0] != this.currentItem[0]) {
      this.currentItem.hide();
    } //Create the placeholder


    this._createPlaceholder(); //Set a containment if given in the options


    if (o.containment) this._setContainment();

    if (o.cursor) {
      // cursor option
      if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])("body").css("cursor")) this._storedCursor = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])("body").css("cursor");
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])("body").css("cursor", o.cursor);
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
    } //Prepare scrolling


    if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") this.overflowOffset = this.scrollParent.offset(); //Call callbacks

    this._trigger("start", event, this._uiHash()); //Recache the helper size


    if (!this._preserveHelperProportions) this._cacheHelperProportions(); //Post 'activate' events to possible containers

    if (!noActivation) {
      for (var i = this.containers.length - 1; i >= 0; i--) {
        this.containers[i]._trigger("activate", event, this._uiHash(this));
      }
    } //Prepare possible droppables


    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager) _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager.current = this;
    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager && !o.dropBehaviour) _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager.prepareOffsets(this, event);
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
    } //Do scrolling


    if (this.options.scroll) {
      var o = this.options,
          scrolled = false;

      if (this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML") {
        if (this.overflowOffset.top + this.scrollParent[0].offsetHeight - event.pageY < o.scrollSensitivity) this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity) this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;
        if (this.overflowOffset.left + this.scrollParent[0].offsetWidth - event.pageX < o.scrollSensitivity) this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity) this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;
      } else {
        if (event.pageY - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop() < o.scrollSensitivity) scrolled = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop() - o.scrollSpeed);else if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(window).height() - (event.pageY - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop()) < o.scrollSensitivity) scrolled = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollTop() + o.scrollSpeed);
        if (event.pageX - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft() < o.scrollSensitivity) scrolled = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft() - o.scrollSpeed);else if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(window).width() - (event.pageX - (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft()) < o.scrollSensitivity) scrolled = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document).scrollLeft() + o.scrollSpeed);
      }

      if (scrolled !== false && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager && !o.dropBehaviour) _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager.prepareOffsets(this, event);
    } //Regenerate the absolute position used for position checks


    this.positionAbs = this._convertPositionTo("absolute"); //Set the helper position

    if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + "px";
    if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + "px"; //Rearrange

    for (var i = this.items.length - 1; i >= 0; i--) {
      //Cache variables and intersection, continue if no intersection
      var item = this.items[i],
          itemElement = item.item[0],
          intersection = this._intersectsWithPointer(item);

      if (!intersection) continue; // Only put the placeholder inside the current Container, skip all
      // items form other containers. This works because when moving
      // an item from one container to another the
      // currentContainer is switched before the placeholder is moved.
      //
      // Without this moving items in "sub-sortables" can cause the placeholder to jitter
      // beetween the outer and inner container.

      if (item.instance !== this.currentContainer) continue;

      if (itemElement != this.currentItem[0] && //cannot intersect with itself
      this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement && //no useless actions that have been done before
      !_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.placeholder[0], itemElement) && ( //no action if the item moved is the parent of the item checked
      this.options.type == "semi-dynamic" ? !_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.element[0], itemElement) : true) //&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
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
    } //Post events to containers


    this._contactContainers(event); //Interconnect with droppables


    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager) _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager.drag(this, event); //Call callbacks

    this._trigger("sort", event, this._uiHash());

    this.lastPositionAbs = this.positionAbs;
    return false;
  },
  _mouseStop: function _mouseStop(event, noPropagation) {
    if (!event) return; //If we are using droppables, inform the manager about the drop

    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager && !this.options.dropBehaviour) _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ddmanager.drop(this, event);

    if (this.options.revert) {
      var that = this;
      var cur = this.placeholder.offset();
      this.reverting = true;
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.helper).animate({
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
      this._mouseUp({
        target: null
      });

      if (this.options.helper == "original") this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");else this.currentItem.show(); //Post deactivating events to containers

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
      _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].extend(this, {
        helper: null,
        dragging: false,
        reverting: false,
        _noFinalSort: null
      });

      if (this.domPosition.prev) {
        (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.domPosition.prev).after(this.currentItem);
      } else {
        (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.domPosition.parent).prepend(this.currentItem);
      }
    }

    return this;
  },
  serialize: function serialize(o) {
    var items = this._getItemsAsjQuery(o && o.connected);

    var str = [];
    o = o || {};
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(items).each(function () {
      var res = ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.item || this).attr(o.attribute || "id") || "").match(o.expression || /(.+)[-=_](.+)/);
      if (res) str.push((o.key || res[1] + "[]") + "=" + (o.key && o.expression ? res[1] : res[2]));
    });

    if (!str.length && o.key) {
      str.push(o.key + "=");
    }

    return str.join("&");
  },
  toArray: function toArray(o) {
    var items = this._getItemsAsjQuery(o && o.connected);

    var ret = [];
    o = o || {};
    items.each(function () {
      ret.push((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.item || this).attr(o.attribute || "id") || "");
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

    if (this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > item[this.floating ? "width" : "height"]) {
      return isOverElement;
    } else {
      return l < x1 + this.helperProportions.width / 2 && // Right Half
      x2 - this.helperProportions.width / 2 < r && // Left Half
      t < y1 + this.helperProportions.height / 2 && // Bottom Half
      y2 - this.helperProportions.height / 2 < b; // Top Half
    }
  },
  _intersectsWithPointer: function _intersectsWithPointer(item) {
    var isOverElementHeight = this.options.axis === "x" || this._isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, Math.max(10, item.height)),
        isOverElementWidth = this.options.axis === "y" || this._isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
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
        var cur = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(connectWith[i]);

        for (var j = cur.length - 1; j >= 0; j--) {
          var inst = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].data(cur[j], this.widgetName);

          if (inst && inst != this && !inst.options.disabled) {
            queries.push([_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isFunction(inst.options.items) ? inst.options.items.call(inst.element) : (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(inst.options.items, inst.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), inst]);
          }
        }
      }
    }

    queries.push([_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isFunction(this.options.items) ? this.options.items.call(this.element, null, {
      options: this.options,
      item: this.currentItem
    }) : (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);

    for (var i = queries.length - 1; i >= 0; i--) {
      queries[i][0].each(function () {
        items.push(this);
      });
    }

    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(items);
  },
  _removeCurrentsFromItems: function _removeCurrentsFromItems() {
    var list = this.currentItem.find(":data(" + this.widgetName + "-item)");
    this.items = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].grep(this.items, function (item) {
      for (var j = 0; j < list.length; j++) {
        if (list[j] == item.item[0]) return false;
      }

      return true;
    });
  },
  _refreshItems: function _refreshItems(event) {
    this.items = [];
    this.containers = [this];
    var items = this.items;
    var queries = [[_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {
      item: this.currentItem
    }) : (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.options.items, this.element), this]];

    var connectWith = this._connectWith();

    if (connectWith && this.ready) {
      //Shouldn't be run the first time through due to massive slow-down
      for (var i = connectWith.length - 1; i >= 0; i--) {
        var cur = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(connectWith[i]);

        for (var j = cur.length - 1; j >= 0; j--) {
          var inst = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].data(cur[j], this.widgetName);

          if (inst && inst != this && !inst.options.disabled) {
            queries.push([_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {
              item: this.currentItem
            }) : (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(inst.options.items, inst.element), inst]);
            this.containers.push(inst);
          }
        }
      }
    }

    for (var i = queries.length - 1; i >= 0; i--) {
      var targetData = queries[i][1];
      var _queries = queries[i][0];

      for (var j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
        var item = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(_queries[j]);
        item.data(this.widgetName + "-item", targetData); // Data for target checking (mouse manager)

        items.push({
          item: item,
          instance: targetData,
          width: 0,
          height: 0,
          left: 0,
          top: 0
        });
      }
    }
  },
  refreshPositions: function refreshPositions(fast) {
    //This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
    if (this.offsetParent && this.helper) {
      this.offset.parent = this._getParentOffset();
    }

    for (var i = this.items.length - 1; i >= 0; i--) {
      var item = this.items[i]; //We ignore calculating positions of all connected containers when we're not over them

      if (item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0]) continue;
      var t = this.options.toleranceElement ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(this.options.toleranceElement, item.item) : item.item;

      if (!fast) {
        item.width = t.outerWidth();
        item.height = t.outerHeight();
      }

      var p = t.offset();
      item.left = p.left;
      item.top = p.top;
    }

    if (this.options.custom && this.options.custom.refreshContainers) {
      this.options.custom.refreshContainers.call(this);
    } else {
      for (var i = this.containers.length - 1; i >= 0; i--) {
        var p = this.containers[i].element.offset();
        this.containers[i].containerCache.left = p.left;
        this.containers[i].containerCache.top = p.top;
        this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
        this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
      }
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
          var el = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(document.createElement(that.currentItem[0].nodeName)).addClass(className || that.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
          if (!className) el.style.visibility = "hidden";
          return el;
        },
        update: function update(container, p) {
          // 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
          // 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
          if (className && !o.forcePlaceholderSize) return; //If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item

          if (!p.height()) {
            p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css("paddingTop") || 0, 10) - parseInt(that.currentItem.css("paddingBottom") || 0, 10));
          }

          if (!p.width()) {
            p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css("paddingLeft") || 0, 10) - parseInt(that.currentItem.css("paddingRight") || 0, 10));
          }
        }
      };
    } //Create the placeholder


    that.placeholder = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.placeholder.element.call(that.element, that.currentItem)); //Append it after the actual current item

    that.currentItem.after(that.placeholder); //Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)

    o.placeholder.update(that, that.placeholder);
  },
  _contactContainers: function _contactContainers(event) {
    // get innermost container that intersects with item
    var innermostContainer = null,
        innermostIndex = null;

    for (var i = this.containers.length - 1; i >= 0; i--) {
      // never consider a container that's located within the item itself
      if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.currentItem[0], this.containers[i].element[0])) continue;

      if (this._intersectsWith(this.containers[i].containerCache)) {
        // if we've already found a container and it's more "inner" than this, then continue
        if (innermostContainer && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.containers[i].element[0], innermostContainer.element[0])) continue;
        innermostContainer = this.containers[i];
        innermostIndex = i;
      } else {
        // container doesn't intersect. trigger "out" event if necessary
        if (this.containers[i].containerCache.over) {
          this.containers[i]._trigger("out", event, this._uiHash(this));

          this.containers[i].containerCache.over = 0;
        }
      }
    } // if no intersecting containers found, return


    if (!innermostContainer) return; // move the item into the container if it's not there already

    if (this.containers.length === 1) {
      this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));

      this.containers[innermostIndex].containerCache.over = 1;
    } else {
      //When entering a new container, we will find the item with the least distance and append our item near it
      var dist = 10000;
      var itemWithLeastDistance = null;
      var posProperty = this.containers[innermostIndex].floating ? "left" : "top";
      var sizeProperty = this.containers[innermostIndex].floating ? "width" : "height";
      var base = this.positionAbs[posProperty] + this.offset.click[posProperty];

      for (var j = this.items.length - 1; j >= 0; j--) {
        if (!_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue;
        if (this.items[j].item[0] == this.currentItem[0]) continue;
        var cur = this.items[j].item.offset()[posProperty];
        var nearBottom = false;

        if (Math.abs(cur - base) > Math.abs(cur + Math.max(10, this.items[j][sizeProperty]) - base)) {
          nearBottom = true;
          cur += this.items[j][sizeProperty];
        }

        if (Math.abs(cur - base) < dist) {
          dist = Math.abs(cur - base);
          itemWithLeastDistance = this.items[j];
          this.direction = nearBottom ? "up" : "down";
        }
      }

      if (!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
        return;
      this.currentContainer = this.containers[innermostIndex];
      itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);

      this._trigger("change", event, this._uiHash());

      this.containers[innermostIndex]._trigger("change", event, this._uiHash(this)); //Update the placeholder


      this.options.placeholder.update(this.currentContainer, this.placeholder);

      this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));

      this.containers[innermostIndex].containerCache.over = 1;
    }
  },
  _createHelper: function _createHelper(event) {
    var o = this.options;
    var helper = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isFunction(o.helper) ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.helper.apply(this.element[0], [event, this.currentItem])) : o.helper == "clone" ? this.currentItem.clone() : this.currentItem;
    if (!helper.parents("body").length) //Add the helper to the DOM if that didn't happen already
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.appendTo != "parent" ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);
    if (helper[0] == this.currentItem[0]) this._storedCSS = {
      width: this.currentItem[0].style.width,
      height: this.currentItem[0].style.height,
      position: this.currentItem.css("position"),
      top: this.currentItem.css("top"),
      left: this.currentItem.css("left")
    };
    if (helper[0].style.width == "" || o.forceHelperSize) helper.width(this.currentItem.width());
    if (helper[0].style.height == "" || o.forceHelperSize) helper.height(this.currentItem.height());
    return helper;
  },
  _adjustOffsetFromHelper: function _adjustOffsetFromHelper(obj) {
    if (typeof obj == "string") {
      obj = obj.split(" ");
    }

    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].isArray(obj)) {
      obj = {
        left: +obj[0],
        top: +obj[1] || 0
      };
    }

    if ("left" in obj) {
      this.offset.click.left = obj.left + this.margins.left;
    }

    if ("right" in obj) {
      this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
    }

    if ("top" in obj) {
      this.offset.click.top = obj.top + this.margins.top;
    }

    if ("bottom" in obj) {
      this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
    }
  },
  _getParentOffset: function _getParentOffset() {
    //Get the offsetParent and cache its position
    this.offsetParent = this.helper.offsetParent();
    var po = this.offsetParent.offset(); // This is a special case where we need to modify a offset calculated on start, since the following happened:
    // 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
    // 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
    //    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag

    if (this.cssPosition == "absolute" && this.scrollParent[0] != document && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.scrollParent[0], this.offsetParent[0])) {
      po.left += this.scrollParent.scrollLeft();
      po.top += this.scrollParent.scrollTop();
    }

    if (this.offsetParent[0] == document.body || //This needs to be actually done for all browsers, since pageX/pageY includes this information
    this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].ui.ie) //Ugly IE fix
      po = {
        top: 0,
        left: 0
      };
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
      return {
        top: 0,
        left: 0
      };
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
    if (o.containment == "parent") o.containment = this.helper[0].parentNode;
    if (o.containment == "document" || o.containment == "window") this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];

    if (!/^(document|window|parent)$/.test(o.containment)) {
      var ce = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.containment)[0];
      var co = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(o.containment).offset();
      var over = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("overflow") != "hidden";
      this.containment = [co.left + (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("borderLeftWidth"), 10) || 0) + (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("paddingLeft"), 10) || 0) - this.margins.left, co.top + (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("borderTopWidth"), 10) || 0) + (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("paddingTop"), 10) || 0) - this.margins.top, co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("borderLeftWidth"), 10) || 0) - (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("borderTopWidth"), 10) || 0) - (parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top];
    }
  },
  _convertPositionTo: function _convertPositionTo(d, pos) {
    if (!pos) pos = this.position;
    var mod = d == "absolute" ? 1 : -1;
    var o = this.options,
        scroll = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
        scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName);
    return {
      top: pos.top + // The absolute mouse position
      this.offset.relative.top * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
      this.offset.parent.top * mod - // The offsetParent's offset without borders (offset + border)
      (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()) * mod,
      left: pos.left + // The absolute mouse position
      this.offset.relative.left * mod + // Only for relative positioned nodes: Relative offset from element to offset parent
      this.offset.parent.left * mod - // The offsetParent's offset without borders (offset + border)
      (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod
    };
  },
  _generatePosition: function _generatePosition(event) {
    var o = this.options,
        scroll = this.cssPosition == "absolute" && !(this.scrollParent[0] != document && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
        scrollIsRootNode = /(html|body)/i.test(scroll[0].tagName); // This is another very weird special case that only happens for relative elements:
    // 1. If the css position is relative
    // 2. and the scroll parent is the document or similar to the offset parent
    // we have to refresh the relative offset during the scroll so there are no jumps

    if (this.cssPosition == "relative" && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
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
      top: pageY - // The absolute mouse position
      this.offset.click.top - // Click offset (relative to the element)
      this.offset.relative.top - // Only for relative positioned nodes: Relative offset from element to offset parent
      this.offset.parent.top + ( // The offsetParent's offset without borders (offset + border)
      this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : scrollIsRootNode ? 0 : scroll.scrollTop()),
      left: pageX - // The absolute mouse position
      this.offset.click.left - // Click offset (relative to the element)
      this.offset.relative.left - // Only for relative positioned nodes: Relative offset from element to offset parent
      this.offset.parent.left + ( // The offsetParent's offset without borders (offset + border)
      this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft())
    };
  },
  _rearrange: function _rearrange(event, i, a, hardRefresh) {
    a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? i.item[0] : i.item[0].nextSibling); //Various things done here to improve the performance:
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
    this.reverting = false; // We delay all events that have to be triggered to after the point where the placeholder has been removed and
    // everything else normalized again

    var delayedTriggers = []; // We first have to update the dom position of the actual currentItem
    // Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)

    if (!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
    this._noFinalSort = null;

    if (this.helper[0] == this.currentItem[0]) {
      for (var i in this._storedCSS) {
        if (this._storedCSS[i] == "auto" || this._storedCSS[i] == "static") this._storedCSS[i] = "";
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
    } //Post events to containers


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
    } //Do what was originally in plugins


    if (this._storedCursor) (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])("body").css("cursor", this._storedCursor); //Reset cursor

    if (this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity

    if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex); //Reset z-index

    this.dragging = false;

    if (this.cancelHelperRemoval) {
      if (!noPropagation) {
        this._trigger("beforeStop", event, this._uiHash());

        for (var i = 0; i < delayedTriggers.length; i++) {
          delayedTriggers[i].call(this, event);
        } //Trigger all delayed events


        this._trigger("stop", event, this._uiHash());
      }

      this.fromOutside = false;
      return false;
    }

    if (!noPropagation) this._trigger("beforeStop", event, this._uiHash()); //$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!

    this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
    if (this.helper[0] != this.currentItem[0]) this.helper.remove();
    this.helper = null;

    if (!noPropagation) {
      for (var i = 0; i < delayedTriggers.length; i++) {
        delayedTriggers[i].call(this, event);
      } //Trigger all delayed events


      this._trigger("stop", event, this._uiHash());
    }

    this.fromOutside = false;
    return true;
  },
  _trigger: function _trigger() {
    if (_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"].Widget.prototype._trigger.apply(this, arguments) === false) {
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
      placeholder: inst.placeholder || (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_6__["default"])([]),
      position: inst.position,
      originalPosition: inst.originalPosition,
      offset: inst.positionAbs,
      item: inst.currentItem,
      sender: _inst ? _inst.element : null
    };
  }
});

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.nestedsortable.js":
/*!***************************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.nestedsortable.js ***!
  \***************************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.array.sort.js */ "./node_modules/core-js/modules/es6.array.sort.js");
/* harmony import */ var core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_sort_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");
/* harmony import */ var _jquery_ui_djnsortable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./jquery.ui.djnsortable */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.djnsortable.js");






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

if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].fn.nearest != "function") {
  /**
   * Returns the descendant(s) matching a given selector which are the
   * shortest distance from the search context element (in otherwords,
   * $.fn.closest(), in reverse).
   */
  _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].fn.nearest = function (selector) {
    var nearest = [],
        node = this,
        distance = 10000;
    node.find(selector).each(function () {
      var d = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this).parentsUntil(node).length;

      if (d < distance) {
        distance = d;
        nearest = [this];
      } else if (d == distance) {
        nearest.push(this);
      }
    });
    return this.pushStack(nearest, "nearest", [selector]);
  };
}

var counter = 0;
var expando = "djn" + ("" + Math.random()).replace(/\D/g, "");

var createChildNestedSortable = function createChildNestedSortable(parent, childContainer) {
  // Don't continue if the new element is the same as the old
  if (parent && parent.element && parent.element[0] == childContainer) {
    return;
  }

  var $childContainer = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(childContainer),
      options = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].extend({}, parent.options);
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

_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].widget("ui.nestedSortable", _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable, {
  options: {
    tabSize: 20,
    disableNesting: "ui-nestedSortable-no-nesting",
    errorClass: "ui-nestedSortable-error",
    nestedContainerSelector: ":not(*)",
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
      return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(document.createElement("ol"));
    },
    // Selector which matches all container elements in the nestedSortable
    containerElementSelector: "ol",
    // Selector which matches all list items (draggables) in the nestedSortable
    listItemSelector: "li",
    // Selector which, when applied to a container, returns its child list items
    items: "> li",
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
      var model1 = container1.data("inlineModel");
      var model2 = container2.data("inlineModel");

      if (model1 !== model2) {
        return false;
      }

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
    var $element = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element || this.defaultElement || this),
        dataOptions = $element.data("djnsortableOptions");
    element = $element[0];

    if (dataOptions) {
      options = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].extend({}, options, dataOptions);
    }

    return _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._createWidget.call(this, options, element);
  },
  _create: function _create() {
    if (this.element.data("uiNestedSortable")) {
      this.element.data("nestedSortable", this.element.data("uiNestedSortable"));
    }

    if (this.element.data("ui-nestedSortable")) {
      this.element.data("nestedSortable", this.element.data("ui-nestedSortable"));
    }

    this.element.data("djnsortable", this.element.data("nestedSortable"));

    if (this.element.data("uiNestedSortable")) {
      this.element.data("uiSortable", this.element.data("nestedSortable"));
    } // if (!this.element.is(this.options.containerElementSelector)) {
    //  throw new Error('nestedSortable: Please check that the ' +
    //                  'containerElementSelector option matches ' +
    //                  'the element passed to the constructor.');
    //             }


    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._create.apply(this, arguments);

    this._connectWithMap = {};
    var self = this,
        o = this.options,
        $document = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(document);
    var originalConnectWith = o.connectWith;

    if (!originalConnectWith || typeof originalConnectWith == "string") {
      this.options.connectWith = [];

      if (typeof originalConnectWith == "string") {
        var connected = this._connectWith();

        for (var i = 0; i < connected.length; i++) {
          this.addToConnectWith((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(connected[i]));
        }
      } // HACK!! FIX!! (django-specific logic)


      $document.on("djnesting:init.nestedSortable", o.containerElementSelector, function (event) {
        createChildNestedSortable(self, this);
      });
      this.element.find(o.containerElementSelector + ":not(.subarticle-wrapper)").each(function (i, el) {
        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(el).closest("[data-inline-formset]").attr("id").indexOf("-empty") > -1) {
          return;
        }

        createChildNestedSortable(self, el);
      });
    }

    $document.trigger("nestedSortable:created", [this]);
    $document.on("nestedSortable:created.nestedSortable", function (e, instance) {
      instance.addToConnectWith(self.element);
      self.addToConnectWith(instance.element);
    });
  },
  addToConnectWith: function addToConnectWith(element) {
    var self = this,
        $element = typeof element.selector != "undefined" ? element : (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(element),
        uniqueId;

    if ($element.length > 1) {
      $element.each(function (i, el) {
        self.addToConnectWith((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(el));
      });
      return;
    }

    uniqueId = element[0][expando];

    if (typeof uniqueId == "undefined") {
      uniqueId = element[0][expando] = ++counter;
    }

    if (typeof this.options.connectWith == "string") {
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
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(document).unbind(".nestedSortable");
    return _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype.destroy.apply(this, arguments);
  },

  /**
   * Override this method to add extra conditions on an item before it's
   * rearranged.
   */
  _intersectsWithPointer: function _intersectsWithPointer(item) {
    var itemElement = item.item[0],
        o = this.options,
        intersection = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._intersectsWithPointer.apply(this, arguments);

    this.lastItemElement = null;

    if (!intersection) {
      return intersection;
    } // Only put the placeholder inside the current Container, skip all
    // items from other containers. This works because when moving
    // an item from one container to another the
    // currentContainer is switched before the placeholder is moved.
    //
    // Without this moving items in "sub-sortables" can cause the placeholder to jitter
    // between the outer and inner container.


    if (item.instance !== this.currentContainer) {
      return false;
    }

    var $itemElement = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(itemElement);

    if (o.fixedNestingDepth && this._getLevel(this.currentItem) === 1 + this._getLevel($itemElement)) {
      $itemElement = function () {
        var containerSel = o.containerElementSelector;
        var $childItems = $itemElement.find(".djn-item");

        if ($childItems.length != 1) {
          return $itemElement;
        }

        if (!$childItems.is(".djn-no-drag,.djn-thead")) {
          return $itemElement;
        }

        var itemElementClosestContainer = $itemElement.closest(containerSel);

        if (!itemElementClosestContainer.length) {
          return $itemElement;
        } // Make sure the item is only one level deeper


        if (itemElementClosestContainer[0] != $childItems.closest(containerSel).closest(containerSel)[0]) {
          return $itemElement;
        }

        return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])($childItems[0]);
      }();

      itemElement = $itemElement[0];
    }

    if (itemElement != this.currentItem[0] && //cannot intersect with itself
    this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement && //no useless actions that have been done before
    !_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].contains(this.placeholder[0], itemElement) && ( //no action if the item moved is the parent of the item checked
    this.options.type == "semi-dynamic" ? !_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].contains(this.element[0], itemElement) : true) && (!o.keepInParent || itemElement.parentNode == this.placeholder[0].parentNode) && ( //only rearrange items within the same container
    !o.fixedNestingDepth || this._getLevel(this.currentItem) === this._getLevel($itemElement)) && ( //maintain the nesting level of node
    o.showErrorDiv || o.isAllowed.call(this, this.currentItem[0], itemElement.parentNode, this.placeholder))) {
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

    var o = this.options,
        _parentItem = this.placeholder.closest(o.listItemSelector),
        parentItem = _parentItem.length && _parentItem.closest(".ui-sortable").length ? _parentItem : null,
        level = this._getLevel(this.placeholder),
        childLevels = this._getChildLevels(this.helper);

    var placeholderClassName = this.placeholder.attr("class");
    var phClassSearch = " " + placeholderClassName + " "; // If the current level class isn't already set

    if (phClassSearch.indexOf(" ui-sortable-nested-level-" + level + " ") == -1) {
      var phOrigClassName; // Check if another level class is set

      var phOrigClassNameEndPos = phClassSearch.indexOf(" ui-sortable-nested-level-") - 1;

      if (phOrigClassNameEndPos > -1) {
        phOrigClassName = placeholderClassName.substring(0, phOrigClassNameEndPos);
      } else {
        phOrigClassName = placeholderClassName;
      } // Add new level to class


      this.placeholder.attr("class", phOrigClassName + " ui-sortable-nested-level-" + level);
    } // To find the previous sibling in the list, keep backtracking until we hit a valid list item.


    var previousItem = this.placeholder[0].previousSibling ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.placeholder[0].previousSibling) : null;

    if (previousItem != null) {
      while (!previousItem.is(this.options.listItemSelector) || previousItem[0] == this.currentItem[0] || previousItem[0] == this.helper[0]) {
        if (previousItem[0].previousSibling) {
          previousItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(previousItem[0].previousSibling);
        } else {
          previousItem = null;
          break;
        }
      }
    } // To find the next sibling in the list, keep stepping forward until we hit a valid list item.


    var nextItem = this.placeholder[0].nextSibling ? (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.placeholder[0].nextSibling) : null;

    if (nextItem != null) {
      while (!nextItem.is(this.options.listItemSelector) || nextItem[0] == this.currentItem[0] || nextItem[0] == this.helper[0]) {
        if (nextItem[0].nextSibling) {
          nextItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(nextItem[0].nextSibling);
        } else {
          nextItem = null;
          break;
        }
      }
    }

    this.beyondMaxLevels = 0; // We will change this to the instance of the nested container if
    // appropriate, so that the appropriate context is applied to the
    // super _contactContainers prototype method

    var containerInstance = this;
    this.refreshPositions(); // If the item is moved to the left, send it to its parent's level unless there are siblings below it.

    if (!o.fixedNestingDepth && parentItem != null && nextItem == null && (o.rtl && this.positionAbs.left + this.helper.outerWidth() > parentItem.offset().left + parentItem.outerWidth() || !o.rtl && this.positionAbs.left < parentItem.offset().left)) {
      parentItem.after(this.placeholder[0]);
      containerInstance = parentItem.closest(o.containerElementSelector).data(this.widgetName) || containerInstance;

      this._clearEmpty(parentItem[0]);

      this.refreshPositions();

      this._trigger("change", event, this._uiHash());
    } // If the item is below a sibling and is moved to the right, make it a child of that sibling.
    else if (!o.fixedNestingDepth && previousItem != null && !previousItem.is(".djn-no-drag,.djn-thead") && (o.rtl && this.positionAbs.left + this.helper.outerWidth() < previousItem.offset().left + previousItem.outerWidth() - o.tabSize || !o.rtl && this.positionAbs.left > previousItem.offset().left + o.tabSize)) {
      this._isAllowed(previousItem, level, level + childLevels);

      if (this.beyondMaxLevels > 0) {
        return _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._contactContainers.apply(this, arguments);
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

    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._contactContainers.call(this, event);
  },
  _rearrange: function _rearrange(event, item, a, hardRefresh) {
    // Cache the rearranged element for the call to _clear()
    var o = this.options;

    if (item && typeof item == "object" && item.item) {
      this.lastRearrangedElement = item.item[0];
    }

    if (item && typeof item == "object" && item.item && this.placeholder.closest(o.nestedContainerSelector).length) {
      // This means we have been dropped into a nested container down a level
      // from the parent.
      var placeholderParentItem = this.placeholder.closest(o.listItemSelector);
      var comparisonElement = this.direction == "down" ? placeholderParentItem.next(o.nestedContainerSelector) : placeholderParentItem;

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
        }); // The super method will pop the container out of its nested container,
        // which we don't want.


        return;
      }
    }

    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._rearrange.apply(this, arguments);
  },
  _convertPositionTo: function _convertPositionTo(d, pos) {
    // Cache the top offset before rearrangement
    this.previousTopOffset = this.placeholder.offset().top;
    return _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._convertPositionTo.apply(this, arguments);
  },
  _clear: function _clear() {
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._clear.apply(this, arguments); // If lastRearrangedElement exists and is still attached to the document
    // (i.e., hasn't been removed)


    if (typeof this.lastRearrangedElement == "object" && this.lastRearrangedElement.ownerDocument) {
      this._clearEmpty(this.lastRearrangedElement);
    }
  },
  _mouseStop: function _mouseStop(event, noPropagation) {
    // If the item is in a position not allowed, send it back
    if (this.beyondMaxLevels) {
      this.placeholder.removeClass(this.options.errorClass);

      if (this.domPosition.prev) {
        (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.domPosition.prev).after(this.placeholder);
      } else {
        (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.domPosition.parent).prepend(this.placeholder);
      }

      this._trigger("revert", event, this._uiHash());
    } // Clean last empty container/list item


    for (var i = this.items.length - 1; i >= 0; i--) {
      var item = this.items[i].item[0];

      this._clearEmpty(item);
    }

    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._mouseStop.apply(this, arguments);
  },
  toArray: function toArray(o) {
    o = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].extend(true, {}, this.options, o || {});
    var sDepth = o.startDepthCount || 0,
        ret = [],
        left = 2;
    ret.push({
      item_id: o.rootID,
      parent_id: "none",
      depth: sDepth,
      left: "1",
      right: ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(o.listItemSelector, this.element).length + 1) * 2
    });

    var _recursiveArray = function _recursiveArray(item, depth, left) {
      var right = left + 1,
          id,
          pid;
      var $childItems = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(item).children(o.containerElementSelector).find(o.items);

      if ($childItems.length > 0) {
        depth++;
        $childItems.each(function () {
          right = _recursiveArray((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this), depth, right);
        });
        depth--;
      }

      id = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(item).attr(o.attribute || "id").match(o.expression || /(.+)[-=_](.+)/);

      if (depth === sDepth + 1) {
        pid = o.rootID;
      } else {
        var parentItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(item).parent(o.containerElementSelector).parent(o.items).attr(o.attribute || "id").match(o.expression || /(.+)[-=_](.+)/);
        pid = parentItem[2];
      }

      if (id) {
        ret.push({
          item_id: id[2],
          parent_id: pid,
          depth: depth,
          left: left,
          right: right
        });
      }

      left = right + 1;
      return left;
    };

    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.element).children(o.listItemSelector).each(function () {
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

    var $item = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(item);
    var childContainers = $item.nearest(this.options.containerElementSelector);
    childContainers.each(function (i, childContainer) {
      var $childContainer = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(childContainer);

      if (!$childContainer.children().length) {
        var instance = $childContainer.data(this.widgetName);

        if (typeof instance == "object" && instance.destroy) {
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

      while (list && list.length > 0 && !list.parent().is(".djn-group-root")) {
        // if (!list.is(o.nestedContainerSelector)) {
        level++; // }

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
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(parent).nearest(o.containerElementSelector).first().find(o.items).each(function (index, child) {
      if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(child).is(".djn-no-drag,.djn-thead")) {
        return;
      }

      result = Math.max(self._getChildLevels(child, depth + 1), result);
    });
    return depth ? result + 1 : result;
  },
  _isAllowed: function _isAllowed(parentItem, level, levels) {
    var o = this.options,
        isRoot = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this.domPosition.parent).hasClass("ui-sortable") ? true : false; // this takes into account the maxLevels set to the recipient list
    // var maxLevels = this.placeholder.closest('.ui-sortable').nestedSortable('option', 'maxLevels');

    var maxLevels = o.maxLevels; // Is the root protected?
    // Are we trying to nest under a no-nest?
    // Are we nesting too deep?

    if (parentItem && typeof parentItem == "object" && typeof parentItem.selector == "undefined") {
      parentItem = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(parentItem);
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
    var origConnectWith = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype._connectWith.apply(this, arguments),
        connectWith = [];

    var self = this;

    for (var i = 0; i < origConnectWith.length; i++) {
      var $elements = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(origConnectWith[i]);
      $elements.each(function (j, el) {
        if (el == self.element[0]) {
          return;
        }

        if (!self.options.canConnectWith(self.element, (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(el), self)) {
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
    return (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(newContainer);
  }
});
_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.nestedSortable.prototype.options = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].extend({}, _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.djnsortable.prototype.options, _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].ui.nestedSortable.prototype.options);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/regexquote.js":
/*!*************************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/regexquote.js ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_0__);


function regexQuote(str) {
  return (str + "").replace(/([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g, "\\$1");
}

/* harmony default export */ __webpack_exports__["default"] = (regexQuote);

/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/sortable.js":
/*!***********************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/sortable.js ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "updatePositions": function() { return /* binding */ updatePositions; },
/* harmony export */   "createSortable": function() { return /* binding */ createSortable; }
/* harmony export */ });
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.regexp.constructor.js */ "./node_modules/core-js/modules/es6.regexp.constructor.js");
/* harmony import */ var core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_constructor_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");
/* harmony import */ var _regexquote__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./regexquote */ "./nested_admin/static/nested_admin/src/nested-admin/regexquote.js");
/* harmony import */ var _jquery_ui_nestedsortable__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./jquery.ui.nestedsortable */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.ui.nestedsortable.js");








function updatePositions(prefix) {
  var position = 0,
      count = 1,
      $group = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])("#" + prefix + "-group"),
      groupData = $group.djnData(),
      fieldNames = groupData.fieldNames,
      groupFkName = groupData.formsetFkName,
      parentPkVal,
      _ref = prefix.match(/^(.*)\-(\d+)-[^\-]+(?:\-\d+)?$/) || [],
      parentPrefix = _ref[1],
      index = _ref[2],
      sortableOptions = groupData.sortableOptions,
      sortableExcludes = (sortableOptions || {}).sortableExcludes || [];

  sortableExcludes.push(groupFkName);

  if (parentPrefix) {
    var $parentGroup = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])("#" + parentPrefix + "-group");
    var parentFieldNames = $parentGroup.djnData("fieldNames");
    var parentPkFieldName = parentFieldNames.pk;
    var parentPkField = $parentGroup.filterDjangoField(parentPrefix, parentPkFieldName, index);
    parentPkVal = parentPkField.val();
  }

  if (groupFkName && typeof parentPkVal != "undefined") {
    $group.filterDjangoField(prefix, groupFkName).val(parentPkVal).trigger("change");
  }

  $group.find(".djn-inline-form").each(function () {
    if (!this.id || this.id.substr(-6) == "-empty") {
      return true; // Same as continue
    }

    var regex = new RegExp("^(?:id_)?" + (0,_regexquote__WEBPACK_IMPORTED_MODULE_5__["default"])(prefix) + "\\-\\d+$");

    if (!this.id.match(regex)) {
      return true;
    } // Cache jQuery object


    var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this),
        _ref2 = $this.djangoPrefixIndex() || [null, null],
        formPrefix = _ref2[0],
        index = _ref2[1],
        namePrefix = formPrefix + "-" + index + "-";

    if (!formPrefix) {
      return;
    } // Set header position for stacked inlines in Django 1.9+


    var $inlineLabel = $this.find("> h3 > .inline_label");

    if ($inlineLabel.length) {
      $inlineLabel.html($inlineLabel.html().replace(/(#\d+)/g, "#" + count));
    }

    count++;
    var $fields = $this.djangoFormField("*"),
        $positionField,
        setPosition = false; // position is being updated if
    // a) the field has a value
    // b) if the field is not exluded with sortable_excludes (e.g. with default values)

    $fields.each(function () {
      var $field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this);

      if (!$field.is(":input[type!=radio][type!=checkbox],input:checked")) {
        return;
      }

      var hasValue = $field.val() || $field.attr("type") == "file" && $field.siblings("a").length,
          fieldName = $field.attr("name").substring(namePrefix.length);

      if (fieldName == fieldNames.position) {
        $positionField = $field;
      }

      if (hasValue && _jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"].inArray(fieldName, sortableExcludes) === -1) {
        setPosition = true;
      }
    });

    if (!setPosition || !$positionField) {
      return;
    }

    $positionField.val(position).trigger("change");
    position++;
  });
}

function createSortable($group) {
  var isPolymorphic = $group.is(".djn-is-polymorphic");
  return $group.find("> .djn-items, > .djn-fieldset > .djn-items, > .tabular > .module > .djn-items").nestedSortable({
    handle: ["> h3.djn-drag-handler", "> .djn-tools .drag-handler", "> .djn-td > .djn-tools .djn-drag-handler", "> .djn-tr > .is-sortable > .djn-drag-handler", "> .djn-tr > .grp-tools-container .djn-drag-handler"].join(", "),

    /**
     * items: The selector for ONLY the items underneath a given
     *        container at that level. Not to be confused with
     *        listItemSelector, which is the selector for all list
     *        items in the nestedSortable
     */
    items: "> .djn-item",
    forcePlaceholderSize: true,
    placeholder: {
      element: function element($currentItem) {
        var el = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(document.createElement($currentItem[0].nodeName)).addClass($currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];

        if ($currentItem.is(".djn-tbody")) {
          var $originalTr = $currentItem.children(".djn-tr").eq(0);
          var trTagName = $originalTr.prop("tagName").toLowerCase();
          var $tr = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])("<" + trTagName + "></" + trTagName + ">");
          $tr.addClass($originalTr.attr("class"));
          var $originalTd = $originalTr.children(".djn-td").eq(0);
          var tdTagName = $originalTd.prop("tagName").toLowerCase();
          var numColumns = 0;
          $originalTr.children(".djn-td").each(function (i, td) {
            numColumns += parseInt((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(td).attr("colspan"), 10) || 1;
          });
          $tr.append((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])("<" + tdTagName + " colspan=\"" + numColumns + "\" class=\"djn-td grp-td\"></" + tdTagName + ">"));
          el.appendChild($tr[0]);
        }

        return el;
      },
      update: function update(instance, $placeholder) {
        var $currItem = instance.currentItem;

        if (!$currItem) {
          return;
        }

        var opts = instance.options; // 1. If a className is set as 'placeholder option, we
        //    don't force sizes - the class is responsible for that
        // 2. The option 'forcePlaceholderSize can be enabled to
        //    force it even if a class name is specified

        if (opts.className && !opts.forcePlaceholderSize) return;

        if ($placeholder.is(".djn-tbody")) {
          // debugger;
          $placeholder = $placeholder.children(".djn-tr").eq(0).children(".djn-td").eq(0);
        } // If the element doesn't have a actual height by itself
        // (without styles coming from a stylesheet), it receives
        // the inline height from the dragged item


        if (!$placeholder.height()) {
          var innerHeight = $currItem.innerHeight(),
              paddingTop = parseInt($currItem.css("paddingTop") || 0, 10),
              paddingBottom = parseInt($currItem.css("paddingBottom") || 0, 10);
          $placeholder.height(innerHeight - paddingTop - paddingBottom);
        }

        if (!$placeholder.width()) {
          var innerWidth = $currItem.innerWidth(),
              paddingLeft = parseInt($currItem.css("paddingLeft") || 0, 10),
              paddingRight = parseInt($currItem.css("paddingRight") || 0, 10);
          $placeholder.width(innerWidth - paddingLeft - paddingRight);
        }
      }
    },
    helper: "clone",
    opacity: 0.6,
    maxLevels: 0,
    connectWith: ".djn-items",
    tolerance: "intersection",
    // Don't allow dragging beneath an inline that is marked for deletion
    isAllowed: function isAllowed(currentItem, parentItem) {
      if (parentItem && parentItem.hasClass("predelete")) {
        return false;
      }

      var $parentGroup = parentItem.closest(".djn-group");
      var parentModel = $parentGroup.data("inlineModel");
      var childModels = $parentGroup.djnData("childModels");
      var currentModel = currentItem.data("inlineModel");
      var isPolymorphicChild = childModels && childModels.indexOf(currentModel) !== -1;

      if (currentModel !== parentModel && !isPolymorphicChild) {
        return false;
      }

      return true;
    },
    // fixedNestingDepth: not a standard ui.sortable parameter.
    // Prevents dragging items up or down levels
    fixedNestingDepth: true,
    // The selector for ALL list containers in the nested sortable.
    containerElementSelector: ".djn-items",
    // The selector for ALL list items in the nested sortable.
    listItemSelector: ".djn-item",
    start: function start(event, ui) {
      ui.item.addClass("djn-item-dragging");
      ui.item.show();
    },
    stop: function stop(event, ui) {
      ui.item.removeClass("djn-item-dragging");
    },

    /**
     * Triggered when a sortable is dropped into a container
     */
    receive: function receive(event, ui) {
      var $inline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(this).closest(".djn-group");
      $inline.djangoFormset().spliceInto(ui.item);
      updatePositions(ui.item.djangoFormsetPrefix());
    },
    update: function update(event, ui) {
      // Ensure that <div class='djn-item djn-no-drag'/>
      // is the first child of the djn-items. If there
      // is another <div class='djn-item'/> before the
      // .do-not-drag element then the drag-and-drop placeholder
      // margins don't work correctly.
      var $nextItem = ui.item.nextAll(".djn-item").first();

      if ($nextItem.is(".djn-no-drag,.djn-thead")) {
        var nextItem = $nextItem[0];
        var parent = nextItem.parentNode;
        parent.insertBefore(nextItem, parent.firstChild);
      }

      var groupId = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(event.target).closest(".djn-group").attr("id"),
          $form = ui.item,
          $parentGroup = $form.closest("#" + groupId);

      if ($form.data("updateOperation") == "removed") {
        $form.removeAttr("data-update-operation");
      } else if (!$parentGroup.length) {
        $form.attr("data-update-operation", "removed");
      }

      updatePositions($form.djangoFormsetPrefix());
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])(document).trigger("djnesting:mutate", [(0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_4__["default"])("#" + $form.djangoFormsetPrefix() + "-group")]);
    }
  });
}



/***/ }),

/***/ "./nested_admin/static/nested_admin/src/nested-admin/utils.js":
/*!********************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/utils.js ***!
  \********************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.regexp.replace.js */ "./node_modules/core-js/modules/es6.regexp.replace.js");
/* harmony import */ var core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_replace_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! core-js/modules/es6.array.map.js */ "./node_modules/core-js/modules/es6.array.map.js");
/* harmony import */ var core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_map_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! core-js/modules/es6.array.slice.js */ "./node_modules/core-js/modules/es6.array.slice.js");
/* harmony import */ var core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_slice_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! core-js/modules/es6.regexp.split.js */ "./node_modules/core-js/modules/es6.regexp.split.js");
/* harmony import */ var core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_split_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var core_js_modules_es6_set_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! core-js/modules/es6.set.js */ "./node_modules/core-js/modules/es6.set.js");
/* harmony import */ var core_js_modules_es6_set_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_set_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! core-js/modules/es6.string.iterator.js */ "./node_modules/core-js/modules/es6.string.iterator.js");
/* harmony import */ var core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_string_iterator_js__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! core-js/modules/es6.object.to-string.js */ "./node_modules/core-js/modules/es6.object.to-string.js");
/* harmony import */ var core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_object_to_string_js__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! core-js/modules/es6.array.iterator.js */ "./node_modules/core-js/modules/es6.array.iterator.js");
/* harmony import */ var core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_iterator_js__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! core-js/modules/web.dom.iterable.js */ "./node_modules/core-js/modules/web.dom.iterable.js");
/* harmony import */ var core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_web_dom_iterable_js__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! core-js/modules/es6.function.name.js */ "./node_modules/core-js/modules/es6.function.name.js");
/* harmony import */ var core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_function_name_js__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! core-js/modules/es6.regexp.match.js */ "./node_modules/core-js/modules/es6.regexp.match.js");
/* harmony import */ var core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_regexp_match_js__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! core-js/modules/es6.array.filter.js */ "./node_modules/core-js/modules/es6.array.filter.js");
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");
/* harmony import */ var _jquery_djnutils__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./jquery.djnutils */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.djnutils.js");
/* harmony import */ var _sortable__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./sortable */ "./nested_admin/static/nested_admin/src/nested-admin/sortable.js");
/* harmony import */ var _regexquote__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ./regexquote */ "./nested_admin/static/nested_admin/src/nested-admin/regexquote.js");
/* harmony import */ var _django$__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./django$ */ "./nested_admin/static/nested_admin/src/nested-admin/django$.js");
/* harmony import */ var _grp$__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./grp$ */ "./nested_admin/static/nested_admin/src/nested-admin/grp$.js");














/* globals SelectFilter, DateTimeShortcuts */






var DJNesting = typeof window.DJNesting != "undefined" ? window.DJNesting : {};
DJNesting.regexQuote = _regexquote__WEBPACK_IMPORTED_MODULE_16__["default"];
DJNesting.createSortable = _sortable__WEBPACK_IMPORTED_MODULE_15__.createSortable;
DJNesting.updatePositions = _sortable__WEBPACK_IMPORTED_MODULE_15__.updatePositions;
/**
 * Update attributes based on a regular expression
 */

DJNesting.updateFormAttributes = function ($elem, search, replace, selector) {
  if (!selector) {
    selector = [":input", "span", "table", "iframe", "label", "a", "ul", "p", "img", ".djn-group", ".djn-inline-form", ".cropduster-form", ".dal-forward-conf"].join(",");
  }

  var addBackMethod = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].fn.addBack ? "addBack" : "andSelf";
  $elem.find(selector)[addBackMethod]().each(function () {
    var $node = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this),
        attrs = ["id", "name", "for", "href", "class", "onclick", "data-inline-formset"];
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(attrs, function (i, attrName) {
      var attrVal = $node.attr(attrName);

      if (attrVal) {
        $node.attr(attrName, attrVal.replace(search, replace));

        if (attrName === "data-inline-formset") {
          $node.data("inlineFormset", JSON.parse($node.attr(attrName)));
        }
      }
    });
  }); // update prepopulate ids for function initPrepopulatedFields

  $elem.find(".prepopulated_field").each(function () {
    var $node = (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])(this);

    if (typeof $node.prepopulate !== "function") {
      $node = (0,_django$__WEBPACK_IMPORTED_MODULE_17__["default"])(this);
    }

    var dependencyIds = _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].makeArray($node.data("dependency_ids") || []);
    $node.data("dependency_ids", _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].map(dependencyIds, function (id) {
      return id.replace(search, replace);
    }));
  });
};

DJNesting.createContainerElement = function () {
  return;
}; // Slight tweaks to the grappelli functions of the same name
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
  if (typeof DJNesting.LOOKUP_URLS != "object" || !DJNesting.LOOKUP_URLS.related) {
    return;
  }

  var lookupUrls = DJNesting.LOOKUP_URLS;
  var $inline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#" + prefix + "-group");

  if (!groupData) {
    groupData = $inline.djnData();
  }

  var lookupFields = groupData.lookupRelated;
  $inline.djangoFormsetForms().each(function (i, form) {
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.fk || [], function (i, fk) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(fk).each(function () {
        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])(this).grp_related_fk({
          lookup_url: lookupUrls.related
        });
      });
    });
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.m2m || [], function (i, m2m) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(m2m).each(function () {
        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])(this).grp_related_m2m({
          lookup_url: lookupUrls.m2m
        });
      });
    });
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.generic || [], function () {
      var _this = this,
          contentType = _this[0],
          objectId = _this[1];

      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(objectId).each(function () {
        var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this);
        var index = $this.djangoFormIndex();

        if ($this.hasClass("grp-has-related-lookup")) {
          $this.parent().find("a.related-lookup").remove();
          $this.parent().find(".grp-placeholder-related-generic").remove();
        }

        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])($this).grp_related_generic({
          content_type: "#id_" + prefix + "-" + index + "-" + contentType,
          object_id: "#id_" + prefix + "-" + index + "-" + objectId,
          lookup_url: lookupUrls.related
        });
      });
    });
  });
};

DJNesting.initAutocompleteFields = function (prefix, groupData) {
  if (typeof DJNesting.LOOKUP_URLS != "object" || !DJNesting.LOOKUP_URLS.related) {
    return;
  }

  var lookupUrls = DJNesting.LOOKUP_URLS;
  var $inline = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#" + prefix + "-group");

  if (!groupData) {
    groupData = $inline.djnData();
  }

  var lookupFields = groupData.lookupAutocomplete;
  $inline.djangoFormsetForms().each(function (i, form) {
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.fk || [], function (i, fk) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(fk).each(function () {
        var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this),
            id = $this.attr("id"); // An autocomplete widget has already been initialized, return

        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#" + id + "-autocomplete").length) {
          return;
        }

        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])($this).grp_autocomplete_fk({
          lookup_url: lookupUrls.related,
          autocomplete_lookup_url: lookupUrls.autocomplete
        });
      });
    });
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.m2m || [], function (i, m2m) {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(m2m).each(function () {
        var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this),
            id = $this.attr("id"); // An autocomplete widget has already been initialized, return

        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#" + id + "-autocomplete").length) {
          return;
        }

        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])($this).grp_autocomplete_m2m({
          lookup_url: lookupUrls.m2m,
          autocomplete_lookup_url: lookupUrls.autocomplete
        });
      });
    });
    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(lookupFields.generic || [], function () {
      var _this2 = this,
          contentType = _this2[0],
          objectId = _this2[1];

      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(form).djangoFormField(objectId).each(function () {
        var $this = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this);
        var index = $this.djangoFormIndex(); // An autocomplete widget has already been initialized, return

        if ((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#" + $this.attr("id") + "-autocomplete").length) {
          return;
        }

        (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])($this).grp_autocomplete_generic({
          content_type: "#id_" + prefix + "-" + index + "-" + contentType,
          object_id: "#id_" + prefix + "-" + index + "-" + objectId,
          lookup_url: lookupUrls.related,
          autocomplete_lookup_url: lookupUrls.m2m
        });
      });
    });
  });
};

function getLevelPrefix(id) {
  return id.replace(/^\#?id_/, "").split(/-(?:empty|__prefix__|\d+)-/g).slice(0, -1).join("-");
} // I very much regret that these are basically copy-pasted from django's
// inlines.js, but they're hidden in closure scope so I don't have much choice.


DJNesting.DjangoInlines = {
  initPrepopulatedFields: function initPrepopulatedFields(row) {
    var formPrefix = row.djangoFormPrefix();
    if (!formPrefix) return;
    var fields = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])("#django-admin-prepopulated-fields-constants").data("prepopulatedFields");
    var fieldNames = new Set();
    var fieldDependencies = {};

    if (Array.isArray(fields)) {
      fields.forEach(function (_ref) {
        var id = _ref.id,
            name = _ref.name,
            dependency_list = _ref.dependency_list,
            maxLength = _ref.maxLength,
            allowUnicode = _ref.allowUnicode;
        fieldNames.add(name);
        var levelPrefix = getLevelPrefix(id);

        if (typeof fieldDependencies[levelPrefix] !== "object") {
          fieldDependencies[levelPrefix] = {};
        }

        fieldDependencies[levelPrefix][name] = {
          dependency_list: dependency_list,
          maxLength: maxLength,
          allowUnicode: allowUnicode
        };
      });
      fieldNames.forEach(function (name) {
        row.find(".form-row .field-" + name + ", .form-row.field-" + name).each(function () {
          var $el = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this);
          var prefix = $el.djangoFormPrefix();
          if (!prefix) return;
          var levelPrefix = getLevelPrefix(prefix);
          var dep = (fieldDependencies[levelPrefix] || {})[name];

          if (dep) {
            $el.addClass("prepopulated_field");
            var $field = $el.is(":input") ? $el : $el.find(":input");
            $field.data("dependency_list", dep.dependency_list);
            $field.data("maxLength", dep.maxLength);
            $field.data("allowUnicode", dep.allowUnicode);
          }
        });
      });
    }

    if (formPrefix.match(/__prefix__/)) return;
    row.find(".prepopulated_field").each(function () {
      var field = (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(this),
          input = field.is(":input") ? field : field.find(":input"),
          $input = (0,_grp$__WEBPACK_IMPORTED_MODULE_18__["default"])(input),
          inputFormPrefix = input.djangoFormPrefix(),
          dependencyList = $input.data("dependency_list") || [],
          dependencies = [];
      if (!inputFormPrefix || inputFormPrefix.match(/__prefix__/)) return;

      if (!dependencyList.length || !$input.prepopulate) {
        $input = (0,_django$__WEBPACK_IMPORTED_MODULE_17__["default"])(input);
        dependencyList = $input.data("dependency_list") || [];
      }

      _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].each(dependencyList, function (i, fieldName) {
        dependencies.push("#id_" + inputFormPrefix + fieldName);
      });

      if (dependencies.length) {
        $input.prepopulate(dependencies, $input.data("maxLength") || $input.attr("maxlength"), $input.data("allowUnicode"));
      }
    });
  },
  reinitDateTimeShortCuts: function reinitDateTimeShortCuts() {
    // Reinitialize the calendar and clock widgets by force
    if (typeof window.DateTimeShortcuts !== "undefined") {
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"])(".datetimeshortcuts").remove();
      DateTimeShortcuts.init();
    }
  },
  updateSelectFilter: function updateSelectFilter($form) {
    // If any SelectFilter widgets are a part of the new form,
    // instantiate a new SelectFilter instance for it.
    if (typeof window.SelectFilter !== "undefined") {
      $form.find(".selectfilter").each(function (index, value) {
        var _this$dataset$fieldNa;

        var namearr = value.name.split("-");
        SelectFilter.init(value.id, (_this$dataset$fieldNa = this.dataset.fieldName) != null ? _this$dataset$fieldNa : namearr[namearr.length - 1], false);
      });
      $form.find(".selectfilterstacked").each(function (index, value) {
        var _this$dataset$fieldNa2;

        var namearr = value.name.split("-");
        SelectFilter.init(value.id, (_this$dataset$fieldNa2 = this.dataset.fieldName) != null ? _this$dataset$fieldNa2 : namearr[namearr.length - 1], true);
      });
    }
  }
};

function patchSelectFilter() {
  window.SelectFilter.init = function (oldFn) {
    return function init(field_id, field_name, is_stacked) {
      if (field_id.match(/\-empty\-/)) {
        return;
      } else {
        oldFn.apply(this, arguments);
      }
    };
  }(window.SelectFilter.init);
}

if (typeof window.SelectFilter !== "undefined") {
  patchSelectFilter();
} else {
  setTimeout(function () {
    if (typeof window.SelectFilter !== "undefined") {
      patchSelectFilter();
    }
  }, 12);
}

function patchSelectBox() {
  window.SelectBox.init = function (oldFn) {
    return function init(field_id, field_name, is_stacked) {
      if (field_id.match(/\-empty\-/)) {
        return;
      } else {
        oldFn.apply(this, arguments);
      }
    };
  }(window.SelectBox.init);

  window.SelectBox.add_to_cache = function (oldFn) {
    return function add_to_cache(id, option) {
      if (!id.match(/_(from|to)$/)) return;
      return oldFn.apply(this, arguments);
    };
  }(window.SelectBox.add_to_cache);

  window.SelectBox.redisplay = function (oldFn) {
    return function redisplay(id) {
      if (!id.match(/_(from|to)$/)) return;
      return oldFn.apply(this, arguments);
    };
  }(window.SelectBox.redisplay);
}

if (typeof window.SelectBox !== "undefined") {
  patchSelectBox();
} else {
  setTimeout(function () {
    if (typeof window.SelectBox !== "undefined") {
      patchSelectBox();
    }
  }, 12);
}

var djangoFuncs = ["prepopulate", "djangoAdminSelect2"];
djangoFuncs.forEach(function (funcName) {
  (function patchDjangoFunction(callCount) {
    if (callCount > 2) {
      return;
    }

    if (typeof _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].fn[funcName] === "undefined") {
      return setTimeout(function () {
        return patchDjangoFunction(++callCount);
      }, 12);
    }

    _jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].fn[funcName] = function (oldFn) {
      return function django_fn_patch() {
        return oldFn.apply(this.filter(':not([id*="-empty-"]):not([id$="-empty"]):not([id*="__prefix__"])'), arguments);
      };
    }(_jquery_shim_js__WEBPACK_IMPORTED_MODULE_13__["default"].fn[funcName]);
  })(0);
});
var grpFuncs = ["grp_autocomplete_fk", "grp_autocomplete_generic", "grp_autocomplete_m2m", "grp_collapsible", "grp_collapsible_group", "grp_inline", "grp_related_fk", "grp_related_generic", "grp_related_m2m", "grp_timepicker", "datepicker", "prepopulate", "djangoAdminSelect2"];
grpFuncs.forEach(function (funcName) {
  (function patchGrpFunction(callCount) {
    if (callCount > 2) {
      return;
    }

    if (typeof window.grp === "undefined" || typeof window.grp.jQuery.fn[funcName] === "undefined") {
      return setTimeout(function () {
        return patchGrpFunction(++callCount);
      }, 12);
    }

    window.grp.jQuery.fn[funcName] = function (oldFn) {
      return function grp_fn_patch() {
        return oldFn.apply(this.filter(':not([id*="-empty-"]):not([id$="-empty"]):not([id*="__prefix__"])'), arguments);
      };
    }(window.grp.jQuery.fn[funcName]);
  })(0);
});
/* harmony default export */ __webpack_exports__["default"] = (DJNesting);

/***/ }),

/***/ "./node_modules/core-js/modules/_a-function.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_a-function.js ***!
  \*****************************************************/
/***/ (function(module) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_add-to-unscopables.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_add-to-unscopables.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 22.1.3.31 Array.prototype[@@unscopables]
var UNSCOPABLES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('unscopables');
var ArrayProto = Array.prototype;
if (ArrayProto[UNSCOPABLES] == undefined) __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js")(ArrayProto, UNSCOPABLES, {});
module.exports = function (key) {
  ArrayProto[UNSCOPABLES][key] = true;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_advance-string-index.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_advance-string-index.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var at = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/modules/_string-at.js")(true);

 // `AdvanceStringIndex` abstract operation
// https://tc39.github.io/ecma262/#sec-advancestringindex
module.exports = function (S, index, unicode) {
  return index + (unicode ? at(S, index).length : 1);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_an-instance.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_an-instance.js ***!
  \******************************************************/
/***/ (function(module) {

module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_an-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_an-object.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_array-includes.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_array-includes.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/core-js/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_array-methods.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_array-methods.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 0 -> Array#forEach
// 1 -> Array#map
// 2 -> Array#filter
// 3 -> Array#some
// 4 -> Array#every
// 5 -> Array#find
// 6 -> Array#findIndex
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/modules/_iobject.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var asc = __webpack_require__(/*! ./_array-species-create */ "./node_modules/core-js/modules/_array-species-create.js");
module.exports = function (TYPE, $create) {
  var IS_MAP = TYPE == 1;
  var IS_FILTER = TYPE == 2;
  var IS_SOME = TYPE == 3;
  var IS_EVERY = TYPE == 4;
  var IS_FIND_INDEX = TYPE == 6;
  var NO_HOLES = TYPE == 5 || IS_FIND_INDEX;
  var create = $create || asc;
  return function ($this, callbackfn, that) {
    var O = toObject($this);
    var self = IObject(O);
    var f = ctx(callbackfn, that, 3);
    var length = toLength(self.length);
    var index = 0;
    var result = IS_MAP ? create($this, length) : IS_FILTER ? create($this, 0) : undefined;
    var val, res;
    for (;length > index; index++) if (NO_HOLES || index in self) {
      val = self[index];
      res = f(val, index, O);
      if (TYPE) {
        if (IS_MAP) result[index] = res;   // map
        else if (res) switch (TYPE) {
          case 3: return true;             // some
          case 5: return val;              // find
          case 6: return index;            // findIndex
          case 2: result.push(val);        // filter
        } else if (IS_EVERY) return false; // every
      }
    }
    return IS_FIND_INDEX ? -1 : IS_SOME || IS_EVERY ? IS_EVERY : result;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_array-species-constructor.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/modules/_array-species-constructor.js ***!
  \********************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var isArray = __webpack_require__(/*! ./_is-array */ "./node_modules/core-js/modules/_is-array.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');

module.exports = function (original) {
  var C;
  if (isArray(original)) {
    C = original.constructor;
    // cross-realm fallback
    if (typeof C == 'function' && (C === Array || isArray(C.prototype))) C = undefined;
    if (isObject(C)) {
      C = C[SPECIES];
      if (C === null) C = undefined;
    }
  } return C === undefined ? Array : C;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_array-species-create.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_array-species-create.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 9.4.2.3 ArraySpeciesCreate(originalArray, length)
var speciesConstructor = __webpack_require__(/*! ./_array-species-constructor */ "./node_modules/core-js/modules/_array-species-constructor.js");

module.exports = function (original, length) {
  return new (speciesConstructor(original))(length);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_classof.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_classof.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_cof.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_cof.js ***!
  \**********************************************/
/***/ (function(module) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_collection-strong.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_collection-strong.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var dP = (__webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f);
var create = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/modules/_object-create.js");
var redefineAll = __webpack_require__(/*! ./_redefine-all */ "./node_modules/core-js/modules/_redefine-all.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var anInstance = __webpack_require__(/*! ./_an-instance */ "./node_modules/core-js/modules/_an-instance.js");
var forOf = __webpack_require__(/*! ./_for-of */ "./node_modules/core-js/modules/_for-of.js");
var $iterDefine = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/modules/_iter-define.js");
var step = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/modules/_iter-step.js");
var setSpecies = __webpack_require__(/*! ./_set-species */ "./node_modules/core-js/modules/_set-species.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js");
var fastKey = (__webpack_require__(/*! ./_meta */ "./node_modules/core-js/modules/_meta.js").fastKey);
var validate = __webpack_require__(/*! ./_validate-collection */ "./node_modules/core-js/modules/_validate-collection.js");
var SIZE = DESCRIPTORS ? '_s' : 'size';

var getEntry = function (that, key) {
  // fast case
  var index = fastKey(key);
  var entry;
  if (index !== 'F') return that._i[index];
  // frozen object case
  for (entry = that._f; entry; entry = entry.n) {
    if (entry.k == key) return entry;
  }
};

module.exports = {
  getConstructor: function (wrapper, NAME, IS_MAP, ADDER) {
    var C = wrapper(function (that, iterable) {
      anInstance(that, C, NAME, '_i');
      that._t = NAME;         // collection type
      that._i = create(null); // index
      that._f = undefined;    // first entry
      that._l = undefined;    // last entry
      that[SIZE] = 0;         // size
      if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
    });
    redefineAll(C.prototype, {
      // 23.1.3.1 Map.prototype.clear()
      // 23.2.3.2 Set.prototype.clear()
      clear: function clear() {
        for (var that = validate(this, NAME), data = that._i, entry = that._f; entry; entry = entry.n) {
          entry.r = true;
          if (entry.p) entry.p = entry.p.n = undefined;
          delete data[entry.i];
        }
        that._f = that._l = undefined;
        that[SIZE] = 0;
      },
      // 23.1.3.3 Map.prototype.delete(key)
      // 23.2.3.4 Set.prototype.delete(value)
      'delete': function (key) {
        var that = validate(this, NAME);
        var entry = getEntry(that, key);
        if (entry) {
          var next = entry.n;
          var prev = entry.p;
          delete that._i[entry.i];
          entry.r = true;
          if (prev) prev.n = next;
          if (next) next.p = prev;
          if (that._f == entry) that._f = next;
          if (that._l == entry) that._l = prev;
          that[SIZE]--;
        } return !!entry;
      },
      // 23.2.3.6 Set.prototype.forEach(callbackfn, thisArg = undefined)
      // 23.1.3.5 Map.prototype.forEach(callbackfn, thisArg = undefined)
      forEach: function forEach(callbackfn /* , that = undefined */) {
        validate(this, NAME);
        var f = ctx(callbackfn, arguments.length > 1 ? arguments[1] : undefined, 3);
        var entry;
        while (entry = entry ? entry.n : this._f) {
          f(entry.v, entry.k, this);
          // revert to the last existing entry
          while (entry && entry.r) entry = entry.p;
        }
      },
      // 23.1.3.7 Map.prototype.has(key)
      // 23.2.3.7 Set.prototype.has(value)
      has: function has(key) {
        return !!getEntry(validate(this, NAME), key);
      }
    });
    if (DESCRIPTORS) dP(C.prototype, 'size', {
      get: function () {
        return validate(this, NAME)[SIZE];
      }
    });
    return C;
  },
  def: function (that, key, value) {
    var entry = getEntry(that, key);
    var prev, index;
    // change existing entry
    if (entry) {
      entry.v = value;
    // create new entry
    } else {
      that._l = entry = {
        i: index = fastKey(key, true), // <- index
        k: key,                        // <- key
        v: value,                      // <- value
        p: prev = that._l,             // <- previous entry
        n: undefined,                  // <- next entry
        r: false                       // <- removed
      };
      if (!that._f) that._f = entry;
      if (prev) prev.n = entry;
      that[SIZE]++;
      // add to index
      if (index !== 'F') that._i[index] = entry;
    } return that;
  },
  getEntry: getEntry,
  setStrong: function (C, NAME, IS_MAP) {
    // add .keys, .values, .entries, [@@iterator]
    // 23.1.3.4, 23.1.3.8, 23.1.3.11, 23.1.3.12, 23.2.3.5, 23.2.3.8, 23.2.3.10, 23.2.3.11
    $iterDefine(C, NAME, function (iterated, kind) {
      this._t = validate(iterated, NAME); // target
      this._k = kind;                     // kind
      this._l = undefined;                // previous
    }, function () {
      var that = this;
      var kind = that._k;
      var entry = that._l;
      // revert to the last existing entry
      while (entry && entry.r) entry = entry.p;
      // get next entry
      if (!that._t || !(that._l = entry = entry ? entry.n : that._t._f)) {
        // or finish the iteration
        that._t = undefined;
        return step(1);
      }
      // return step by kind
      if (kind == 'keys') return step(0, entry.k);
      if (kind == 'values') return step(0, entry.v);
      return step(0, [entry.k, entry.v]);
    }, IS_MAP ? 'entries' : 'values', !IS_MAP, true);

    // add [@@species], 23.1.2.2, 23.2.2.2
    setSpecies(NAME);
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_collection.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_collection.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var redefineAll = __webpack_require__(/*! ./_redefine-all */ "./node_modules/core-js/modules/_redefine-all.js");
var meta = __webpack_require__(/*! ./_meta */ "./node_modules/core-js/modules/_meta.js");
var forOf = __webpack_require__(/*! ./_for-of */ "./node_modules/core-js/modules/_for-of.js");
var anInstance = __webpack_require__(/*! ./_an-instance */ "./node_modules/core-js/modules/_an-instance.js");
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var $iterDetect = __webpack_require__(/*! ./_iter-detect */ "./node_modules/core-js/modules/_iter-detect.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js");
var inheritIfRequired = __webpack_require__(/*! ./_inherit-if-required */ "./node_modules/core-js/modules/_inherit-if-required.js");

module.exports = function (NAME, wrapper, methods, common, IS_MAP, IS_WEAK) {
  var Base = global[NAME];
  var C = Base;
  var ADDER = IS_MAP ? 'set' : 'add';
  var proto = C && C.prototype;
  var O = {};
  var fixMethod = function (KEY) {
    var fn = proto[KEY];
    redefine(proto, KEY,
      KEY == 'delete' ? function (a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'has' ? function has(a) {
        return IS_WEAK && !isObject(a) ? false : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'get' ? function get(a) {
        return IS_WEAK && !isObject(a) ? undefined : fn.call(this, a === 0 ? 0 : a);
      } : KEY == 'add' ? function add(a) { fn.call(this, a === 0 ? 0 : a); return this; }
        : function set(a, b) { fn.call(this, a === 0 ? 0 : a, b); return this; }
    );
  };
  if (typeof C != 'function' || !(IS_WEAK || proto.forEach && !fails(function () {
    new C().entries().next();
  }))) {
    // create collection constructor
    C = common.getConstructor(wrapper, NAME, IS_MAP, ADDER);
    redefineAll(C.prototype, methods);
    meta.NEED = true;
  } else {
    var instance = new C();
    // early implementations not supports chaining
    var HASNT_CHAINING = instance[ADDER](IS_WEAK ? {} : -0, 1) != instance;
    // V8 ~  Chromium 40- weak-collections throws on primitives, but should return false
    var THROWS_ON_PRIMITIVES = fails(function () { instance.has(1); });
    // most early implementations doesn't supports iterables, most modern - not close it correctly
    var ACCEPT_ITERABLES = $iterDetect(function (iter) { new C(iter); }); // eslint-disable-line no-new
    // for early implementations -0 and +0 not the same
    var BUGGY_ZERO = !IS_WEAK && fails(function () {
      // V8 ~ Chromium 42- fails only with 5+ elements
      var $instance = new C();
      var index = 5;
      while (index--) $instance[ADDER](index, index);
      return !$instance.has(-0);
    });
    if (!ACCEPT_ITERABLES) {
      C = wrapper(function (target, iterable) {
        anInstance(target, C, NAME);
        var that = inheritIfRequired(new Base(), target, C);
        if (iterable != undefined) forOf(iterable, IS_MAP, that[ADDER], that);
        return that;
      });
      C.prototype = proto;
      proto.constructor = C;
    }
    if (THROWS_ON_PRIMITIVES || BUGGY_ZERO) {
      fixMethod('delete');
      fixMethod('has');
      IS_MAP && fixMethod('get');
    }
    if (BUGGY_ZERO || HASNT_CHAINING) fixMethod(ADDER);
    // weak collections should not contains .clear method
    if (IS_WEAK && proto.clear) delete proto.clear;
  }

  setToStringTag(C, NAME);

  O[NAME] = C;
  $export($export.G + $export.W + $export.F * (C != Base), O);

  if (!IS_WEAK) common.setStrong(C, NAME, IS_MAP);

  return C;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_core.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_core.js ***!
  \***********************************************/
/***/ (function(module) {

var core = module.exports = { version: '2.6.12' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_ctx.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_ctx.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_defined.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_defined.js ***!
  \**************************************************/
/***/ (function(module) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_descriptors.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_descriptors.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_dom-create.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_dom-create.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var document = (__webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document);
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/modules/_enum-bug-keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_enum-bug-keys.js ***!
  \********************************************************/
/***/ (function(module) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "./node_modules/core-js/modules/_export.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_export.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] || (global[name] = {}) : (global[name] || {})[PROTOTYPE];
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE] || (exports[PROTOTYPE] = {});
  var key, own, out, exp;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    // export native or passed
    out = (own ? target : source)[key];
    // bind timers to global for call from export context
    exp = IS_BIND && own ? ctx(out, global) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // extend global
    if (target) redefine(target, key, out, type & $export.U);
    // export
    if (exports[key] != out) hide(exports, key, exp);
    if (IS_PROTO && expProto[key] != out) expProto[key] = out;
  }
};
global.core = core;
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/core-js/modules/_fails.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_fails.js ***!
  \************************************************/
/***/ (function(module) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_fix-re-wks.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_fix-re-wks.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

__webpack_require__(/*! ./es6.regexp.exec */ "./node_modules/core-js/modules/es6.regexp.exec.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
var wks = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js");
var regexpExec = __webpack_require__(/*! ./_regexp-exec */ "./node_modules/core-js/modules/_regexp-exec.js");

var SPECIES = wks('species');

var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  // #replace needs built-in support for named groups.
  // #match works fine because it just return the exec results, even if it has
  // a "grops" property.
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});

var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = (function () {
  // Chrome 51 has a buggy "split" implementation when RegExp#exec !== nativeExec
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length === 2 && result[0] === 'a' && result[1] === 'b';
})();

module.exports = function (KEY, length, exec) {
  var SYMBOL = wks(KEY);

  var DELEGATES_TO_SYMBOL = !fails(function () {
    // String methods call symbol-named RegEp methods
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });

  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL ? !fails(function () {
    // Symbol-named RegExp methods call .exec
    var execCalled = false;
    var re = /a/;
    re.exec = function () { execCalled = true; return null; };
    if (KEY === 'split') {
      // RegExp[@@split] doesn't call the regex's exec method, but first creates
      // a new one. We need to return the patched regex when creating the new one.
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
    }
    re[SYMBOL]('');
    return !execCalled;
  }) : undefined;

  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !REPLACE_SUPPORTS_NAMED_GROUPS) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var fns = exec(
      defined,
      SYMBOL,
      ''[KEY],
      function maybeCallNative(nativeMethod, regexp, str, arg2, forceStringMethod) {
        if (regexp.exec === regexpExec) {
          if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
            // The native String method already delegates to @@method (this
            // polyfilled function), leasing to infinite recursion.
            // We avoid it by directly calling the native @@method method.
            return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
          }
          return { done: true, value: nativeMethod.call(str, regexp, arg2) };
        }
        return { done: false };
      }
    );
    var strfn = fns[0];
    var rxfn = fns[1];

    redefine(String.prototype, KEY, strfn);
    hide(RegExp.prototype, SYMBOL, length == 2
      // 21.2.5.8 RegExp.prototype[@@replace](string, replaceValue)
      // 21.2.5.11 RegExp.prototype[@@split](string, limit)
      ? function (string, arg) { return rxfn.call(string, this, arg); }
      // 21.2.5.6 RegExp.prototype[@@match](string)
      // 21.2.5.9 RegExp.prototype[@@search](string)
      : function (string) { return rxfn.call(string, this); }
    );
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_flags.js":
/*!************************************************!*\
  !*** ./node_modules/core-js/modules/_flags.js ***!
  \************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// 21.2.5.3 get RegExp.prototype.flags
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
module.exports = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_for-of.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_for-of.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js");
var call = __webpack_require__(/*! ./_iter-call */ "./node_modules/core-js/modules/_iter-call.js");
var isArrayIter = __webpack_require__(/*! ./_is-array-iter */ "./node_modules/core-js/modules/_is-array-iter.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var getIterFn = __webpack_require__(/*! ./core.get-iterator-method */ "./node_modules/core-js/modules/core.get-iterator-method.js");
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;


/***/ }),

/***/ "./node_modules/core-js/modules/_function-to-string.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/_function-to-string.js ***!
  \*************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('native-function-to-string', Function.toString);


/***/ }),

/***/ "./node_modules/core-js/modules/_global.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_global.js ***!
  \*************************************************/
/***/ (function(module) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/modules/_has.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_has.js ***!
  \**********************************************/
/***/ (function(module) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_hide.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_hide.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_html.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_html.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var document = (__webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").document);
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/modules/_ie8-dom-define.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/_ie8-dom-define.js ***!
  \*********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/modules/_inherit-if-required.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_inherit-if-required.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var setPrototypeOf = (__webpack_require__(/*! ./_set-proto */ "./node_modules/core-js/modules/_set-proto.js").set);
module.exports = function (that, target, C) {
  var S = target.constructor;
  var P;
  if (S !== C && typeof S == 'function' && (P = S.prototype) !== C.prototype && isObject(P) && setPrototypeOf) {
    setPrototypeOf(that, P);
  } return that;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iobject.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_iobject.js ***!
  \**************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-array-iter.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_is-array-iter.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-array.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_is-array.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-object.js ***!
  \****************************************************/
/***/ (function(module) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/modules/_is-regexp.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_is-regexp.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.2.8 IsRegExp(argument)
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
var MATCH = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('match');
module.exports = function (it) {
  var isRegExp;
  return isObject(it) && ((isRegExp = it[MATCH]) !== undefined ? !!isRegExp : cof(it) == 'RegExp');
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-call.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-call.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-create.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-create.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/modules/_object-create.js");
var descriptor = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js");
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js")(IteratorPrototype, __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-define.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-define.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js");
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var $iterCreate = __webpack_require__(/*! ./_iter-create */ "./node_modules/core-js/modules/_iter-create.js");
var setToStringTag = __webpack_require__(/*! ./_set-to-string-tag */ "./node_modules/core-js/modules/_set-to-string-tag.js");
var getPrototypeOf = __webpack_require__(/*! ./_object-gpo */ "./node_modules/core-js/modules/_object-gpo.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-detect.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-detect.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iter-step.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iter-step.js ***!
  \****************************************************/
/***/ (function(module) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_iterators.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_iterators.js ***!
  \****************************************************/
/***/ (function(module) {

module.exports = {};


/***/ }),

/***/ "./node_modules/core-js/modules/_library.js":
/*!**************************************************!*\
  !*** ./node_modules/core-js/modules/_library.js ***!
  \**************************************************/
/***/ (function(module) {

module.exports = false;


/***/ }),

/***/ "./node_modules/core-js/modules/_meta.js":
/*!***********************************************!*\
  !*** ./node_modules/core-js/modules/_meta.js ***!
  \***********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var META = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js")('meta');
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var setDesc = (__webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f);
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-create.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_object-create.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  (__webpack_require__(/*! ./_html */ "./node_modules/core-js/modules/_html.js").appendChild)(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-dp.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dp.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-dps.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-dps.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopd.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopd.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

var pIE = __webpack_require__(/*! ./_object-pie */ "./node_modules/core-js/modules/_object-pie.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/modules/_property-desc.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/modules/_to-primitive.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/modules/_ie8-dom-define.js");
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gopn.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gopn.js ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/modules/_object-keys-internal.js");
var hiddenKeys = (__webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js").concat)('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-gpo.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-gpo.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys-internal.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys-internal.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-keys.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_object-keys.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_object-pie.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_object-pie.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),

/***/ "./node_modules/core-js/modules/_property-desc.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_property-desc.js ***!
  \********************************************************/
/***/ (function(module) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_redefine-all.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine-all.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
module.exports = function (target, src, safe) {
  for (var key in src) redefine(target, key, src[key], safe);
  return target;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_redefine.js":
/*!***************************************************!*\
  !*** ./node_modules/core-js/modules/_redefine.js ***!
  \***************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var SRC = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js")('src');
var $toString = __webpack_require__(/*! ./_function-to-string */ "./node_modules/core-js/modules/_function-to-string.js");
var TO_STRING = 'toString';
var TPL = ('' + $toString).split(TO_STRING);

(__webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js").inspectSource) = function (it) {
  return $toString.call(it);
};

(module.exports = function (O, key, val, safe) {
  var isFunction = typeof val == 'function';
  if (isFunction) has(val, 'name') || hide(val, 'name', key);
  if (O[key] === val) return;
  if (isFunction) has(val, SRC) || hide(val, SRC, O[key] ? '' + O[key] : TPL.join(String(key)));
  if (O === global) {
    O[key] = val;
  } else if (!safe) {
    delete O[key];
    hide(O, key, val);
  } else if (O[key]) {
    O[key] = val;
  } else {
    hide(O, key, val);
  }
// add fake Function#toString for correct work wrapped methods / constructors with methods like LoDash isNative
})(Function.prototype, TO_STRING, function toString() {
  return typeof this == 'function' && this[SRC] || $toString.call(this);
});


/***/ }),

/***/ "./node_modules/core-js/modules/_regexp-exec-abstract.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/modules/_regexp-exec-abstract.js ***!
  \***************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var builtinExec = RegExp.prototype.exec;

 // `RegExpExec` abstract operation
// https://tc39.github.io/ecma262/#sec-regexpexec
module.exports = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw new TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classof(R) !== 'RegExp') {
    throw new TypeError('RegExp#exec called on incompatible receiver');
  }
  return builtinExec.call(R, S);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_regexp-exec.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_regexp-exec.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var regexpFlags = __webpack_require__(/*! ./_flags */ "./node_modules/core-js/modules/_flags.js");

var nativeExec = RegExp.prototype.exec;
// This always refers to the native implementation, because the
// String#replace polyfill uses ./fix-regexp-well-known-symbol-logic.js,
// which loads this file before patching the method.
var nativeReplace = String.prototype.replace;

var patchedExec = nativeExec;

var LAST_INDEX = 'lastIndex';

var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/,
      re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1[LAST_INDEX] !== 0 || re2[LAST_INDEX] !== 0;
})();

// nonparticipating capturing group, copied from es5-shim's String#split patch.
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;

var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED;

if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;

    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + re.source + '$(?!\\s)', regexpFlags.call(re));
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re[LAST_INDEX];

    match = nativeExec.call(re, str);

    if (UPDATES_LAST_INDEX_WRONG && match) {
      re[LAST_INDEX] = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      // Fix browsers whose `exec` methods don't consistently return `undefined`
      // for NPCG, like IE8. NOTE: This doesn' work for /(.?)?/
      // eslint-disable-next-line no-loop-func
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }

    return match;
  };
}

module.exports = patchedExec;


/***/ }),

/***/ "./node_modules/core-js/modules/_set-proto.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_set-proto.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/modules/_ctx.js")(Function.call, (__webpack_require__(/*! ./_object-gopd */ "./node_modules/core-js/modules/_object-gopd.js").f)(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),

/***/ "./node_modules/core-js/modules/_set-species.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/modules/_set-species.js ***!
  \******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js");
var DESCRIPTORS = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');

module.exports = function (KEY) {
  var C = global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_set-to-string-tag.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_set-to-string-tag.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var def = (__webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f);
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/modules/_has.js");
var TAG = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_shared-key.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_shared-key.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_shared.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/_shared.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/core-js/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/modules/_species-constructor.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_species-constructor.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
var SPECIES = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_strict-method.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/_strict-method.js ***!
  \********************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");

module.exports = function (method, arg) {
  return !!method && fails(function () {
    // eslint-disable-next-line no-useless-call
    arg ? method.call(null, function () { /* empty */ }, 1) : method.call(null);
  });
};


/***/ }),

/***/ "./node_modules/core-js/modules/_string-at.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_string-at.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-absolute-index.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/_to-absolute-index.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-integer.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-integer.js ***!
  \*****************************************************/
/***/ (function(module) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-iobject.js":
/*!*****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-iobject.js ***!
  \*****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-length.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-length.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-object.js":
/*!****************************************************!*\
  !*** ./node_modules/core-js/modules/_to-object.js ***!
  \****************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_to-primitive.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/_to-primitive.js ***!
  \*******************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/modules/_uid.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_uid.js ***!
  \**********************************************/
/***/ (function(module) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/modules/_validate-collection.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/_validate-collection.js ***!
  \**************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/modules/_is-object.js");
module.exports = function (it, TYPE) {
  if (!isObject(it) || it._t !== TYPE) throw TypeError('Incompatible receiver, ' + TYPE + ' required!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/modules/_wks.js":
/*!**********************************************!*\
  !*** ./node_modules/core-js/modules/_wks.js ***!
  \**********************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var store = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/modules/_shared.js")('wks');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/modules/_uid.js");
var Symbol = (__webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js").Symbol);
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),

/***/ "./node_modules/core-js/modules/core.get-iterator-method.js":
/*!******************************************************************!*\
  !*** ./node_modules/core-js/modules/core.get-iterator-method.js ***!
  \******************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var ITERATOR = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('iterator');
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
module.exports = (__webpack_require__(/*! ./_core */ "./node_modules/core-js/modules/_core.js").getIteratorMethod) = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.filter.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.filter.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $filter = __webpack_require__(/*! ./_array-methods */ "./node_modules/core-js/modules/_array-methods.js")(2);

$export($export.P + $export.F * !__webpack_require__(/*! ./_strict-method */ "./node_modules/core-js/modules/_strict-method.js")([].filter, true), 'Array', {
  // 22.1.3.7 / 15.4.4.20 Array.prototype.filter(callbackfn [, thisArg])
  filter: function filter(callbackfn /* , thisArg */) {
    return $filter(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.find.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.find.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// 22.1.3.8 Array.prototype.find(predicate, thisArg = undefined)
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $find = __webpack_require__(/*! ./_array-methods */ "./node_modules/core-js/modules/_array-methods.js")(5);
var KEY = 'find';
var forced = true;
// Shouldn't skip holes
if (KEY in []) Array(1)[KEY](function () { forced = false; });
$export($export.P + $export.F * forced, 'Array', {
  find: function find(callbackfn /* , that = undefined */) {
    return $find(this, callbackfn, arguments.length > 1 ? arguments[1] : undefined);
  }
});
__webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/modules/_add-to-unscopables.js")(KEY);


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.iterator.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.iterator.js ***!
  \************************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(/*! ./_add-to-unscopables */ "./node_modules/core-js/modules/_add-to-unscopables.js");
var step = __webpack_require__(/*! ./_iter-step */ "./node_modules/core-js/modules/_iter-step.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/modules/_to-iobject.js");

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/modules/_iter-define.js")(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.map.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.map.js ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var $map = __webpack_require__(/*! ./_array-methods */ "./node_modules/core-js/modules/_array-methods.js")(1);

$export($export.P + $export.F * !__webpack_require__(/*! ./_strict-method */ "./node_modules/core-js/modules/_strict-method.js")([].map, true), 'Array', {
  // 22.1.3.15 / 15.4.4.19 Array.prototype.map(callbackfn [, thisArg])
  map: function map(callbackfn /* , thisArg */) {
    return $map(this, callbackfn, arguments[1]);
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.slice.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.slice.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var html = __webpack_require__(/*! ./_html */ "./node_modules/core-js/modules/_html.js");
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/modules/_cof.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/core-js/modules/_to-absolute-index.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var arraySlice = [].slice;

// fallback for not array-like ES3 strings and DOM objects
$export($export.P + $export.F * __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  if (html) arraySlice.call(html);
}), 'Array', {
  slice: function slice(begin, end) {
    var len = toLength(this.length);
    var klass = cof(this);
    end = end === undefined ? len : end;
    if (klass == 'Array') return arraySlice.call(this, begin, end);
    var start = toAbsoluteIndex(begin, len);
    var upTo = toAbsoluteIndex(end, len);
    var size = toLength(upTo - start);
    var cloned = new Array(size);
    var i = 0;
    for (; i < size; i++) cloned[i] = klass == 'String'
      ? this.charAt(start + i)
      : this[start + i];
    return cloned;
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.array.sort.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.array.sort.js ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js");
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/modules/_a-function.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var $sort = [].sort;
var test = [1, 2, 3];

$export($export.P + $export.F * (fails(function () {
  // IE8-
  test.sort(undefined);
}) || !fails(function () {
  // V8 bug
  test.sort(null);
  // Old WebKit
}) || !__webpack_require__(/*! ./_strict-method */ "./node_modules/core-js/modules/_strict-method.js")($sort)), 'Array', {
  // 22.1.3.25 Array.prototype.sort(comparefn)
  sort: function sort(comparefn) {
    return comparefn === undefined
      ? $sort.call(toObject(this))
      : $sort.call(toObject(this), aFunction(comparefn));
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.function.name.js":
/*!***********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.function.name.js ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var dP = (__webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f);
var FProto = Function.prototype;
var nameRE = /^\s*function ([^ (]*)/;
var NAME = 'name';

// 19.2.4.2 name
NAME in FProto || __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && dP(FProto, NAME, {
  configurable: true,
  get: function () {
    try {
      return ('' + this).match(nameRE)[1];
    } catch (e) {
      return '';
    }
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.object.to-string.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.object.to-string.js ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

// 19.1.3.6 Object.prototype.toString()
var classof = __webpack_require__(/*! ./_classof */ "./node_modules/core-js/modules/_classof.js");
var test = {};
test[__webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('toStringTag')] = 'z';
if (test + '' != '[object z]') {
  __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js")(Object.prototype, 'toString', function toString() {
    return '[object ' + classof(this) + ']';
  }, true);
}


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.constructor.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.constructor.js ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var inheritIfRequired = __webpack_require__(/*! ./_inherit-if-required */ "./node_modules/core-js/modules/_inherit-if-required.js");
var dP = (__webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/modules/_object-dp.js").f);
var gOPN = (__webpack_require__(/*! ./_object-gopn */ "./node_modules/core-js/modules/_object-gopn.js").f);
var isRegExp = __webpack_require__(/*! ./_is-regexp */ "./node_modules/core-js/modules/_is-regexp.js");
var $flags = __webpack_require__(/*! ./_flags */ "./node_modules/core-js/modules/_flags.js");
var $RegExp = global.RegExp;
var Base = $RegExp;
var proto = $RegExp.prototype;
var re1 = /a/g;
var re2 = /a/g;
// "new" creates a new object, old webkit buggy here
var CORRECT_NEW = new $RegExp(re1) !== re1;

if (__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/modules/_descriptors.js") && (!CORRECT_NEW || __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js")(function () {
  re2[__webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js")('match')] = false;
  // RegExp constructor can alter flags and IsRegExp works correct with @@match
  return $RegExp(re1) != re1 || $RegExp(re2) == re2 || $RegExp(re1, 'i') != '/a/i';
}))) {
  $RegExp = function RegExp(p, f) {
    var tiRE = this instanceof $RegExp;
    var piRE = isRegExp(p);
    var fiU = f === undefined;
    return !tiRE && piRE && p.constructor === $RegExp && fiU ? p
      : inheritIfRequired(CORRECT_NEW
        ? new Base(piRE && !fiU ? p.source : p, f)
        : Base((piRE = p instanceof $RegExp) ? p.source : p, piRE && fiU ? $flags.call(p) : f)
      , tiRE ? this : proto, $RegExp);
  };
  var proxy = function (key) {
    key in $RegExp || dP($RegExp, key, {
      configurable: true,
      get: function () { return Base[key]; },
      set: function (it) { Base[key] = it; }
    });
  };
  for (var keys = gOPN(Base), i = 0; keys.length > i;) proxy(keys[i++]);
  proto.constructor = $RegExp;
  $RegExp.prototype = proto;
  __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js")(global, 'RegExp', $RegExp);
}

__webpack_require__(/*! ./_set-species */ "./node_modules/core-js/modules/_set-species.js")('RegExp');


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.exec.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.exec.js ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var regexpExec = __webpack_require__(/*! ./_regexp-exec */ "./node_modules/core-js/modules/_regexp-exec.js");
__webpack_require__(/*! ./_export */ "./node_modules/core-js/modules/_export.js")({
  target: 'RegExp',
  proto: true,
  forced: regexpExec !== /./.exec
}, {
  exec: regexpExec
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.match.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.match.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var advanceStringIndex = __webpack_require__(/*! ./_advance-string-index */ "./node_modules/core-js/modules/_advance-string-index.js");
var regExpExec = __webpack_require__(/*! ./_regexp-exec-abstract */ "./node_modules/core-js/modules/_regexp-exec-abstract.js");

// @@match logic
__webpack_require__(/*! ./_fix-re-wks */ "./node_modules/core-js/modules/_fix-re-wks.js")('match', 1, function (defined, MATCH, $match, maybeCallNative) {
  return [
    // `String.prototype.match` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.match
    function match(regexp) {
      var O = defined(this);
      var fn = regexp == undefined ? undefined : regexp[MATCH];
      return fn !== undefined ? fn.call(regexp, O) : new RegExp(regexp)[MATCH](String(O));
    },
    // `RegExp.prototype[@@match]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@match
    function (regexp) {
      var res = maybeCallNative($match, regexp, this);
      if (res.done) return res.value;
      var rx = anObject(regexp);
      var S = String(this);
      if (!rx.global) return regExpExec(rx, S);
      var fullUnicode = rx.unicode;
      rx.lastIndex = 0;
      var A = [];
      var n = 0;
      var result;
      while ((result = regExpExec(rx, S)) !== null) {
        var matchStr = String(result[0]);
        A[n] = matchStr;
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
        n++;
      }
      return n === 0 ? null : A;
    }
  ];
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.replace.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.replace.js ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/modules/_to-object.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/modules/_to-integer.js");
var advanceStringIndex = __webpack_require__(/*! ./_advance-string-index */ "./node_modules/core-js/modules/_advance-string-index.js");
var regExpExec = __webpack_require__(/*! ./_regexp-exec-abstract */ "./node_modules/core-js/modules/_regexp-exec-abstract.js");
var max = Math.max;
var min = Math.min;
var floor = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&`']|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&`']|\d\d?)/g;

var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};

// @@replace logic
__webpack_require__(/*! ./_fix-re-wks */ "./node_modules/core-js/modules/_fix-re-wks.js")('replace', 2, function (defined, REPLACE, $replace, maybeCallNative) {
  return [
    // `String.prototype.replace` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.replace
    function replace(searchValue, replaceValue) {
      var O = defined(this);
      var fn = searchValue == undefined ? undefined : searchValue[REPLACE];
      return fn !== undefined
        ? fn.call(searchValue, O, replaceValue)
        : $replace.call(String(O), searchValue, replaceValue);
    },
    // `RegExp.prototype[@@replace]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@replace
    function (regexp, replaceValue) {
      var res = maybeCallNative($replace, regexp, this, replaceValue);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regExpExec(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max(min(toInteger(result.index), S.length), 0);
        var captures = [];
        // NOTE: This is equivalent to
        //   captures = result.slice(1).map(maybeToString)
        // but for some reason `nativeSlice.call(result, 1, result.length)` (called in
        // the slice polyfill when slicing native arrays) "doesn't work" in safari 9 and
        // causes a crash (https://pastebin.com/N21QzeQA) when trying to debug it.
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];

    // https://tc39.github.io/ecma262/#sec-getsubstitution
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return $replace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default: // \d\d?
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.regexp.split.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/es6.regexp.split.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";


var isRegExp = __webpack_require__(/*! ./_is-regexp */ "./node_modules/core-js/modules/_is-regexp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/modules/_an-object.js");
var speciesConstructor = __webpack_require__(/*! ./_species-constructor */ "./node_modules/core-js/modules/_species-constructor.js");
var advanceStringIndex = __webpack_require__(/*! ./_advance-string-index */ "./node_modules/core-js/modules/_advance-string-index.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/modules/_to-length.js");
var callRegExpExec = __webpack_require__(/*! ./_regexp-exec-abstract */ "./node_modules/core-js/modules/_regexp-exec-abstract.js");
var regexpExec = __webpack_require__(/*! ./_regexp-exec */ "./node_modules/core-js/modules/_regexp-exec.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/modules/_fails.js");
var $min = Math.min;
var $push = [].push;
var $SPLIT = 'split';
var LENGTH = 'length';
var LAST_INDEX = 'lastIndex';
var MAX_UINT32 = 0xffffffff;

// babel-minify transpiles RegExp('x', 'y') -> /x/y and it causes SyntaxError
var SUPPORTS_Y = !fails(function () { RegExp(MAX_UINT32, 'y'); });

// @@split logic
__webpack_require__(/*! ./_fix-re-wks */ "./node_modules/core-js/modules/_fix-re-wks.js")('split', 2, function (defined, SPLIT, $split, maybeCallNative) {
  var internalSplit;
  if (
    'abbc'[$SPLIT](/(b)*/)[1] == 'c' ||
    'test'[$SPLIT](/(?:)/, -1)[LENGTH] != 4 ||
    'ab'[$SPLIT](/(?:ab)*/)[LENGTH] != 2 ||
    '.'[$SPLIT](/(.?)(.?)/)[LENGTH] != 4 ||
    '.'[$SPLIT](/()()/)[LENGTH] > 1 ||
    ''[$SPLIT](/.?/)[LENGTH]
  ) {
    // based on es5-shim implementation, need to rework it
    internalSplit = function (separator, limit) {
      var string = String(this);
      if (separator === undefined && limit === 0) return [];
      // If `separator` is not a regex, use native split
      if (!isRegExp(separator)) return $split.call(string, separator, limit);
      var output = [];
      var flags = (separator.ignoreCase ? 'i' : '') +
                  (separator.multiline ? 'm' : '') +
                  (separator.unicode ? 'u' : '') +
                  (separator.sticky ? 'y' : '');
      var lastLastIndex = 0;
      var splitLimit = limit === undefined ? MAX_UINT32 : limit >>> 0;
      // Make `global` and avoid `lastIndex` issues by working with a copy
      var separatorCopy = new RegExp(separator.source, flags + 'g');
      var match, lastIndex, lastLength;
      while (match = regexpExec.call(separatorCopy, string)) {
        lastIndex = separatorCopy[LAST_INDEX];
        if (lastIndex > lastLastIndex) {
          output.push(string.slice(lastLastIndex, match.index));
          if (match[LENGTH] > 1 && match.index < string[LENGTH]) $push.apply(output, match.slice(1));
          lastLength = match[0][LENGTH];
          lastLastIndex = lastIndex;
          if (output[LENGTH] >= splitLimit) break;
        }
        if (separatorCopy[LAST_INDEX] === match.index) separatorCopy[LAST_INDEX]++; // Avoid an infinite loop
      }
      if (lastLastIndex === string[LENGTH]) {
        if (lastLength || !separatorCopy.test('')) output.push('');
      } else output.push(string.slice(lastLastIndex));
      return output[LENGTH] > splitLimit ? output.slice(0, splitLimit) : output;
    };
  // Chakra, V8
  } else if ('0'[$SPLIT](undefined, 0)[LENGTH]) {
    internalSplit = function (separator, limit) {
      return separator === undefined && limit === 0 ? [] : $split.call(this, separator, limit);
    };
  } else {
    internalSplit = $split;
  }

  return [
    // `String.prototype.split` method
    // https://tc39.github.io/ecma262/#sec-string.prototype.split
    function split(separator, limit) {
      var O = defined(this);
      var splitter = separator == undefined ? undefined : separator[SPLIT];
      return splitter !== undefined
        ? splitter.call(separator, O, limit)
        : internalSplit.call(String(O), separator, limit);
    },
    // `RegExp.prototype[@@split]` method
    // https://tc39.github.io/ecma262/#sec-regexp.prototype-@@split
    //
    // NOTE: This cannot be properly polyfilled in engines that don't support
    // the 'y' flag.
    function (regexp, limit) {
      var res = maybeCallNative(internalSplit, regexp, this, limit, internalSplit !== $split);
      if (res.done) return res.value;

      var rx = anObject(regexp);
      var S = String(this);
      var C = speciesConstructor(rx, RegExp);

      var unicodeMatching = rx.unicode;
      var flags = (rx.ignoreCase ? 'i' : '') +
                  (rx.multiline ? 'm' : '') +
                  (rx.unicode ? 'u' : '') +
                  (SUPPORTS_Y ? 'y' : 'g');

      // ^(? + rx + ) is needed, in combination with some S slicing, to
      // simulate the 'y' flag.
      var splitter = new C(SUPPORTS_Y ? rx : '^(?:' + rx.source + ')', flags);
      var lim = limit === undefined ? MAX_UINT32 : limit >>> 0;
      if (lim === 0) return [];
      if (S.length === 0) return callRegExpExec(splitter, S) === null ? [S] : [];
      var p = 0;
      var q = 0;
      var A = [];
      while (q < S.length) {
        splitter.lastIndex = SUPPORTS_Y ? q : 0;
        var z = callRegExpExec(splitter, SUPPORTS_Y ? S : S.slice(q));
        var e;
        if (
          z === null ||
          (e = $min(toLength(splitter.lastIndex + (SUPPORTS_Y ? 0 : q)), S.length)) === p
        ) {
          q = advanceStringIndex(S, q, unicodeMatching);
        } else {
          A.push(S.slice(p, q));
          if (A.length === lim) return A;
          for (var i = 1; i <= z.length - 1; i++) {
            A.push(z[i]);
            if (A.length === lim) return A;
          }
          q = p = e;
        }
      }
      A.push(S.slice(p));
      return A;
    }
  ];
});


/***/ }),

/***/ "./node_modules/core-js/modules/es6.set.js":
/*!*************************************************!*\
  !*** ./node_modules/core-js/modules/es6.set.js ***!
  \*************************************************/
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var strong = __webpack_require__(/*! ./_collection-strong */ "./node_modules/core-js/modules/_collection-strong.js");
var validate = __webpack_require__(/*! ./_validate-collection */ "./node_modules/core-js/modules/_validate-collection.js");
var SET = 'Set';

// 23.2 Set Objects
module.exports = __webpack_require__(/*! ./_collection */ "./node_modules/core-js/modules/_collection.js")(SET, function (get) {
  return function Set() { return get(this, arguments.length > 0 ? arguments[0] : undefined); };
}, {
  // 23.2.3.1 Set.prototype.add(value)
  add: function add(value) {
    return strong.def(validate(this, SET), value = value === 0 ? 0 : value, value);
  }
}, strong);


/***/ }),

/***/ "./node_modules/core-js/modules/es6.string.iterator.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/modules/es6.string.iterator.js ***!
  \*************************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(/*! ./_string-at */ "./node_modules/core-js/modules/_string-at.js")(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(/*! ./_iter-define */ "./node_modules/core-js/modules/_iter-define.js")(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),

/***/ "./node_modules/core-js/modules/web.dom.iterable.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/modules/web.dom.iterable.js ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

var $iterators = __webpack_require__(/*! ./es6.array.iterator */ "./node_modules/core-js/modules/es6.array.iterator.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/modules/_object-keys.js");
var redefine = __webpack_require__(/*! ./_redefine */ "./node_modules/core-js/modules/_redefine.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/modules/_global.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/modules/_hide.js");
var Iterators = __webpack_require__(/*! ./_iterators */ "./node_modules/core-js/modules/_iterators.js");
var wks = __webpack_require__(/*! ./_wks */ "./node_modules/core-js/modules/_wks.js");
var ITERATOR = wks('iterator');
var TO_STRING_TAG = wks('toStringTag');
var ArrayValues = Iterators.Array;

var DOMIterables = {
  CSSRuleList: true, // TODO: Not spec compliant, should be false.
  CSSStyleDeclaration: false,
  CSSValueList: false,
  ClientRectList: false,
  DOMRectList: false,
  DOMStringList: false,
  DOMTokenList: true,
  DataTransferItemList: false,
  FileList: false,
  HTMLAllCollection: false,
  HTMLCollection: false,
  HTMLFormElement: false,
  HTMLSelectElement: false,
  MediaList: true, // TODO: Not spec compliant, should be false.
  MimeTypeArray: false,
  NamedNodeMap: false,
  NodeList: true,
  PaintRequestList: false,
  Plugin: false,
  PluginArray: false,
  SVGLengthList: false,
  SVGNumberList: false,
  SVGPathSegList: false,
  SVGPointList: false,
  SVGStringList: false,
  SVGTransformList: false,
  SourceBufferList: false,
  StyleSheetList: true, // TODO: Not spec compliant, should be false.
  TextTrackCueList: false,
  TextTrackList: false,
  TouchList: false
};

for (var collections = getKeys(DOMIterables), i = 0; i < collections.length; i++) {
  var NAME = collections[i];
  var explicit = DOMIterables[NAME];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  var key;
  if (proto) {
    if (!proto[ITERATOR]) hide(proto, ITERATOR, ArrayValues);
    if (!proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
    Iterators[NAME] = ArrayValues;
    if (explicit) for (key in $iterators) if (!proto[key]) redefine(proto, key, $iterators[key], true);
  }
}


/***/ }),

/***/ "grappelli":
/*!****************************!*\
  !*** external "grappelli" ***!
  \****************************/
/***/ (function(module) {

"use strict";
module.exports = window["grappelli"];

/***/ }),

/***/ "grp":
/*!**********************!*\
  !*** external "grp" ***!
  \**********************/
/***/ (function(module) {

"use strict";
module.exports = window["grp"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
var __webpack_exports__ = {};
/*!****************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested_admin.scss ***!
  \****************************************************************/
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin

}();
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";
/*!********************************************************************!*\
  !*** ./nested_admin/static/nested_admin/src/nested-admin/index.js ***!
  \********************************************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! core-js/modules/es6.array.filter.js */ "./node_modules/core-js/modules/es6.array.filter.js");
/* harmony import */ var core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_filter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! core-js/modules/es6.array.find.js */ "./node_modules/core-js/modules/es6.array.find.js");
/* harmony import */ var core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(core_js_modules_es6_array_find_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jquery.shim.js */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.shim.js");
/* harmony import */ var grappelli__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! grappelli */ "grappelli");
/* harmony import */ var grappelli__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(grappelli__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils */ "./nested_admin/static/nested_admin/src/nested-admin/utils.js");
/* harmony import */ var _jquery_djangoformset__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./jquery.djangoformset */ "./nested_admin/static/nested_admin/src/nested-admin/jquery.djangoformset.js");






_utils__WEBPACK_IMPORTED_MODULE_4__["default"].DjangoFormset = _jquery_djangoformset__WEBPACK_IMPORTED_MODULE_5__["default"];
(0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(document).ready(function () {
  // Remove the border on any empty fieldsets
  (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])("fieldset.grp-module, fieldset.module").filter(function (i, element) {
    return element.childNodes.length == 0;
  }).css("border-width", "0"); // Set predelete class on any form elements with the DELETE input checked.
  // These can occur on forms rendered after a validation error.

  (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])('input[name$="-DELETE"]:checked').not('[name*="__prefix__"]').closest(".djn-inline-form").addClass("grp-predelete");
  (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(document).on("djnesting:initialized djnesting:mutate", function onMutate(e, $inline) {
    var $items = $inline.find("> .djn-items, > .tabular > .module > .djn-items");
    var $rows = $items.children(".djn-tbody");
    $rows.removeClass("row1 row2");
    $rows.each(function (i, row) {
      var n = 1 + i % 2;
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(row).addClass("row" + n);
    });
  }); // Register the nested formset on top level djnesting-stacked elements.
  // It will handle recursing down the nested inlines.

  (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(".djn-group-root").each(function (i, rootGroup) {
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(rootGroup).djangoFormset();
  });
  (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])("form").on("submit.djnesting", function (e) {
    (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(".djn-group").each(function () {
      _utils__WEBPACK_IMPORTED_MODULE_4__["default"].updatePositions((0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this).djangoFormsetPrefix());
      (0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(document).trigger("djnesting:mutate", [(0,_jquery_shim_js__WEBPACK_IMPORTED_MODULE_2__["default"])(this).djangoFormset().$inline]);
    });
  });
});
/* harmony default export */ __webpack_exports__["default"] = (_utils__WEBPACK_IMPORTED_MODULE_4__["default"]);
}();
window.DJNesting = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=nested_admin.js.map