from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def home(request):
    return JsonResponse({
        "message": "Natural Foods API",
        "endpoints": {
            "admin": "/admin/",
            "signup": "/api/auth/signup/",
            "login": "/api/auth/login/",
            "logout": "/api/auth/logout/",
            "profile": "/api/auth/profile/",
        }
    })

urlpatterns = [
    path("", home),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
]
