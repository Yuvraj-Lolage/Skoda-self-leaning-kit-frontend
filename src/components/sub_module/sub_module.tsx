import { useEffect, useState } from "react";
import { ArrowLeft, Share2, Play, Pause, Volume2, Settings, Maximize, ChevronDown, ChevronRight, Check, Circle } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { useParams } from "react-router-dom";
import axiosInstance from "../../API/axios_instance";
import TrainingVideo from "../ui/training_video/training_video";

interface CoursePlayerPageProps {
    onBackClick: () => void;
}

interface Lesson {
    id: string;
    title: string;
    duration: string;
    status: "completed" | "current" | "in_progress" | "locked";
}

interface CourseSection {
    id: string;
    title: string;
    lessons: Lesson[];
}

interface ModuleData {
    module_id: string;
    module_name: string;
    module_description: string;
    submodules: any[];
    status: string;
}

interface SubmoduleData {
    submodule_id: string;
    module_id: string;
    name: string;
    description: string;
    content_url: string;
    order_index: string;
    duration: string;
    created_at: string;
}

interface Assessment {
    
}

interface AssessmentData {
   assessment_id: string;
    module_id: string;
    submodule_id: string;
    title: string;
    description: string;
    questions: any[];
}


export function Submodule({ onBackClick, }: CoursePlayerPageProps) {
    // const { module_id, sub_id } = useParams();
    const param = useParams();
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeTab, setActiveTab] = useState("overview");
    const [currentLesson, setCurrentLesson] = useState("lesson-1-1");

    const [moduleData, setModuleData] = useState<ModuleData | null>(null);
    const [submoduleData, setSubModuleData] = useState<SubmoduleData | null>(null);
    const [assessmentData, setAssessmentData] = useState<AssessmentData[]>([]);

    const courseProgress = 65; // Overall course progress percentage


    useEffect(() => {
        console.log(`current module id = ${param.module_id}`);
        async function fetchModuleData() {
            //fetch module data from backend using module_id   
            axiosInstance.get(`/module/with-id/${param.module_id}/with-submodules/with-status`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((response) => {
                    setModuleData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching module data:", error);
                });
        }

        function fetchSubModulesData() {
            //fetch submodule data from backend using sub_id
            axiosInstance.get(`/submodule/by/module/${param.module_id}/submodule/${param.sub_id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((response) => {
                    setSubModuleData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching module data:", error);
                });
        }

        function fetchAssessmentData() {
            //fetch assessment data from backend using module_id
            axiosInstance.get(`/assessment/by/module/${param.module_id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            })
                .then((response) => {
                    setAssessmentData(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching module data:", error);
                });
        }

        fetchModuleData();
        fetchSubModulesData();
        fetchAssessmentData();
    }, [])

    const [openSections, setOpenSections] = useState<string[]>(["section-1", "section-2"]);

    const toggleSection = (sectionId: string) => {
        setOpenSections(prev =>
            prev.includes(sectionId)
                ? prev.filter(id => id !== sectionId)
                : [...prev, sectionId]
        );
    };

    const handleLessonClick = (lessonId: string) => {
        setCurrentLesson(lessonId);
    };

    const getStatusIcon = (status: Lesson["status"]) => {
        switch (status) {
            case "completed":
                return <Check className="w-4 h-4 text-green-500" />;
            case "in_progress":
                return <Circle className="w-4 h-4 text-blue-500 fill-current" />;
            case "locked":
                return <Circle className="w-4 h-4 text-gray-300" />;
        }
    };

    return (
        <div className="flex-1 flex flex-col h-screen bg-gray-50">
            {/* Top Navigation Bar */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    {/* Left: Logo */}
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" onClick={onBackClick}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <div className="text-xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
                            Academyis
                        </div>
                    </div>

                    {/* Center: Course Title */}
                    <div className="flex-1 text-center mx-8">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {moduleData?.module_name}
                        </h2>
                    </div>

                    {/* Right: Progress, Share, Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Progress value={courseProgress} className="w-24 h-2" />
                            <span className="text-sm text-gray-600">{courseProgress}%</span>
                        </div>
                        <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                        </Button>
                        {/* <Avatar className="w-8 h-8">
                            <AvatarImage src="/api/placeholder/32/32" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar> */}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Side - Player Area */}
                <div className="flex-1 flex flex-col">
                    {submoduleData?.content_url ? (
                        <><TrainingVideo video_url={submoduleData.content_url} />
                            <h1>{submoduleData.name}</h1>
                            <p>{submoduleData.description}</p>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="text-center">
                                <p className="text-lg font-medium text-gray-700">No video for this module</p>
                                <p className="text-sm text-gray-500 mt-1">This submodule does not contain a video.</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar - Course Outline */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Module Content</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {/* {courseSections.reduce((total, section) => total + section.lessons.length, 0)} lessons */}
                            {moduleData?.submodules.length} lessons
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-2">

                            {/* ALWAYS OPEN SECTION */}
                            <div key={moduleData?.module_id} className="w-full">

                                {/* Module Title (No toggle, no arrow) */}
                                <div className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50">
                                    <h3 className="font-medium text-gray-900">
                                        {moduleData?.module_name}
                                    </h3>
                                </div>

                                {/* Content always visible */}
                                <div className="ml-2 mt-2 space-y-1">
                                    {moduleData?.submodules.map((submodule) => (
                                        <div
                                            key={submodule.submodule_id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${submodule.status === "in_progress"
                                                ? "bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200"
                                                : "hover:bg-gray-50"
                                                }`}
                                            onClick={() => handleLessonClick(submodule.submodule_id)}
                                        >
                                            {getStatusIcon(submodule.status)}

                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm truncate ${submodule.status === "in_progress"
                                                        ? "font-medium text-gray-900"
                                                        : "text-gray-700"
                                                        }`}
                                                >
                                                    {submodule.submodule_name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {submodule.duration}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Assessments */}
                            <div key={moduleData?.module_id} className="w-full">

                                {/* Module Title (No toggle, no arrow) */}
                                <div className="flex items-center justify-between w-full p-3 rounded-lg bg-gray-50">
                                    <h3 className="font-medium text-gray-900">
                                        Assessments
                                    </h3>
                                </div>

                                {/* Content always visible */}
                                <div className="ml-2 mt-2 space-y-1">

                                    {/* { JSON.stringify(typeof assessmentData) } */}
                                    {assessmentData?.map((assessment) => (
                                        <div
                                            key={assessment.assessment_id}
                                            className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-50`}
                                            onClick={() => handleLessonClick(assessment.assessment_id)}
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm truncate font-medium text-gray-900">
                                                    {assessment.title}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {assessment.description}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="flex-1 overflow-y-auto">
                        <div className="p-4 space-y-2">
                            <Collapsible key={moduleData?.module_id} defaultOpen={openSections.includes(moduleData?.module_id?.toString() ?? "")}>
                                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 text-left rounded-lg hover:bg-gray-50 transition-colors">
                                    <h3 className="font-medium text-gray-900">{moduleData?.module_name}</h3>
                                    {openSections.includes(moduleData?.module_id ?? "") ? (
                                        <ChevronDown className="w-4 h-4 text-gray-500" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-gray-500" />
                                    )}
                                </CollapsibleTrigger>

                                <CollapsibleContent>
                                    <div className="ml-2 space-y-1">
                                        {moduleData?.submodules.map((submodule) => (
                                            <div
                                                key={submodule.submodule_id}
                                                className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-all duration-200 ${submodule.status === "in_progress"
                                                    ? "bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200"
                                                    : "hover:bg-gray-50"
                                                    }`}
                                                onClick={() => handleLessonClick(submodule.submodule_id)}
                                            >
                                                {getStatusIcon(submodule.status)}
                                                <div className="flex-1 min-w-0">
                                                    <p
                                                        className={`text-sm truncate ${submodule.status === "in_progress"
                                                            ? "font-medium text-gray-900"
                                                            : "text-gray-700"
                                                            }`}
                                                    >
                                                        {submodule.submodule_name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">{submodule.duration}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CollapsibleContent>
                            </Collapsible>
                        </div> */}
                </div>
            </div>
        </div >
    );
}