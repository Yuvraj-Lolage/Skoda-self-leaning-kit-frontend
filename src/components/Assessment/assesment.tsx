import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import type { Method } from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { X, Trophy, Clock, Info, CheckCircle2, Timer, Star } from "lucide-react";
import caricature from "../../assets/caricature.jpg";
import male_caricature from "../../assets/RYAN_2.png";
import female_caricature from "../../assets/EMMA_2.png";
import Confetti from "react-confetti";
import axiosInstance from "../../API/axios_instance";
import { ToastHelper } from "../ui/toast_helper/toast";

/* -------------------- Types -------------------- */
type Option = { key: string; text: string };

type QuizQuestion = {
  id: string;
  assessmentId: string;
  moduleId: string;
  question: string;
  options: Option[];
  correct: number | number[];
};

type QuizPageProps = {
  onLogout?: () => void;
  onQuizComplete?: (score: number, total: number) => void;
};

const TIMER_DURATION = 5;

const Assessment: React.FC<QuizPageProps> = ({ onLogout, onQuizComplete }) => {
  const { module_id, assessment_id } = useParams<{ module_id: string; assessment_id: string }>();

  const isSubmittingRef = useRef(false);


  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [assessmentDetails, setAssessmentDetails] = useState<any>(null);
  const [assessmentName, setAssessmentName] = useState<string>("Knowledge Check");
  const [answers, setAnswers] = useState<Record<number, string[]>>({});
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [totalXP, setTotalXP] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [timer, setTimer] = useState<number>(TIMER_DURATION);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timerKey, setTimerKey] = useState<number>(0);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [startTime, setStartTime] = useState<number | null>(null);
  const [totalTimeTaken, setTotalTimeTaken] = useState<string>("00:00");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const moduleNumber = parseInt(module_id || "1");
  const currentQuestion = quiz[currentIndex];
  const isMultiChoice = currentQuestion ? Array.isArray(currentQuestion.correct) : false;

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

      // SYNC ASSESSMENT NAME FROM DATABASE
      setAssessmentName(target.title || target.name || `Assessment ${assessment_id}`);
      setAssessmentDetails(target);

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
    if (timer === 0) { handleConfirm(); return; }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, quiz.length, showFeedback, hasStarted, isFinished]);

  const startAssessment = () => {
    if (quiz.length > 0) {
      setHasStarted(true);
      setStartTime(Date.now());
    }
  };

  const handleNext = async () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setTimer(TIMER_DURATION);
      setTimerKey(prev => prev + 1);
    } else {
      // 1. Calculate time immediately
      if (startTime) {
        const endTime = Date.now();
        const durationMs = endTime - startTime;
        const totalSeconds = Math.floor(durationMs / 1000);
        const mins = Math.floor(totalSeconds / 60);
        const secs = totalSeconds % 60;
        setTotalTimeTaken(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      }

      // 2. SHOW THE SCORE SECTION IMMEDIATELY
      // This ensures the UI updates even if the network is slow
      setIsFinished(true);
      onQuizComplete?.(score, quiz.length);

      // 3. Save XP in the background
      try {
        await apiCall("post", "/user/update-xp", {
          xpEarned: totalXP
        });
        console.log("XP Synced successfully!");
      } catch (err) {
        // If this fails, the user still sees their score, but we log the error
        console.error("Background XP sync failed:", err);
      }
    }
  };

  const handleOptionClick = (key: string) => {
    if (showFeedback) return;
    setAnswers(prev => {
      const currentSelection = prev[currentIndex] || [];
      if (isMultiChoice) {
        return { ...prev, [currentIndex]: currentSelection.includes(key) ? currentSelection.filter(k => k !== key) : [...currentSelection, key] };
      } else {
        return { ...prev, [currentIndex]: [key] };
      }
    });
  };

  const calculateEarnedXP = (isCorrect: boolean, timeRemaining: number, multi: boolean) => {
    if (!isCorrect) return 0;
    // Base: 10 for single, 15 for multi
    const baseXP = multi ? 15 : 10;
    // Bonus: up to 50% extra for speed
    const speedBonus = Math.floor((timeRemaining / TIMER_DURATION) * 5);
    return baseXP + speedBonus;
  };

  // const submitAssessmentResult = async () => {

  //   // const data = {
  //   //   assessmentId, score, dateTaken, moduleId
  //   // }
  //   const data = {
  //     assessmentId: assessmentDetails?.assessment_id,
  //     moduleId: assessmentDetails?.module_id,
  //     score: score,
  //     duration: totalTimeTaken,
  //     xpEarned: totalXP,
  //   };

  //   try {
  //     await axiosInstance.post("/assessment-result/submit", data, {
  //       headers: {
  //         Authorization: token ? `Bearer ${token}` : "",
  //         "Content-Type": "application/json"
  //       }
  //     })
  //     .then((response) => {
  //       ToastHelper.success("Assessment result submitted successfully!");
  //     })
  //     .catch((error) => {
  //       ToastHelper.error("Failed to submit assessment result.");
  //     });

  //   }
  //   catch (error) {
  //     console.error("Error submitting assessment result:", error);
  //   }
  // }

  const submitAssessmentResult = async () => {
    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;

    const data = {
      assessmentId: assessmentDetails?.assessment_id,
      moduleId: assessmentDetails?.module_id,
      score,
      duration: totalTimeTaken,
      xpEarned: totalXP,
    };

    try {
      await axiosInstance.post("/assessment-result/submit", data, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
      });

      ToastHelper.success("Assessment result submitted successfully!");
    } catch (error) {
      ToastHelper.error("Failed to submit assessment result.");
      console.error(error);
    }
  };

  const handleConfirm = () => {
    if (showFeedback) return;

    const currentQ = quiz[currentIndex];
    const selected = answers[currentIndex] || [];
    const correctIndices = Array.isArray(currentQ.correct) ? currentQ.correct : [Number(currentQ.correct)];
    const correctKeys = correctIndices.map(idx => String.fromCharCode(65 + idx));
    const isCorrect = selected.length === correctKeys.length && selected.every(k => correctKeys.includes(k));

    if (isCorrect) {
      setScore(s => s + 1);
      setTotalXP(prev => Math.min(50, prev + calculateEarnedXP(true, timer, isMultiChoice)));
    }

    setShowFeedback(true);
    setTimeout(async () => {
      setShowFeedback(false);

      //IF LAST QUESTION → SUBMIT ASSESSMENT
      if (currentIndex === quiz.length - 1) {
        await submitAssessmentResult();
        return;
      }
      // OTHERWISE → NEXT QUESTION
      handleNext();
    }, 2000);
  };

  const optionStyle = (key: string): React.CSSProperties => {
    const currentQ = quiz[currentIndex];
    const selected = answers[currentIndex] || [];
    const correctIndices = Array.isArray(currentQ?.correct) ? currentQ.correct : [Number(currentQ?.correct)];
    const correctKeys = correctIndices.map(idx => String.fromCharCode(65 + idx));
    const isCorrect = correctKeys.includes(key);
    const isSelected = selected.includes(key);

    const base: React.CSSProperties = {
      padding: 16, borderRadius: 12, fontWeight: 600, marginBottom: 12, transition: "0.3s",
      border: "1px solid #eee", cursor: showFeedback ? "default" : "pointer",
      display: "flex", alignItems: "center"
    };

    if (!showFeedback) return { ...base, background: isSelected ? "#FFB400" : "#fff", borderColor: isSelected ? "#ea5205" : "#eee" };
    if (isCorrect) return { ...base, background: "#28a745", color: "#fff", borderColor: "#1e7e34" };
    if (isSelected && !isCorrect) return { ...base, background: "#dc3545", color: "#fff", borderColor: "#bd2130" };
    return { ...base, background: "#f4f6f8", color: "#999", opacity: 0.6 };
  };

  const getScoreData = () => {
    const ratio = score / quiz.length;
    if (ratio >= 0.8) return { msg: "Expert Status!", sub: "You've mastered this module.", color: "#28a745" };
    if (ratio >= 0.5) return { msg: "Great Effort!", sub: "You have a solid understanding.", color: "#FFB400" };
    return { msg: "Keep Practicing!", sub: "Review the module and try again.", color: "#dc3545" };
  };

  const getGuideMessage = () => {
    if (showFeedback) return "Verifying your logic... 🔍";
    if (timer < 5) return "Clock's ticking! Hurry! ⏳";
    if ((answers[currentIndex]?.length || 0) > 0) return "Looking good! Click confirm! ✅";
    return isMultiChoice ? "Careful! Select all correct answers! 💡" : "Pick the best answer! 💡";
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

        {!hasStarted && !isFinished && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => navigate(-1)} style={{ animation: "fadeIn 0.3s ease-out" }}></div>
            <div className="relative bg-white rounded-[32px] shadow-2xl max-w-2xl w-full overflow-hidden" style={{ animation: "scaleIn 0.3s ease-out" }}>
              <button onClick={() => navigate(-1)} className="absolute top-4 right-4 z-50 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
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
                          <div className="bg-orange-500 text-white font-bold px-3 py-1 rounded-lg text-sm uppercase tracking-wider">
                            {assessmentName}
                          </div>
                          <div className="flex-1 h-px bg-white/20"></div>
                        </div>
                        <h3 className="text-white font-extrabold text-2xl uppercase tracking-tight leading-tight">{assessmentName}</h3>
                        <div className="flex gap-4 text-xs font-semibold text-gray-300 uppercase tracking-widest">
                          <span className="flex items-center gap-1.5"><Trophy className="w-4 h-4 text-yellow-500" /> {quiz.length || "..."} Questions</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> Interactive Quiz</span>
                        </div>
                        <button onClick={startAssessment} disabled={isLoading || quiz.length === 0} className="mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-10 py-3 rounded-full font-black text-sm uppercase shadow-lg hover:scale-105 transition-transform active:scale-95 disabled:opacity-50">
                          {isLoading ? "Loading..." : "Start Assessment"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="flex items-start gap-4 p-5 bg-blue-50 rounded-2xl border border-blue-100">
                  <Info className="w-5 h-5 text-blue-500 mt-1" />
                  <p className="text-sm text-gray-700">Note: Pay attention to selection icons. Squares <span className="inline-block w-3 h-3 bg-gray-400 rounded-sm"></span> mean multiple answers, circles <span className="inline-block w-3 h-3 bg-gray-400 rounded-full"></span> mean only one!</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {hasStarted && !isFinished && quiz.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 16, padding: 30, boxShadow: "0 8px 20px rgba(0,0,0,0.1)", position: "relative" }}>
            <div style={{ marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", color: "#666" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span>Question {currentIndex + 1} of {quiz.length}</span>
                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '12px', background: isMultiChoice ? '#E0F2FE' : '#FEF3C7', color: isMultiChoice ? '#0369A1' : '#92400E', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isMultiChoice ? "Multiple Choice" : "Single Choice"}
                </span>
              </div>
              <span style={{ fontWeight: "bold", color: timer < 6 ? "red" : "#333" }}>⏳ {timer}s</span>
            </div>
            <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20 }}>{quiz[currentIndex].question}</div>

            {quiz[currentIndex].options.map((opt) => {
              const isSelected = (answers[currentIndex] || []).includes(opt.key);
              return (
                <div key={opt.key} onClick={() => handleOptionClick(opt.key)} style={optionStyle(opt.key)}>
                  <div style={{
                    width: 24, height: 24, borderRadius: isMultiChoice ? 6 : "50%", border: "2px solid #ddd", marginRight: 15, display: "flex", alignItems: "center", justifyContent: "center",
                    background: isSelected ? "#FFB400" : "transparent", transition: "all 0.2s ease"
                  }}>
                    {isSelected && (isMultiChoice ? <CheckCircle2 className="w-4 h-4 text-white" /> : <div style={{ width: 10, height: 10, borderRadius: "50%", background: "white" }} />)}
                  </div>
                  <strong style={{ marginRight: 12 }}>{opt.key}</strong> {opt.text}
                </div>
              );
            })}

            <div key={timerKey} style={{ marginTop: 20, height: 8, background: "#eee", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(timer / TIMER_DURATION) * 100}%`, height: "100%", background: "#ea5205", transition: "width 1s linear" }} />
            </div>

            <div style={{ marginTop: 30, display: "flex", justifyContent: "flex-end" }}>
              <button onClick={handleConfirm} disabled={showFeedback || (answers[currentIndex] || []).length === 0} style={{ padding: "12px 40px", borderRadius: 12, border: "none", background: showFeedback ? "#ccc" : "linear-gradient(90deg, #ea5205, #e91e87ff)", color: "#fff", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 15px rgba(234, 82, 5, 0.3)" }}>
                {showFeedback ? "Checking..." : (currentIndex === quiz.length - 1 ? "Finish Assessment" : "Confirm & Next")}
              </button>
            </div>

            <div style={{ position: "fixed", bottom: 40, right: 90, display: "flex", alignItems: "center", gap: 15, zIndex: 100 }}>
              <div style={{ background: "#fff", padding: "12px 20px", borderRadius: "20px 20px 0px 20px", boxShadow: "0 10px 25px rgba(0,0,0,0.1)", fontSize: 14, fontWeight: 600, color: "#333", maxWidth: 200, border: "2px solid #f38005", animation: "fadeIn 0.5s ease-out" }}>
                {getGuideMessage()}
              </div>
              <img src={male_caricature} style={{ width: 120, height: 120, borderRadius: "0%", objectFit: "cover" }} alt="guide" />
            </div>
          </div>
        )}

        {isFinished && (
          <div style={{ animation: "popIn 0.5s ease-out forwards" }}>
            <Confetti numberOfPieces={score * 50} recycle={false} />
            <div style={{ background: "#0b0b0bff", borderRadius: 24, padding: "40px", textAlign: "center", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", position: "relative", overflow: "hidden" }}>
              <img src={caricature} alt="guide" style={{ width: 180, height: 180, borderRadius: "50%", border: "4px solid #f38005ff", marginBottom: 20, display: "block", marginLeft: "auto", marginRight: "auto", animation: "float 3s infinite ease-in-out", objectFit: "cover" }} />
              <h2 style={{ fontSize: "2.2rem", fontWeight: 800, margin: "20px 0 5px", color: "#fbf5f5ff" }}>{getScoreData().msg}</h2>
              <p style={{ color: "#fcfafaff", fontSize: "1.1rem", marginBottom: 30 }}>{getScoreData().sub}</p>

              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "20px", marginBottom: 40, flexWrap: "wrap" }}>
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#FFB400", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Star className="w-8 h-8 fill-[#FFB400]" /> {totalXP}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#efeaeaff", textTransform: "uppercase", letterSpacing: 1 }}>Total XP Earned</div>
                </div>
                <div style={{ height: 40, width: 2, background: "#333" }} />
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: getScoreData().color }}>{score} / {quiz.length}</div>
                  <div style={{ fontSize: "0.7rem", color: "#efeaeaff", textTransform: "uppercase", letterSpacing: 1 }}>Score</div>
                </div>
                <div style={{ height: 40, width: 2, background: "#333" }} />
                <div style={{ textAlign: "center", minWidth: "120px" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Timer className="w-8 h-8" /> {totalTimeTaken}
                  </div>
                  <div style={{ fontSize: "0.7rem", color: "#f1ececff", textTransform: "uppercase", letterSpacing: 1 }}>Total Time</div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
                <button onClick={() => navigate("/dashboard")} style={{ padding: "14px 30px", borderRadius: 12, border: "none", background: "linear-gradient(90deg, #d62569, #ea5205)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Back to Dashboard</button>
              </div>
            </div>
          </div>
        )}

        {hasStarted && !isFinished && (
          <div style={{ position: "fixed", top: 0, right: 0, height: "100vh", width: 70, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40, boxShadow: "-2px 0 10px rgba(0,0,0,0.05)" }}>
            {quiz.map((_, idx) => (
              <div key={idx} style={{ width: 30, height: 30, borderRadius: "50%", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", background: idx === currentIndex ? "#ea5205" : (answers[idx]?.length > 0 ? "#007bff" : "#ddd"), color: "#fff", cursor: "pointer" }} onClick={() => !showFeedback && setCurrentIndex(idx)}>{idx + 1}</div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default Assessment;