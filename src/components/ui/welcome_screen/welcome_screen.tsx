import React from "react";
import "./welcome_screen.css";
import male_caricature from "../../../assets/male_caricature.png";
import female_caricature from "../../../assets/female_caricature.png";

interface WelcomeScreenProps {
    onClose: () => void;
    styleType?: "white" | "glass" | "gradient"; // choose style
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onClose, styleType = "white" }) => {
    return (
        <div className="welcome-overlay">
            {/* BLUR BACKGROUND LAYER */}
            <div className="blur-layer"></div>
            <div className={`welcome-card ${styleType}`}>

                {/* Left caricature */}
                <img
                    src={male_caricature}
                    alt="Caricature Girl"
                    className="caricature left"
                />

                <div className="welcome-content">

                    <h1 className="welcome-title">Škoda Self-Learning Kit</h1>

                    <h2 className="welcome-heading">
                        Welcome aboard! Your interactive learning journey starts now.
                    </h2>

                    <p className="welcome-desc">
                        Discover modules, track your progress, and unlock new skills at your own pace.
                        Let’s make your learning experience engaging, smooth, and inspiring!
                    </p>

                    <button className="start-btn" onClick={onClose}>
                        Start Tour
                    </button>
                </div>


                {/* Right caricature */}
                <img
                    src={female_caricature}
                    alt="Caricature Boy"
                    className="caricature right"
                />

            </div>
        </div>
    );
};

export default WelcomeScreen;
