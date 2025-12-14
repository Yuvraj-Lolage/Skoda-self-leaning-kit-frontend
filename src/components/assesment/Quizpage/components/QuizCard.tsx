import React from "react";
import OptionItem from "./OptionItem";
import TimerBar from "./TimerBar";

interface Option {
  key: string;
  text: string;
}

interface QuizQuestion {
  question: string;
  options: Option[];
}

interface QuizCardProps {
  quiz: QuizQuestion[];
  currentIndex: number;
  optionStyle: (key: string) => React.CSSProperties;
  handleOptionClick: (key: string) => void;
  timer: number;
  timerKey: number;
  duration: number;
  handleNext: () => void;
  handlePrevious: () => void;
}

const QuizCard: React.FC<QuizCardProps> = ({
  quiz,
  currentIndex,
  optionStyle,
  handleOptionClick,
  timer,
  timerKey,
  duration,
  handleNext,
  handlePrevious,
}) => {
  return (
    <div
      style={{
        background: "#fff",
        padding: 30,
        borderRadius: 16,
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <h3>
        Question {currentIndex + 1} of {quiz.length}
      </h3>

      <h2>{quiz[currentIndex].question}</h2>

      {quiz[currentIndex].options.map((opt) => (
        <OptionItem
          key={opt.key}
          optionKey={opt.key}
          text={opt.text}
          style={optionStyle(opt.key)}
          onClick={() => handleOptionClick(opt.key)}
        />
      ))}

      <TimerBar
        timer={timer}
        duration={duration}
        timerKey={timerKey}
      />

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {currentIndex > 0 && (
          <button onClick={handlePrevious}>⬅ Previous</button>
        )}
        <button onClick={handleNext}>Next ➡</button>
      </div>
    </div>
  );
};

export default QuizCard;
