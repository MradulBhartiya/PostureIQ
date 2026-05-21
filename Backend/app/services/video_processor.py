import warnings

warnings.filterwarnings("ignore")

import cv2
import mediapipe as mp
import joblib
import numpy as np

# -----------------------------------
# MediaPipe Setup
# -----------------------------------
mp_pose = mp.solutions.pose

mp_drawing = mp.solutions.drawing_utils

# -----------------------------------
# Model Paths
# -----------------------------------
MODEL_PATH = (
    "app/ml_models/bicep_model/model/RF_model.pkl"
)

SCALER_PATH = (
    "app/ml_models/bicep_model/model/input_scaler.pkl"
)

# -----------------------------------
# Load Model + Scaler
# -----------------------------------
model = joblib.load(MODEL_PATH)

scaler = joblib.load(SCALER_PATH)

# -----------------------------------
# Feature Landmarks
# -----------------------------------
FEATURE_LANDMARKS = [

    "nose",

    "left_shoulder",
    "right_shoulder",

    "left_elbow",
    "right_elbow",

    "left_wrist",
    "right_wrist",

    "left_hip",
    "right_hip"
]

# -----------------------------------
# Extract Features
# -----------------------------------
def extract_features(results):

    if not results.pose_landmarks:
        return None

    landmarks = (
        results.pose_landmarks.landmark
    )

    feature_vector = []

    for landmark_name in FEATURE_LANDMARKS:

        landmark = getattr(
            mp_pose.PoseLandmark,
            landmark_name.upper()
        )

        point = landmarks[landmark.value]

        feature_vector.extend([

            point.x,

            point.y,

            point.z,

            point.visibility
        ])

    return np.array(
        feature_vector
    ).reshape(1, -1)

# -----------------------------------
# Calculate Joint Angle
# -----------------------------------
def calculate_angle(a, b, c):

    a = np.array(a)

    b = np.array(b)

    c = np.array(c)

    radians = np.arctan2(
        c[1] - b[1],
        c[0] - b[0]
    ) - np.arctan2(
        a[1] - b[1],
        a[0] - b[0]
    )

    angle = np.abs(
        radians * 180.0 / np.pi
    )

    if angle > 180:
        angle = 360 - angle

    return angle

