import random
from decimal import Decimal
from django.core.management.base import BaseCommand
from dashboard.models import (
    Category, Product, Customer, Order, OrderItem,
    ContactMessage, Notification, SiteSettings,
)
from users.models import User


class Command(BaseCommand):
    help = "Seed the database with sample Natural Foods data"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding Natural Foods data...")

        # Categories
        categories_data = [
            ("Organic Vegetables", "organic-vegetables", "Fresh organic vegetables from local farms"),
            ("Organic Fruits", "organic-fruits", "Seasonal organic fruits"),
            ("Whole Grains", "whole-grains", "Unprocessed whole grain products"),
            ("Dairy & Eggs", "dairy-eggs", "Farm-fresh dairy and free-range eggs"),
            ("Herbs & Spices", "herbs-spices", "Natural herbs and spices"),
            ("Honey & Sweeteners", "honey-sweeteners", "Raw honey and natural sweeteners"),
            ("Nuts & Seeds", "nuts-seeds", "Premium nuts and superfood seeds"),
            ("Beverages", "beverages", "Organic teas, juices, and health drinks"),
        ]
        cats = {}
        for name, slug, desc in categories_data:
            cat, _ = Category.objects.get_or_create(slug=slug, defaults={"name": name, "description": desc})
            cats[slug] = cat
        self.stdout.write(self.style.SUCCESS(f"  Created {len(cats)} categories"))

        # Products
        products_data = [
            ("Organic Spinach Bundle", "organic-spinach-bundle", "organic-vegetables", 45, 120, "in_stock", "Fresh organic spinach, hand-picked from certified organic farms."),
            ("Brown Rice 1kg", "brown-rice-1kg", "whole-grains", 180, 85, "in_stock", "Premium whole grain brown rice, unpolished and chemical-free."),
            ("Raw Forest Honey", "raw-forest-honey", "honey-sweeteners", 350, 60, "in_stock", "Pure raw honey sourced from Western Ghats forest apiaries."),
            ("Free Range Eggs (12)", "free-range-eggs-12", "dairy-eggs", 120, 200, "in_stock", "Farm-fresh free-range eggs from happy hens."),
            ("Almonds 500g", "almonds-500g", "nuts-seeds", 420, 45, "in_stock", "Premium quality California almonds, unsalted and raw."),
            ("Turmeric Powder", "turmeric-powder", "herbs-spices", 95, 150, "in_stock", "Organic turmeric powder with high curcumin content."),
            ("Organic Tomatoes 1kg", "organic-tomatoes-1kg", "organic-vegetables", 65, 0, "out_of_stock", "Vine-ripened organic tomatoes, chemical-free."),
            ("Green Tea Bags (25)", "green-tea-bags-25", "beverages", 210, 75, "in_stock", "Antioxidant-rich organic green tea bags."),
            ("Organic Bananas (1 dozen)", "organic-bananas-1-dozen", "organic-fruits", 80, 180, "in_stock", "Sweet organic bananas from certified farms."),
            ("Mixed Seeds Trail Mix", "mixed-seeds-trail-mix", "nuts-seeds", 280, 35, "limited", "Pumpkin, sunflower, flax and chia seed blend."),
            ("Jaggery Powder 500g", "jaggery-powder-500g", "honey-sweeteners", 110, 90, "in_stock", "Chemical-free organic jaggery powder."),
            ("Organic Carrots 500g", "organic-carrots-500g", "organic-vegetables", 40, 8, "limited", "Sweet and crunchy organic carrots."),
        ]
        for name, slug, cat_slug, price, stock, avail, desc in products_data:
            Product.objects.get_or_create(
                slug=slug,
                defaults={
                    "name": name,
                    "category": cats[cat_slug],
                    "price": Decimal(str(price)),
                    "stock": stock,
                    "availability": avail,
                    "description": desc,
                },
            )
        self.stdout.write(self.style.SUCCESS(f"  Created {len(products_data)} products"))

        # Customers
        customers_data = [
            ("Arun Kumar", "arun@email.com", "9876543210"),
            ("Priya Sharma", "priya@email.com", "9876543211"),
            ("Rahul Verma", "rahul@email.com", "9876543212"),
            ("Sneha Patel", "sneha@email.com", "9876543213"),
            ("Vikram Singh", "vikram@email.com", "9876543214"),
            ("Ananya Reddy", "ananya@email.com", "9876543215"),
            ("Deepak Nair", "deepak@email.com", "9876543216"),
            ("Kavitha Menon", "kavitha@email.com", "9876543217"),
        ]
        custs = []
        for name, email, phone in customers_data:
            c, _ = Customer.objects.get_or_create(
                email=email,
                defaults={"full_name": name, "phone": phone, "address": "Chennai, Tamil Nadu"},
            )
            custs.append(c)
        self.stdout.write(self.style.SUCCESS(f"  Created {len(custs)} customers"))

        # Orders
        statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]
        products = list(Product.objects.all())
        if products and custs:
            for i, cust in enumerate(custs):
                order = Order.objects.create(
                    customer=cust,
                    total_amount=Decimal(str(random.randint(150, 2500))),
                    status=random.choice(statuses),
                    shipping_address="123 Green Street, Chennai, Tamil Nadu",
                )
                # Add 1-3 items per order
                for _ in range(random.randint(1, 3)):
                    prod = random.choice(products)
                    qty = random.randint(1, 5)
                    OrderItem.objects.create(
                        order=order,
                        product=prod,
                        quantity=qty,
                        price=prod.price,
                    )
                order.total_amount = sum(item.subtotal for item in order.items.all())
                order.save()
            self.stdout.write(self.style.SUCCESS(f"  Created {Order.objects.count()} orders"))

        # Contact Messages
        messages_data = [
            ("Ravi Raj", "ravi@email.com", "9876000001", "Organic Certification", "Hi, I want to know if your products are USDA organic certified?"),
            ("Meena Kumari", "meena@email.com", "9876000002", "Bulk Order Inquiry", "We run a restaurant and would like to place bulk orders weekly."),
            ("Suresh Babu", "suresh@email.com", "9876000003", "Delivery Areas", "Do you deliver to suburban areas of Chennai?"),
            ("Lakshmi Devi", "lakshmi@email.com", "9876000004", "Product Availability", "When will organic tomatoes be back in stock?"),
            ("Amit Patel", "amit@email.com", "9876000005", "Wholesale Pricing", "Interested in wholesale pricing for your spices range."),
        ]
        for name, email, phone, subject, msg in messages_data:
            ContactMessage.objects.get_or_create(
                email=email,
                subject=subject,
                defaults={
                    "full_name": name,
                    "phone": phone,
                    "message": msg,
                    "status": random.choice(["unread", "read"]),
                },
            )
        self.stdout.write(self.style.SUCCESS(f"  Created {len(messages_data)} contact messages"))

        # Notifications
        notifs = [
            ("New Product Added", "Organic Spinach Bundle has been added.", "product"),
            ("New Order", "Order NF00001 has been placed by Arun Kumar.", "order"),
            ("Customer Registered", "Priya Sharma has registered.", "customer"),
            ("New Contact Message", "New message from Ravi Raj: Organic Certification", "message"),
            ("Order Delivered", "Order NF00003 has been delivered.", "order"),
        ]
        for title, desc, ntype in notifs:
            Notification.objects.get_or_create(
                title=title,
                defaults={"description": desc, "notification_type": ntype, "is_read": False},
            )
        self.stdout.write(self.style.SUCCESS(f"  Created {len(notifs)} notifications"))

        # Site Settings
        SiteSettings.objects.get_or_create(
            pk=1,
            defaults={
                "site_name": "Natural Foods",
                "site_email": "hello@naturalfoods.com",
                "site_phone": "+91 98765 43210",
                "site_address": "42 Green Valley Road, Adyar, Chennai, Tamil Nadu 600020",
                "footer_text": "© 2026 Natural Foods. All rights reserved. Eat Clean, Live Green.",
            },
        )
        self.stdout.write(self.style.SUCCESS("  Created site settings"))

        self.stdout.write(self.style.SUCCESS("\nDone! Database seeded with Natural Foods data."))
