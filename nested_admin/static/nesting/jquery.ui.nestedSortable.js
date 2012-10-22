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

	var createChildNestedSortable = function(parent, childContainer) {
		var $childContainer = $(childContainer);
		var options = $.extend({}, parent.options);
		options.connectWith = [parent.element];
		var widgetConstructor = $childContainer[parent.widgetName];
		widgetConstructor.call($childContainer, options);
		var newInstance = $childContainer.data(parent.widgetName);
		for (var i = 0; i < parent.options.connectWith.length; i++) {
			var $otherContainer = parent.options.connectWith[i];
			newInstance.options.connectWith.push($otherContainer);
			var otherInstance = $otherContainer.data(parent.widgetName);
			otherInstance.options.connectWith.push($childContainer);
		}
		parent.options.connectWith.push($childContainer);
	};

	$.widget("ui.nestedSortable", $.ui.sortable, {

		options: {
			tabSize: 20,
			disableNesting: 'ui-nestedSortable-no-nesting',
			errorClass: 'ui-nestedSortable-error',
			// Whether to clear empty list item and container elements
			doNotClear: false,
			/**
			 * Create a list container element if the draggable was dragged
			 * to the top or bottom of the elements at its level.
			 *
			 * @param DOMElement parent - The element relative to which the
			 *      new element will be inserted.
			 * @param string insertType - Either append or prepend. If append,
			 *      will perform an appendChild on the new element. If prepend,
			 *      will be inserted before parent.firstChild.
			 * @return DOMElement - The new element.
			 */
			createContainerElement: function(parent, insertType) {
				return document.createElement('ol');
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
			maintainNestingLevel: false,
			// show the error div or just not show a drop area
			showErrorDiv: true,
			// if true only allows you to rearrange within its parent container
			keepInParent: false,
			isAllowed: function(item, parent) { return true; },
			canConnectWith: function(container1, container2, instance) {
				if (!instance.options.maintainNestingLevel) {
					return true;
				}
				var container1Level = instance._getLevel(container1);
				var container2Level = instance._getLevel(container2);
				return (container1Level === container2Level);
			}
		},

		_create: function() {
			this.element.data('sortable', this.element.data('nestedSortable'));
			// if (!this.element.is(this.options.containerElementSelector)) {
			//  throw new Error('nestedSortable: Please check that the ' +
			//                  'containerElementSelector option matches ' +
			//                  'the element passed to the constructor.');
			//             }

			$.ui.sortable.prototype._create.apply(this, arguments);
			this.element.trigger('nestedSortable:created');

			if (!this.options.connectWith) {
				this.options.connectWith = [];
				var self = this, o = this.options;
				this.element.on('djnesting:init', o.containerElementSelector, function(event) {
					createChildNestedSortable(self, this);
				});
				this.element.find(o.containerElementSelector).each(function(i, el) {
					createChildNestedSortable(self, el);
				});
			}
		},

		destroy: function() {
			this.element
				.removeData("nestedSortable")
				.unbind(".nestedSortable");
			return $.ui.sortable.prototype.destroy.apply(this, arguments);
		},

		/**
		 * Override this method to add extra conditions on an item before it's
		 * rearranged.
		 */
		_intersectsWithPointer: function(item) {
			var itemElement = item.item[0], o = this.options,
				intersection = $.ui.sortable.prototype._intersectsWithPointer.apply(this, arguments);

			this.lastItemElement = null;

			if (!intersection) {
				return false;
			}
		
			// Only put the placeholder inside the current Container, skip all
			// items form other containers. This works because when moving
			// an item from one container to another the
			// currentContainer is switched before the placeholder is moved.
			//
			// Without this moving items in "sub-sortables" can cause the placeholder to jitter
			// between the outer and inner container.
			if (item.instance !== this.currentContainer) {
				return false;
			}
			var $itemElement = $(itemElement);

			if (o.maintainNestingLevel && this._getLevel(this.currentItem) === 1+this._getLevel($itemElement)) {
				$itemElement = (function() {
					var containerSel = o.containerElementSelector;
					var $childItems = $itemElement.find('.nested-sortable-item');
					if ($childItems.length != 1) {
						return $itemElement;
					}
					if (!$childItems.hasClass('nested-do-not-drag')) {
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
					return $($childItems[0]);
				})();
				itemElement = $itemElement[0];
			}

			if (itemElement != this.currentItem[0] //cannot intersect with itself
				&&  this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
				&&  !$.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
				&& (this.options.type == 'semi-dynamic' ? !$.contains(this.element[0], itemElement) : true)
				&& (!o.keepInParent || itemElement.parentNode == this.placeholder[0].parentNode) //only rearrange items within the same container
					&& (!o.maintainNestingLevel || (this._getLevel(this.currentItem) === this._getLevel($itemElement))) //maintain the nesting level of node
					&& (o.showErrorDiv || o.isAllowed.call(this, this.currentItem[0], itemElement.parentNode, this.placeholder))
			) {
				this.lastItemElement = itemElement;
				return true;
			} else {
				return false;
			}
		},

		// This method is called after items have been iterated through.
		// Overriding this is cleaner than copying and pasting _mouseDrag()
		// and inserting logic in the middle.
		_contactContainers: function(event) {
			if (this.lastItemElement) {
				this._clearEmpty(this.lastItemElement);
			}

			if (this.options.maintainNestingLevel) {
				return $.ui.sortable.prototype._contactContainers.apply(this, arguments);
			}

			var o = this.options,
			_parentItem = this.placeholder.closest(o.listItemSelector),
			parentItem = (_parentItem.length && _parentItem.closest('.ui-sortable').length)
					   ? _parentItem
					   : null,
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
			var previousItem = this.placeholder[0].previousSibling ? $(this.placeholder[0].previousSibling) : null;
			if (previousItem != null) {
				while (!previousItem.is(this.options.listItemSelector) || previousItem[0] == this.currentItem[0] || previousItem[0] == this.helper[0]) {
					if (previousItem[0].previousSibling) {
						previousItem = $(previousItem[0].previousSibling);
					} else {
						previousItem = null;
						break;
					}
				}
			}
			// To find the next sibling in the list, keep stepping forward until we hit a valid list item.
			var nextItem = this.placeholder[0].nextSibling ? $(this.placeholder[0].nextSibling) : null;
			if (nextItem != null) {
				while (!nextItem.is(this.options.listItemSelector) || nextItem[0] == this.currentItem[0] || nextItem[0] == this.helper[0]) {
					if (nextItem[0].nextSibling) {
						nextItem = $(nextItem[0].nextSibling);
					} else {
						nextItem = null;
						break;
					}
				}
			}

			this.beyondMaxLevels = 0;

			// If the item is moved to the left, send it to its parent's level unless there are siblings below it.
			if (!o.maintainNestingLevel && parentItem != null && nextItem == null &&
					(o.rtl && (this.positionAbs.left + this.helper.outerWidth() > parentItem.offset().left + parentItem.outerWidth()) ||
					!o.rtl && (this.positionAbs.left < parentItem.offset().left))) {
				parentItem.after(this.placeholder[0]);
				this._clearEmpty(parentItem[0]);
				this._trigger("change", event, this._uiHash());
			}
			// If the item is below a sibling and is moved to the right, make it a child of that sibling.
			else if (!o.maintainNestingLevel && previousItem != null &&
						(o.rtl && (this.positionAbs.left + this.helper.outerWidth() < previousItem.offset().left + previousItem.outerWidth() - o.tabSize) ||
						!o.rtl && (this.positionAbs.left > previousItem.offset().left + o.tabSize))) {
				this._isAllowed(previousItem, level, level+childLevels+1);
				var placeholderInsertParent, $previousItemChildContainers, insertType;
				$previousItemChildContainers = previousItem.children(o.containerElementSelector);
				// If this item is being moved from the top, add it to the top of the list.
				if (this.previousTopOffset && (this.previousTopOffset <= previousItem.offset().top)) {
					insertType = 'prepend';
				}
				// Otherwise, add it to the bottom of the list.
				else {
					insertType = 'append';
				}
				if (!$previousItemChildContainers.length) {
					placeholderInsertParent = this.options.createContainerElement(previousItem[0], insertType);
					placeholderInsertParent.appendChild(this.placeholder[0]);
					previousItem[0].appendChild(placeholderInsertParent);
				} else {
					if (insertType == 'prepend') {
						$previousItemChildContainers.first().prepend(this.placeholder);
					} else {
						$previousItemChildContainers[0].appendChild(this.placeholder[0]);
					}
				}
				this._trigger("change", event, this._uiHash());
			}
			else {
				this._isAllowed(parentItem, level, level+childLevels);
			}

			// apply/return super method
			return $.ui.sortable.prototype._contactContainers.apply(this, arguments);
		},

		_rearrange: function(event, item) {
			// Cache the rearranged element for the call to _clear()
			if (item && typeof item == 'object' && item.item) {
				this.lastRearrangedElement = item.item[0];
			}
			$.ui.sortable.prototype._rearrange.apply(this, arguments);
		},

		_convertPositionTo: function(d, pos) {
			// Cache the top offset before rearrangement
			this.previousTopOffset = this.placeholder.offset().top;
			return $.ui.sortable.prototype._convertPositionTo.apply(this, arguments);
		},

		_clear: function() {
			$.ui.sortable.prototype._clear.apply(this, arguments);
			// If lastRearrangedElement exists and is still attached to the document
			// (i.e., hasn't been removed)
			if (typeof this.lastRearrangedElement == 'object' && this.lastRearrangedElement.ownerDocument) {
				this._clearEmpty(this.lastRearrangedElement);
			}
		},

		_mouseStop: function(event, noPropagation) {
			// If the item is in a position not allowed, send it back
			if (this.beyondMaxLevels) {
				this.placeholder.removeClass(this.options.errorClass);

				if (this.domPosition.prev) {
					$(this.domPosition.prev).after(this.placeholder);
				} else {
					$(this.domPosition.parent).prepend(this.placeholder);
				}
				this._trigger("revert", event, this._uiHash());

			}

			// Clean last empty container/list item
			for (var i = this.items.length - 1; i >= 0; i--) {
				var item = this.items[i].item[0];
				this._clearEmpty(item);
			}

			$.ui.sortable.prototype._mouseStop.apply(this, arguments);
		},

		toArray: function(o) {

			o = $.extend(true, {}, this.options, o || {});
		
			var sDepth = o.startDepthCount || 0,
				ret = [],
				left = 2;

			ret.push({
				"item_id": o.rootID,
				"parent_id": 'none',
				"depth": sDepth,
				"left": '1',
				"right": ($(o.listItemSelector, this.element).length + 1) * 2
			});

			var _recursiveArray = function(item, depth, left) {
				var right = left + 1,
					id,
					pid;

				var $childItems = $(item).children(o.containerElementSelector).find(o.items);

				if ($childItems.length > 0) {
					depth ++;
					$childItems.each(function () {
						right = _recursiveArray($(this), depth, right);
					});
					depth --;
				}

				id = ($(item).attr(o.attribute || 'id')).match(o.expression || (/(.+)[-=_](.+)/));

				if (depth === sDepth + 1) {
					pid = o.rootID;
				} else {
					var parentItem = ($(item).parent(o.containerElementSelector)
						.parent(o.items)
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
		},

		_clearEmpty: function(item) {
			if (this.options.doNotClear) {
				return;
			}
			var $item = $(item);
			var childContainers = $item.children(this.options.containerElementSelector);
			childContainers.each(function(i, childContainer) {
				var $childContainer = $(childContainer);
				if (!$childContainer.children().length) {
					$childContainer.remove();
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
				while (list && list.length > 0 && !list.parent().is('.djnesting-stacked-root')) {
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

		_isAllowed: function(parentItem, level, levels) {
			var o = this.options,
				isRoot = $(this.domPosition.parent).hasClass('ui-sortable') ? true : false;
			// this takes into account the maxLevels set to the recipient list
			// var maxLevels = this.placeholder.closest('.ui-sortable').nestedSortable('option', 'maxLevels');
			var maxLevels = o.maxLevels;

			// Is the root protected?
			// Are we trying to nest under a no-nest?
			// Are we nesting too deep?
			if (!o.isAllowed.call(this, this.currentItem[0], parentItem, this.placeholder) ||
				parentItem && parentItem.hasClass(o.disableNesting) ||
				o.protectRoot && (parentItem == null && !isRoot || isRoot && level > 1)) {
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

		_connectWith: function() {
			var origConnectWith = $.ui.sortable.prototype._connectWith.apply(this, arguments),
				connectWith = [];
			var self = this;
			for (var i = 0; i < origConnectWith.length; i++) {
				var $elements = $(origConnectWith[i]);
				$elements.each(function(i, el) {
					if (el == self.element) {
						return;
					}
					if (!self.options.canConnectWith(self.element, $(el), self)) {
						return;
					}
					connectWith.push(el);
				});
			}
			return connectWith;
		},

		// _removeCurrentsFromItems: function() {
		//	var list = this.currentItem.find(":data(sortable-item)");
		//	for (var i=0; i < this.items.length; i++) {
		//		for (var j=0; j < list.length; j++) {
		//			if (list[j] == this.items[i].item[0]) {
		//				this.items.splice(i, 1);
		//				if (i >= this.items.length) {
		//					break;
		//				}
		//			}
		//		}
		//	}
		// },

		createContainerElement: function(parent, insertType) {
			if (!parent.childNodes) {
				throw new Error("Invalid element 'parent' passed to " +
				                "createContainerElement.");
			}
			var newContainer = this.options.createContainerElement.apply(this, arguments);
			if (insertType == 'prepend' && parent.firstChild) {
				parent.insertBefore(newContainer, parent.firstChild);
			} else {
				parent.appendChild(newContainer);
			}
			return newContainer;
		}

	});

	$.ui.nestedSortable.prototype.options = $.extend({}, $.ui.sortable.prototype.options, $.ui.nestedSortable.prototype.options);
})(((typeof grp == 'object' && grp.jQuery)
        ? grp.jQuery : (
            (typeof django == 'object' && django.jQuery)
                ? django.jQuery : jQuery)));
