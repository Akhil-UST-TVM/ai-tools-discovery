from fastapi import APIRouter, Depends, HTTPException
from database.mongo import reviews_collection, tools_collection, users_collection
from dependencies.auth import admin_only

router = APIRouter(prefix="/api/admin", tags=["Admin"])


@router.get("/reviews/pending")
def pending_reviews(_=Depends(admin_only)):
    reviews = reviews_collection.find({"status": "pending"})
    result = []

    for review in reviews:
        # normalize returned object to include numeric id and readable createdAt
        result.append({
            "id": review.get("id"),
            "toolId": review.get("toolId"),
            "rating": review.get("rating"),
            "comment": review.get("comment"),
            "username": review.get("username"),
            "status": review.get("status"),
            "createdAt": review.get("createdAt")
        })

    return result


@router.put("/reviews/{review_id}")
def update_review(review_id: str, status: str, _=Depends(admin_only)):
    try:
        rid = int(review_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid review id")

    reviews_collection.update_one(
        {"id": rid},
        {"$set": {"status": status}}
    )
    return {"message": "Review updated"}


@router.get("/stats")
def stats(_=Depends(admin_only)):
    return {
        "users": users_collection.count_documents({}),
        "tools": tools_collection.count_documents({}),
        "reviews": reviews_collection.count_documents({})
    }
