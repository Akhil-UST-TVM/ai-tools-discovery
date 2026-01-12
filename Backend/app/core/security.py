from jose import jwt, JWTError
from fastapi import Depends, HTTPException
from fastapi.security import HTTPBearer
from datetime import datetime, timedelta
# from core.config import settings

security = HTTPBearer()

def create_token(data: dict):
    payload = data.copy()
    payload["exp"] = datetime.utcnow() + timedelta(
        minutes=30
    )
    return jwt.encode(payload, "some secret key text", algorithm="HS256")

def verify_token(token=Depends(security)):
    try:
        return jwt.decode(
            token.credentials,
            "some secret key text",
            algorithms=["HS256"],
        )
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

def admin_only(user=Depends(verify_token)):
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Admin only")
    return user
