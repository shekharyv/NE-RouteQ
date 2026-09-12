import json
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import FRONTEND_URL
from .core.database import get_db, init_db, now_iso
from .core.security import hash_password
from .api import auth, missions, routes, tracking, alerts, analytics, reports, rerouting, simulation, drivers, vehicles, health, websocket

@asynccontextmanager
async def lifespan(_app):
    init_db(); seed_demo()
    yield

app=FastAPI(title='NE-RouteIQ API',version='2.0.0',description='AI-powered logistics and accessibility intelligence API', lifespan=lifespan)
app.add_middleware(CORSMiddleware,allow_origins=[FRONTEND_URL,'http://localhost:5173'],allow_credentials=True,allow_methods=['*'],allow_headers=['*'])
for router in (auth.router,missions.router,routes.router,tracking.router,alerts.router,analytics.router,reports.router,rerouting.router,simulation.router,drivers.router,vehicles.router,health.router,websocket.router): app.include_router(router)

@app.get('/')
def root(): return {'service':'NE-RouteIQ API','docs':'/docs'}

def seed_demo():
    now=now_iso()
    users=[('USER-ADMIN','Dr. Himanta Sharma','admin@nerouteiq.in','9876543201','NE-RouteIQ State Command','government_admin'),('USER-OPERATOR','Logistics Operator','operator@nerouteiq.in','9876543202','NE-RouteIQ Operations','logistics_operator'),('USER-NGO','Relief Coordinator','relief@nerouteiq.in','9876543203','North-East Relief Network','ngo_operator'),('USER-EMERGENCY','Emergency Commander','emergency@nerouteiq.in','9876543204','Emergency Response Cell','emergency_operator'),('USER-DRIVER','Rajesh Gogoi','driver@nerouteiq.in','9876543210','NE-RouteIQ Field Operations','driver')]
    with get_db() as db:
        for user_id,name,email,mobile,org,role in users:
            db.execute('INSERT OR IGNORE INTO users (id,name,email,mobile,organization,password_hash,role,is_active,created_at,updated_at) VALUES (?,?,?,?,?,?,?,1,?,?)',(user_id,name,email,mobile,org,hash_password('Admin123!' if role=='government_admin' else 'Operator123!' if role=='logistics_operator' else 'Relief123!' if role=='ngo_operator' else 'Emergency123!' if role=='emergency_operator' else 'Driver123!',),role,now,now))
        db.execute('INSERT OR IGNORE INTO vehicles VALUES (?,?,?,?,?,?,?,?)',('VEH-MED-01','AS-01-BC-1234','Truck',500,'ASSIGNED','USER-DRIVER',26.1158,91.7362))
        mission=('MED-1024','Medicine','Guwahati','Imphal','CRITICAL','VEH-MED-01','USER-DRIVER','Medical Supplies',500,'',1,1,'in_transit','ROUTE-B',24,86,'LOW','8h 40m','312 km','USER-OPERATOR',now,now)
        db.execute('INSERT OR IGNORE INTO missions VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',mission)
        db.execute("INSERT OR IGNORE INTO alerts VALUES ('ALT-DEMO-1','MED-1024','WARNING','HEAVY_RAIN','Heavy Rainfall Expected','Moderate rainfall along the Manipur corridor.','Manipur region',?,0,'ROUTE-B')",(now,))
        routes=[('ROUTE-A','Fastest Route','7h 50m','Low Cost',72,62,78,64,74,24),('ROUTE-B','AI Recommended','8h 40m','Medium Cost',24,86,91,28,18,8),('ROUTE-C','Safest Alternative','9h 00m','Higher Cost',18,89,94,22,20,6)]
        geometry=json.dumps([[91.7362,26.1158],[92.684,26.348],[93.7266,25.9089],[93.9368,24.817]])
        for route_id,label,duration,cost,risk,access,reliability,weather,terrain,disruption in routes:
            db.execute('INSERT OR IGNORE INTO routes VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',(route_id,'MED-1024',label,'312 km',duration,cost,risk,access,reliability,weather,terrain,disruption,1,geometry,'AVAILABLE',now))
        db.execute("INSERT OR IGNORE INTO events (mission_id,event_type,payload,created_at) VALUES ('MED-1024','mission_created','{}',?)",(now,))
