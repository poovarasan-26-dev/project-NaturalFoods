import os
from django.core.management.base import BaseCommand
from users.models import User


class Command(BaseCommand):
    help = "Create or update the dashboard superuser using env vars (or defaults)"

    def handle(self, *args, **kwargs):
        username = os.environ.get("ADMIN_USERNAME", "poovarasan")
        password = os.environ.get("ADMIN_PASSWORD", "123456")
        email = os.environ.get("ADMIN_EMAIL", "varasanpoo83@gmail.com")

        user, created = User.objects.get_or_create(
            username=username,
            defaults={"email": email},
        )
        if email and not User.objects.exclude(pk=user.pk).filter(email=email).exists():
            user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.is_active = True
        user.set_password(password)
        user.save()

        action = "created" if created else "updated"
        self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' {action} successfully"))
