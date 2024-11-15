from unittest import SkipTest

from django.conf import settings

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import User, Project, Document


class GrappelliCollapsibleTabularInlineTestCase(BaseNestedAdminTestCase):

    root_model = User
    nested_models = (Project, Document)

    def expand_collapsible(self, indexes, is_group=False):
        if is_group:
            inline = self.get_group(indexes)
        else:
            inline = self.get_item(indexes)
        inline_id = inline.get_attribute("id")
        with self.visible_selector("#%s" % inline_id) as el:
            is_closed = self.selenium.execute_script(
                'return $(arguments[0]).is(".grp-closed")', el
            )
            self.assertTrue(
                is_closed, "Cannot expand inline #%s, not currently closed" % inline_id
            )

        with self.visible_selector("#%s > .djn-collapse-handler" % inline_id) as el:
            el.click()

        self.wait_until_element_is(
            inline, ".grp-open", message="Collapsible #%s did not open" % inline_id
        )

        return inline

    def test_grappelli_tabular_collapse_bug(self):
        """Grappelli NestedTabularInline.classes grp-collapse should work"""
        if "grappelli" not in settings.INSTALLED_APPS:
            raise SkipTest("Only testing for grappelli")

        self.load_admin(self.root_model)
        self.set_field("name", "A")
        self.expand_collapsible([2])
        self.set_field("name", "B", [2])
        self.expand_collapsible([2], is_group=True)
        indexes = self.add_inline([2])
        self.set_field("name", "C", indexes)
        self.save_form()

        users = self.root_model.objects.all()

        self.assertEqual(1, len(users), "Form did not save")

        user = users[0]
        self.assertEqual(user.name, "A")

        projects = user.project_set.all()
        self.assertEqual(1, len(projects), "Project inline was not saved")
        project = projects[0]
        self.assertEqual(project.name, "B")

        documents = project.document_set.all()
        self.assertEqual(1, len(documents), "Document inline was not saved")
        self.assertEqual(documents[0].name, "C")
