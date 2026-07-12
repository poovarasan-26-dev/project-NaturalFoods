from django.test import TestCase
from django.urls import reverse


class DashboardPageTests(TestCase):
    def test_dashboard_page_is_available(self):
        response = self.client.get(reverse("dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Dashboard")
        self.assertContains(response, "Natural Foods")
