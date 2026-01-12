from pydantic import BaseModel
from typing import Optional


class ReviewCreate(BaseModel):
    # toolId is supplied via the path parameter in the route, not the body
    rating: float
    comment: Optional[str] = ""
