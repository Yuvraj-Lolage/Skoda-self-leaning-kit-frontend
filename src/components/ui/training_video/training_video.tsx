import { useRef, useState } from "react";

interface TrainingVideoProps {
  video_url: string;
}

export default function TrainingVideo({ video_url }: TrainingVideoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null); // Type properly
  const [completed, setCompleted] = useState(false);

  // Track last played time to prevent skipping
  let lastTime = 0;

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    lastTime = video.currentTime;

    // Mark as completed if reached end
    if (video.currentTime >= video.duration - 0.5) {
      setCompleted(true);
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
    <div>
      <video
        ref={videoRef}
        src={ video_url }
        controls
        controlsList="nodownload noremoteplayback"
        disablePictureInPicture
        width={600}
        onTimeUpdate={handleTimeUpdate}
        onSeeking={handleSeeking}
        onPlay={() => { lastTime = 0; }}
      />
      <p className="text-black">Status: {completed ? "✅ Completed" : "⏳ In Progress"}</p>
    </div>
  );
}
