/*
 * jQuery UI Nested Sortable
 * v 1.3.4 / 28 apr 2011
 * http://mjsarfatti.com/sandbox/nestedSortable
 *
 * Depends:
 *	jquery.ui.sortable.js 1.8+
 *
 * License CC BY-SA 3.0
 * Copyright 2010-2011, Manuele J Sarfatti
 */
(function($) {

	$.widget("ui.nestedSortable", $.extend({}, $.ui.sortable.prototype, {

		options: {
			tabSize: 20,
			disableNesting: 'ui-nestedSortable-no-nesting',
			errorClass: 'ui-nestedSortable-error',
			createContainerElement: function(parent) {
				newList = document.createElement('ol');
				parent.appendChild(newList);
				return newList;
			},
			containerElementSelector: 'ol',
			listItemSelector: 'li',
			maxLevels: 0,
			revertOnError: 1
		},

		_create: function() {
			this.element.data('sortable', this.element.data('nestedSortable'));
			return $.ui.sortable.prototype._create.apply(this, arguments);
		},

		destroy: function() {
			this.element
				.removeData("nestedSortable")
				.unbind(".nestedSortable");
			return $.ui.sortable.prototype.destroy.apply(this, arguments);
		},

		_rearrange: function(event, item) {
			// Cache the rearranged element for the call to _clear()
			this.lastRearrangedElement = item.item[0];
			$.ui.sortable.prototype._rearrange.apply(this, arguments);
		},

		_clear: function() {
			$.ui.sortable.prototype._clear.apply(this, arguments);
			// If lastRearrangedElement exists and is still attached to the document
			// (i.e., hasn't been removed)
			if (typeof this.lastRearrangedElement == 'object' && this.lastRearrangedElement.ownerDocument) {
				this._clearEmpty(this.lastRearrangedElement);
			}
		},

		// This method is called after items have been iterated through.
		// Overriding this is cleaner than copying and pasting _mouseDrag()
		// and inserting logic in the middle.
		_contactContainers: function(event) {
			var o = this.options,
			_parentItem = this.placeholder.parent(o.listItemSelector),
			parentItem = (_parentItem.length && _parentItem.closest('.ui-sortable').length)
					   ? _parentItem
					   : null,
			level = this._getLevel(this.placeholder),
			childLevels = this._getChildLevels(this.helper),
			previousItem = this.placeholder[0].previousSibling ? $(this.placeholder[0].previousSibling) : null;

			if (level > 0) {
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

				if (previousItem != null) {
					while (!previousItem.is(this.options.listItemSelector) || previousItem[0] == this.currentItem[0]) {
						if (previousItem[0].previousSibling) {
							previousItem = $(previousItem[0].previousSibling);
						} else {
							previousItem = null;
							break;
						}
					}
				}
				this.beyondMaxLevels = 0;

				// If the item is moved to the left, send it to its parent level
				if (parentItem != null && this.positionAbs.left < parentItem.offset().left) {
					parentItem.after(this.placeholder[0]);
					this._clearEmpty(parentItem[0]);
					this._trigger("change", event, this._uiHash());
				}
				// If the item is below another one and is moved to the right, make it a children of it
				else if (previousItem != null && this.positionAbs.left > previousItem.offset().left + o.tabSize) {
					this._isAllowed(previousItem, level+childLevels+1);
					var placeholderInsertParent;
					var $previousItemChildContainers = previousItem.children(o.containerElementSelector);
					placeholderInsertParent = this.options.createContainerElement(previousItem[0]);
                    // if (!$previousItemChildContainers.length) {
                    //  placeholderInsertParent = this.options.createContainerElement(previousItem[0]);
                    // } else {
                    //  placeholderInsertParent = $previousItemChildContainers[0];
                    // }
					placeholderInsertParent.appendChild(this.placeholder[0]);
					this._trigger("change", event, this._uiHash());
				}
				else {
					this._isAllowed(parentItem, level+childLevels);
				}
			}

			// apply/return super method
			return $.ui.sortable.prototype._contactContainers.apply(this, arguments);
		},

		_mouseStop: function(event, noPropagation) {

			// If the item is in a position not allowed, send it back
			if (this.beyondMaxLevels) {

				this.placeholder.removeClass(this.options.errorClass);

				if (this.options.revertOnError) {
					if (this.domPosition.prev) {
						$(this.domPosition.prev).after(this.placeholder);
					} else {
						$(this.domPosition.parent).prepend(this.placeholder);
					}
					this._trigger("revert", event, this._uiHash());
				} else {
					var parent = this.placeholder.parent().closest(this.options.items);

					for (var i = this.beyondMaxLevels - 1; i > 0; i--) {
						parent = parent.parent().closest(this.options.items);
					}

					parent.after(this.placeholder);
					this._trigger("change", event, this._uiHash());
				}

			}

			// Clean last empty container/list item
			for (var i = this.items.length - 1; i >= 0; i--) {
				var item = this.items[i].item[0];
				this._clearEmpty(item);
			}

			$.ui.sortable.prototype._mouseStop.apply(this, arguments);

		},

		_clearEmpty: function(item) {
			var $item = $(item);
			var childContainers = $item.children(this.options.containerElementSelector);
			childContainers.each(function(i, childContainer) {
				if (!$(childContainer).children().length) {
					childContainer.parentNode.removeChild(childContainer);
				}
			});
			if (!$item.children().length) {
				$item.remove();
			}
		},

		_getLevel: function(item) {

			var level = 1;
			if (this.options.containerElementSelector) {
				var list = item.closest(this.options.containerElementSelector);
				if (!list.length) {
					return 0;
				}
				while (!list.is('.ui-sortable')) {
					level++;
					list = list.parent().closest(this.options.containerElementSelector);
				}
			}

			return level;
		},

		_getChildLevels: function(parent, depth) {
			var self = this,
			o = this.options,
			result = 0;
			depth = depth || 0;

			$(parent).children(o.containerElementSelector).children(o.items).each(function (index, child) {
				result = Math.max(self._getChildLevels(child, depth + 1), result);
			});

			return depth ? result + 1 : result;
		},

		_isAllowed: function(parentItem, levels) {
			var o = this.options;
			// Are we trying to nest under a no-nest or are we nesting too deep?
			if (parentItem == null || !(parentItem.hasClass(o.disableNesting))) {
				if (o.maxLevels < levels && o.maxLevels !== 0) {
					this.placeholder.addClass(o.errorClass);
					this.beyondMaxLevels = levels - o.maxLevels;
				} else {
					this.placeholder.removeClass(o.errorClass);
					this.beyondMaxLevels = 0;
				}
			} else {
				this.placeholder.addClass(o.errorClass);
				if (o.maxLevels < levels && o.maxLevels !== 0) {
					this.beyondMaxLevels = levels - o.maxLevels;
				} else {
					this.beyondMaxLevels = 1;
				}
			}
		},

		_removeCurrentsFromItems: function() {

			var list = this.currentItem.find(":data(sortable-item)");

			for (var i=0; i < this.items.length; i++) {

				for (var j=0; j < list.length; j++) {
					if(list[j] == this.items[i].item[0]) {
						this.items.splice(i,1);
						if (i >= this.items.length) {
							break;
						}
					}
				}

			}

		},

		toArray: function(o) {

			o = $.extend(true, {}, this.options, o || {});
		
			var sDepth = o.startDepthCount || 0,
				ret = [],
				left = 2;

			ret.push({
				"item_id": 'root',
				"parent_id": 'none',
				"depth": sDepth,
				"left": '1',
				"right": ($(o.listItemSelector, this.element).length + 1) * 2
			});

			var _recursiveArray = function(item, depth, left) {
				var right = left + 1,
					id,
					pid;

				if ($(item).children(o.containerElementSelector).children(o.listItemSelector).length > 0) {
					depth ++;
					$(item).children(o.containerElementSelector).children(o.listItemSelector).each(function () {
						right = _recursiveArray($(this), depth, right);
					});
					depth --;
				}

				id = ($(item).attr(o.attribute || 'id')).match(o.expression || (/(.+)[-=_](.+)/));

				if (depth === sDepth + 1) {
					pid = 'root';
				} else {
					var parentItem = ($(item).parent(o.containerElementSelector)
						.parent(o.listItemSelector)
						.attr(o.attribute || 'id'))
						.match(o.expression || (/(.+)[-=_](.+)/));
					pid = parentItem[2];
				}

				if (id) {
					ret.push({"item_id": id[2], "parent_id": pid, "depth": depth, "left": left, "right": right});
				}

				left = right + 1;
				return left;
			};

			$(this.element).children(o.listItemSelector).each(function () {
				left = _recursiveArray(this, sDepth + 1, left);
			});

			ret = ret.sort(function(a,b){ return (a.left - b.left); });

			return ret;
		}


	}));

	$.ui.nestedSortable.prototype.options = $.extend({}, $.ui.sortable.prototype.options, $.ui.nestedSortable.prototype.options);
})(((typeof grp == 'object' && grp.jQuery)
        ? grp.jQuery : (
            (typeof django == 'object' && django.jQuery)
                ? django.jQuery : jQuery)));
