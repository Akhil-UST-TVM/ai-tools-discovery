from fastapi import APIRouter, HTTPException
from schemas.auth import UserSignup, UserLogin
from database.mongo import users_collection
from core.security import create_token

router = APIRouter(prefix="/api/auth", tags=["Auth"])

@router.post("/signup")
def signup(user: UserSignup):
    if users_collection.find_one({"username": user.username}):
        raise HTTPException(400, "User exists")

    users_collection.insert_one(user.dict())
    token = create_token({"username": user.username, "role": user.role})
    return {"token": token}

@router.post("/login")
def login(user: UserLogin):
    db_user = users_collection.find_one(user.dict())
    if not db_user:
        raise HTTPException(401, "Invalid credentials")

    token = create_token({"username": db_user["username"], "role": db_user["role"]})
    return {"token": token}

@router.get("/me")
def me():
    return {"message": "Authorized"}
