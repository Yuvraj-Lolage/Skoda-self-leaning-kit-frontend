import React from "react";

interface TrainingPdfProps {
    pdf_url: string;
}

const TrainingPdf: React.FC<TrainingPdfProps> = ({ pdf_url }) => (
    <iframe
        src={pdf_url}
        className="w-full h-[80vh] rounded-lg"
        title="PDF Viewer"
    />
);

export default TrainingPdf;
