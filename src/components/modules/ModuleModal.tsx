import React from "react";
import male_caricature from "../../assets/RYAN_2.png";
import female_caricature from "../../assets/EMMA_2.png";

interface ModuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  moduleName: string;
  moduleNumber: number;
  lessonsCount: number;
  duration: string;
  onStartModule: () => void;
}

export function ModuleModal({
  isOpen,
  onClose,
  moduleName,
  moduleNumber,
  lessonsCount,
  duration,
  onStartModule,
}: ModuleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 1. Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        style={{ animation: "fadeIn 0.3s ease-out" }}
      ></div>

      {/* 2. Modal Content */}
      <div
        className="relative bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden"
        style={{ animation: "scaleIn 0.3s ease-out" }}
      >
        {/* Close Button (SVG Icon) */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
        >
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* 3. Character & Blackboard Section */}
        <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8 pt-12">
          <div className="flex items-end justify-center">
            <div className="relative w-full">
              {/* The Blackboard */}
              <div className="bg-[#2d2d2d] rounded-2xl p-8 shadow-2xl border-[6px] border-[#b8860b] min-h-[260px] relative">
                
                {/* Character Image (Absolute Positioned) */}
                {/* Note: Ensure these assets are in your public folder or src/assets */}
                <img
                  src={moduleNumber % 2 === 0 ? male_caricature : female_caricature }
                  alt="Instructor"
                  className="absolute -left-16 -bottom-6 w-56 h-auto z-20 drop-shadow-xl object-contain"
                />

                {/* Text Content inside Blackboard */}
                <div className="relative z-10 ml-32 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded-lg text-sm">
                      MODULE {moduleNumber}
                    </div>
                    <div className="flex-1 h-px bg-white/20"></div>
                  </div>

                  <h3 className="text-white font-extrabold text-2xl uppercase tracking-tight leading-tight">
                    {moduleName}
                  </h3>

                  <div className="flex gap-4 text-xs font-semibold text-gray-300 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" /></svg>
                      {lessonsCount} Lessons
                    </span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" /></svg>
                      {duration}
                    </span>
                  </div>

                  {/* Start Module Button (On Board) */}
                  <button
                    onClick={onStartModule}
                    className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-3 rounded-full font-black text-sm uppercase shadow-lg hover:scale-105 transition-transform active:scale-95"
                  >
                    Start Learning
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Bottom Action Section */}
        <div className="p-8 space-y-6">
          <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              You're about to start <span className="font-bold text-gray-900">{moduleName}</span>. Ready to dive into this module?
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={onClose}
              className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-colors uppercase text-sm tracking-wider"
            >
              Cancel
            </button>
            <button
              onClick={onStartModule}
              className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-opacity uppercase text-sm tracking-wider"
            >
              Start Module
            </button>
          </div>
        </div>
      </div>

      {/* Internal CSS for Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}