import sqlite3, os
db='backend/db.sqlite3'
if not os.path.exists(db):
    print('DB not found at',db)
else:
    conn=sqlite3.connect(db)
    cur=conn.cursor()
    try:
        cur.execute("PRAGMA table_info('users_user')")
        rows=cur.fetchall()
        print('COLUMNS:')
        for r in rows:
            print(r)
    except Exception as e:
        print('ERROR:',e)
    conn.close()
