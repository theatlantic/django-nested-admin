from unittest import SkipTest

import django
from django.contrib.auth import get_permission_codename
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType
from django.test import TestCase

try:
    from django.urls import reverse
except ImportError:
    from django.core.urlresolvers import reverse

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import StackedGroup, StackedSection, StackedItem


def get_perm(Model, perm):
    """Return the permission object, for the Model"""
    ct = ContentType.objects.get_for_model(Model)
    return Permission.objects.get(content_type=ct, codename=perm)


class TestInlinePermissions(TestCase):

    def setUp(self):
        if django.VERSION < (2, 1):
            raise SkipTest("View permissions not available before django 2.1")
        super(TestInlinePermissions, self).setUp()

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

        self.client.force_login(self.user)

        opts = StackedGroup._meta
        self.admin_url = reverse(
            'admin:%s_%s_change' % (opts.app_label, opts.model_name),
            args=(self.group.pk,))

        self.post_data = {
            "_continue": "Save and continue editing",
            "slug": "group",

            "section_set-TOTAL_FORMS": "2",
            "section_set-INITIAL_FORMS": "2",
            "section_set-MAX_NUM_FORMS": "1000",
            "section_set-MIN_NUM_FORMS": "0",

            "section_set-0-position": "0",
            "section_set-0-id": "1",
            "section_set-0-group": "1",
            "section_set-0-slug": "a",

            "section_set-0-item_set-TOTAL_FORMS": "2",
            "section_set-0-item_set-INITIAL_FORMS": "1",
            "section_set-0-item_set-MAX_NUM_FORMS": "1000",
            "section_set-0-item_set-MIN_NUM_FORMS": "0",

            "section_set-0-item_set-0-position": "0",
            "section_set-0-item_set-0-id": "1",
            "section_set-0-item_set-0-section": "1",
            "section_set-0-item_set-0-name": "A 0",
            "section_set-0-item_set-0-upload": "",

            "section_set-0-item_set-1-position": "",
            "section_set-0-item_set-1-id": "",
            "section_set-0-item_set-1-section": "1",
            "section_set-0-item_set-1-name": "",
            "section_set-0-item_set-1-upload": "",

            "section_set-1-position": "1",
            "section_set-1-id": "2",
            "section_set-1-group": "1",
            "section_set-1-slug": "b",

            "section_set-1-item_set-TOTAL_FORMS": "2",
            "section_set-1-item_set-INITIAL_FORMS": "1",
            "section_set-1-item_set-MAX_NUM_FORMS": "1000",
            "section_set-1-item_set-MIN_NUM_FORMS": "0",

            "section_set-1-item_set-0-position": "0",
            "section_set-1-item_set-0-id": "2",
            "section_set-1-item_set-0-section": "2",
            "section_set-1-item_set-0-name": "B 0",
            "section_set-1-item_set-0-upload": "",

            "section_set-1-item_set-1-position": "",
            "section_set-1-item_set-1-id": "",
            "section_set-1-item_set-1-section": "2",
            "section_set-1-item_set-1-name": "",
            "section_set-1-item_set-1-upload": "",
        }

    def test_view_permission_no_add(self):
        """With only view permission, a new inline cannot be added"""
        self.post_data['section_set-0-item_set-1-name'] = 'A 1'
        self.post_data['section_set-0-item_set-1-position'] = '1'
        response = self.client.post(self.admin_url, self.post_data)
        self.assertEqual(response.status_code, 302)
        items = StackedItem.objects.filter(section=self.section_a)
        self.assertEqual(items.count(), 1)
        self.assertEqual(items[0].name, 'A 0')

    def test_view_permission_no_change(self):
        """With only view permission, an inline cannot be changed"""
        self.post_data['section_set-0-item_set-0-name'] = 'A 0 changed'
        response = self.client.post(self.admin_url, self.post_data)
        self.assertEqual(response.status_code, 302)
        items = StackedItem.objects.filter(section=self.section_a)
        self.assertEqual(items.count(), 1)
        self.assertEqual(items[0].name, 'A 0')

    def test_add_permission(self):
        """With add permission, an inline can be added even if parent has only view perms"""
        self.user.user_permissions.add(
            get_perm(StackedItem, get_permission_codename('add', StackedItem._meta)))

        self.post_data['section_set-0-item_set-1-name'] = 'A 1'
        self.post_data['section_set-0-item_set-1-position'] = '1'
        response = self.client.post(self.admin_url, self.post_data)
        self.assertEqual(response.status_code, 302)
        items = StackedItem.objects.filter(section=self.section_a)
        self.assertEqual(items.count(), 2)
        self.assertEqual(items[1].name, 'A 1')

    def test_change_permission(self):
        """With change permission, an inline can be changed even if parent has only view perms"""
        self.user.user_permissions.add(
            get_perm(StackedItem, get_permission_codename('change', StackedItem._meta)))

        self.post_data['section_set-0-item_set-0-name'] = 'A 0 changed'
        response = self.client.post(self.admin_url, self.post_data)
        self.assertEqual(response.status_code, 302)
        items = StackedItem.objects.filter(section=self.section_a)
        self.assertEqual(items.count(), 1)
        self.assertEqual(items[0].name, 'A 0 changed')


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

    def test_add_permission(self):
        """With add permission, an inline can be added even if parent has only view perms"""
        self.user.user_permissions.add(
            get_perm(StackedItem, get_permission_codename('add', StackedItem._meta)))

        self.load_admin(self.group)

        has_save = self.selenium.execute_script('return !!$("[name=_save]").length')
        self.assertTrue(has_save)

        if self.has_grappelli:
            readonly_xpath = '//div[@class="grp-readonly" and text()="B 0"]'
        else:
            readonly_xpath = '//p[text()="B 0"]'

        self.wait_until_xpath(readonly_xpath)

        add_buttons = self.selenium.find_elements_by_css_selector(
            '#section_set-1-item_set-group .djn-add-handler.djn-model-two_deep-stackeditem')

        self.assertNotEqual(len(add_buttons), 0)

        add_buttons[0].click()

        with self.visible_selector('#id_section_set-1-item_set-1-name') as el:
            el.clear()
            el.send_keys('B 1')

        self.save_form()

        items = StackedItem.objects.filter(section=self.section_b)
        self.assertEqual(items.count(), 2)
        self.assertEqual(items[1].name, 'B 1')

    def test_change_permission(self):
        """With change permission, an inline can be changed even if parent has only view perms"""
        self.user.user_permissions.add(
            get_perm(StackedItem, get_permission_codename('change', StackedItem._meta)))

        self.load_admin(self.group)

        has_save = self.selenium.execute_script('return !!$("[name=_save]").length')
        self.assertTrue(has_save)

        with self.visible_selector('#id_section_set-1-item_set-0-name') as el:
            el.clear()
            el.send_keys('B 0 changed')

        self.save_form()

        items = StackedItem.objects.filter(section=self.section_b)
        self.assertEqual(items.count(), 1)
        self.assertEqual(items[0].name, 'B 0 changed')
