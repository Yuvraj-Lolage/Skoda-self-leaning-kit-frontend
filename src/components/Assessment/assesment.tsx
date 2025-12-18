import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Method } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import caricature from "../../assets/caricature.jpg";
//import caricature from "../../assets/male_caricature.jpeg";

import Confetti from "react-confetti";

/* -------------------- Types -------------------- */
type Option = { key: string; text: string };

type QuizQuestion = {
  id: string;
  assessmentId: string;
  moduleId: string;
  question: string;
  options: Option[];
  correct: string | number;
};

type QuizPageProps = {
  onLogout?: () => void;
  onQuizComplete?: (score: number, total: number) => void;
};

const TIMER_DURATION = 10;

const Assessment: React.FC<QuizPageProps> = ({ onLogout, onQuizComplete }) => {
  const { module_id, assessment_id } = useParams<{ module_id: string; assessment_id: string }>();
  
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(TIMER_DURATION);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // API logic remains identical to your previous version...
  const apiCall = useCallback(async (method: Method, url: string, data: any = null) => {
    setError("");
    try {
      const headers = { Authorization: token ? `Bearer ${token}` : "", "Content-Type": "application/json" };
      const res = await axios({ method, url: `http://localhost:3000${url}`, data, headers });
      return res.data;
    } catch (err: any) {
      setError(err?.response?.data?.error || "❌ Connection error");
      return null;
    }
  }, [token]);

  const loadQuiz = useCallback(async () => {
    if (!token || !module_id || !assessment_id) return;
    setIsLoading(true);
    try {
      const res = await apiCall("get", `/assessment/by/module/${module_id}`);
      const allRows = Array.isArray(res) ? res : (res?.assessments || []);
      const target = allRows.find((row: any) => String(row.assessment_id) === String(assessment_id) || String(row.id) === String(assessment_id));
      if (!target) { setError(`Assessment ${assessment_id} not found.`); return; }
      const rawQuestions = target.questions || target.assessment || [];
      const finalQuestions = rawQuestions.map((item: any, idx: number) => ({
        id: item.id || `${assessment_id}_${idx}`,
        assessmentId: String(assessment_id),
        moduleId: String(module_id),
        question: item.question || "Untitled Question",
        options: (item.options || []).map((o: any, i: number) => ({
          key: String.fromCharCode(65 + i),
          text: String(typeof o === "string" ? o : (o.text ?? o.value ?? "")).trim()
        })),
        correct: item.correct,
      }));
      setQuiz(finalQuestions);
    } catch { setError("Critical error loading assessment."); }
    finally { setIsLoading(false); }
  }, [apiCall, assessment_id, module_id, token]);

  useEffect(() => { loadQuiz(); }, [loadQuiz]);

  useEffect(() => {
    if (!hasStarted || !quiz.length || showFeedback || isFinished) return;
    if (timer === 0) { handleNext(); return; }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, quiz.length, showFeedback, hasStarted, isFinished]);

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimer(TIMER_DURATION);
      setTimerKey(prev => prev + 1);
    } else {
      setIsFinished(true);
      onQuizComplete?.(score, quiz.length);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setTimer(TIMER_DURATION);
      setTimerKey(prev => prev + 1);
    }
  };

  const handleOptionClick = (key: string) => {
    if (showFeedback) return;
    const currentQ = quiz[currentIndex];
    const selectedIndex = currentQ.options.findIndex(o => o.key === key);
    const isCorrect = Number(currentQ.correct) === selectedIndex;
    setAnswers(prev => ({ ...prev, [currentIndex]: key }));
    if (isCorrect) setScore(s => s + 1);
    setShowFeedback(true);
    setTimeout(() => { setShowFeedback(false); handleNext(); }, 1500);
  };

  const optionStyle = (key: string): React.CSSProperties => {
    const currentQ = quiz[currentIndex];
    const selected = answers[currentIndex];
    const thisIndex = currentQ?.options.findIndex(o => o.key === key);
    const isCorrect = Number(currentQ?.correct) === thisIndex;
    const base: React.CSSProperties = { padding: 16, borderRadius: 12, fontWeight: 600, marginBottom: 12, transition: "0.3s", border: "1px solid #eee", cursor: showFeedback ? "default" : "pointer", display: "flex", alignItems: "center" };
    if (!showFeedback) return { ...base, background: selected === key ? "#FFB400" : "#fff" };
    if (isCorrect) return { ...base, background: "#28a745", color: "#fff" };
    if (selected === key && !isCorrect) return { ...base, background: "#dc3545", color: "#fff" };
    return { ...base, background: "#f4f6f8", color: "#999", opacity: 0.6 };
  };

  // Dynamically calculate message based on score
  const getScoreData = () => {
    const ratio = score / quiz.length;
    if (ratio >= 0.8) return { msg: "Expert Status!", sub: "You've mastered this module.", color: "#28a745" };
    if (ratio >= 0.5) return { msg: "Great Effort!", sub: "You have a solid understanding.", color: "#FFB400" };
    return { msg: "Keep Practicing!", sub: "Review the module and try again.", color: "#dc3545" };
  };

  return (
    <div style={{ padding: 40, background: "#F4F6F8", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        {error && <div style={{ color: "#dc3545", textAlign: "center", padding: 15, background: "#fff", borderRadius: 8, marginBottom: 20 }}>{error}</div>}

        {/* --- 1. START SCREEN (Keep UI as before) --- */}
        {!hasStarted && !isFinished && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 50, textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.1)" }}>
<img
  src={caricature}
  alt="guide"
  style={{
    width: 180,
    height: 180,
    borderRadius: "50%",
    border: "4px solid #ec0a0aff",
    marginBottom: 20,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    animation: "float 3s infinite ease-in-out",
  }}
/>
            <h1 style={{ marginBottom: 10, fontWeight: 600 }}>Start the Assessment</h1>
            {quiz.length > 0 ? (
              <>
              <p style={{ color: "#666", marginBottom: 30 }}>

                  Everything is loaded! Ready to start <strong>Module {module_id}  Assessment {assessment_id}</strong>?  <br />

                  You have <strong>{quiz.length}</strong> questions ahead.
<br />
                  Carefully read the questions and choose the best answers. <br />
                  You would have <strong>{TIMER_DURATION} seconds</strong> for each question.

                </p>
                <button onClick={() => setHasStarted(true)} style={{ padding: "15px 40px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #d62569, #ea5205)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>🚀 Start Quiz</button>
              </>
            ) : (
              <button onClick={loadQuiz} disabled={isLoading} style={{ padding: "15px 40px", borderRadius: 12, border: "none", background: "#333", color: "#fff", cursor: "pointer" }}>{isLoading ? "Loading..." : "Load Questions"}</button>
            )}
          </div>
        )}

        {/* --- 2. BEAUTIFUL DYNAMIC SCORE SECTION --- */}
        {isFinished && (
          <div style={{ animation: "popIn 0.5s ease-out forwards" }}>
              <Confetti numberOfPieces={score * 50} recycle={false} />
            <div style={{ background: "#0b0b0bff", borderRadius: 24, padding: "40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
              
              {/* Background Accent Decor */}
              <div style={{ position: "absolute", top: -50, right: -50, width: 200, height: 200, background: "rgba(234, 82, 5, 0.05)", borderRadius: "50%" }} />
              
              <img
                  src={caricature}
                  alt="guide"
                  style={{
                    width: 180,
                    height: 180,
                    borderRadius: "50%",
                    border: "4px solid #f38005ff",
                    marginBottom: 20,
                    display: "block",
                    marginLeft: "auto",
                    marginRight: "auto",
                    animation: "float 3s infinite ease-in-out",
                  }}
                    />
              
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "20px 0 5px", color: "#fbf5f5ff" }}>{getScoreData().msg}</h2>
              <p style={{ color: "#fcfafaff", fontSize: "1.1rem", marginBottom: 30 }}>{getScoreData().sub}</p>

              {/* Progress Container */}
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginBottom: 40, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", fontWeight: 900, color: getScoreData().color }}>{score} / {quiz.length}</div>
                  <div style={{ fontSize: "0.9rem", color: "#efeaeaff", textTransform: "uppercase", letterSpacing: 1 }}>Correct Answers</div>
                </div>
                
                <div style={{ height: 60, width: 2, background: "#fef7f7ff" }} className="divider" />

                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#f1eaeaff" }}>{((score/quiz.length)*100).toFixed(0)}%</div>
                  <div style={{ fontSize: "0.9rem", color: "#f1ececff", textTransform: "uppercase", letterSpacing: 1 }}>Final Accuracy</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button 
                  onClick={() => window.location.reload()} 
                  style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "#f0f0f0", color: "#333", fontWeight: 700, cursor: "pointer", transition: "0.2s" }}
                  onMouseOver={(e) => e.currentTarget.style.background = "#e5e5e5"}
                  onMouseOut={(e) => e.currentTarget.style.background = "#f0f0f0"}
                >
                  🔁 Try Again
                </button>
                <button 
                  onClick={() => navigate("/")} 
                  style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #d62569, #ea5205)", color: "#fff", fontWeight: 700, cursor: "pointer", boxShadow: "0 10px 20px rgba(214, 37, 105, 0.2)" }}
                >
                  🏠 Back to Home
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- 3. QUIZ SCREEN (Keep UI as before) --- */}
        {hasStarted && !isFinished && quiz.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 30, boxShadow: "0 8px 20px rgba(0,0,0,0.1)" }}>
             <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", color: "#666" }}>
               <span>Question {currentIndex + 1} of {quiz.length}</span>
               <span style={{ fontWeight: "bold", color: timer < 4 ? "red" : "#333" }}>⏳ {timer}s</span>
             </div>
             <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{quiz[currentIndex].question}</div>
             {quiz[currentIndex].options.map((opt) => (
               <div key={opt.key} onClick={() => handleOptionClick(opt.key)} style={optionStyle(opt.key)}>
                 <strong style={{ marginRight: 12 }}>{opt.key}</strong> {opt.text}
               </div>
             ))}
             <div key={timerKey} style={{ marginTop: 20, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
               <div style={{ width: `${(timer / TIMER_DURATION) * 100}%`, height: "100%", background: "#ea5205", transition: "width 1s linear" }} />
             </div>
             <div style={{ marginTop: 30, display: "flex", justifyContent: "space-between" }}>
               <button onClick={handlePrevious} disabled={currentIndex === 0 || showFeedback} style={{ padding: "10px 25px", borderRadius: 8, border: "1px solid #ddd", background: "#fff", cursor: "pointer", opacity: currentIndex === 0 ? 0.5 : 1 }}>⬅ Previous</button>
               <button onClick={handleNext} disabled={showFeedback} style={{ padding: "10px 25px", borderRadius: 8, border: "none", background: "#007bff", color: "#fff", cursor: "pointer" }}>{currentIndex === quiz.length - 1 ? "Finish Check 🏁" : "Next ➡"}</button>
             </div>
{/* FLOATING GUIDE */}

      <div style={{ position: "fixed", bottom: 20, right: 90, display: "flex", alignItems: "center", gap: 10 }}>

        <div style={{ background: "#fff", padding: "10px 20px", borderRadius: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", fontSize: 14 }}>

          {showFeedback ? "Verifying... 🔍" : (timer < 4 ? "Quick! ⏳" : "Think carefully! 💡")}

        </div>

        <img src={caricature} style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid #fff" }} alt="guide" />

      </div>

          </div>
        )}
      </div>

       

      {/* RIGHT SIDE DOT NAVIGATION (Only during quiz) */}
      {hasStarted && !isFinished && (
        <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 70, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, boxShadow: "-2px 0 10px rgba(0,0,0,0.05)" }}>
          {quiz.map((_, idx) => (
            <div key={idx} style={{ width: 30, height: 30, borderRadius: "50%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", background: idx === currentIndex ? "#28a745" : answers[idx] ? "#007bff" : "#ddd", color: "#fff", cursor: "pointer" }} onClick={() => !showFeedback && setCurrentIndex(idx)}>{idx + 1}</div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Assessment;