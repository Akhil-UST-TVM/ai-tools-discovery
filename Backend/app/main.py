from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import auth, tools, reviews, admin

app = FastAPI()

# Allow only local frontend origins in development. Using a specific origin
# (instead of "*") ensures Access-Control-Allow-Origin will be set correctly
# when credentials are used. Add other origins here as needed.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://127.0.0.1:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tools.router)
app.include_router(reviews.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Backend running"}
