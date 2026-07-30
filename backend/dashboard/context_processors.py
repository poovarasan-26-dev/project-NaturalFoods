from .models import ContactMessage, Notification


def dashboard_context(request):
    context = {}
    if request.user.is_authenticated:
        unread_messages = ContactMessage.objects.filter(status="unread").count()
        unread_notifications = Notification.objects.filter(is_read=False, notification_type="order").count()
        recent_notifications = Notification.objects.filter(is_read=False, notification_type="order")[:5]
        context["unread_messages"] = unread_messages
        context["unread_notifications"] = unread_notifications
        context["recent_notifications"] = recent_notifications
    return context
