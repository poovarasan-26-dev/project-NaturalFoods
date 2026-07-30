from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash, authenticate, login, logout
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib import messages
from django.views.generic import ListView, CreateView, UpdateView, DeleteView, DetailView, TemplateView, View
from django.urls import reverse_lazy, reverse
from django.http import JsonResponse, HttpResponseRedirect
from django.db.models import Sum, Count, Q
from django.db.models.functions import TruncMonth
from django.utils import timezone
from datetime import timedelta
import json

from .models import (
    Product, Category, Customer, Order, OrderItem,
    ContactMessage, Notification, SiteSettings, AdminProfile,
)
from .forms import (
    ProductForm, CategoryForm, CustomerForm, OrderForm,
    SiteSettingsForm, AdminProfileForm, ChangePasswordForm,
    ContactMessageReplyForm,
)


# ─── AUTH VIEWS ───────────────────────────────────────────────

class LoginView(View):
    def get(self, request):
        if request.user.is_authenticated:
            return redirect("dash_home")
        return render(request, "registration/login.html")

    def post(self, request):
        username = request.POST.get("username")
        password = request.POST.get("password")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect("dash_home")
        else:
            messages.error(request, "Invalid username or password.")
            return render(request, "registration/login.html")


@login_required
def logout_view(request):
    logout(request)
    return redirect("dash_login")


# ─── DASHBOARD HOME ───────────────────────────────────────────

class DashboardHomeView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard/dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        now = timezone.now()
        thirty_days_ago = now - timedelta(days=30)
        sixty_days_ago = now - timedelta(days=60)

        total_sales = Order.objects.filter(status__in=["delivered", "shipped", "processing"]).aggregate(
            total=Sum("total_amount")
        )["total"] or 0
        prev_sales = Order.objects.filter(
            status__in=["delivered", "shipped", "processing"],
            created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago
        ).aggregate(total=Sum("total_amount"))["total"] or 0
        sales_change = ((total_sales - prev_sales) / prev_sales * 100) if prev_sales else 100

        total_orders = Order.objects.count()
        prev_orders = Order.objects.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
        orders_change = ((total_orders - prev_orders) / prev_orders * 100) if prev_orders else 100

        total_products = Product.objects.count()
        total_customers = Customer.objects.count()
        prev_customers = Customer.objects.filter(created_at__gte=sixty_days_ago, created_at__lt=thirty_days_ago).count()
        customers_change = ((total_customers - prev_customers) / prev_customers * 100) if prev_customers else 100

        ctx["total_sales"] = total_sales
        ctx["sales_change"] = round(sales_change, 1)
        ctx["total_orders"] = total_orders
        ctx["orders_change"] = round(orders_change, 1)
        ctx["total_products"] = total_products
        ctx["total_customers"] = total_customers
        ctx["customers_change"] = round(customers_change, 1)
        ctx["top_products"] = Product.objects.filter(is_active=True).order_by("-created_at")[:5]
        ctx["recent_orders"] = Order.objects.select_related("customer").order_by("-created_at")[:5]

        # Chart data - monthly revenue
        months = []
        revenue_data = []
        order_data = []
        customer_data = []
        for i in range(5, -1, -1):
            month_start = (now - timedelta(days=30 * i)).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            if i > 0:
                month_end = (now - timedelta(days=30 * (i - 1))).replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            else:
                month_end = now
            month_label = month_start.strftime("%b %Y")
            months.append(month_label)
            rev = Order.objects.filter(
                created_at__gte=month_start, created_at__lt=month_end,
                status__in=["delivered", "shipped", "processing"]
            ).aggregate(total=Sum("total_amount"))["total"] or 0
            revenue_data.append(float(rev))
            ord_count = Order.objects.filter(created_at__gte=month_start, created_at__lt=month_end).count()
            order_data.append(ord_count)
            cust_count = Customer.objects.filter(created_at__gte=month_start, created_at__lt=month_end).count()
            customer_data.append(cust_count)

        ctx["chart_labels"] = json.dumps(months)
        ctx["chart_revenue"] = json.dumps(revenue_data)
        ctx["chart_orders"] = json.dumps(order_data)
        ctx["chart_customers"] = json.dumps(customer_data)

        return ctx


dash_home = DashboardHomeView.as_view()


# ─── PRODUCT VIEWS ────────────────────────────────────────────

