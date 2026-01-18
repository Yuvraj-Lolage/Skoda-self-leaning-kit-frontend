import React from "react";

interface TrainingExcelProps {
    file_url: string;
}

const TrainingExcel: React.FC<TrainingExcelProps> = ({ file_url }) => (
    <iframe
        src={file_url}
        className="w-full h-[80vh] rounded-lg"
        title="PDF Viewer"
    />
);

export default TrainingExcel;
