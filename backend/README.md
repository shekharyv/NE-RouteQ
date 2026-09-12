# NE-RouteIQ FastAPI Backend

The backend is now FastAPI-first. It persists operational state in SQLite by default (`backend/ne_routeiq.db`) and keeps the existing MongoDB configuration available through `DATABASE_URL` for a future adapter migration. Important state is never stored only in React/localStorage.

## Run

```powershell
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 5000
```

From the repository root, `npm run dev` starts this API and the Vite frontend together.

Swagger: `http://localhost:5000/docs`
Health: `http://localhost:5000/api/health`

## Demo users

| Role | Email | Password |
| --- | --- | --- |
| Government admin | admin@nerouteiq.in | Admin123! |
| Logistics operator | operator@nerouteiq.in | Operator123! |
| NGO operator | relief@nerouteiq.in | Relief123! |
| Emergency operator | emergency@nerouteiq.in | Emergency123! |
| Driver | driver@nerouteiq.in | Driver123! |

## Implemented flow

1. Login and receive a JWT.
2. Create or load a persisted mission.
3. Generate deterministic Route A/B/C options.
4. Recommend Route B for the critical MED-1024 mission.
5. Assign/start/track/complete a driver mission.
6. Simulate a landslide, create an alert, and recommend Route C.
7. Explicitly accept or reject the reroute.
8. Build a report from stored mission events.
9. Read analytics from stored mission rows.

Google Maps and Hugging Face keys are optional. Without them, `maps_service.py` and the AI modules use deterministic demo behavior while keeping the integration boundary ready for real providers.
