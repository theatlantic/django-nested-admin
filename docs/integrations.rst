============
Integrations
============

django-polymorphic
==================

Quickstart
----------

Support for `django-polymorphic`_ is currently in beta. To use polymorphic
inlines with django-nested-admin follow the steps for
`setting up django-polymorphic admin inline integration`_. The instructions
are identical with django-nested-admin, except that the classes you would
normally import from ``polymorphic.admin`` should instead be imported from
``nested_admin`` and the classes themselves should be prefixed with
``Nested`` For example:

.. code-block:: python

    # Instead of these imports
    from django.contrib.admin import ModelAdmin
    from polymorphic.admin import (
        PolymorphicInlineSupportMixin, StackedPolymorphicInline)

    # One should import:
    from nested_admin import (
        NestedModelAdmin,
        NestedPolymorphicInlineSupportMixin, NestedStackedPolymorphicInline)

The polymorphic inlines used with django-nested-admin can have other inlines
nested inside them, or even other polymorphic inlines. The only requirement
is that all ModelAdmin and InlineAdmin classes inherit from the appropriate
nested version.

.. _django-polymorphic: https://django-polymorphic.readthedocs.io/en/stable/index.html
.. _setting up django-polymorphic admin inline integration: https://django-polymorphic.readthedocs.io/en/stable/admin.html#inline-models

Example
-------

.. code-block:: python

    from django.contrib import admin
    import nested_admin
    from .models import (
        Store, Customer, GuestCustomer, LoggedInCustomer, OrderItem, Product, WishListItem,
        Order, WishList, Payment, CreditCardPayment, BankPayment)

    class PaymentInline(nested_admin.NestedStackedPolymorphicInline):
        model = Payment
        class CreditCardPaymentInline(nested_admin.NestedStackedPolymorphicInline.Child):
            model = CreditCardPayment
        class BankPayment(nested_admin.NestedStackedPolymorphicInline.Child):
            model = BankPayment
        child_inlines = (CreditCardPaymentInline, BankPayment)

    class ProductInline(nested_admin.NestedStackedInline):
        model = Product

    class WishListItemInline(nested_admin.NestedStackedInline):
        model = WishListItem
        sortable_field_name = 'position'

    class WishListInline(nested_admin.NestedStackedInline):
        model = WishList
        inlines = [WishListItemInline]

    class OrderItemInline(nested_admin.NestedStackedInline):
        model = OrderItem

    class OrderInline(nested_admin.NestedTabularInline):
        model = Order
        inlines = [OrderItemInline, PaymentInline]

    class CustomerInline(nested_admin.NestedStackedPolymorphicInline):
        model = Customer
        inlines = [OrderInline]
        class GuestCustomerInline(nested_admin.NestedStackedPolymorphicInline.Child):
            model = GuestCustomer
        class LoggedInCustomerInline(nested_admin.NestedStackedPolymorphicInline.Child):
            model = LoggedInCustomer
            inlines = [WishListInline]
        child_inlines = (GuestCustomerInline, LoggedInCustomerInline)

    @admin.register(Store)
    class StoreAdmin(nested_admin.NestedPolymorphicModelAdmin):
        inlines = [CustomerInline]
