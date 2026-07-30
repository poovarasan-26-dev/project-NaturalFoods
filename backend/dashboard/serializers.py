from rest_framework import serializers
from .models import (
    Category, Product, Customer, Order, OrderItem,
    ContactMessage, Notification, Cart, CartItem
)


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "product_count"]

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source="category.name", read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "category", "category_name",
            "description", "price", "unit", "stock", "availability",
            "image", "image_url", "is_active", "created_at", "updated_at",
        ]

    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = [
            "id", "user", "full_name", "email", "phone",
            "address", "profile_image", "is_active", "created_at",
        ]


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "quantity", "price", "subtotal"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    customer_name = serializers.CharField(source="customer.full_name", read_only=True)

    class Meta:
        model = Order
        fields = [
            "id", "customer", "customer_name", "order_id", "total_amount",
            "status", "shipping_address", "notes", "items", "created_at",
        ]


class OrderCreateSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=300)
    email = serializers.EmailField()
    phone = serializers.CharField(max_length=20, required=False, default="")
    address = serializers.CharField()
    city = serializers.CharField(max_length=200)
    state = serializers.CharField(max_length=200)
    pincode = serializers.CharField(max_length=20)
    payment_method = serializers.CharField(max_length=50)
    items = serializers.ListField(child=serializers.DictField())

    def validate_items(self, value):
        if not value:
            raise serializers.ValidationError("At least one item is required.")
        for item in value:
            if "product_id" not in item or "quantity" not in item:
                raise serializers.ValidationError("Each item must have product_id and quantity.")
        return value


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ["id", "full_name", "email", "phone", "subject", "message", "created_at"]
        read_only_fields = ["id", "created_at"]


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "description", "notification_type", "is_read", "link", "created_at"]


class CartItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source="product.name", read_only=True)
    product_price = serializers.DecimalField(source="product.price", max_digits=10, decimal_places=2, read_only=True)
    product_image = serializers.SerializerMethodField()
    product_stock = serializers.IntegerField(source="product.stock", read_only=True)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id", "product", "product_name", "product_price",
            "product_image", "product_stock", "quantity", "subtotal",
        ]

    def get_product_image(self, obj):
        if obj.product.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.product.image.url)
            return obj.product.image.url
        return None


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = ["id", "items", "total", "item_count"]
