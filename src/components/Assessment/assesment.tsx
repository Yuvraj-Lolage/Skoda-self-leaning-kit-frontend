import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import type { Method } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { X, Trophy, Clock, Info } from "lucide-react"; 
import caricature from "../../assets/caricature.jpg";
import male_caricature from "../../assets/RYAN_2.png";
import female_caricature from "../../assets/EMMA_2.png";
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

  // Helper to determine which caricature to show based on module number
  const moduleNumber = parseInt(module_id || "1");
  const instructorImg = moduleNumber % 2 === 0 ? "/assets/RYAN_2.png" : "/assets/EMMA_2.png";

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

  const getScoreData = () => {
    const ratio = score / quiz.length;
    if (ratio >= 0.8) return { msg: "Expert Status!", sub: "You've mastered this module.", color: "#28a745" };
    if (ratio >= 0.5) return { msg: "Great Effort!", sub: "You have a solid understanding.", color: "#FFB400" };
    return { msg: "Keep Practicing!", sub: "Review the module and try again.", color: "#dc3545" };
  };

  return (
    <div style={{ padding: 40, background: "#F4F6F8", minHeight: "100vh", fontFamily: "'Poppins', sans-serif" }}>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        @keyframes popIn { 0% { transform: scale(0.8); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      `}</style>

      <div style={{ maxWidth: 800, margin: "0 auto" }}>
        
        {/* --- 1. ASSESSMENT INTRO MODAL (Matches ModuleModal Design) --- */}
        {!hasStarted && !isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
              onClick={() => navigate(-1)}
              style={{ animation: "fadeIn 0.3s ease-out" }}
            ></div>

            <div
              className="relative bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden"
              style={{ animation: "scaleIn 0.3s ease-out" }}
            >
              <button
                onClick={() => navigate(-1)}
                className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110"
              >
                <X className="w-6 h-6 text-gray-700" />
              </button>

              <div className="relative bg-gradient-to-br from-orange-50 via-pink-50 to-purple-50 p-8 pt-12">
                <div className="flex items-end justify-center">
                  <div className="relative w-full">
                    <div className="bg-[#2d2d2d] rounded-2xl p-8 shadow-2xl border-[6px] border-[#b8860b] min-h-[260px] relative">
                      
                      <img
                        src={female_caricature}
                        onError={(e) => { (e.target as HTMLImageElement).src = caricature; }}
                        alt="Instructor"
                        className="absolute -left-16 -bottom-6 w-56 h-auto z-20 drop-shadow-xl object-contain"
                        style={{ animation: "float 3s infinite ease-in-out" }}
                      />

                      <div className="relative z-10 ml-32 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded-lg text-sm">
                            ASSESSMENT {module_id}
                          </div>
                          <div className="flex-1 h-px bg-white/20"></div>
                        </div>

                        <h3 className="text-white font-extrabold text-2xl uppercase tracking-tight leading-tight">
                           Knowledge Check
                        </h3>

                        <div className="flex gap-4 text-xs font-semibold text-gray-300 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5">
                            <Trophy className="w-4 h-4 text-yellow-500" />
                            {quiz.length || "..."} Questions
                          </span>
                          <span className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-400" />
                            {TIMER_DURATION}s per Q
                          </span>
                        </div>

                        <button
                          onClick={() => quiz.length > 0 && setHasStarted(true)}
                          disabled={isLoading || quiz.length === 0}
                          className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-3 rounded-full font-black text-sm uppercase shadow-lg hover:scale-105 transition-transform active:scale-95 disabled:opacity-50"
                        >
                          {isLoading ? "Loading..." : "Start Assessment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <div className="bg-blue-500 text-white p-2 rounded-full flex-shrink-0">
                    <Info className="w-4 h-4" />
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    You're about to start the assessment for <span className="font-bold text-gray-900">Module {module_id}</span>. Once you click start, the first question will appear immediately.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate(-1)}
                    className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-2xl font-bold transition-colors uppercase text-sm tracking-wider"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => quiz.length > 0 && setHasStarted(true)}
                    disabled={isLoading || quiz.length === 0}
                    className="flex-1 py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-black shadow-xl hover:opacity-90 transition-opacity uppercase text-sm tracking-wider disabled:opacity-50"
                  >
                    Start Assessment
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. ACTIVE QUIZ SECTION --- */}
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
             <div style={{ position: "fixed", bottom: 20, right: 90, display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: "#fff", padding: "10px 20px", borderRadius: 15, boxShadow: "0 4px 10px rgba(0,0,0,0.1)", fontSize: 14 }}>
                  {showFeedback ? "Verifying... 🔍" : (timer < 4 ? "Quick! ⏳" : "Think carefully! 💡")}
                </div>
                <img src={male_caricature} style={{ width: 120, height: 120, borderRadius: "0%", objectFit: "cover" }} alt="guide" />
             </div>
          </div>
        )}

        {/* --- 3. SCORE SECTION --- */}
        {isFinished && (
           <div style={{ animation: "popIn 0.5s ease-out forwards" }}>
              <Confetti numberOfPieces={score * 50} recycle={false} />
              <div style={{ background: "#0b0b0bff", borderRadius: 24, padding: "40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
                <img src={caricature} alt="guide" style={{ width: 180, height: 180, borderRadius: "50%", border: "4px solid #f38005ff", marginBottom: 20, display: "block", marginLeft: "auto", marginRight: "auto", animation: "float 3s infinite ease-in-out", objectFit: "cover" }} />
                <h2 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "20px 0 5px", color: "#fbf5f5ff" }}>{getScoreData().msg}</h2>
                <p style={{ color: "#fcfafaff", fontSize: "1.1rem", marginBottom: 30 }}>{getScoreData().sub}</p>
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "40px", marginBottom: 40, flexWrap: "wrap" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3.5rem", fontWeight: 900, color: getScoreData().color }}>{score} / {quiz.length}</div>
                    <div style={{ fontSize: "0.9rem", color: "#efeaeaff", textTransform: "uppercase", letterSpacing: 1 }}>Correct Answers</div>
                  </div>
                  <div style={{ height: 60, width: 2, background: "#fef7f7ff" }} />
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: "3.5rem", fontWeight: 900, color: "#f1eaeaff" }}>{((score/quiz.length)*100).toFixed(0)}%</div>
                    <div style={{ fontSize: "0.9rem", color: "#f1ececff", textTransform: "uppercase", letterSpacing: 1 }}>Final Accuracy</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                  <button onClick={() => window.location.reload()} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "#f0f0f0", color: "#333", fontWeight: 700, cursor: "pointer" }}>🔁 Try Again</button>
                  <button onClick={() => navigate("/")} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #d62569, #ea5205)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>🏠 Back to Home</button>
                </div>
              </div>
           </div>
        )}
      </div>

      {/* RIGHT SIDE DOT NAVIGATION */}
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