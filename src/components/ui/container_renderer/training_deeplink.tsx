import React from "react";

interface TrainingDeeplinksProps {
    url: string;
}

const TrainingDeepLink: React.FC<TrainingDeeplinksProps> = ({ url }) => (
    <iframe
        src={url}
        className="w-full h-[80vh] rounded-lg"
        title="PDF Viewer"
    />
);

export default TrainingDeepLink;
