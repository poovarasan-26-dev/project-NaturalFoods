from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.LoginView.as_view(), name="dash_login"),
    path("logout/", views.logout_view, name="dash_logout"),

    path("", views.dash_home, name="dash_home"),

    path("products/", views.ProductListView.as_view(), name="dash_products"),
    path("products/add/", views.ProductCreateView.as_view(), name="dash_product_add"),
    path("products/<int:pk>/edit/", views.ProductUpdateView.as_view(), name="dash_product_edit"),
    path("products/<int:pk>/delete/", views.ProductDeleteView.as_view(), name="dash_product_delete"),

    path("categories/add/", views.CategoryCreateView.as_view(), name="dash_category_add"),
    path("categories/<int:pk>/delete/", views.CategoryDeleteView.as_view(), name="dash_category_delete"),

    path("orders/", views.OrderListView.as_view(), name="dash_orders"),
    path("orders/<int:pk>/", views.OrderDetailView.as_view(), name="dash_order_detail"),
    path("orders/<int:pk>/update/", views.OrderUpdateView.as_view(), name="dash_order_update"),
    path("orders/<int:pk>/delete/", views.OrderDeleteView.as_view(), name="dash_order_delete"),

    path("customers/", views.CustomerListView.as_view(), name="dash_customers"),
    path("customers/add/", views.CustomerCreateView.as_view(), name="dash_customer_add"),
    path("customers/<int:pk>/edit/", views.CustomerUpdateView.as_view(), name="dash_customer_edit"),
    path("customers/<int:pk>/delete/", views.CustomerDeleteView.as_view(), name="dash_customer_delete"),

    path("messages/", views.MessageListView.as_view(), name="dash_messages"),
    path("messages/<int:pk>/", views.MessageDetailView.as_view(), name="dash_message_detail"),
    path("messages/<int:pk>/delete/", views.MessageDeleteView.as_view(), name="dash_message_delete"),
    path("messages/mark-all-read/", views.MarkAllMessagesReadView.as_view(), name="dash_messages_mark_all"),

    path("notifications/", views.NotificationListView.as_view(), name="dash_notifications"),
    path("notifications/<int:pk>/read/", views.MarkNotificationReadView.as_view(), name="dash_notification_read"),
    path("notifications/mark-all-read/", views.MarkAllNotificationsReadView.as_view(), name="dash_notifications_mark_all"),

    path("profile/", views.ProfileView.as_view(), name="dash_profile"),
    path("settings/", views.SettingsView.as_view(), name="dash_settings"),

    path("api/unread-counts/", views.api_unread_counts, name="dash_api_unread"),
    path("api/recent-messages/", views.api_recent_messages, name="dash_api_messages"),
    path("api/recent-notifications/", views.api_recent_notifications, name="dash_api_notifications"),
]
