from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Form
)

import shutil
import uuid
import os

from app.services.video_processor import process_video

router = APIRouter()

# -----------------------------------
# Folders
# -----------------------------------
UPLOAD_DIR = "app/uploads"

OUTPUT_DIR = "app/outputs"

os.makedirs(UPLOAD_DIR, exist_ok=True)

os.makedirs(OUTPUT_DIR, exist_ok=True)

# -----------------------------------
# Predict Route
# -----------------------------------
@router.post("/predict")
async def predict_video(

    video: UploadFile = File(...),

    exercise: str = Form(...)

):

    # -----------------------------------
    # Unique File ID
    # -----------------------------------
    unique_id = str(uuid.uuid4())

    # -----------------------------------
    # Input / Output Paths
    # -----------------------------------
    input_path = (
        f"{UPLOAD_DIR}/{unique_id}.mp4"
    )

    output_filename = (
        f"{unique_id}_output.mp4"
    )

    output_path = (
        f"{OUTPUT_DIR}/{output_filename}"
    )

    # -----------------------------------
    # Save Uploaded Video
    # -----------------------------------
    with open(input_path, "wb") as buffer:

        shutil.copyfileobj(
            video.file,
            buffer
        )

    # -----------------------------------
    # Process Video
    # -----------------------------------
    result = process_video(

        input_path=input_path,

        output_path=output_path,

        exercise=exercise.lower()
    )

    # -----------------------------------
    # Output Video URL
    # -----------------------------------
    output_video_url = (
        f"/outputs/{output_filename}"
    )

    # -----------------------------------
    # Debug Logs
    # -----------------------------------
    print("OUTPUT VIDEO:", output_path)

    print("OUTPUT URL:", output_video_url)

    print("ANALYTICS:", result)

    # -----------------------------------
    # API Response
    # -----------------------------------
    return {

        "message": "success",

        "exercise": exercise,

        "rep_count":
            result["rep_count"],

        "accuracy":
            result["accuracy"],

        "correction":
            result["correction"],

        "posture_status":
            result["posture_status"],

        "correct_frames":
            result["correct_frames"],

        "incorrect_frames":
            result["incorrect_frames"],

        "output_video_url":
            output_video_url
    }