import re
import time

from selenium.webdriver.common.action_chains import ActionChains

from .utils import xpath_cls, xpath_item, is_integer, Position, Size, ElementRect


if not hasattr(__builtins__, "cmp"):

    def cmp(a, b):
        return (a > b) - (a < b)


def sign(x):
    return x and (1, -1)[x < 0]


class DragAndDropAction:
    def __init__(self, test_case, from_indexes, to_indexes):
        self.test_case = test_case
        self.selenium = test_case.selenium

        if len(from_indexes) > len(to_indexes):
            self.target_is_empty = True
        else:
            self.target_is_empty = False

        self.from_indexes = self.test_case._normalize_indexes(
            from_indexes, named_models=False
        )
        self.to_indexes = self.test_case._normalize_indexes(
            to_indexes, is_group=self.target_is_empty, named_models=False
        )

        num_inlines_indexes = self.test_case._normalize_indexes(
            to_indexes, is_group=self.target_is_empty, named_models=True
        )
        if not is_integer(num_inlines_indexes[-1]):
            num_inlines_indexes[-1] = num_inlines_indexes[-1][0]
        self.target_num_items = self.test_case.get_num_inlines(num_inlines_indexes)

        if is_integer(self.to_indexes[-1]):
            self.to_indexes[-1] = [self.to_indexes[-1], 0]
        self.to_indexes = [tuple(i) for i in self.to_indexes]

        inline_models = self.test_case.models[1]
        for inline_index, item_index in self.to_indexes[:-1]:
            inline_models = inline_models[inline_index][1]
        self.target_num_inlines = len(inline_models)

        if self.from_indexes[:-1] == self.to_indexes[:-1]:
            if self.from_indexes[-1][1] < self.to_indexes[-1][1]:
                self.to_indexes[-1][1] += 1

        self.test_case.assertEqual(
            len(to_indexes),
            len(from_indexes),
            "Depth of source and target must be the same",
        )

    @property
    def viewport_size(self):
        if not hasattr(self, "_viewport_size"):
            dimensions = self.selenium.execute_script(
                """
                return {
                    width:  (window.innerWidth ||  document.documentElement.clientWidth),
                    height: (window.innerHeight || document.documentElement.clientHeight)
                }"""
            )
            self._viewport_size = Size(**dimensions)
        return self._viewport_size

    # def get_element_rect(self, element):
    #     return Rect()

    def get_mouse_position(self):
        pos_dict = self.selenium.execute_script(
            """
            return (function(m) {
                return m && {x: m.clientX, y: m.clientY};
            })(DJNesting.lastMouseMove)"""
        )
        return Position(**pos_dict)

    @property
    def source(self):
        if not hasattr(self, "_source"):
            source_item = self.test_case.get_item(indexes=self.from_indexes)
            if source_item.tag_name == "div":
                drag_handler_xpath = "h3"
            elif self.test_case.has_grappelli:
                drag_handler_xpath = "/".join(
                    [
                        "*[%s]" % xpath_cls("djn-tr"),
                        "*[%s]" % xpath_cls("djn-td"),
                        "*[%s]" % xpath_cls("tools"),
                        "/*[%s]" % xpath_cls("djn-drag-handler"),
                    ]
                )
            else:
                drag_handler_xpath = "/".join(
                    [
                        "*[%s]" % xpath_cls("djn-tr"),
                        "*[%s]" % xpath_cls("is-sortable"),
                        "*[%s]" % xpath_cls("djn-drag-handler"),
                    ]
                )
            self._source = source_item.find_element_by_xpath(drag_handler_xpath)
        return self._source

    @property
    def target(self):
        if not hasattr(self, "_target"):
            if len(self.to_indexes) > 1:
                target_inline_parent = self.test_case.get_item(self.to_indexes[:-1])
            else:
                target_inline_parent = self.selenium
            target_xpath = ".//*[%s][%d]//*[%s]" % (
                xpath_cls("djn-group"),
                self.to_indexes[-1][0] + 1,
                xpath_cls("djn-items"),
            )
            if self.target_num_items != self.to_indexes[-1][1]:
                target_xpath += "/*[%(item_pred)s][%(item_pos)d]" % {
                    "item_pred": xpath_item(),
                    "item_pos": self.to_indexes[-1][1] + 1,
                }
            self._target = target_inline_parent.find_element_by_xpath(target_xpath)
        return self._target

    def initialize_drag(self):
        source = self.source
        self.selenium.execute_script(
            """
            var el = arguments[0],
                top = el.getBoundingClientRect().top;
            if (top <= 15) {
                document.documentElement.scrollTop += (top - 16);
            } else {
                el.scrollIntoView();
            }
        """,
            source,
        )
        source.click()

        (
            ActionChains(self.selenium)
            .move_to_element_with_offset(source, 5, 5)
            .click_and_hold()
            .perform()
        )

        time.sleep(0.05)
        ActionChains(self.selenium).move_by_offset(0, -15).perform()
        time.sleep(0.05)
        ActionChains(self.selenium).move_by_offset(0, 15).perform()

        with self.test_case.visible_selector(".ui-sortable-helper") as el:
            return el

    def release(self):
        ActionChains(self.selenium).release().perform()

    def _match_helper_with_target(self, helper_element, target_element):
        ActionChains(self.selenium).move_by_offset(0, -15).perform()

        desired_pos = tuple(self.to_indexes)

        # True if aiming for the bottom of the target
        target_bottom = bool(
            0 < self.to_indexes[-1][1] == (self.target_num_items - 1)
            and self.to_indexes[-1][0] == (self.target_num_inlines - 1)
            and cmp(desired_pos[:-1], self.current_position[:-1]) > -1
        )

        helper = ElementRect(helper_element)
        target = ElementRect(
            target_element, aliases={"y": ("bottom" if target_bottom else "top")}
        )
        mouse_pos = self.get_mouse_position()

        viewport_height = self.viewport_size.height
        dy = target.y - helper.y
        inline_height = max(target.height, helper.height)
        increment = max(
            15, min(viewport_height // 3, (2 * inline_height) // 3, abs(dy) // 2)
        )

        max_iter = 50
        i = 0
        prev_pos_diff = None
        direction = None

        direction_flip = 1
        flip_count = 0
        flip_multiplier = max(2, inline_height // 18)

        while i < max_iter:
            curr_pos = self.current_position
            pos_diff = cmp(desired_pos, curr_pos)
            if pos_diff == 0:
                break
            if prev_pos_diff is None:
                prev_pos_diff = pos_diff
            elif pos_diff != prev_pos_diff:
                # We switched directions, lower the increment
                increment = min(increment, 15)
            prev_pos_diff = pos_diff
            if direction is None:
                direction = pos_diff
            target.refresh()
            helper.refresh()
            target_y = getattr(target, "bottom" if direction == 1 else "top")
            dy = target_y - helper.y
            if sign(dy) != sign(pos_diff) * direction_flip and abs(dy) > inline_height:
                flip_count += 1
                if flip_count > 3:
                    increment = 10
                elif flip_count > 5:
                    increment = 5
                else:
                    increment = max(abs(dy // 2), flip_count * flip_multiplier)
                direction_flip *= -1
            direction = pos_diff * direction_flip
            inc = increment * direction
            mouse_pos = self.get_mouse_position()
            mouse_edge_dy = (
                mouse_pos.y if direction < 0 else viewport_height - mouse_pos.y
            )
            if mouse_edge_dy <= abs(inc):
                self.selenium.execute_script(
                    "document.documentElement.scrollTop += arguments[0]",
                    inc + direction,
                )
                (ActionChains(self.selenium).move_by_offset(0, -direction).perform())
            else:
                ActionChains(self.selenium).move_by_offset(0, inc).perform()
            i += 1

        return helper_element

    def _num_preceding_siblings(self, ctx, condition):
        """
        For an unknown reason, evaluating XPath expressions of the form

            preceding-sibling::*[not(contains(@attr, 'value'))]

        Where 'value' is contained in at least one of the preceding siblings,
        is extraordinarily slow. So we just grab all siblings and iterate
        through the elements in python.
        """
        siblings = ctx.find_element_by_xpath("parent::*").find_elements_by_xpath("*")
        count = 0
        for el in siblings:
            if el.id == ctx.id:
                break
            if condition(el):
                count += 1
        return count

    def _num_preceding_djn_items(self, ctx):
        def is_djn_item(el):
            classes = set(re.split(r"\s+", el.get_attribute("class")))
            return classes & {"djn-item"} and not (
                classes & {"djn-no-drag", "djn-thead", "djn-item-dragging"}
            )

        return self._num_preceding_siblings(ctx, condition=is_djn_item)

    def _num_preceding_djn_groups(self, ctx):
        def is_djn_group(el):
            return "djn-group" in re.split(r"\s+", el.get_attribute("class"))

        return self._num_preceding_siblings(ctx, condition=is_djn_group)

    @property
    def current_position(self):
        placeholder = self.selenium.find_element_by_css_selector(
            ".ui-sortable-placeholder"
        )
        pos = []
        ctx = None
        ancestor_xpath = "ancestor::*[%s][1]" % xpath_cls("djn-item")
        for i in range(0, len(self.to_indexes)):
            if ctx is None:
                ctx = placeholder
            else:
                ctx = ctx.find_element_by_xpath(ancestor_xpath)
            item_index = self._num_preceding_djn_items(ctx)
            ctx = ctx.find_element_by_xpath(
                "ancestor::*[%s][1]" % xpath_cls("djn-group")
            )
            inline_index = self._num_preceding_djn_groups(ctx)
            pos.insert(0, (inline_index, item_index))
        return tuple(pos)

    def move_to_target(self, screenshot_hack=False):
        target = self.target
        helper = self.initialize_drag()
        if screenshot_hack and "phantomjs" in self.test_case.browser:
            # I don't know why, but saving a screenshot fixes a weird bug
            # in phantomjs
            self.selenium.save_screenshot("/dev/null")
        helper = self._match_helper_with_target(helper, target)
        self.release()
