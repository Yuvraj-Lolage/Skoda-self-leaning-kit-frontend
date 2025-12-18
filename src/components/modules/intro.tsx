import React from 'react';
import maleCaricature from '../../assets/RYAN_2.png';
import femaleCaricature from '../../assets/EMMA_2.png';

interface ModuleIntroProps {
  moduleName: string;
  moduleId: number;
  onProceed: () => void;
}

const ModuleIntro: React.FC<ModuleIntroProps> = ({ moduleName, moduleId, onProceed }) => {
  // Select character based on moduleId logic
  const caricature = moduleId % 2 === 0 ? maleCaricature : femaleCaricature;
  const characterName = moduleId % 2 === 0 ? 'RYAN' : 'EMMA';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* 1. Blurred Background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-md -z-10" />

      <div className="relative w-full max-w-6xl flex flex-col md:flex-row items-center justify-center">
        
        {/* 2. Character Image - Shifted right to overlap the board */}
        <div className="relative z-20 md:-mr-16 animate-bounce-in">
          <img
            src={maleCaricature}
            alt={`${characterName} caricature`}
            className="w-64 md:w-[480px] h-auto drop-shadow-2xl object-contain"
          />
        </div>

        {/* 3. The Blackboard (The Board) */}
        <div className="relative z-10 w-full max-w-2xl bg-[#373737] border-[10px] border-[#c5a059] rounded-[40px] shadow-2xl p-12 flex flex-col items-center justify-center text-center animate-slide-right">
          
          {/* Module Number */}
          <h2 className="text-[#f0f0f0] text-xl md:text-2xl font-bold uppercase tracking-[0.2em] mb-4">
            Module No {moduleId}.
          </h2>
          
          {/* Dynamic Module Name */}
          <h1 className="text-white text-3xl md:text-4xl font-extrabold uppercase mb-12 leading-tight">
            {moduleName}
          </h1>

          {/* Start Module Button - Purple Gradient */}
          <button
            onClick={onProceed}
            className="bg-gradient-to-r from-[#6b52ee] to-[#9e5cf1] text-white px-14 py-4 rounded-full text-lg font-black shadow-xl hover:scale-105 active:scale-95 transition-all uppercase tracking-widest"
          >
            Start Module
          </button>
        </div>
      </div>

      {/* Custom Keyframes for the Animation */}
      <style>{`
        @keyframes slideRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); }
        }
        .animate-slide-right {
          animation: slideRight 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-bounce-in {
          animation: bounceIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>
  );
};

export default ModuleIntro;