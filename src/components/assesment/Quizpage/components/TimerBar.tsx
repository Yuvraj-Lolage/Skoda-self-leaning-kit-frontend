import React from "react";

interface TimerBarProps {
  timer: number;
  duration: number;
  timerKey: number;
}

const TimerBar: React.FC<TimerBarProps> = ({
  timer,
  duration,
  timerKey,
}) => {
  return (
    <div
      key={timerKey}
      style={{
        marginTop: 20,
        height: 10,
        background: "#eee",
        borderRadius: 5,
      }}
    >
      <div
        style={{
          width: `${(timer / duration) * 100}%`,
          height: "100%",
          background: "linear-gradient(90deg,#d62569,#ea5205)",
          transition: "width 1s linear",
        }}
      />
    </div>
  );
};

export default TimerBar;
