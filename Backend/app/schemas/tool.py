from typing import Optional
from pydantic import BaseModel


class ToolCreate(BaseModel):
    name: str
    useCase: str
    category: str
    pricing: str
    description: Optional[str] = None
    website: Optional[str] = None
