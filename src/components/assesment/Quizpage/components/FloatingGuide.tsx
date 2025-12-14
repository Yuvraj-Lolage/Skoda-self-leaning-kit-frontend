import React from "react";
import caricature from "../assets/caricature.jpg";

interface FloatingGuideProps {
  quizLoaded: boolean;
  timer: number;
}

const FloatingGuide: React.FC<FloatingGuideProps> = ({
  quizLoaded,
  timer,
}) => {
  const message = !quizLoaded
    ? "👋 Load a quiz to start"
    : timer > 3
    ? "Pick the correct answer!"
    : timer > 0
    ? "⏳ Hurry up!"
    : "Time's up!";

  return (
    <div
      style={{
        position: "fixed",
        bottom: 30,
        right: 30,
        display: "flex",
        gap: 12,
        alignItems: "flex-end",
      }}
    >
      <div
        style={{
          background: "#fff",
          padding: 16,
          borderRadius: 12,
        }}
      >
        {message}
      </div>
      <img
        src={caricature}
        alt="guide"
        style={{ width: 64, height: 64, borderRadius: "50%" }}
      />
    </div>
  );
};

export default FloatingGuide;
