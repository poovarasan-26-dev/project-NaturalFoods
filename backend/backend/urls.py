from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse, FileResponse
from django.shortcuts import render
from pathlib import Path


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


FAVICON_PATH = Path(__file__).resolve().parent.parent / "static" / "images" / "favicon.ico"


def favicon(request):
    return FileResponse(open(FAVICON_PATH, "rb"), content_type="image/x-icon")


urlpatterns = [
    path("", home),
    path("favicon.ico", favicon),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("dashboard/", dashboard, name="dashboard"),
]
