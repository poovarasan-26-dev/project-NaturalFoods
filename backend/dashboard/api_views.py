from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.db.models import Q
from users.models import User
from .models import (
    Category, Product, Customer, Order, OrderItem,
    ContactMessage, Notification, Cart, CartItem
)
from .serializers import (
    CategorySerializer, ProductSerializer, OrderSerializer,
    OrderCreateSerializer, ContactMessageSerializer,
    NotificationSerializer, CartSerializer, CartItemSerializer,
)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related("category")
        search = self.request.query_params.get("search", "")
        category = self.request.query_params.get("category", "")
        if search:
            qs = qs.filter(
                Q(name__icontains=search) |
                Q(description__icontains=search) |
                Q(category__name__icontains=search)
            )
        if category:
            qs = qs.filter(category__slug=category)
        return qs


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]
    queryset = Product.objects.filter(is_active=True).select_related("category")


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]
    queryset = Category.objects.all()


class ContactCreateView(generics.CreateAPIView):
    serializer_class = ContactMessageSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        Notification.objects.create(
            title="New Contact Message",
            description=f"Message from {serializer.data['full_name']}: {serializer.data['subject']}",
            notification_type="message",
        )
        return Response(
            {"detail": "Thank you! Your message has been sent."},
            status=status.HTTP_201_CREATED,
        )


class OrderCreateView(generics.CreateAPIView):
    serializer_class = OrderCreateSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        user = request.user if request.user.is_authenticated else None
        if not user:
            try:
                user = User.objects.get(email=data["email"])
            except User.DoesNotExist:
                user = None

        customer, created = Customer.objects.get_or_create(
            email=data["email"],
            defaults={
                "user": user,
                "full_name": data["full_name"],
                "phone": data.get("phone", ""),
                "address": data.get("address", ""),
            },
        )
        if not created and user and not customer.user:
            customer.user = user
            customer.save()

        full_address = f"{data['address']}, {data['city']}, {data['state']} - {data['pincode']}"

        order = Order.objects.create(
            customer=customer,
            total_amount=0,
            shipping_address=full_address,
            notes=f"Payment: {data['payment_method']}",
        )

        total = 0
        for item_data in data["items"]:
            product = Product.objects.get(id=item_data["product_id"])
            quantity = item_data["quantity"]
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=product.price,
            )
            total += product.price * quantity
            product.stock = max(0, product.stock - quantity)
            product.save()

        order.total_amount = total
        order.save()

        Notification.objects.create(
            title="New Order Received",
            description=f"Order {order.order_id} placed by {data['full_name']} - Total: Rs. {total}",
            notification_type="order",
        )

        return Response(
            {"detail": "Order placed successfully.", "order_id": order.order_id},
            status=status.HTTP_201_CREATED,
        )


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        email = self.request.query_params.get("email", "")
        if email:
            return Order.objects.filter(customer__email=email).prefetch_related("items__product")
        return Order.objects.none()


@api_view(["GET"])
@permission_classes([AllowAny])
def notification_count(request):
    count = Notification.objects.filter(is_read=False, notification_type="order").count()
    return Response({"unread_count": count})


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return cart


class CartAddView(generics.CreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        cart, _ = Cart.objects.get_or_create(user=request.user)
        product_id = request.data.get("product_id")
        quantity = int(request.data.get("quantity", 1))

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            return Response({"detail": "Product not found."}, status=status.HTTP_404_NOT_FOUND)

        item, created = CartItem.objects.get_or_create(
            cart=cart, product=product, defaults={"quantity": quantity}
        )
        if not created:
            item.quantity += quantity
            item.save()

        return Response(CartItemSerializer(item, context={"request": request}).data, status=status.HTTP_201_CREATED)


class CartItemUpdateView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        cart, _ = Cart.objects.get_or_create(user=self.request.user)
        return CartItem.objects.filter(cart=cart)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def cart_clear(request):
    cart, _ = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    return Response({"detail": "Cart cleared."})
