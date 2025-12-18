import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../API/axios_instance';
import ModuleIntro from '../../components/modules/intro';

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
    <div className="relative overflow-hidden">
      {/* Background Blur Effect */}
      <div className="fixed inset-0 bg-white/30 backdrop-blur-md -z-10" />

      <ModuleIntro
        moduleName={module.name}
        moduleId={module.id}
        onProceed={handleProceed} // Pass navigation logic to the component
      />
    </div>
  );
};


export default ModuleIntroPage;