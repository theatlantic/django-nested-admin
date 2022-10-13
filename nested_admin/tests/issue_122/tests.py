from unittest import SkipTest

from django.conf import settings

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import Parent, Child1, Child2


class TestIssue122(BaseNestedAdminTestCase):

    root_model = Parent
    nested_models = (Child1, Child2)

    def test_grappelli_collapse_bug(self):
        """Deeply-nested grappelli collapsible inlines with min_num > 0 should expand"""
        if "grappelli" not in settings.INSTALLED_APPS:
            raise SkipTest("Only testing for grappelli")

        self.load_admin(self.root_model)
        self.add_inline()

        with self.visible_selector("#child1_set-1 > .djn-collapse-handler") as el:
            el.click()

        input_is_visible = self.selenium.execute_script(
            'return django.jQuery("#id_child1_set-1-name").is(":visible")'
        )
        self.assertTrue(input_is_visible)

        with self.visible_selector(
            "#child1_set-1-child2_set-0 > .djn-collapse-handler"
        ) as el:
            el.click()

        input_is_visible = self.selenium.execute_script(
            'return django.jQuery("#id_child1_set-1-child2_set-0-name").is(":visible")'
        )

        self.assertTrue(input_is_visible)

    def test_grappelli_duplicate_event_handler_registration(self):
        """Click handlers for grappelli collapse should only be registered once"""
        if "grappelli" not in settings.INSTALLED_APPS:
            raise SkipTest("Only testing for grappelli")

        # First repeat the steps in test_grappelli_collapse_bug
        self.test_grappelli_collapse_bug()
        self.add_inline()

        with self.visible_selector("#child1_set-2") as el:
            is_closed = self.selenium.execute_script(
                'return $(arguments[0]).is(".grp-closed")', el
            )
            self.assertTrue(
                is_closed, "New inlines should initiate with class grp-closed"
            )

        with self.visible_selector("#child1_set-2 > .djn-collapse-handler") as el:
            el.click()

        input_is_visible = self.selenium.execute_script(
            'return django.jQuery("#id_child1_set-2-name").is(":visible")'
        )
        self.assertTrue(input_is_visible)

        with self.visible_selector("#child1_set-2-child2_set-0") as el:
            is_closed = self.selenium.execute_script(
                'return $(arguments[0]).is(".grp-closed")', el
            )
            self.assertTrue(
                is_closed, "New inlines should initiate with class grp-closed"
            )
