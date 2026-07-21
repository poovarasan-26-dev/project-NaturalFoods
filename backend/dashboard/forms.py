from django import forms
from django.contrib.auth import get_user_model
from .models import Product, Category, Customer, Order, ContactMessage, SiteSettings, AdminProfile

User = get_user_model()


class ProductForm(forms.ModelForm):
    class Meta:
        model = Product
        fields = ["name", "slug", "category", "description", "price", "unit", "stock", "availability", "image", "is_active"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Product name"}),
            "slug": forms.TextInput(attrs={"class": "form-control", "placeholder": "product-slug"}),
            "category": forms.Select(attrs={"class": "form-select"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 3, "placeholder": "Product description"}),
            "price": forms.NumberInput(attrs={"class": "form-control", "placeholder": "0.00", "step": "0.01"}),
            "unit": forms.TextInput(attrs={"class": "form-control", "placeholder": "Unit (e.g. kg, lb, pcs)"}),
            "stock": forms.NumberInput(attrs={"class": "form-control", "placeholder": "0"}),
            "availability": forms.Select(attrs={"class": "form-select"}),
            "image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "is_active": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }


class CategoryForm(forms.ModelForm):
    class Meta:
        model = Category
        fields = ["name", "slug", "description"]
        widgets = {
            "name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Category name"}),
            "slug": forms.TextInput(attrs={"class": "form-control", "placeholder": "category-slug"}),
            "description": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Category description"}),
        }


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = ["full_name", "email", "phone", "address", "profile_image", "is_active"]
        widgets = {
            "full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Full name"}),
            "email": forms.EmailInput(attrs={"class": "form-control", "placeholder": "Email address"}),
            "phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "Phone number"}),
            "address": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Address"}),
            "profile_image": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "is_active": forms.CheckboxInput(attrs={"class": "form-check-input"}),
        }


class OrderForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ["customer", "status", "shipping_address", "notes"]
        widgets = {
            "customer": forms.Select(attrs={"class": "form-select"}),
            "status": forms.Select(attrs={"class": "form-select"}),
            "shipping_address": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Shipping address"}),
            "notes": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Order notes"}),
        }


class ContactMessageReplyForm(forms.Form):
    reply_message = forms.CharField(
        widget=forms.Textarea(attrs={"class": "form-control", "rows": 4, "placeholder": "Type your reply..."}),
        label="Reply Message",
    )


class SiteSettingsForm(forms.ModelForm):
    class Meta:
        model = SiteSettings
        fields = [
            "site_name", "site_logo", "site_email", "site_phone", "site_address",
            "facebook_url", "instagram_url", "linkedin_url", "footer_text",
        ]
        widgets = {
            "site_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Website name"}),
            "site_logo": forms.ClearableFileInput(attrs={"class": "form-control"}),
            "site_email": forms.EmailInput(attrs={"class": "form-control", "placeholder": "Email address"}),
            "site_phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "Phone number"}),
            "site_address": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Address"}),
            "facebook_url": forms.URLInput(attrs={"class": "form-control", "placeholder": "Facebook URL"}),
            "instagram_url": forms.URLInput(attrs={"class": "form-control", "placeholder": "Instagram URL"}),
            "linkedin_url": forms.URLInput(attrs={"class": "form-control", "placeholder": "LinkedIn URL"}),
            "footer_text": forms.Textarea(attrs={"class": "form-control", "rows": 2, "placeholder": "Footer text"}),
        }


class AdminProfileForm(forms.ModelForm):
    username = forms.CharField(max_length=150, widget=forms.TextInput(attrs={"class": "form-control"}))
    email = forms.EmailField(widget=forms.EmailInput(attrs={"class": "form-control"}))

    class Meta:
        model = AdminProfile
        fields = ["full_name", "phone", "bio", "profile_image"]
        widgets = {
            "full_name": forms.TextInput(attrs={"class": "form-control", "placeholder": "Full name"}),
            "phone": forms.TextInput(attrs={"class": "form-control", "placeholder": "Phone number"}),
            "bio": forms.Textarea(attrs={"class": "form-control", "rows": 3, "placeholder": "Tell us about yourself..."}),
            "profile_image": forms.ClearableFileInput(attrs={"class": "form-control"}),
        }


class ChangePasswordForm(forms.Form):
    new_password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "New password"}),
        min_length=6,
    )
    confirm_password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control", "placeholder": "Confirm password"}),
        min_length=6,
    )

    def clean(self):
        cleaned_data = super().clean()
        if cleaned_data.get("new_password") != cleaned_data.get("confirm_password"):
            raise forms.ValidationError("Passwords do not match.")
        return cleaned_data
