import React from 'react';
import maleCaricature from '../../assets/male_caricature.png';
import femaleCaricature from '../../assets/female_caricature.png';

interface ModuleIntroProps {
  moduleName: string;
  motivationalMessage: string;
  moduleId: number; // To alternate caricatures
}

const ModuleIntro: React.FC<ModuleIntroProps> = ({ moduleName, motivationalMessage, moduleId }) => {
  // Alternate caricatures: even moduleId -> RYAN (male), odd -> EMMA (female)
  const caricature = moduleId % 2 === 0 ? maleCaricature : femaleCaricature;
  const characterName = moduleId % 2 === 0 ? 'RYAN' : 'EMMA';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-8 animate-fade-in">
        <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
          {/* Caricature Image */}
          <div className="flex-shrink-0">
            <img
              src={caricature}
              alt={`${characterName} caricature`}
              className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-md animate-bounce-in"
            />
          </div>

          {/* Message Box */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 animate-slide-up">
              Welcome to {moduleName}
            </h1>
            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg shadow-sm">
              <p className="text-lg text-gray-700 leading-relaxed animate-fade-in-delay">
                {motivationalMessage}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-4 animate-fade-in-delay">
              Guided by {characterName}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes bounceIn {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.05); }
          70% { transform: scale(0.9); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        .animate-slide-up {
          animation: slideUp 1s ease-in-out 0.5s both;
        }
        .animate-bounce-in {
          animation: bounceIn 1s ease-in-out;
        }
        .animate-fade-in-delay {
          animation: fadeIn 1s ease-in-out 1s both;
        }
      `}</style>
    </div>
  );
};

export default ModuleIntro;

<ModuleIntro 
  moduleName="Module 1: Introduction" 
  motivationalMessage="Get ready to embark on an exciting learning journey!" 
  moduleId={1} 
/>
