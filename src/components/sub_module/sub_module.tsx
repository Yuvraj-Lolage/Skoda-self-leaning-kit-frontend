import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, Check, Circle } from "lucide-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";
import { useNavigate, useParams } from "react-router-dom";
import axiosInstance from "../../API/axios_instance";
import { Tabs, TabsContent, TabsTrigger, TabsList } from "../ui/tabs";
import ContentRenderer from "../ui/container_renderer/container_renderer";

interface CoursePlayerPageProps {
    onBackClick: () => void;
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
    content_type: string;
    content_url: string;
    order_index: string;
    duration: string;
    created_at: string;
}

const DEFAULT_TRACK_ID = 1;

const authHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("token") ?? ""}`,
});

export function Submodule({ }: CoursePlayerPageProps) {
    // const { module_id, sub_id } = useParams();
    const param = useParams();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("overview");
    const [, setCurrentLesson] = useState("lesson-1-1");

    const [moduleData, setModuleData] = useState<ModuleData | null>(null);
    const [submoduleData, setSubModuleData] = useState<SubmoduleData | null>(null);

    const [courseProgress, setCourseProgress] = useState(0);

    const loadModuleOutlineFromCatalog = useCallback(async () => {
        const moduleId = param.module_id;
        if (!moduleId) return;

        try {
            const { data } = await axiosInstance.get("/learning-progress/catalog", {
                params: { trackId: DEFAULT_TRACK_ID },
                headers: authHeader(),
            });

            const allModules = data?.modules ?? [];
            const total = allModules.length;
            const done = typeof data?.total_completed_modules === "number"
                ? data.total_completed_modules
                : allModules.filter((m: { status: string }) => m.status === "completed").length;

            setCourseProgress(
                total > 0 ? Math.min(100, Math.round((done / total) * 100)) : 0
            );

            const mod = allModules.find(
                (m: { module_id: number }) => String(m.module_id) === String(moduleId)
            );

            if (!mod) {
                setModuleData(null);
                return;
            }

            const submodules = (mod.submodules ?? [])
                .slice()
                .sort(
                    (a: { order_index?: number }, b: { order_index?: number }) =>
                        (a.order_index ?? 0) - (b.order_index ?? 0)
                )
                .map(
                    (s: {
                        submodule_id: number;
                        name: string;
                        description?: string;
                        status: string;
                        duration?: number | string;
                        assessments?: Array<{
                            assessment_id: number;
                            title?: string;
                            description?: string;
                            status?: string;
                        }>;
                    }) => ({
                        ...s,
                        submodule_id: s.submodule_id,
                        submodule_name: s.name,
                        submodule_description: s.description ?? "",
                        status:
                            s.status === "completed" ||
                                s.status === "in_progress" ||
                                s.status === "locked"
                                ? s.status
                                : "locked",
                        assessments: (s.assessments ?? []).map((a) => ({
                            ...a,
                            status:
                                a.status === "completed" ||
                                a.status === "in_progress" ||
                                a.status === "locked"
                                    ? a.status
                                    : "locked",
                        })),
                    })
                );

            setModuleData({
                module_id: String(mod.module_id),
                module_name: mod.name,
                module_description: mod.description ?? "",
                status: mod.status,
                submodules,
            });
        } catch (error) {
            console.error("Error loading catalog for module outline:", error);
            setModuleData(null);
        }
    }, [param.module_id]);

    useEffect(() => {
        const moduleId = param.module_id;
        const subId = param.sub_id;
        if (!moduleId || !subId) return;

        let cancelled = false;

        (async () => {
            try {
                await axiosInstance.post(
                    "/learning-progress/start-submodule",
                    {
                        moduleId: Number(moduleId),
                        submoduleId: Number(subId),
                        trackId: DEFAULT_TRACK_ID,
                    },
                    { headers: authHeader() }
                );
            } catch (e) {
                console.warn("start-submodule (non-fatal):", e);
            }
            if (!cancelled) await loadModuleOutlineFromCatalog();
        })();

        return () => {
            cancelled = true;
        };
    }, [param.module_id, param.sub_id, loadModuleOutlineFromCatalog]);

    useEffect(() => {
        const moduleId = param.module_id;
        const subId = param.sub_id;
        if (!moduleId || !subId) return;

        axiosInstance
            .get(`/submodule/by/module/${moduleId}/submodule/${subId}`, {
                headers: authHeader(),
            })
            .then((response) => {
                const row = response.data;
                if (!row) return;
                setSubModuleData({
                    submodule_id: String(row.submodule_id),
                    module_id: String(row.module_id),
                    name: row.name,
                    description: row.description ?? "",
                    content_type: row.content_type ?? "Videos",
                    content_url: row.content_url ?? "",
                    order_index: String(row.order_index ?? 0),
                    duration: String(row.duration ?? 0),
                    created_at: row.created_at ?? "",
                });
            })
            .catch((error) => {
                console.error("Error fetching submodule detail:", error);
            });
    }, [param.module_id, param.sub_id]);

    const handleLessonClick = (lessonId: string) => {
        setCurrentLesson(lessonId);
        if (param.module_id) {
            navigate(`/module/${param.module_id}/submodule/${lessonId}`);
        }
    };

    const handleAssessmentClick = (assessmentId: string | number) => {
        if (param.module_id) {
            navigate(`/module/${param.module_id}/assessment/${assessmentId}`);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "completed":
                return <Check className="w-4 h-4 text-green-500" />;
            case "in_progress":
                return <Circle className="w-4 h-4 text-blue-500 fill-current" />;
            case "current":
                return <Circle className="w-4 h-4 text-blue-500 fill-current" />;
            case "locked":
            default:
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
                        <Button variant="ghost" size="sm" onClick={() => { navigate('/') }}>
                            <ArrowLeft className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Center: Course Title */}
                    <div className="flex-1 text-center mx-8">
                        <h2 className="text-lg font-semibold text-gray-900 truncate">
                            {submoduleData?.name}
                        </h2>
                    </div>

                    {/* Right: Progress, Share, Profile */}
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <Progress value={courseProgress} className="w-24 h-2" />
                            <span className="text-sm text-gray-600">{courseProgress}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Left Side - Player Area */}
                <div className="flex-1 flex flex-col">
                        {/* <TrainingVideo video_url={submoduleData?.content_url ?? ""} /> */}
                        {submoduleData ? (
                            <ContentRenderer
                                submoduleData={submoduleData}
                                onProgressUpdated={loadModuleOutlineFromCatalog}
                            />
                        ) : null}
                            {/* <h1>{submoduleData.name}</h1>
                            <p>{submoduleData.description}</p> */}
                            <div className="flex-1 flex flex-col">
                                {/* Navigation Tabs */}
                                <div className="bg-white border-b border-gray-200 p-6">
                                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                                        <TabsList className="grid w-full grid-cols-6 lg:w-fit">
                                            <TabsTrigger value="overview" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Overview
                                            </TabsTrigger>
                                            <TabsTrigger value="qa" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Q&A
                                            </TabsTrigger>
                                            <TabsTrigger value="notes" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Notes
                                            </TabsTrigger>
                                            <TabsTrigger value="announcements" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Announcements
                                            </TabsTrigger>
                                            <TabsTrigger value="reviews" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Reviews
                                            </TabsTrigger>
                                            <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500 data-[state=active]:text-white">
                                                Learning Tools
                                            </TabsTrigger>
                                        </TabsList>

                                        <div className="mt-6">
                                            <TabsContent value="overview" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Lesson</h3>
                                                    <p className="text-gray-600">
                                                        { submoduleData?.description }
                                                    </p> 
                                                </div>
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Objectives</h3>
                                                    <ul className="space-y-2 text-gray-600">
                                                        <li className="flex items-start space-x-2">
                                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span>Understand the definition and scope of data science</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span>Identify key skills and tools used by data scientists</span>
                                                        </li>
                                                        <li className="flex items-start space-x-2">
                                                            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                                            <span>Explore real-world applications and career opportunities</span>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="qa" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Questions & Answers</h3>
                                                    <p className="text-gray-600">No questions yet. Be the first to ask!</p>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="notes" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Notes</h3>
                                                    <p className="text-gray-600">Take notes while watching to help remember key concepts.</p>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="announcements" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Announcements</h3>
                                                    <p className="text-gray-600">No announcements at this time.</p>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="reviews" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Reviews</h3>
                                                    <p className="text-gray-600">See what other students are saying about this course.</p>
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="tools" className="space-y-4">
                                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Tools</h3>
                                                    <p className="text-gray-600">Additional resources and tools to enhance your learning experience.</p>
                                                </div>
                                            </TabsContent>
                                        </div>
                                    </Tabs>
                                </div>
                            </div>
                </div>

                {/* Right Sidebar - Course Outline */}
                <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Module Content</h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {(() => {
                                const subs = moduleData?.submodules ?? [];
                                const n =
                                    subs.length +
                                    subs.reduce(
                                        (acc, s: { assessments?: unknown[] }) =>
                                            acc + (s.assessments?.length ?? 0),
                                        0
                                    );
                                return `${n} items`;
                            })()}
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
                                <div className="ml-2 mt-2 space-y-3">
                                    {moduleData?.submodules.map((submodule) => {
                                        const isCurrent =
                                            String(submodule.submodule_id) === String(param.sub_id);
                                        const rowActive =
                                            isCurrent ||
                                            submodule.status === "in_progress";
                                        return (
                                        <div key={submodule.submodule_id} className="space-y-1">
                                        <div
                                            className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                                submodule.status === "locked"
                                                    ? "cursor-not-allowed opacity-60"
                                                    : "cursor-pointer"
                                            } ${rowActive
                                                ? "bg-gradient-to-r from-orange-50 to-pink-50 border border-orange-200"
                                                : "hover:bg-gray-50"
                                                } ${isCurrent ? "ring-2 ring-orange-300" : ""}`}
                                            onClick={() => {
                                                if (submodule.status === "locked") return;
                                                handleLessonClick(String(submodule.submodule_id));
                                            }}
                                        >
                                            {getStatusIcon(submodule.status)}

                                            <div className="flex-1 min-w-0">
                                                <p
                                                    className={`text-sm truncate ${rowActive
                                                        ? "font-medium text-gray-900"
                                                        : "text-gray-700"
                                                        }`}
                                                >
                                                    {submodule.submodule_name}
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    {submodule.duration} min
                                                </p>
                                            </div>
                                        </div>
                                        {(submodule.assessments ?? []).map((assessment:any) => {
                                            const aActive = assessment.status === "in_progress";
                                            return (
                                                <div
                                                    key={assessment.assessment_id}
                                                    className={`ml-4 flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                                                        assessment.status === "locked"
                                                            ? "cursor-not-allowed opacity-60"
                                                            : "cursor-pointer"
                                                    } ${aActive
                                                        ? "bg-violet-50 border border-violet-200"
                                                        : "hover:bg-gray-50"
                                                    }`}
                                                    onClick={() => {
                                                        if (assessment.status === "locked") return;
                                                        handleAssessmentClick(assessment.assessment_id);
                                                    }}
                                                >
                                                    {getStatusIcon(assessment.status ?? "locked")}
                                                    <div className="flex-1 min-w-0">
                                                        <p
                                                            className={`text-sm truncate ${
                                                                aActive
                                                                    ? "font-medium text-gray-900"
                                                                    : "text-gray-700"
                                                            }`}
                                                        >
                                                            {assessment.title}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            Assessment
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                        </div>
                                    );
                                    })}
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