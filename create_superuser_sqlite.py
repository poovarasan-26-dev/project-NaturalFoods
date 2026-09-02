import os
import sys
import django
import sqlite3
import datetime

# ensure project root is on sys.path so `backend` package can be imported
# add the `backend` package directory so `backend.settings` is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))
os.environ.setdefault('DJANGO_SETTINGS_MODULE','backend.settings')
django.setup()
from django.contrib.auth.hashers import make_password

DB='backend/db.sqlite3'
if not os.path.exists(DB):
    print('DB not found at',DB)
    raise SystemExit(1)

pw = make_password('admin123')
now = datetime.datetime.utcnow().isoformat()
conn = sqlite3.connect(DB)
cur = conn.cursor()
try:
    cur.execute("INSERT INTO users_user (password, last_login, is_superuser, email, username, role, is_active, is_staff, date_joined, phone) VALUES (?,?,?,?,?,?,?,?,?,?)",
                (pw, None, 1, 'admin@example.com', 'admin', 'admin', 1, 1, now, ''))
    conn.commit()
    print('CREATED admin')
except Exception as e:
    print('ERROR:',e)
finally:
    conn.close()
