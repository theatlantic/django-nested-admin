from unittest import SkipTest

import django
from django.contrib.auth import get_permission_codename
from django.contrib.auth.models import Permission, User
from django.contrib.contenttypes.models import ContentType

from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import (
    CuratedGroupCollection,
    CuratedGroup, CuratedList, CuratedItem)


def get_perm(Model, perm):
    """Return the permission object, for the Model"""
    ct = ContentType.objects.get_for_model(Model)
    return Permission.objects.get(content_type=ct, codename=perm)


class TestMixedPermissionsMinNumBug(BaseNestedAdminTestCase):

    root_model = CuratedGroupCollection
    nested_models = (CuratedGroup, CuratedList, CuratedItem)

    auto_login = False

    @classmethod
    def setUpClass(cls):
        super(TestMixedPermissionsMinNumBug, cls).setUpClass()
        cls.models = (cls.root_model,) + tuple(cls.nested_models)

    def setUp(self):
        super(TestMixedPermissionsMinNumBug, self).setUp()
        self.collection = CuratedGroupCollection.objects.create(
            slug='site-nav', name='Site Nav')
        lists = []
        for i, group_name in enumerate(('Sections', 'Magazine', 'More')):
            group = CuratedGroup.objects.create(
                name=group_name,
                slug=group_name.lower(),
                collection=self.collection,
                position=i)
            lists.append(
                CuratedList.objects.create(group=group, position=0))

        section_labels = [
            ('Politics', 'Culture', 'Podcasts'),
            ('Current Issue', 'All Issues', 'Subscribe'),
            ('Newsletters', 'Events'),
        ]

        for list_obj, sections in zip(lists, section_labels):
            for i, section in enumerate(sections):
                CuratedItem.objects.create(
                    parent=list_obj, position=i, name=section)

        self.user = User.objects.create_user(
            username='permissionuser', password='secret',
            email='vuser@example.com', is_staff=True)

        models = (self.root_model,) + tuple(self.nested_models)
        for model_cls in models:
            self.user.user_permissions.add(
                get_perm(model_cls, get_permission_codename('change', model_cls._meta)))

        for model_cls in (CuratedList, CuratedItem):
            self.user.user_permissions.add(
                get_perm(model_cls, get_permission_codename('add', model_cls._meta)))
            self.user.user_permissions.add(
                get_perm(model_cls, get_permission_codename('delete', model_cls._meta)))

        self.admin_login('permissionuser', 'secret')

    def test_mixed_no_top_level_add_permissions_save(self):
        self.load_admin(self.collection)
        self.set_field('name', 'Politics!', [0, 0, 0])
        self.save_form()

        item = CuratedItem.objects.get(
            parent__group__position=0,
            parent__position=0,
            position=0)

        self.assertEqual(item.name, "Politics!", "Item name did not update")
