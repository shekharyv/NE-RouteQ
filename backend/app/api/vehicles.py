from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from ..core.dependencies import get_current_user, require_roles
from ..core.database import get_db, row_to_dict
router=APIRouter(prefix='/api/vehicles',tags=['vehicles'])
class Vehicle(BaseModel): vehicle_id:str; registration_number:str; type:str='Truck'; capacity:float=0; status:str='AVAILABLE'; driver_id:str|None=None; current_lat:float|None=None; current_lng:float|None=None
@router.get('')
def list_vehicles(user=Depends(get_current_user)):
    with get_db() as db:return [row_to_dict(r) for r in db.execute('SELECT * FROM vehicles').fetchall()]
@router.get('/{vehicle_id}')
def get_vehicle(vehicle_id,user=Depends(get_current_user)):
    with get_db() as db:r=db.execute('SELECT * FROM vehicles WHERE vehicle_id=?',(vehicle_id,)).fetchone()
    if not r:raise HTTPException(404,'Vehicle not found')
    return row_to_dict(r)
@router.post('')
def create_vehicle(payload:Vehicle,user=Depends(require_roles('government_admin','logistics_operator'))):
    with get_db() as db:db.execute('INSERT INTO vehicles VALUES (?,?,?,?,?,?,?,?)',tuple(payload.model_dump().values()))
    return payload.model_dump()
@router.put('/{vehicle_id}')
def update_vehicle(vehicle_id,payload:Vehicle,user=Depends(require_roles('government_admin','logistics_operator'))):
    with get_db() as db:db.execute('UPDATE vehicles SET registration_number=?,type=?,capacity=?,status=?,driver_id=?,current_lat=?,current_lng=? WHERE vehicle_id=?',(payload.registration_number,payload.type,payload.capacity,payload.status,payload.driver_id,payload.current_lat,payload.current_lng,vehicle_id))
    return payload.model_dump()
