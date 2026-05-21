"use client";

import { useRef, useState } from "react";

import {
  Camera,
  Sparkles,
  Activity,
  RotateCcw,
  Dumbbell,
  ShieldAlert,
  ChevronDown,
} from "lucide-react";

import Navbar from "../components/Navbar";

export default function DashboardPage() {

  const [selectedExercise, setSelectedExercise] =
    useState("Bicep Curl");

  const [videoFile, setVideoFile] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string | null>(null);

  const [outputVideo, setOutputVideo] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [isDragging, setIsDragging] =
    useState(false);

  const [viewMode, setViewMode] =
    useState<"input" | "output">("input");

  // -----------------------------------
  // REAL ANALYTICS STATES
  // -----------------------------------
  const [repCount, setRepCount] =
    useState<string>("--");

  const [accuracy, setAccuracy] =
    useState<string>("--");

  const [correction, setCorrection] =
    useState<string>("Waiting for analysis");

  const [postureStatus, setPostureStatus] =
    useState<string>("--");

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const exerciseCards: Record<
    string,
    {
      image: string;
      correction: string;
    }
  > = {

    "Push-up": {
      image: "/Exercises/pushups.png",
      correction:
        "Maintain straight body posture.",
    },

    "Bicep Curl": {
      image: "/Exercises/bicep_curls.png",
      correction:
        "Keep elbows fixed and controlled.",
    },

    "Squat": {
      image: "/Exercises/squats.png",
      correction:
        "Lower hips and keep chest up.",
    },

    "Plank": {
      image: "/Exercises/plank.png",
      correction:
        "Keep spine neutral and core tight.",
    },

    "Lunges": {
      image: "/Exercises/lunges.png",
      correction:
        "Front knee should not collapse inward.",
    },
  };

  // -----------------------------------
  // Upload Handler
  // -----------------------------------
  const handleVideoUpload = (
    file: File
  ) => {

    setVideoFile(file);

    const url = URL.createObjectURL(file);

    setPreviewUrl(url);

    setViewMode("input");
  };

  // -----------------------------------
  // Exercise Mapping
  // -----------------------------------
  const getBackendExerciseName = (
    exercise: string
  ) => {

    if (exercise === "Bicep Curl")
      return "bicep";

    if (exercise === "Squat")
      return "squat";

    if (exercise === "Plank")
      return "plank";

    if (exercise === "Lunges")
      return "lunge";

    if (exercise === "Push-up")
      return "pushup";

    return "bicep";
  };

  // -----------------------------------
  // Analyze Video
  // -----------------------------------
  const handleAnalyze = async () => {

    if (!videoFile) {

      alert("Please upload video");

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append(
        "video",
        videoFile
      );

      formData.append(
        "exercise",
        getBackendExerciseName(
          selectedExercise
        )
      );

      const response = await fetch(
        "http://127.0.0.1:8000/predict",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log(data);

      // -----------------------------------
      // Output Video
      // -----------------------------------
      if (data.output_video_url) {

        const finalVideoUrl =
          `http://127.0.0.1:8000${data.output_video_url}`;

        setOutputVideo(finalVideoUrl);

        setViewMode("output");
      }

      // -----------------------------------
      // REAL ANALYTICS
      // -----------------------------------
      setRepCount(
        String(data.rep_count ?? "--")
      );

      setAccuracy(
        data.accuracy
          ? `${data.accuracy}%`
          : "--"
      );

      setCorrection(
        data.correction ??
        "No correction available"
      );

      setPostureStatus(
        data.posture_status ?? "--"
      );

    } catch (error) {

      console.error(error);

      alert("Analysis failed");

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="h-screen overflow-hidden bg-[#f5f5f7] flex flex-col">

      <Navbar />

      <main className="flex-1 px-3 py-3 overflow-hidden">

        <div className="grid grid-cols-12 gap-3 h-full">

          {/* LEFT PANEL */}
          <div className="col-span-12 xl:col-span-9 h-full min-h-0">

            <div className="bg-white border border-gray-200 rounded-[26px] shadow-sm h-full p-4 flex flex-col overflow-hidden">

              {/* HEADER */}
              <div className="mb-1 shrink-0">

                <h1 className="text-[22px] font-bold text-[#111827] leading-tight">
                  AI Exercise Analysis
                </h1>

              </div>

              {/* DROPDOWN */}
              <div className="relative mb-3 shrink-0">

                <select
                  value={selectedExercise}
                  onChange={(e) =>
                    setSelectedExercise(
                      e.target.value
                    )
                  }
                  className="w-full appearance-none bg-[#fafafa] border border-gray-200 rounded-2xl px-4 py-3 text-[16px] font-semibold text-[#111827] outline-none"
                >

                  <option>Bicep Curl</option>
                  <option>Squat</option>
                  <option>Push-up</option>
                  <option>Plank</option>
                  <option>Lunges</option>

                </select>

                <ChevronDown
                  size={20}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />

              </div>

              {/* VIDEO CONTAINER */}
              <div
                onDrop={(e) => {

                  e.preventDefault();

                  setIsDragging(false);

                  const file =
                    e.dataTransfer.files[0];

                  if (
                    file &&
                    file.type.startsWith("video/")
                  ) {
                    handleVideoUpload(file);
                  }
                }}

                onDragOver={(e) => {

                  e.preventDefault();

                  setIsDragging(true);
                }}

                onDragLeave={() => {
                  setIsDragging(false);
                }}

                className={`relative h-[600px] rounded-[28px] overflow-hidden border transition-all duration-300
                  ${
                    isDragging
                      ? "border-black bg-black/5"
                      : "border-gray-200 bg-[#f8f8fa]"
                  }`}
              >

                {/* FILE INPUT */}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="video/*"
                  onChange={(e) => {

                    const file =
                      e.target.files?.[0];

                    if (file) {
                      handleVideoUpload(file);
                    }
                  }}
                />

                {/* CAMERA BUTTON */}
                <button
                  className="absolute top-4 left-4 z-20 bg-black/85 hover:bg-black text-white px-4 py-2 rounded-2xl flex items-center gap-2 transition-all"
                >

                  <Camera size={16} />

                  <span className="font-medium text-sm">
                    Switch Camera
                  </span>

                </button>

                {/* EMPTY STATE */}
                {!previewUrl ? (

                  <div
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                    className="absolute inset-0 flex items-center justify-center cursor-pointer p-6"
                  >

                    <div className="w-full h-full border-2 border-dashed border-gray-400 bg-white/60 backdrop-blur-sm rounded-[28px] shadow-inner flex flex-col items-center justify-center text-center">

                      <div className="text-[56px] mb-3">
                        ☁️
                      </div>

                      <h2 className="text-[22px] font-bold text-[#111827]">
                        Drag & Drop your video here
                      </h2>

                      <p className="text-gray-500 mt-2 text-[15px]">
                        or click to browse
                      </p>

                    </div>

                  </div>

                ) : (

                  <video
                    key={
                      viewMode === "input"
                        ? previewUrl
                        : outputVideo
                    }
                    src={
                      viewMode === "input"
                        ? previewUrl || ""
                        : outputVideo || ""
                    }
                    controls
                    autoPlay
                    preload="auto"
                    className="w-full h-full object-contain bg-black"
                  />

                )}

                {/* BOTTOM SWITCH */}
                <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-md py-2 flex items-center justify-center">

                  <div className="bg-white rounded-full p-1 flex shadow-lg">

                    <button
                      onClick={() =>
                        setViewMode("input")
                      }
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2
                      ${
                        viewMode === "input"
                          ? "bg-black text-white"
                          : "text-gray-500"
                      }`}
                    >

                      <Camera size={15} />

                      Input

                    </button>

                    <button
                      onClick={() => {

                        if (outputVideo) {
                          setViewMode("output");
                        }
                      }}
                      className={`px-6 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2
                      ${
                        viewMode === "output"
                          ? "bg-black text-white"
                          : "text-gray-500"
                      }`}
                    >

                      <Sparkles size={15} />

                      Output

                    </button>

                  </div>

                </div>

              </div>

              {/* ANALYZE BUTTON */}
              <div className="flex justify-center mt-3 shrink-0">

                <button
                  onClick={handleAnalyze}
                  disabled={loading}
                  className="bg-black hover:bg-[#1c1c1c] active:scale-95 transition-all duration-200 text-white px-7 py-3 rounded-2xl flex items-center gap-3 text-[15px] font-semibold shadow-lg disabled:opacity-70"
                >

                  <Sparkles size={18} />

                  {loading
                    ? "Analyzing..."
                    : "Analyze Exercise"}

                </button>

              </div>

            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="col-span-12 xl:col-span-3 h-full min-h-0">

            <div className="bg-white border border-gray-200 rounded-[26px] shadow-sm h-full p-4 flex flex-col overflow-hidden">

              {/* TITLE */}
              <div className="flex items-center gap-3 mb-3 shrink-0">

                <div className="w-10 h-10 rounded-2xl bg-[#f5f5f7] flex items-center justify-center">

                  <Activity
                    size={20}
                    className="text-black"
                  />

                </div>

                <h2 className="text-[24px] font-bold text-[#111827]">
                  Analysis
                </h2>

              </div>

              {/* REP */}
              <div className="bg-[#fafafa] border border-gray-200 rounded-3xl p-3 flex items-center gap-3 mb-3 shrink-0">

                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">

                  <RotateCcw size={20} />

                </div>

                <div>

                  <p className="text-gray-500 text-xs">
                    Repetition Count
                  </p>

                  <h3 className="text-[17px] font-bold text-[#111827]">
                    {repCount}
                  </h3>

                </div>

              </div>

              {/* ACCURACY */}
              <div className="bg-[#fafafa] border border-gray-200 rounded-3xl p-3 flex items-center gap-3 mb-3 shrink-0">

                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">

                  <Dumbbell size={20} />

                </div>

                <div>

                  <p className="text-gray-500 text-xs">
                    Correction Accuracy
                  </p>

                  <h3 className="text-[17px] font-bold text-[#111827]">
                    {accuracy}
                  </h3>

                </div>

              </div>

              {/* CORRECTION */}
              <div className="bg-[#fafafa] border border-gray-200 rounded-3xl p-3 flex items-center gap-3 mb-3 shrink-0">

                <div className="w-11 h-11 rounded-2xl bg-black text-white flex items-center justify-center">

                  <ShieldAlert size={20} />

                </div>

                <div>

                  <p className="text-gray-500 text-xs">
                    Posture Correction
                  </p>

                  <h3 className="text-[14px] font-semibold text-[#111827] leading-snug">
                    {correction}
                  </h3>

                </div>

              </div>

              {/* GUIDE */}
              <div className="flex-1 min-h-0 bg-[#fafafa] border border-gray-200 rounded-[28px] overflow-hidden flex flex-col">

                <div className="p-4 shrink-0">

                  <h3 className="text-[20px] font-bold text-[#111827]">
                    {selectedExercise}
                  </h3>

                </div>

                <div className="flex-1 min-h-0 px-3 flex items-center justify-center overflow-hidden">

                  <img
                    src={
                      exerciseCards[
                        selectedExercise
                      ]?.image
                    }
                    alt={selectedExercise}
                    className="max-h-full max-w-full object-contain"
                  />

                </div>

                <div className="px-4 pb-4 shrink-0">

                  <p className="text-gray-500 text-[13px] leading-relaxed">

                    Status:
                    {" "}
                    <span className="font-semibold text-black">
                      {postureStatus}
                    </span>

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}