from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from django.shortcuts import render


def home(request):
    return JsonResponse({
        "message": "Natural Foods API",
        "endpoints": {
            "admin": "/admin/",
            "signup": "/api/auth/signup/",
            "login": "/api/auth/login/",
            "logout": "/api/auth/logout/",
            "profile": "/api/auth/profile/",
            "dashboard": "/dashboard/",
        }
    })


def dashboard(request):
    return render(request, "dashboard/index.html", {"title": "Dashboard"})


urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("dashboard/", dashboard, name="dashboard"),
]
