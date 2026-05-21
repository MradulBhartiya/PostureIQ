from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routers.predict import router as predict_router

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(predict_router)

# STATIC FOLDERS
app.mount(
    "/outputs",
    StaticFiles(directory="app/outputs"),
    name="outputs"
)

app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)