from fastapi import APIRouter, UploadFile, File, Form
import shutil
import uuid
import os

from app.services.video_processor import process_video

router = APIRouter()

UPLOAD_DIR = "app/uploads"
OUTPUT_DIR = "app/outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)


@router.post("/predict")
async def predict_video(
    video: UploadFile = File(...),
    exercise: str = Form(...)
):

    unique_id = str(uuid.uuid4())

    input_path = f"{UPLOAD_DIR}/{unique_id}.mp4"
    output_path = f"{OUTPUT_DIR}/{unique_id}_output.mp4"

    with open(input_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    process_video(input_path, output_path)

    print("OUTPUT VIDEO:", output_path)
    print("OUTPUT URL:", f"/outputs/{unique_id}_output.mp4")
    return {
        "message": "success",
        "exercise": exercise,
        "rep_count": 12,
        "accuracy": "92%",
        "correction": "Keep posture straight",
        "output_video_url": f"/outputs/{unique_id}_output.mp4"
    }