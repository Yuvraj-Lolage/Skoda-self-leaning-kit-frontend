import React from "react";

interface TrainingWordProps {
  file_url: string;
}

const TrainingWord: React.FC<TrainingWordProps> = ({ file_url }) => {
  const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(
    file_url
  )}&embedded=true`;

  return (
    <iframe
      src={viewerUrl}
      className="w-full h-[80vh] rounded-lg"
      title="Word Viewer"
    />
  );
};

export default TrainingWord;
