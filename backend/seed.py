from app.core.database import init_db
from app.main import seed_demo

if __name__ == '__main__':
    init_db()
    seed_demo()
    print('NE-RouteIQ demo data seeded.')