class ProductListView(LoginRequiredMixin, ListView):
    model = Product
    template_name = "dashboard/products.html"
    context_object_name = "products"
    paginate_by = 10

    def get_queryset(self):
        qs = Product.objects.select_related("category").all()
        search = self.request.GET.get("search", "")
        category = self.request.GET.get("category", "")
        if search:
            qs = qs.filter(Q(name__icontains=search) | Q(description__icontains=search))
        if category:
            qs = qs.filter(category__id=category)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["categories"] = Category.objects.all()
        ctx["search_query"] = self.request.GET.get("search", "")
        ctx["selected_category"] = self.request.GET.get("category", "")
        return ctx


class ProductCreateView(LoginRequiredMixin, CreateView):
    model = Product
    form_class = ProductForm
    template_name = "dashboard/product_form.html"
    success_url = reverse_lazy("dash_products")

    def form_valid(self, form):
        response = super().form_valid(form)
        Notification.objects.create(
            title="New Product Added",
            description=f'Product "{self.object.name}" has been added.',
            notification_type="product",
            link=reverse("dash_products"),
        )
        messages.success(self.request, f'Product "{self.object.name}" created successfully.')
        return response


class ProductUpdateView(LoginRequiredMixin, UpdateView):
    model = Product
    form_class = ProductForm
    template_name = "dashboard/product_form.html"
    success_url = reverse_lazy("dash_products")

    def form_valid(self, form):
        response = super().form_valid(form)
        Notification.objects.create(
            title="Product Updated",
            description=f'Product "{self.object.name}" has been updated.',
            notification_type="product",
            link=reverse("dash_products"),
        )
        messages.success(self.request, f'Product "{self.object.name}" updated successfully.')
        return response


class ProductDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        product = get_object_or_404(Product, pk=pk)
        name = product.name
        product.delete()
        Notification.objects.create(
            title="Product Deleted",
            description=f'Product "{name}" has been deleted.',
            notification_type="product",
            link=reverse("dash_products"),
        )
        messages.success(request, f'Product "{name}" deleted successfully.')
        return redirect("dash_products")


# ─── CATEGORY VIEWS ───────────────────────────────────────────

class CategoryCreateView(LoginRequiredMixin, CreateView):
    model = Category
    form_class = CategoryForm
    template_name = "dashboard/category_form.html"
    success_url = reverse_lazy("dash_products")


class CategoryDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        category = get_object_or_404(Category, pk=pk)
        category.delete()
        messages.success(request, f'Category "{category.name}" deleted.')
        return redirect("dash_products")


# ─── ORDER VIEWS ──────────────────────────────────────────────

class OrderListView(LoginRequiredMixin, ListView):
    model = Order
    template_name = "dashboard/orders.html"
    context_object_name = "orders"
    paginate_by = 10

    def get_queryset(self):
        qs = Order.objects.select_related("customer").all()
        search = self.request.GET.get("search", "")
        status = self.request.GET.get("status", "")
        if search:
            qs = qs.filter(
                Q(order_id__icontains=search) | Q(customer__full_name__icontains=search)
            )
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["status_choices"] = Order.STATUS_CHOICES
        ctx["search_query"] = self.request.GET.get("search", "")
        ctx["selected_status"] = self.request.GET.get("status", "")
        return ctx


class OrderDetailView(LoginRequiredMixin, DetailView):
    model = Order
    template_name = "dashboard/order_detail.html"
    context_object_name = "order"


class OrderUpdateView(LoginRequiredMixin, View):
    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        new_status = request.POST.get("status")
        if new_status:
            order.status = new_status
            order.save()
            notif_title = f"Order {order.order_id} Updated"
            notif_desc = f"Order status changed to {order.get_status_display()}."
            if new_status == "delivered":
                notif_title = f"Order {order.order_id} Delivered"
                notif_desc = f"Order has been delivered to {order.customer.full_name}."
            elif new_status == "cancelled":
                notif_title = f"Order {order.order_id} Cancelled"
                notif_desc = f"Order has been cancelled."
            Notification.objects.create(
                title=notif_title, description=notif_desc,
                notification_type="order", link=reverse("dash_orders"),
            )
            messages.success(request, f"Order {order.order_id} status updated.")
        return redirect("dash_orders")


class OrderDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        order = get_object_or_404(Order, pk=pk)
        order_id = order.order_id
        order.delete()
        Notification.objects.create(
            title=f"Order {order_id} Deleted",
            description=f"Order {order_id} has been removed.",
            notification_type="order",
            link=reverse("dash_orders"),
        )
        messages.success(request, f"Order {order_id} deleted.")
        return redirect("dash_orders")


# ─── CUSTOMER VIEWS ───────────────────────────────────────────