# -----------------------------------
# Main Video Processing
# -----------------------------------
def process_video(

    input_path: str,

    output_path: str,

    exercise: str = "bicep"
):

    # -----------------------------------
    # Pose Detector
    # -----------------------------------
    pose = mp_pose.Pose(

        static_image_mode=False,

        min_detection_confidence=0.5,

        min_tracking_confidence=0.5
    )

    # -----------------------------------
    # Open Video
    # -----------------------------------
    cap = cv2.VideoCapture(input_path)

    width = int(
        cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    )

    height = int(
        cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    )

    fps = int(
        cap.get(cv2.CAP_PROP_FPS)
    )

    if fps <= 0:
        fps = 30
    # -----------------------------------
    # Browser Compatible Codec
    # -----------------------------------
    fourcc = cv2.VideoWriter_fourcc(*"avc1")

    out = cv2.VideoWriter(

        output_path,

        fourcc,

        fps,

        (width, height)
    )

    # -----------------------------------
    # Analytics Variables
    # -----------------------------------
    correct_frames = 0

    incorrect_frames = 0

    posture_status = "Unknown"

    # -----------------------------------
    # Rep Counter Variables
    # -----------------------------------
    rep_count = 0

    stage = "down"

    # -----------------------------------
    # Frame Loop
    # -----------------------------------
    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        # -----------------------------------
        # Convert BGR -> RGB
        # -----------------------------------
        rgb_frame = cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )

        # -----------------------------------
        # Pose Detection
        # -----------------------------------
        results = pose.process(rgb_frame)

        prediction_text = "No Pose"

        # -----------------------------------
        # Pose Found
        # -----------------------------------
        if results.pose_landmarks:

            landmarks = (
                results.pose_landmarks.landmark
            )

            # -----------------------------------
            # Right Arm Coordinates
            # -----------------------------------
            shoulder = [

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_SHOULDER.value
                ].x,

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_SHOULDER.value
                ].y
            ]

            elbow = [

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_ELBOW.value
                ].x,

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_ELBOW.value
                ].y
            ]

            wrist = [

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_WRIST.value
                ].x,

                landmarks[
                    mp_pose.PoseLandmark.RIGHT_WRIST.value
                ].y
            ]

            # -----------------------------------
            # Elbow Angle
            # -----------------------------------
            angle = calculate_angle(

                shoulder,

                elbow,

                wrist
            )

            # -----------------------------------
            # Rep Counter Logic
            # -----------------------------------
            if angle > 150:

                stage = "down"

            if angle < 50 and stage == "down":

                stage = "up"

                rep_count += 1

            # -----------------------------------
            # Feature Extraction
            # -----------------------------------
            features = extract_features(
                results
            )

            if features is not None:

                # -----------------------------------
                # Feature Scaling
                # -----------------------------------
                scaled_features = (
                    scaler.transform(features)
                )

                # -----------------------------------
                # Prediction
                # -----------------------------------
                prediction = model.predict(
                    scaled_features
                )[0]

                # -----------------------------------
                # Prediction Mapping
                # -----------------------------------
                prediction_text = (

                    "Correct"

                    if prediction == "C"

                    else "Lean"
                )

                posture_status = prediction_text

                # -----------------------------------
                # Analytics Counters
                # -----------------------------------
                if prediction == "C":

                    correct_frames += 1

                else:

                    incorrect_frames += 1

            # -----------------------------------
            # Draw Skeleton
            # -----------------------------------
            mp_drawing.draw_landmarks(

                frame,

                results.pose_landmarks,

                mp_pose.POSE_CONNECTIONS
            )

            # -----------------------------------
            # Text Color
            # -----------------------------------
            color = (

                (0, 255, 0)

                if prediction_text == "Correct"

                else (0, 0, 255)
            )

            # -----------------------------------
            # Posture Text
            # -----------------------------------
            cv2.putText(

                frame,

                f"Posture: {prediction_text}",

                (30, 50),

                cv2.FONT_HERSHEY_SIMPLEX,

                1,

                color,

                2,

                cv2.LINE_AA
            )

            # -----------------------------------
            # Rep Count Text
            # -----------------------------------
            cv2.putText(

                frame,

                f"Reps: {rep_count}",

                (30, 100),

                cv2.FONT_HERSHEY_SIMPLEX,

                1,

                (0, 255, 255),

                2,

                cv2.LINE_AA
            )

            # -----------------------------------
            # Angle Text
            # -----------------------------------
            cv2.putText(

                frame,

                str(int(angle)),

                tuple(
                    np.multiply(
                        elbow,
                        [width, height]
                    ).astype(int)
                ),

                cv2.FONT_HERSHEY_SIMPLEX,

                1,

                (255, 255, 255),

                2,

                cv2.LINE_AA
            )

        # -----------------------------------
        # Write Frame
        # -----------------------------------
        out.write(frame)

    # -----------------------------------
    # Final Analytics
    # -----------------------------------
    total_frames = (

        correct_frames +

        incorrect_frames
    )

    accuracy = 0

    if total_frames > 0:

        accuracy = (

            correct_frames /

            total_frames
        ) * 100

    # -----------------------------------
    # Correction Feedback
    # -----------------------------------
    if accuracy >= 90:

        correction = (
            "Excellent posture"
        )

    elif accuracy >= 75:

        correction = (
            "Minor posture correction needed"
        )

    else:

        correction = (
            "Keep posture straight"
        )

    # -----------------------------------
    # Cleanup
    # -----------------------------------
    cap.release()

    out.release()

    pose.close()

    # -----------------------------------
    # Return Analytics
    # -----------------------------------
    return {

        "rep_count":
            rep_count,

        "accuracy":
            round(accuracy, 2),

        "correction":
            correction,

        "posture_status":
            posture_status,

        "correct_frames":
            correct_frames,

        "incorrect_frames":
            incorrect_frames
    }