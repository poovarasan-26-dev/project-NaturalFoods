from django.contrib import admin
from django.urls import path, include
from django.shortcuts import redirect
from django.http import FileResponse
from django.conf import settings
from django.conf.urls.static import static
from pathlib import Path


def home(request):
    return redirect("dash_home")


FAVICON_PATH = Path(__file__).resolve().parent.parent / "static" / "images" / "favicon.ico"


def favicon(request):
    if FAVICON_PATH.exists():
        return FileResponse(open(FAVICON_PATH, "rb"), content_type="image/x-icon")
    from django.http import HttpResponseNotFound
    return HttpResponseNotFound()


urlpatterns = [
    path("", home),
    path("favicon.ico", favicon),
    path("admin/", admin.site.urls),
    path("api/auth/", include("users.urls")),
    path("api/", include("dashboard.api_urls")),
    path("dashboard/", include("dashboard.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