class CustomerListView(LoginRequiredMixin, ListView):
    model = Customer
    template_name = "dashboard/customers.html"
    context_object_name = "customers"
    paginate_by = 10

    def get_queryset(self):
        qs = Customer.objects.all()
        search = self.request.GET.get("search", "")
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) | Q(email__icontains=search) | Q(phone__icontains=search)
            )
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["search_query"] = self.request.GET.get("search", "")
        return ctx


class CustomerCreateView(LoginRequiredMixin, CreateView):
    model = Customer
    form_class = CustomerForm
    template_name = "dashboard/customer_form.html"
    success_url = reverse_lazy("dash_customers")

    def form_valid(self, form):
        response = super().form_valid(form)
        Notification.objects.create(
            title="New Customer Registered",
            description=f'Customer "{self.object.full_name}" has been added.',
            notification_type="customer",
            link=reverse("dash_customers"),
        )
        messages.success(self.request, f'Customer "{self.object.full_name}" created.')
        return response


class CustomerUpdateView(LoginRequiredMixin, UpdateView):
    model = Customer
    form_class = CustomerForm
    template_name = "dashboard/customer_form.html"
    success_url = reverse_lazy("dash_customers")

    def form_valid(self, form):
        response = super().form_valid(form)
        Notification.objects.create(
            title="Customer Updated",
            description=f'Customer "{self.object.full_name}" has been updated.',
            notification_type="customer",
            link=reverse("dash_customers"),
        )
        messages.success(self.request, f'Customer "{self.object.full_name}" updated.')
        return response


class CustomerDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        customer = get_object_or_404(Customer, pk=pk)
        name = customer.full_name
        customer.delete()
        Notification.objects.create(
            title="Customer Deleted",
            description=f'Customer "{name}" has been removed.',
            notification_type="customer",
            link=reverse("dash_customers"),
        )
        messages.success(request, f'Customer "{name}" deleted.')
        return redirect("dash_customers")


# ─── CONTACT MESSAGE VIEWS ────────────────────────────────────

class MessageListView(LoginRequiredMixin, ListView):
    model = ContactMessage
    template_name = "dashboard/messages.html"
    context_object_name = "messages_list"
    paginate_by = 10

    def get_queryset(self):
        qs = ContactMessage.objects.all()
        search = self.request.GET.get("search", "")
        status = self.request.GET.get("status", "")
        if search:
            qs = qs.filter(
                Q(full_name__icontains=search) | Q(email__icontains=search) | Q(subject__icontains=search)
            )
        if status:
            qs = qs.filter(status=status)
        return qs

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["search_query"] = self.request.GET.get("search", "")
        ctx["selected_status"] = self.request.GET.get("status", "")
        return ctx


class MessageDetailView(LoginRequiredMixin, View):
    def get(self, request, pk):
        msg = get_object_or_404(ContactMessage, pk=pk)
        if msg.status == "unread":
            msg.status = "read"
            msg.save()
        form = ContactMessageReplyForm()
        return render(request, "dashboard/message_detail.html", {"msg": msg, "form": form})

    def post(self, request, pk):
        msg = get_object_or_404(ContactMessage, pk=pk)
        form = ContactMessageReplyForm(request.POST)
        if form.is_valid():
            msg.status = "replied"
            msg.save()
            messages.success(request, "Reply sent successfully.")
            return redirect("dash_messages")
        return render(request, "dashboard/message_detail.html", {"msg": msg, "form": form})


class MessageDeleteView(LoginRequiredMixin, View):
    def post(self, request, pk):
        msg = get_object_or_404(ContactMessage, pk=pk)
        msg.delete()
        messages.success(request, "Message deleted.")
        return redirect("dash_messages")


class MarkAllMessagesReadView(LoginRequiredMixin, View):
    def post(self, request):
        ContactMessage.objects.filter(status="unread").update(status="read")
        messages.success(request, "All messages marked as read.")
        return redirect("dash_messages")


# ─── NOTIFICATION VIEWS ──────────────────────────────────────

class NotificationListView(LoginRequiredMixin, ListView):
    model = Notification
    template_name = "dashboard/notifications.html"
    context_object_name = "notifications_list"
    paginate_by = 20

    def get_queryset(self):
        return Notification.objects.filter(notification_type="order")


class MarkNotificationReadView(LoginRequiredMixin, View):
    def post(self, request, pk):
        notif = get_object_or_404(Notification, pk=pk)
        notif.is_read = True
        notif.save()
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse({"status": "ok"})
        return redirect("dash_notifications")


