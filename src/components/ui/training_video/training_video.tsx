import { useRef, useState } from "react";
import { ToastHelper } from "../toast_helper/toast";
import axiosInstance from "../../../API/axios_instance";
import { useParams } from "react-router-dom";

interface TrainingVideoProps {
  video_url: string;
}

export default function TrainingVideo({ video_url }: TrainingVideoProps) {
  const hasCompletedRef = useRef(false);

  const { module_id, sub_id } = useParams<{ module_id?: string; sub_id?: string }>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [completed, setCompleted] = useState(false);

  // Track last played time to prevent skipping
  let lastTime = 0;

  const handleTimeUpdate = async () => {
  const video = videoRef.current;
  if (!video) return;

  // ⛔ already completed → do nothing
  if (hasCompletedRef.current) return;

  lastTime = video.currentTime;

  if (video.currentTime >= video.duration - 0.5) {
    hasCompletedRef.current = true; // 🔐 lock immediately
    setCompleted(true);

    const data = {
      moduleId: Number(module_id),
      submoduleId: Number(sub_id),
    };

    try {
      await axiosInstance.post(
        "/user-progress/complete-submodule",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      ToastHelper.success(
        "Congratulations! You've completed the training video."
      );
    } catch (err) {
      hasCompletedRef.current = false; // allow retry on failure
      ToastHelper.error(
        "Error marking submodule as completed. Please try again."
      );
    }
  }
};


  const handleSeeking = () => {
    const video = videoRef.current;
    if (!video) return;

    // Prevent skipping forward
    if (video.currentTime > lastTime + 0.1) {
      video.currentTime = lastTime;
    }
  };

  return (
    <div className="w-full">
      <video
        ref={videoRef}
        src={video_url}
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        style={{ height: '600px' }}
        className="w-full h-auto rounded-lg"
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onPlay={() => { lastTime = 0; }}
      />
      <p className="text-black">
        Status: {completed ? "✅ Completed" : "⏳ In Progress"}
      </p>
    </div>

  );
}
