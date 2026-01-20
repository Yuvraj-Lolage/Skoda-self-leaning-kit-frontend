import React, { useEffect } from "react";
import { LeftPanel } from "./left_side_panel";
import { StatsCards } from "./stats_cards";
import { ChartsSection } from "./charts_section";
import ResumeTrainingCard from "./resume_training_card";
import { Helmet } from "react-helmet";
import { getToken } from "../../helper/auth_token";
import axiosInstance from "../../API/axios_instance";

export default function Dashboard() {

    const [token] = React.useState<string | null>(getToken());

    const [userData, setUserData] = React.useState<any>(null);

    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [fetchError, setFetchError] = React.useState<string | null>(null);

    const fetchUserData = async () => {
        if (!token) {
            setFetchError("No token found");
            return;
        }

        await axiosInstance.get('/user/me', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setUserData(response.data);
            })
            .catch((error) => {
                setFetchError("Error fetching user data");
            });
    }

    useEffect(() => {
        fetchUserData();
    }, [token])
    return (
        <>
            <Helmet>
                <title>Škode | SLK - Dashboard</title>
            </Helmet>
            <div>
                <div className="flex-1 p-6 flex gap-6">
                    {/* Left Content Area */}
                    <LeftPanel xp_points={ userData ? userData.xp : 0  } />

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
