from nested_admin.tests.base import BaseNestedAdminTestCase
from .models import Root, AX, AY, BX, BY


class TestIdenticalPrefixes(BaseNestedAdminTestCase):

    root_model = Root

    def test_add_to_empty_one_deep(self):
        root = self.root_model.objects.create(slug="test")
        AX.objects.create(foo="1", root=root, position=0)
        AY.objects.create(foo="2", root=root, position=0)

        self.load_admin(root)
        self.delete_inline([(1, 0)])
        self.save_form()
        ay_objs = AY.objects.all()
        self.assertEqual(len(ay_objs), 0, "AY inline was not deleted")

    def test_drag_and_drop(self):
        root = self.root_model.objects.create(slug="group")
        ax0 = AX.objects.create(foo="x0", root=root, position=0)
        ax1 = AX.objects.create(foo="x1", root=root, position=1)
        ay = AY.objects.create(foo="y0", root=root, position=0)

        BX.objects.create(bar="ax0bx0", a=ax0, position=0)
        BX.objects.create(bar="ax0bx1", a=ax0, position=1)
        BY.objects.create(bar="ax0by0", a=ax0, position=0)
        BY.objects.create(bar="ax0by1", a=ax0, position=1)
        BX.objects.create(bar="ax1bx0", a=ax1, position=0)
        BX.objects.create(bar="ax1bx1", a=ax1, position=1)
        BY.objects.create(bar="ax1by0", a=ax1, position=0)
        BY.objects.create(bar="ax1by1", a=ax1, position=1)
        BX.objects.create(bar="ay0bx0", a=ay, position=0)
        BX.objects.create(bar="ay0bx1", a=ay, position=1)
        BY.objects.create(bar="ay0by0", a=ay, position=0)
        BY.objects.create(bar="ay0by1", a=ay, position=1)

        self.load_admin(root)

        # Move 'ay0by0' to be the first inline in AX[0]/BY[0]
        self.drag_and_drop_item(
            from_indexes=[(1, 0), (1, 0)],
            to_indexes=[(0, 0), (1, 0)],
            screenshot_hack=True,
        )

        self.save_form()

        moved_item = BY.objects.get(bar="ay0by0")
        self.assertEqual(
            str(moved_item),
            "Root(group)/AX[0](x0)/BY[0](ay0by0)",
            "Item was not moved to the correct position",
        )
