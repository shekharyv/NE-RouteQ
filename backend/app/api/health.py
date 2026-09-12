from fastapi import APIRouter
from ..core.database import get_db
router=APIRouter(prefix='/api',tags=['health'])
@router.get('/health')
def health():
    with get_db() as db: db.execute('SELECT 1')
    return {'status':'ok','service':'NE-RouteIQ API','database':'ok'}
