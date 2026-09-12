from fastapi import APIRouter, WebSocket
router=APIRouter(tags=['realtime'])
@router.websocket('/ws/missions/{mission_id}')
async def mission_socket(websocket:WebSocket, mission_id:str):
    await websocket.accept()
    await websocket.send_json({'event':'connected','mission_id':mission_id})
    try:
        while True: await websocket.receive_text()
    except Exception: await websocket.close()
