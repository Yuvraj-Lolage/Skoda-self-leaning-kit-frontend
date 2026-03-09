import React, { useState } from "react";
import "./welcome_screen.css";
import male_caricature from "../../../assets/male_caricature.png";
import female_caricature from "../../../assets/female_caricature.png";

interface WelcomeScreenProps {
    onClose: () => void;
    styleType?: "white" | "glass" | "gradient";
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose, styleType = "white" }) => {
    const [loading, setLoading] = useState(false);

    const handleStart = async () => {
        if (loading) return;
        setLoading(true);
        try {
            const resp = await fetch("/api/track-welcome-click", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "welcome_started",
                    timestamp: new Date().toISOString(),
                }),
            });
            if (!resp.ok) {
                // handle non-2xx response if needed
                console.error("API error", resp.status);
            } else {
                // optional: const data = await resp.json();
            }
        } catch (err) {
            console.error("Network/API error", err);
        } finally {
            setLoading(false);
            onClose(); // close after API attempt (successful or not)
        }
    };

    return (
        <div className="welcome-overlay">
            <div className="blur-layer"></div>
            <div className={`welcome-card ${styleType}`}>
                <img src={male_caricature} alt="Caricature Girl" className="caricature left" />
                <div className="welcome-content">
                    <h1 className="welcome-title">Škoda Self-Learning Kit</h1>
                    <h2 className="welcome-heading">
                        Welcome aboard! Your interactive learning journey starts now.
                    </h2>
                    <p className="welcome-desc">
                        Discover modules, track your progress, and unlock new skills at your own pace.
                        Let’s make your learning experience engaging, smooth, and inspiring!
                    </p>
                    <button className="start-btn" onClick={handleStart} disabled={loading}>
                        {loading ? "Starting..." : "Start Tour"}
                    </button>
                </div>
                <img src={female_caricature} alt="Caricature Boy" className="caricature right" />
            </div>
        </div>
    );
};

export default WelcomeScreen;
