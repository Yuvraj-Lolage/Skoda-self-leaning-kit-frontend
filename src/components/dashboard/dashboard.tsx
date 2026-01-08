import React from "react";
import { LeftPanel } from "./right_side_panel";
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
                <div className="flex-1 p-6 flex gap-6">
                     {/* Left Content Area */}
                     <LeftPanel />
                    
                    {/* Right Panel */}
                    <div className="flex-1 space-y-6">
                        <ResumeTrainingCard />
                        <ChartsSection />
                    </div>

                   
                   
                </div>


            </div>
        </>
    )
}
