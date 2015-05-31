var DJNesting = (typeof window.DJNesting != "undefined")
               ? DJNesting : {};

(function($) {

    // Backport jQuery.fn.data and jQuery.fn.on/off for jQuery 1.4.2,
    // which ships with Django 1.4
    if ($.prototype.jquery == '1.4.2') {
        var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
            rdashAlpha = /-([\da-z])/gi,
            rmultiDash = /([A-Z])/g,
            // Used by jQuery.camelCase as callback to replace()
            fcamelCase = function( all, letter ) {
                 return letter.toUpperCase();
             };
        $.camelCase = function(string) {
            return string.replace(rdashAlpha, fcamelCase);
        };
        $.prototype.data = (function (originalDataMethod) {
            // the parse value function is copied from the jQuery source
             function parseValue(data) {
                 if (typeof data === "string") {
                     try {
                         data = data === "true" ? true :
                             data === "false" ? false :
                             data === "null" ? null :
                             // Only convert to a number if it doesn't change the string
                             +data + "" === data ? +data :
                             rbrace.test(data) ? $.parseJSON(data) : data;
                     } catch (e) {}
                 } else {
                     data = undefined;
                 }
                 return data;
             }

             return function(key, val) {
                 var data;
                 if (typeof key === "undefined") {
                     if (this.length) {
                         data = $.data(this[0]);
                         if (this[0].nodeType === 1) {
                             var attr = this[0].attributes, name;
                             for (var i = 0, l = attr.length; i < l; i++) {
                                 name = attr[i].name;
                                 if (name.indexOf("data-") === 0) {
                                     name = $.camelCase(name.substring(5));
                                     var value = parseValue(attr[i].value);
                                     $(this[0]).data(name, value);
                                     data[name] = value;
                                 }
                             }
                         }
                     }
                     return data;
                 }

                 var result = originalDataMethod.apply(this, arguments);

                 // only when it's an getter and the result from the original data method is null
                 if ((result === null || result === undefined) && val === undefined) {
                     var attrValue = this.attr("data-" + key.replace(rmultiDash, "-$1").toLowerCase());
                     return parseValue(attrValue);
                 }
                 return result;
             };
        })($.prototype.data);

        /**
         * add support for on and off methods
         * @type {Function|*|on}
         */
        $.prototype.on = $.prototype.on || function(/* events [,selector] [,data], handler */) {
            var args = arguments;

            // delegation bind has minimal 3 arguments
            if(args.length >= 3) {
                var events = args[0],
                    selector = args[1],
                    data = (args[3]) ? args[2] : null,
                    handler = (args[3]) ? args[3] : args[2];

                this.bind(events, data, function(ev) {
                    var $target = $(ev.target).closest(selector);
                    if($target.length) {
                        handler.call($target[0], ev);
                    }
                });
            } else {
                this.bind.apply(this, args);
            }

            return this;
        };

        $.prototype.off = $.prototype.off || function(/* events [,selector] [,handler] */) {
            if(arguments.length == 3) {
                throw new Error("Delegated .off is not implemented.");
            } else {
                this.unbind.apply(this, arguments);
            }
            return this;
        };

        $.isNumeric = function(obj) { return !isNaN(parseFloat(obj)) && isFinite(obj); };
    }

    DJNesting.regexQuote = function(str) {
        return (str+'').replace(/([\.\?\*\+\^\$\[\]\\\(\)\{\}\|\-])/g, "\\$1");
    };

    /**
     * Update attributes based on a regular expression
     */
    DJNesting.updateFormAttributes = function(elem, replace_regex, replace_with, selector) {
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

    DJNesting.updatePositions = function(prefix, skipDeleted) {
        var position = 0,
            $group = $('#' + prefix + '-group'),
            fieldNames = $group.data('fieldNames'),
            // The field name on the fieldset which is a ForeignKey to the parent model
            groupFkName = $group.data('formsetFkName'),
            parentPkVal, parentIdMatches = prefix.match(/^(.*_set)\-(\d+)-[^\-]+_set$/);

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

        $group.find('.module.nested-inline-form').each(function() {
            if (!this.id || this.id.substr(-6) == '-empty') {
                return true; // Same as continue
            }
            var regex = new RegExp('^(?:id_)?' + DJNesting.regexQuote(prefix) + '\\d+$');

            if (!this.id.match(regex)) {
                return true;
            }
            // Cache jQuery object
            var $this = $(this),
                prefixAndIndex = $this.djangoPrefixIndex() || [null, null],
                formPrefix = prefixAndIndex[0],
                index = prefixAndIndex[1];
            if (!formPrefix) {
                return;
            }

            // Skip the element if it's marked to be deleted
            if (skipDeleted && ($this.hasClass('predelete') || $this.hasClass('grp-predelete'))) {
                $this.filterDjangoField(formPrefix, fieldNames.position, index).val('0').trigger('change');
            } else {
                $this.filterDjangoField(formPrefix, fieldNames.position, index).val(position).trigger('change');
                position++;
            }
        });
    };

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

    $.fn.djangoFormIndex = function() {
        var prefixIndex = this.djangoPrefixIndex();
        if (!prefixIndex || !prefixIndex[1]) {
            return null;
        }
        return parseInt(prefixIndex[1], 10);
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
            var sortedForms = $forms.toArray().sort(function(a, b) {
                return $(a).djangoFormIndex() - $(b).djangoFormIndex;
            });
            Array.prototype.push.apply(forms, sortedForms);
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

    DJNesting.createContainerElement = function(parent) {
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
    DJNesting.initRelatedFields = function(prefix, groupData) {
        if (typeof DJNesting.LOOKUP_URLS != 'object' || !DJNesting.LOOKUP_URLS.related) {
            return;
        }
        var lookup_urls = DJNesting.LOOKUP_URLS;

        if (!groupData) {
            groupData = $('#' + prefix + '-group').data();
        }
        var lookup_fields = {
            related_fk:       groupData.lookupRelatedFk,
            related_m2m:      groupData.lookupRelatedM2m,
            related_generic:  groupData.lookupRelatedGeneric,
            autocomplete_fk:  groupData.lookupAutocompleteFk,
            autocomplete_m2m: groupData.lookupAutocompleteM2m,
            autocomplete_generic: groupData.lookupAutocompleteGeneric
        };

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
    DJNesting.initAutocompleteFields = function(prefix, groupData) {
        if (typeof DJNesting.LOOKUP_URLS != 'object' || !DJNesting.LOOKUP_URLS.related) {
            return;
        }
        var lookup_urls = DJNesting.LOOKUP_URLS;

        var $inline = $('#' + prefix + '-group');

        if (!groupData) {
            groupData = $inline.data();
        }
        var lookup_fields = {
            related_fk:       groupData.lookupRelatedFk,
            related_m2m:      groupData.lookupRelatedM2m,
            related_generic:  groupData.lookupRelatedGeneric,
            autocomplete_fk:  groupData.lookupAutocompleteFk,
            autocomplete_m2m: groupData.lookupAutocompleteM2m,
            autocomplete_generic: groupData.lookupAutocompleteGeneric
        };

        $.each(lookup_fields.autocomplete_fk, function() {
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find("input[name^='" + prefix + "'][name$='" + this + "']")
            .each(function() {
                $(this).grp_autocomplete_fk({
                    lookup_url: lookup_urls.related,
                    autocomplete_lookup_url: lookup_urls.autocomplete
                });
            });
        });
        $.each(lookup_fields.autocomplete_m2m, function() {
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find("input[name^='" + prefix + "'][name$='" + this + "']")
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
            $('#' + prefix + '-group > div.items > div:not(.empty-form)')
            .find("input[name^='" + prefix + "'][name$='" + this[1] + "']")
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

    // This function will update the position prefix for empty-form elements
    // in nested forms.
    DJNesting.updateNestedFormIndex = function updateNestedFormIndex(form, prefix) {
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

})((typeof grp == 'object' && grp.jQuery) ? grp.jQuery : django.jQuery);
