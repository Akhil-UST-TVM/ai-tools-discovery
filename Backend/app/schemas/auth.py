from pydantic import BaseModel

class UserSignup(BaseModel):
    username: str
    password: str
    role: str = "user"

class UserLogin(BaseModel):
    username: str
    password: str
