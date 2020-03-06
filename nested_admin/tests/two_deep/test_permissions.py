from unittest import SkipTest

import django
from django.contrib.auth import get_permission_codename
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import StackedGroup, StackedSection, StackedItem


def get_perm(Model, perm):
    """Return the permission object, for the Model"""
    ct = ContentType.objects.get_for_model(Model)
    return Permission.objects.get(content_type=ct, codename=perm)


class SeleniumTestInlinePermissions(BaseNestedAdminTestCase):

    root_model = StackedGroup
    nested_models = (StackedSection, StackedItem)

    auto_login = False

    @classmethod
    def setUpClass(cls):
        if django.VERSION < (2, 1):
            raise SkipTest("View permissions not available before django 2.1")

        super(SeleniumTestInlinePermissions, cls).setUpClass()
        cls.section_cls, cls.item_cls = cls.nested_models

    def setUp(self):
        super(SeleniumTestInlinePermissions, self).setUp()
        self.group = StackedGroup.objects.create(pk=1, slug='group')
        self.section_a = StackedSection.objects.create(
            pk=1, slug='a', group=self.group, position=0)
        self.section_b = StackedSection.objects.create(
            pk=2, slug='b', group=self.group, position=1)
        self.item_a0 = StackedItem.objects.create(
            pk=1, name='A 0', section=self.section_a, position=0)
        self.item_b0 = StackedItem.objects.create(
            pk=2, name='B 0', section=self.section_b, position=0)

        self.user = User.objects.create_user(
            username='permissionuser', password='secret',
            email='vuser@example.com', is_staff=True)

        for model_cls in [StackedGroup, StackedSection, StackedItem]:
            self.user.user_permissions.add(
                get_perm(model_cls, get_permission_codename('view', model_cls._meta)))

        self.admin_login('permissionuser', 'secret')

    def test_view_permissions_readonly_fields(self):
        self.load_admin(self.group)
        if self.has_grappelli:
            readonly_xpath = '//div[@class="grp-readonly" and text()="B 0"]'
        else:
            readonly_xpath = '//p[text()="B 0"]'
        self.wait_until_xpath(readonly_xpath)

    def wait_until_xpath(self, xpath):
        def element_is_present(d):
            return d.execute_script(
                """return !!document.evaluate(
                    'count(' + arguments[0] + ')', document).numberValue""",
                xpath)

        self.wait_until(element_is_present,
            message="Timeout waiting for element with xpath %s" % xpath)
