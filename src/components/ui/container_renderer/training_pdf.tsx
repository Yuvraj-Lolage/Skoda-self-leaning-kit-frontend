// import React from "react";

// interface TrainingPdfProps {
//     pdf_url: string;
// }

// const TrainingPdf: React.FC<TrainingPdfProps> = ({ pdf_url }) => (


//     // const data = {
//     //   moduleId: Number(module_id),
//     //   submoduleId: Number(sub_id),
//     // };

//     // try {
//     //   await axiosInstance.post(
//     //     "/user-progress/complete-submodule",
//     //     data,
//     //     {
//     //       headers: {
//     //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//     //       },
//     //     }
//     //   );

//     //   ToastHelper.success(
//     //     "Congratulations! You've completed the training video."
//     //   );
//     // } catch (err) {
//     //   hasCompletedRef.current = false; // allow retry on failure
//     //   ToastHelper.error(
//     //     "Error marking submodule as completed. Please try again."
//     //   );
//     // }



    
//     <iframe
//         src={pdf_url}
//         className="w-full h-[80vh] rounded-lg"
//         title="PDF Viewer"
//     />
// );

// export default TrainingPdf;

import React, { useEffect, useState } from "react";
import axiosInstance from "../../../API/axios_instance";
import { ToastHelper } from "../toast_helper/toast";


interface TrainingPdfProps {
  pdf_url: string;
  module_id: number;
  sub_id: number;
  onComplete?: () => void;
}

const DEFAULT_TRACK_ID = 1;

const TrainingPdf: React.FC<TrainingPdfProps> = ({
  pdf_url,
  module_id,
  sub_id,
  onComplete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [canComplete, setCanComplete] = useState(false);
  const [loading, setLoading] = useState(false);

  // 👉 Show confirm when PDF loads
  useEffect(() => {
    if (pdf_url) {
      setShowConfirm(true);
    }
  }, [pdf_url]);

  // 👉 Handle confirm
  const handleConfirm = () => {
    setShowConfirm(false);
    setCanComplete(true);
  };

  // 👉 Mark complete API
  const handleComplete = async () => {
    try {
      setLoading(true);

      const data = {
        moduleId: Number(module_id),
        submoduleId: Number(sub_id),
        trackId: DEFAULT_TRACK_ID,
      };

      await axiosInstance.post(
        "/learning-progress/complete-submodule",
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      onComplete?.();

      ToastHelper.success("Submodule marked as completed!");
      setCanComplete(false);
    } catch (err) {
      ToastHelper.error("Failed to mark as completed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ✅ Confirmation Modal */}
      {showConfirm && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px] text-center">
            <h2 className="text-lg font-semibold mb-3">
              Please read the document
            </h2>
            <p className="text-sm text-gray-600 mb-5">
              Once you finish reading, you can mark this as complete.
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ PDF Viewer */}
      <iframe
        src={pdf_url}
        className="w-full h-[80vh] rounded-lg"
        title="PDF Viewer"
      />

      {/* ✅ Complete Button */}
      {canComplete && (
        <div className="mt-4 text-right">
          <button
            onClick={handleComplete}
            disabled={loading}
            className="px-5 py-2 bg-green-600 text-white rounded"
          >
            {loading ? "Processing..." : "Mark as Complete"}
          </button>
        </div>
      )}
    </div>
  );
};

export default TrainingPdf;