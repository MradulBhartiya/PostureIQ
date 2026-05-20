import warnings

warnings.filterwarnings("ignore")
import cv2
import mediapipe as mp
import joblib
import numpy as np

# -----------------------------
# MediaPipe Setup
# -----------------------------
mp_pose = mp.solutions.pose
mp_drawing = mp.solutions.drawing_utils

# -----------------------------
# Model Paths
# -----------------------------
MODEL_PATH = "app/ml_models/bicep_model/model/RF_model.pkl"
SCALER_PATH = "app/ml_models/bicep_model/model/input_scaler.pkl"

# -----------------------------
# Load ML Model + Scaler
# -----------------------------
model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)

# -----------------------------
# Landmarks Used During Training
# -----------------------------
FEATURE_LANDMARKS = [
    "nose",
    "left_shoulder",
    "right_shoulder",
    "right_elbow",
    "left_elbow",
    "right_wrist",
    "left_wrist",
    "left_hip",
    "right_hip"
]

# -----------------------------
# Extract Features
# -----------------------------
def extract_features(results):

    if not results.pose_landmarks:
        return None

    landmarks = results.pose_landmarks.landmark

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

    return np.array(feature_vector).reshape(1, -1)

# -----------------------------
# Main Video Processing Function
# -----------------------------
def process_video(input_path: str, output_path: str):

    pose = mp_pose.Pose(
        static_image_mode=False,
        min_detection_confidence=0.5,
        min_tracking_confidence=0.5
    )

    cap = cv2.VideoCapture(input_path)

    width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps = int(cap.get(cv2.CAP_PROP_FPS))

    fourcc = cv2.VideoWriter_fourcc(*"mp4v")

    out = cv2.VideoWriter(
        output_path,
        fourcc,
        fps,
        (width, height)
    )

    while cap.isOpened():

        ret, frame = cap.read()

        if not ret:
            break

        # -----------------------------
        # Convert Frame to RGB
        # -----------------------------
        rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # -----------------------------
        # Pose Detection
        # -----------------------------
        results = pose.process(rgb_frame)

        prediction_text = "No Pose"

        if results.pose_landmarks:

            # -----------------------------
            # Extract Features
            # -----------------------------
            features = extract_features(results)

            if features is not None:

                # -----------------------------
                # Scale Features
                # -----------------------------
                scaled_features = scaler.transform(features)

                # -----------------------------
                # Predict Posture
                # -----------------------------
                prediction = model.predict(scaled_features)[0]

                prediction_text = (
                    "Correct"
                    if prediction == "C"
                    else "Lean"
                )

            # -----------------------------
            # Draw Skeleton
            # -----------------------------
            mp_drawing.draw_landmarks(
                frame,
                results.pose_landmarks,
                mp_pose.POSE_CONNECTIONS
            )

            # -----------------------------
            # Draw Prediction Text
            # -----------------------------
            color = (
                (0, 255, 0)
                if prediction_text == "Correct"
                else (0, 0, 255)
            )

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

        # -----------------------------
        # Write Output Frame
        # -----------------------------
        out.write(frame)

    # -----------------------------
    # Cleanup
    # -----------------------------
    cap.release()
    out.release()
    pose.close()

    return output_path