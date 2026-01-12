from datetime import datetime

def user_model(username, password, role):
    return {
        "username": username,
        "password": password,
        "role": role,
        "createdAt": datetime.utcnow()
    }
