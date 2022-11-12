# from unittest import SkipTest

# from django.conf import settings

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import MenuItem


class TestRecursiveNesting(BaseNestedAdminTestCase):

    root_model = MenuItem
    nested_models = (MenuItem, MenuItem)

    def test_max_num_nested_add_handlers_hide(self):
        self.load_admin(self.root_model)
        level1_add_handler = self.selenium.execute_script(
            """
            return django.jQuery(
                '.djn-add-handler.djn-model-nested_recursive-menuitem.djn-level-1'
            )[0]"""
        )
        level2_add_handler = self.selenium.execute_script(
            """
            return django.jQuery(
                '.djn-add-handler.djn-model-nested_recursive-menuitem.djn-level-2'
            )[0]"""
        )
        self.add_inline()
        self.wait_until_element_is(
            level1_add_handler,
            ":not(:visible)",
            "handler did not hide after max_num reached",
        )
        assert (
            level2_add_handler.is_displayed() is True
        ), "level2 add handler should not be hidden"
        self.remove_inline([0])
        self.wait_until_element_is(
            level1_add_handler,
            ":visible",
            "handler did not unhide after max_num inline removed",
        )
