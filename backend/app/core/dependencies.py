from typing import Iterable
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from .database import get_db, row_to_dict
from .security import decode_token

bearer = HTTPBearer(auto_error=False)


def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer)):
	if not credentials:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='Authentication required')
	claims = decode_token(credentials.credentials)
	with get_db() as db:
		user = db.execute('SELECT id, name, email, mobile, organization, role, is_active, created_at FROM users WHERE id = ?', (claims.get('sub'),)).fetchone()
	if not user or not user['is_active']:
		raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail='User is inactive or missing')
	return row_to_dict(user)


def require_roles(*roles: str):
	def dependency(user=Depends(get_current_user)):
		if user['role'] not in roles:
			raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail='Insufficient permissions')
		return user
	return dependency