class MarkAllNotificationsReadView(LoginRequiredMixin, View):
    def post(self, request):
        Notification.objects.filter(is_read=False, notification_type="order").update(is_read=True)
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse({"status": "ok"})
        return redirect("dash_notifications")


# ─── PROFILE VIEWS ────────────────────────────────────────────

class ProfileView(LoginRequiredMixin, View):
    def get(self, request):
        profile, _ = AdminProfile.objects.get_or_create(user=request.user)
        form = AdminProfileForm(instance=profile, initial={
            "username": request.user.username,
            "email": request.user.email,
        })
        password_form = ChangePasswordForm()
        return render(request, "dashboard/profile.html", {
            "form": form, "password_form": password_form, "profile": profile,
        })

    def post(self, request):
        profile, _ = AdminProfile.objects.get_or_create(user=request.user)
        if "save_profile" in request.POST:
            form = AdminProfileForm(request.POST, request.FILES, instance=profile)
            if form.is_valid():
                form.save()
                request.user.username = form.cleaned_data["username"]
                request.user.email = form.cleaned_data["email"]
                request.user.save()
                messages.success(request, "Profile updated successfully.")
                return redirect("dash_profile")
        elif "change_password" in request.POST:
            password_form = ChangePasswordForm(request.POST)
            if password_form.is_valid():
                request.user.set_password(password_form.cleaned_data["new_password"])
                request.user.save()
                update_session_auth_hash(request, request.user)
                messages.success(request, "Password changed successfully.")
                return redirect("dash_profile")
        return redirect("dash_profile")


# ─── SETTINGS VIEWS ──────────────────────────────────────────

class SettingsView(LoginRequiredMixin, View):
    def get(self, request):
        site_settings = SiteSettings.load()
        form = SiteSettingsForm(instance=site_settings)
        return render(request, "dashboard/settings.html", {"form": form, "site_settings": site_settings})

    def post(self, request):
        site_settings = SiteSettings.load()
        form = SiteSettingsForm(request.POST, request.FILES, instance=site_settings)
        if form.is_valid():
            form.save()
            messages.success(request, "Settings saved successfully.")
            return redirect("dash_settings")
        return render(request, "dashboard/settings.html", {"form": form, "site_settings": site_settings})


# ─── API ENDPOINTS ────────────────────────────────────────────

@login_required
def api_unread_counts(request):
    return JsonResponse({
        "unread_messages": ContactMessage.objects.filter(status="unread").count(),
        "unread_notifications": Notification.objects.filter(is_read=False, notification_type="order").count(),
    })


@login_required
def api_recent_messages(request):
    msgs = ContactMessage.objects.order_by("-created_at")[:5]
    data = [
        {
            "id": m.id,
            "full_name": m.full_name,
            "email": m.email,
            "subject": m.subject,
            "time": m.created_at.strftime("%b %d, %H:%M"),
            "is_unread": m.status == "unread",
        }
        for m in msgs
    ]
    return JsonResponse({"messages": data})


@login_required
def api_recent_notifications(request):
    notifs = Notification.objects.filter(notification_type="order").order_by("-created_at")[:10]
    data = [
        {
            "id": n.id,
            "title": n.title,
            "description": n.description,
            "type": n.notification_type,
            "is_read": n.is_read,
            "time": n.created_at.strftime("%b %d, %H:%M"),
            "link": n.link,
        }
        for n in notifs
    ]
    return JsonResponse({"notifications": data})


# ─── CONTACT FORM (public) ───────────────────────────────────

class PublicContactView(View):
    def post(self, request):
        full_name = request.POST.get("full_name", "")
        email = request.POST.get("email", "")
        phone = request.POST.get("phone", "")
        subject = request.POST.get("subject", "")
        message_text = request.POST.get("message", "")
        if full_name and email and subject and message_text:
            ContactMessage.objects.create(
                full_name=full_name, email=email, phone=phone,
                subject=subject, message=message_text,
            )
            Notification.objects.create(
                title="New Contact Message",
                description=f"New message from {full_name}: {subject}",
                notification_type="message",
                link=reverse("dash_messages"),
            )
            if request.headers.get("X-Requested-With") == "XMLHttpRequest":
                return JsonResponse({"status": "ok", "message": "Message sent successfully."})
            messages.success(request, "Message sent successfully.")
            return redirect("dash_home")
        if request.headers.get("X-Requested-With") == "XMLHttpRequest":
            return JsonResponse({"status": "error", "message": "Please fill all required fields."}, status=400)
        messages.error(request, "Please fill all required fields.")
        return redirect("dash_home")
