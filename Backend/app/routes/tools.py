from fastapi import APIRouter, Depends, Query, HTTPException
from schemas.tool import ToolCreate
from database.mongo import tools_collection, reviews_collection, get_next_sequence
from dependencies.auth import admin_only
from typing import Optional

router = APIRouter(prefix="/api/tools", tags=["Tools"])


# =========================================
# GET ALL TOOLS (WITH FILTERS)
# =========================================
@router.get("")
def get_tools(
    category: Optional[str] = Query(None),
    pricing: Optional[str] = Query(None),
    minRating: Optional[float] = Query(None),
):
    query = {}

    if category:
        query["category"] = category

    if pricing:
        query["pricing"] = pricing

    tools = list(tools_collection.find(query))
    response = []

    for tool in tools:
        tool_id = tool.get("id")

        # get approved reviews (toolId stored as numeric id)
        reviews = list(
            reviews_collection.find(
                {"toolId": tool_id, "status": "approved"}
            )
        )

        if reviews:
            avg_rating = round(
                sum(r["rating"] for r in reviews) / len(reviews), 1
            )
        else:
            avg_rating = 0

        # apply minRating filter
        if minRating is not None and avg_rating < minRating:
            continue

        response.append({
            "id": tool_id,
            "name": tool["name"],
            "useCase": tool["useCase"],
            "category": tool["category"],
            "pricing": tool["pricing"],
            "description": tool.get("description"),
            "website": tool.get("website"),
            "avgRating": avg_rating,
            "reviewCount": len(reviews),
        })

    return response


# =========================================
# GET SINGLE TOOL
# =========================================
@router.get("/{tool_id}")
def get_tool(tool_id: str):
    try:
        tid = int(tool_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tool id")

    tool = tools_collection.find_one({"id": tid})
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")

    return {
        "id": str(tool["_id"]),
        "name": tool["name"],
        "useCase": tool["useCase"],
        "category": tool["category"],
        "pricing": tool["pricing"],
        "description": tool.get("description"),
        "website": tool.get("website"),
    }


# =========================================
# CREATE TOOL (ADMIN)
# =========================================
@router.post("")
def create_tool(tool: ToolCreate, _=Depends(admin_only)):
    # assign numeric id
    new_id = get_next_sequence("tools")
    doc = tool.dict()
    doc["id"] = new_id
    tools_collection.insert_one(doc)
    return {"message": "Tool created"}


# =========================================
# UPDATE TOOL (ADMIN)
# =========================================
@router.put("/{tool_id}")
def update_tool(tool_id: str, tool: ToolCreate, _=Depends(admin_only)):
    try:
        tid = int(tool_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tool id")

    result = tools_collection.update_one(
        {"id": tid},
        {"$set": tool.dict()}
    )

    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")

    return {"message": "Tool updated"}


# =========================================
# DELETE TOOL (ADMIN)
# =========================================
@router.delete("/{tool_id}")
def delete_tool(tool_id: str, _=Depends(admin_only)):
    try:
        tid = int(tool_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid tool id")

    result = tools_collection.delete_one({"id": tid})

    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Tool not found")

    # delete related reviews
    # delete related reviews where toolId is numeric
    reviews_collection.delete_many({"toolId": tid})

    return {"message": "Tool deleted"}
