import React from "react";
import { RightPanel } from "./right_side_panel";
import { StatsCards } from "./stats_cards";
import { ChartsSection } from "./charts_section";
import ResumeTrainingCard from "./resume_training_card";
import { Helmet } from "react-helmet";

export default function Dashboard() {
    return (
        <>
            <Helmet>
                <title>Škode | SLK - Dashboard</title>
            </Helmet>
            <div>
                {/* <h1 className='text-black text-center'>
                Vide from shared folder
            </h1>
            <video
                src="http://localhost:5000/videos/module_1.mp4"
                controls
                width="600"
            />
            <TrainingVideo video_url={"http://localhost:5000/videos/module_1.mp4"}/>
             */}
                <div className="flex-1 p-6 flex gap-6">
                    {/* Left Content Area */}
                    <div className="flex-1 space-y-6">
                        <StatsCards />
                        <ResumeTrainingCard />
                        <ChartsSection />
                    </div>

                    {/* Right Panel */}
                    <RightPanel />
                </div>


            </div>
        </>
    )
}
