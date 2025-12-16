import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../API/axios_instance';
import ModuleIntro from '../../../intro';

interface Module {
  id: number;
  name: string;
  submodules: { id: string; name: string }[];
}

const ModuleIntroPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchModule = async () => {
      try {
        const token = localStorage.getItem('token');
        // Assuming there's an API to get module by id with submodules
        const response = await axiosInstance.get(`/module/${id}/with-submodules`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setModule(response.data);
      } catch (err) {
        setError('Failed to load module');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchModule();
    }
  }, [id]);

  const getMotivationalMessage = (moduleName: string): string => {
    const messages: { [key: string]: string } = {
      "Organisation Overview": "Get ready to explore the heart of Skoda's training ecosystem and understand your vital role in skill development!",
      "Department QMS Standard Process": "Dive into the world of quality management and learn how standardized processes ensure excellence in training delivery!",
      "Work Instructions": "Master the operational workflow of training programs and become a confident administrator of the training lifecycle!",
      "LMS Functionality": "Unlock the power of SumTotal LMS and gain the skills to manage users, enrollments, and training events seamlessly!",
      "Nomination Management": "Learn the art of coordinating training nominations and ensuring maximum participation across dealerships!",
      "Reports Preparation Method": "Discover how to create impactful reports that drive business decisions and showcase training effectiveness!"
    };
    return messages[moduleName] || "Get ready to embark on an exciting learning journey!";
  };

  const handleProceed = () => {
    if (module && module.submodules.length > 0) {
      navigate(`/module/${id}/submodule/${module.submodules[0].id}`);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (error || !module) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">{error || 'Module not found'}</div>;
  }

  return (
    <div className="relative">
      <ModuleIntro
        moduleName={module.name}
        motivationalMessage={getMotivationalMessage(String(module.name))}
        moduleId={module.id}
      />
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <button
          onClick={handleProceed}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-blue-700 transition-colors"
        >
          Start Module
        </button>
      </div>
    </div>
  );
};

export default ModuleIntroPage;