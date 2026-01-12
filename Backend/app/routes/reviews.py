from fastapi import APIRouter, Depends, HTTPException
from schemas.review import ReviewCreate
from database.mongo import reviews_collection, get_next_sequence
from dependencies.auth import verify_token
from datetime import datetime

router = APIRouter(prefix="/api/reviews", tags=["Reviews"])


@router.post("/{tool_id}")
def add_review(tool_id: str, review: ReviewCreate, user=Depends(verify_token)):
    try:
        tid = int(tool_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tool id")

    new_id = get_next_sequence("reviews")
    reviews_collection.insert_one({
        "id": new_id,
        "toolId": tid,
        "rating": review.rating,
        "comment": review.comment,
        "username": user["username"],
        "status": "pending",
        "createdAt": datetime.utcnow()
    })
    return {"message": "Review submitted", "id": new_id}


@router.get("/{tool_id}")
def get_reviews(tool_id: str):
    try:
        tid = int(tool_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tool id")

    return list(reviews_collection.find({"toolId": tid, "status": "approved"}))
