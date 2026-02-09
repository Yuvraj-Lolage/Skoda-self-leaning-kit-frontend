import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../API/axios_instance";

const TourContext = createContext<any>(null);

export const TourProvider = ({ children }: { children: any }) => {
    const [token] = useState<string | null>(() => {
        const storedToken = localStorage.getItem("token")
        return storedToken ? storedToken : null;
    }
    );
    const [tours, setTours] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!loading) {
            console.log("TOURS FROM BACKEND:", tours);
        }
    }, [loading, tours]);


    useEffect(() => {
        const fetchTours = async () => {
            const res = await axiosInstance.get("/user/tours", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            const normalizedTours = Object.fromEntries(
    Object.entries(res.data).map(([key, value]) => [key, Boolean(value)])
  );

            setTours(normalizedTours);
            setLoading(false);
        };
        fetchTours();
    }, []);

    const markTourComplete = async (tourKey: string) => {
        await axiosInstance.post("/user/tours/complete", { tourKey }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        setTours((prev: any) => ({ ...prev, [tourKey]: true }));
    };

    return (
        <TourContext.Provider value={{ tours, loading, markTourComplete }}>
            {children}
        </TourContext.Provider>
    );
};

export const useTours = () => useContext(TourContext);
