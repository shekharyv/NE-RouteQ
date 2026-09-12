import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parents[2] / '.env')

BASE_DIR = Path(__file__).resolve().parents[2]
DATABASE_URL = os.getenv('DATABASE_URL', f'sqlite:///{BASE_DIR / "ne_routeiq.db"}')
DB_PATH = Path(DATABASE_URL.replace('sqlite:///', '', 1))
if not DB_PATH.is_absolute():
    DB_PATH = BASE_DIR / DB_PATH
JWT_SECRET = os.getenv('JWT_SECRET', 'dev-only-change-me')
JWT_EXPIRE_MINUTES = int(os.getenv('JWT_EXPIRE_MINUTES', '1440'))
FRONTEND_URL = os.getenv('FRONTEND_URL', 'http://localhost:5174')
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')
HUGGINGFACE_API_KEY = os.getenv('HUGGINGFACE_API_KEY', '')
ENVIRONMENT = os.getenv('ENVIRONMENT', 'development')
