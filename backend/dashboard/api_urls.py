from django.urls import path
from . import api_views

urlpatterns = [
    path("products/", api_views.ProductListView.as_view(), name="api-product-list"),
    path("products/<int:pk>/", api_views.ProductDetailView.as_view(), name="api-product-detail"),
    path("categories/", api_views.CategoryListView.as_view(), name="api-category-list"),
    path("contact/", api_views.ContactCreateView.as_view(), name="api-contact-create"),
    path("orders/", api_views.OrderListView.as_view(), name="api-order-list"),
    path("orders/create/", api_views.OrderCreateView.as_view(), name="api-order-create"),
    path("cart/", api_views.CartView.as_view(), name="api-cart"),
    path("cart/add/", api_views.CartAddView.as_view(), name="api-cart-add"),
    path("cart/item/<int:pk>/", api_views.CartItemUpdateView.as_view(), name="api-cart-item"),
    path("cart/clear/", api_views.cart_clear, name="api-cart-clear"),
    path("notifications/count/", api_views.notification_count, name="api-notification-count"),
]
