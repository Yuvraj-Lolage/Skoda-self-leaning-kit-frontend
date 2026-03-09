import React from "react";

interface TrainingIframeProps {
    url: string;
}

const TrainingIframe: React.FC<TrainingIframeProps> = ({ url }) => (
    <iframe
        src={url}
        className="w-full h-[80vh] rounded-lg"
        title="Web Content"
    />
);

export default TrainingIframe;
