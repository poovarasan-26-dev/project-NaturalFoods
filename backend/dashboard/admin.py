from django.contrib import admin
from .models import (
    Category, Product, Customer, Order, OrderItem,
    ContactMessage, Notification, SiteSettings, AdminProfile,
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "created_at"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "price", "stock", "availability", "is_active"]
    list_filter = ["category", "availability", "is_active"]
    search_fields = ["name", "description"]


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "phone", "is_active", "created_at"]
    search_fields = ["full_name", "email"]
    list_filter = ["is_active"]


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_id", "customer", "total_amount", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["order_id", "customer__full_name"]
    inlines = [OrderItemInline]


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ["full_name", "email", "subject", "status", "created_at"]
    list_filter = ["status"]
    search_fields = ["full_name", "email", "subject"]


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ["title", "notification_type", "is_read", "created_at"]
    list_filter = ["notification_type", "is_read"]


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    list_display = ["site_name", "site_email", "site_phone"]


@admin.register(AdminProfile)
class AdminProfileAdmin(admin.ModelAdmin):
    list_display = ["full_name", "user", "phone"]
