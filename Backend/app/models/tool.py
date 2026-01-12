from datetime import datetime

def tool_model(data):
    data["createdAt"] = datetime.utcnow()
    return data
