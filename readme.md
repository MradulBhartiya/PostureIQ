README.md (Main Entry Point)
│
├── frontend/README.md
├── backend/README.md
├── ml/README.md
│
└── docs/
    ├── Report.pdf
    ├── Architecture.png
    ├── FrontendArchitecture.png
    ├── BackendArchitecture.png
    └── Screenshots/
    
 # 🏋️ PostureIQ

### AI-Powered Exercise Posture Analysis Platform

Transform workout videos into actionable posture insights using
Computer Vision, Machine Learning, and Full-Stack Engineering.

![Status](https://img.shields.io/badge/Status-MVP-success)
![Python](https://img.shields.io/badge/Python-3.11-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-Backend-green)
![NextJS](https://img.shields.io/badge/Next.js-Frontend-black)
![License](https://img.shields.io/badge/License-MIT-orange)

![PostureIQ Architecture](docs/images/system_architecture.png)

## 📌 Navigation

- 🚀 Overview
- ✨ Features
- 🏗️ Architecture
- 🔄 Workflow
- 📊 Results
- 📸 Screenshots
- 🛠️ Tech Stack
- 📂 Project Structure
- ⚙️ Installation
- 📖 Documentation
- 👨‍💻 Team

## 🚀 Overview

PostureIQ is an AI-powered fitness intelligence platform that analyzes workout videos and evaluates exercise posture using Computer Vision and Machine Learning.

The platform supports:

✅ Bicep Curl

✅ Squat

✅ Lunges

✅ Plank

Users receive:

📈 Posture Accuracy

🔁 Repetition Count

🎥 Annotated Videos

📊 Workout Analytics


## ✨ Features

| Feature | Description |
|----------|-------------|
| 🎥 Video Upload | Upload workout videos |
| 🧠 Pose Estimation | MediaPipe Landmark Extraction |
| 📏 Posture Analysis | Exercise-specific ML Models |
| 🔁 Rep Counting | Angle-Based Tracking |
| 📊 Analytics | Workout Insights |
| 🎯 Accuracy Score | Frame-Level Evaluation |
| 🎮 Gamification | XP, Achievements, Streaks |

## 🏗️ System Architecture
          User
            │
            ▼
      Next.js Frontend
            │
            ▼
       FastAPI Backend
            │
    ┌───────┼────────┐
    ▼                ▼
MediaPipe        ML Models
    │                │
    └───────┬────────┘
            ▼
      Analytics Engine
            ▼
     Annotated Results

## 🔄 End-to-End Workflow
Upload Video
      │
      ▼
Frame Extraction
      │
      ▼
MediaPipe Pose
      │
      ▼
Feature Engineering
      │
      ▼
Machine Learning
      │
      ▼
Posture Prediction
      │
      ▼
Rep Counting
      │
      ▼
Analytics Generation
      │
      ▼
Annotated Output

## 📸 Application Preview
Home Page

(image)

Dashboard

(image)

Exercise Analysis

(image)

Output Video

(image)

The screenshots on pages 3 and 7 are perfect candidates.

## 🏋️ Supported Exercises

| Exercise | Model |
|-----------|---------|
| Bicep Curl | Random Forest |
| Squat | SGDC |
| Lunges | Random Forest |
| Plank | Random Forest |
| Push-Up | In Development |

Performance

This looks much better than a table.

Based on your final results table.

## 🛠️ Technology Stack

Frontend
├── Next.js
├── TypeScript
└── TailwindCSS

Backend
├── FastAPI
├── Uvicorn
└── REST APIs

Computer Vision
├── MediaPipe
└── OpenCV

Machine Learning
├── Scikit-Learn
├── NumPy
├── Pandas
└── Random Forest

Database
└── Supabase

## 📂 Repository Structure
PostureIQ
│
├── frontend
│   ├── app
│   ├── components
│   └── pages
│
├── backend
│   ├── routes
│   ├── services
│   ├── models
│   └── inference
│
├── ml
│   ├── datasets
│   ├── notebooks
│   ├── training
│   └── evaluation
│
├── docs
│   ├── Report.pdf
│   ├── Architecture
│   └── Images
│
└── README.md

## 📖 Documentation

| Module | Documentation |
|----------|--------------|
| Frontend | frontend/README.md |
| Backend | backend/README.md |
| Machine Learning | ml/README.md |
| Full Report | docs/PostureIQ_Report.pdf |

## 👨‍💻 Development Team

### Mradul Bhartiya
Machine Learning • Computer Vision • Backend Development

### Moksh Kasture
Frontend Development • UI/UX • Dashboard Design
