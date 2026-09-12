from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr, Field
from ..core.database import get_db, now_iso, row_to_dict
from ..core.dependencies import get_current_user
from ..core.security import create_access_token, hash_password, verify_password

router = APIRouter(prefix='/api/auth', tags=['auth'])

class AuthInput(BaseModel):
    identifier: str
    password: str = Field(min_length=6)
class RegisterInput(BaseModel):
    name: str = Field(min_length=2)
    email: EmailStr
    mobile: str = ''
    organization: str = ''
    role: str = 'logistics_operator'
    password: str = Field(min_length=6)

def public_user(user): return {k: user[k] for k in ('id','name','email','mobile','organization','role')}

@router.post('/register')
def register(payload: RegisterInput):
    if payload.role not in {'government_admin','logistics_operator','ngo_operator','emergency_operator','driver'}: raise HTTPException(400, 'Invalid role')
    now = now_iso(); user_id = 'USER-' + payload.email.split('@')[0].upper()
    with get_db() as db:
        try: db.execute('INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)', (user_id, payload.name, payload.email, payload.mobile, payload.organization, hash_password(payload.password), payload.role, now, now))
        except Exception as error: raise HTTPException(409, 'Email already registered') from error
        user = row_to_dict(db.execute('SELECT id,name,email,mobile,organization,role,is_active,created_at FROM users WHERE id=?', (user_id,)).fetchone())
    return {'access_token': create_access_token(user_id, payload.role), 'token_type': 'bearer', 'user': public_user(user)}

@router.post('/login')
def login(payload: AuthInput):
    with get_db() as db:
        user = db.execute('SELECT * FROM users WHERE lower(email)=lower(?) OR mobile=?', (payload.identifier, payload.identifier)).fetchone()
    if not user or not verify_password(payload.password, user['password_hash']): raise HTTPException(401, 'Invalid credentials')
    data = row_to_dict(user)
    return {'access_token': create_access_token(data['id'], data['role']), 'token_type': 'bearer', 'user': public_user(data)}

@router.get('/me')
def me(user=Depends(get_current_user)): return user

@router.post('/logout')
def logout(user=Depends(get_current_user)): return {'success': True, 'message': 'Token can be discarded by the client'}
