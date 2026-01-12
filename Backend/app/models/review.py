from datetime import datetime

def review_model(data, username):
    return {
        **data,
        "username": username,
        "status": "pending",
        "createdAt": datetime.utcnow()
    }
