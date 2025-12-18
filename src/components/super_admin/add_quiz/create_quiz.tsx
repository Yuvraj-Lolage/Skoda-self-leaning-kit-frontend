import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"
import caricature from "../assets/caricature.jpg";

const TIMER_DURATION = 10;

function QuizPage({ onLogout, onQuizComplete }) {
  const [file, setFile] = useState(null);
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(TIMER_DURATION);
  const [showFeedback, setShowFeedback] = useState(false);
  const [timerKey, setTimerKey] = useState(0); // <-- added
  const [uploadMsg, setUploadMsg] = useState(""); // Add this state
  const [sidebarOpen, setSidebarOpen] = useState(true); // <-- added

  // Admin upload selections (fixes no-undef ESLint errors)
  const [moduleId, setModuleId] = useState("");
  const [submoduleId, setSubmoduleId] = useState("");

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  // Countdown timer effect
  useEffect(() => {
    if (!quiz.length || showFeedback) return;
    if (timer === 0) {
      handleNext();
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, quiz, showFeedback]);

  const apiCall = async (method, url, data = null) => {
    setIsLoading(true);
    setError("");
    try {
      const headers = { Authorization: `Bearer ${token}` };
      if (data instanceof FormData) headers["Content-Type"] = "multipart/form-data";
      const res = await axios({ method, url: `http://localhost:5000${url}`, data, headers });
      return res.data;
    } catch (err) {
      setError(err.response?.data?.error || "❌ Token not provided or invalid");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async () => {
  if (!moduleId) return setError("Please select a module.");
  if (!submoduleId) return setError("Please select a submodule.");
  if (!file) return setError("Please choose a file.");

  const formData = new FormData();
  formData.append("moduleId", moduleId);
  formData.append("submoduleId", submoduleId);
  formData.append("file", file);

  const data = await apiCall("post", "/upload", formData);

  if (data) {
    setUploadMsg("✅ Quiz uploaded successfully!");
    setError("");
    setFile(null);
  }
};


const indexToKey = (i) => String.fromCharCode(65 + Number(i)); // 0 -> "A", 1 -> "B"

const convertAssessmentToFrontend = (assessment) => {
  const assessmentId = assessment.assessmentId ?? assessment.assessment_id ?? "";
  const moduleIdFromResp = assessment.moduleId ?? assessment.module_id ?? moduleId;
  const submoduleIdFromResp = assessment.submoduleId ?? assessment.submodule_id ?? submoduleId;
  const questions = assessment.questions || [];

  const quiz = questions.map((q, idx) => {
    const opts = (q.options || []).map((opt, j) =>
      typeof opt === "string" ? { key: indexToKey(j), text: opt } : { key: opt.key ?? indexToKey(j), text: opt.text ?? String(opt) }
    );

    const correctKey =
      typeof q.correct === "number"
        ? indexToKey(q.correct)
        : (String(q.correct || "").trim().toUpperCase() || "A");

    return {
      id: q.id ?? `${assessmentId}_${moduleIdFromResp}_${submoduleIdFromResp}_q${idx + 1}`,
      assessmentId: String(assessmentId),
      moduleId: String(moduleIdFromResp ?? ""),
      submoduleId: String(submoduleIdFromResp ?? ""),
      question: q.question || q.questionText || "",
      options: opts,
      correct: correctKey,
    };
  });

  return {
    quiz,
    message: assessment.title ?? assessment.message ?? "",
    latestVersion: assessment.version ?? assessment.latestVersion ?? "1",
    createdAt: assessment.createdAt ?? assessment.created_at,
  };
};

  // Replace your current fetchQuiz with this
  const fetchQuiz = async () => {
    if (!token) {
      setError("Please login to load quizzes (missing token).");
      return;
    }

    const params = [];
    if (moduleId) params.push(`moduleId=${encodeURIComponent(moduleId)}`);
    if (submoduleId) params.push(`submoduleId=${encodeURIComponent(submoduleId)}`);
    const query = params.length ? `?${params.join("&")}` : "";

    const data = await apiCall("get", `/quiz/latest${query}`);
    if (!data) return; // apiCall already set error

    let converted = null;

    // 1) backend already returned frontend-ready shape
    if (Array.isArray(data.quiz)) {
      converted = {
        quiz: data.quiz,
        message: data.message ?? "",
        latestVersion: data.latestVersion ?? data.version ?? "1",
      };
    }
    // 2) backend returned quizData under a different key
    else if (Array.isArray(data.quizData)) {
      converted = { quiz: data.quizData, message: data.message ?? "", latestVersion: data.latestVersion ?? "1" };
    }
    // 3) backend returned assessment-style object with questions array
    else if (Array.isArray(data.questions)) {
      converted = convertAssessmentToFrontend(data);
    } else {
      setError("Unexpected quiz response format");
      return;
    }

    setQuiz(converted.quiz || []);
    setAnswers({});
    setScore(0);
    setCurrentIndex(0);
    setTimer(TIMER_DURATION);
    setTimerKey((k) => k + 1);
    setError("");
    setUploadMsg(converted.message ? `${converted.message} (v${converted.latestVersion || "?"})` : "");
  };

  const handleOptionClick = (key) => {
    if (showFeedback) return;
    setAnswers({ ...answers, [currentIndex]: key });
    const isCorrect = quiz[currentIndex].correct === key;
    if (isCorrect) setScore((s) => s + 1);
    setShowFeedback(true);

    setTimeout(() => {
      setShowFeedback(false);
      handleNext();
    }, 1500);
  };

  const handleNext = () => {
    if (currentIndex < quiz.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setTimer(TIMER_DURATION);
      setTimerKey((k) => k + 1);
    } else {
      if (onQuizComplete) onQuizComplete(score, quiz.length);
      navigate("/score");
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setTimer(TIMER_DURATION);
      setTimerKey((k) => k + 1);
    }
  };

  const optionStyle = (key) => {
    if (!showFeedback)
      return {
        background: answers[currentIndex] === key ? "#FFB400" : "#fff",
        color: "#182848",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        fontSize: "16px",
        cursor: "pointer",
        fontWeight: 600,
        transition: "all 0.3s ease",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
      };
    if (key === quiz[currentIndex].correct)
      return {
        background: "#28a745",
        color: "#fff",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: 600,
        boxShadow: "0 0 15px #28a745",
        transform: "scale(1.05)",
        transition: "all 1s ease",
      };
    if (answers[currentIndex] === key)
      return {
        background: "#dc3545",
        color: "#fff",
        padding: "16px",
        marginBottom: "12px",
        borderRadius: "12px",
        fontSize: "16px",
        fontWeight: 600,
        boxShadow: "0 0 15px #dc3545",
        transform: "scale(1.05)",
        transition: "all 1s ease",
      };
    return {
      background: "#f4f6f8",
      color: "#182848",
      padding: "16px",
      marginBottom: "12px",
      borderRadius: "12px",
      fontSize: "16px",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      transition: "all 2s ease",
    };
  };

  return (
    <div
      style={{
        marginLeft: sidebarOpen ? 250 : 60,
        transition: "margin-left 0.3s",
        padding: 20,
        background: "#F4F6F8",
        minHeight: "100vh",
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      {/* Collapsible Sidebar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "100vh",
          width: sidebarOpen ? 250 : 60,
          background: "black",
          color: "#fff",
          transition: "width 0.3s",
          zIndex: 100,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingTop: 30,
          boxShadow: "2px 0 12px rgba(30,40,90,0.07)",
        }}
      >
        {/* Collapse/Expand Button */}
        <button
          onClick={() => setSidebarOpen((open) => !open)}
          style={{
            background: "none",
            border: "none",
            color: "#fff",
            fontSize: 24,
            cursor: "pointer",
            marginBottom: 30,
            alignSelf: "flex-end",
            marginRight: sidebarOpen ? 10 : 0,
            transition: "all 0.2s",
          }}
          aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          {sidebarOpen ? "⏴" : "⏵"}
        </button>

        {/* Avatar */}
        {sidebarOpen && (
          <img
            src={`https://ui-avatars.com/api/?name=${role || "User"}&background=4b6cb7&color=fff&size=96&rounded=true`}
            alt="User Avatar"
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              marginBottom: 20,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              border: "3px solid #fff",
              background: "#4b6cb7",
              objectFit: "cover",
              transition: "all 0.3s",
            }}
          />
        )}

        {/* App Name and Role */}
        {sidebarOpen && (
          <>
            <h2 style={{ fontWeight: 800, fontSize: 22, marginBottom: 32, letterSpacing: 1 }}>
              ŠKODA Quiz
            </h2>
            <div style={{ marginBottom: 24, fontWeight: 600, fontSize: 16 }}>
              {role?.toUpperCase()}
            </div>
            <button
              onClick={onLogout}
              style={{
                padding: "10px 28px",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #d62569a0, #ea5205ff)",
                color: "#222",
                fontWeight: 700,
                fontSize: 16,
                cursor: "pointer",
                marginBottom: 32,
                boxShadow: "0 2px 8px #ffb30022",
                transition: "background 0.2s",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>

      {/* Top Bar */}
      

      {/* Error Message */}
      {error && <div style={{ color: "#dc3545", fontWeight: "bold", marginBottom: 16 }}>{error}</div>}
      
      {/* Admin Upload */}
      {role === "superadmin" && (
  <div
    style={{
      marginBottom: 20,
      background: "#fff",
      color: "#182848",
      padding: 20,
      borderRadius: 12,
      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    }}
  >
    <h2 style={{ marginBottom: 10 }}>Upload Quiz</h2>

    {/* Module Select */}
    <div style={{ marginBottom: 10 }}>
      <label style={{ marginRight: 10, fontWeight: 600 }}>Module:</label>
      <select
        value={moduleId}
        onChange={(e) => setModuleId(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      >
        <option value="">Select Module</option>
        <option value="1">Module 1</option>
        <option value="2">Module 2</option>
        <option value="3">Module 3</option>
        <option value="4">Module 4</option>
        <option value="5">Module 5</option>
        <option value="6">Module 6</option>

      </select>
    </div>

    {/* Submodule Select */}
    <div style={{ marginBottom: 10 }}>
      <label style={{ marginRight: 10, fontWeight: 600 }}>Submodule:</label>
      <select
        value={submoduleId}
        onChange={(e) => setSubmoduleId(e.target.value)}
        style={{
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      >
        <option value="">Select Submodule</option>
        <option value="1">Submodule 1</option>
        <option value="2">Submodule 2</option>
        <option value="3">Submodule 3</option>
        <option value="4">Submodule 4</option>
        <option value="5">Submodule 5</option>
        <option value="6">Submodule 6</option>
      </select>
    </div>

    {/* File Input */}
    <input
      type="file"
      onChange={(e) => setFile(e.target.files[0])}
      style={{ marginBottom: 10 }}
    />

    {/* Upload Button */}
    <button
      onClick={handleUpload}
      style={{
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        background: "#040404ff",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.3s ease",
        marginTop: 10,
      }}
    >
      Upload
    </button>
  </div>
)}


      {/* Upload Message */}
      {uploadMsg && (
        <div style={{ color: "#28a745", fontWeight: "bold", marginBottom: 16, marginRight: 10 }}>
          {uploadMsg}
        </div>
      )}

      {/* Module / Submodule selection (visible to all users) */}
      <div style={{ marginBottom: 20, display: "flex", gap: 12, alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Module:</label>
          <select
            value={moduleId}
            onChange={(e) => setModuleId(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}
          >
            <option value="">All Modules (latest)</option>
            <option value="1">Module 1</option>
            <option value="2">Module 2</option>
            <option value="3">Module 3</option>
            <option value="4">Module 4</option>
            <option value="5">Module 5</option>
            <option value="6">Module 6</option>

          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <label style={{ fontWeight: 600 }}>Submodule:</label>
          <select
            value={submoduleId}
            onChange={(e) => setSubmoduleId(e.target.value)}
            style={{ padding: 8, borderRadius: 6, border: "1px solid #ccc", fontSize: 14 }}
          >
            <option value="">All Submodules</option>
            <option value="1">Submodule 1</option>
            <option value="2">Submodule 2</option>
            <option value="3">Submodule 3</option>
            <option value="4">Submodule 4</option>
            <option value="5">Submodule 5</option>
            <option value="6">Submodule 6</option>
          </select>
        </div>
      </div>
      
      {/* Load Quiz Button */}
      <button
        onClick={fetchQuiz}
        style={{
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(90deg, #d62569a0, #ea5205ff)",
          color: "#fff",
          fontWeight: 600,
          marginBottom: 20,
          cursor: "pointer",
          transition: "all 0.3s ease",
          
        }}
      >
        Load Quiz
      </button>

      {/* Quiz Card */}
      {quiz.length > 0 && (
        <div
          style={{
            background: "#fff",
            borderRadius: 16,
            padding: 30,
            maxWidth: 720,
            margin: "0 auto",
            position: "relative",
            boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
            transition: "all 2s ease",
          }}
        >
          {/* Question Header */}
          <div style={{ marginBottom: 16, fontSize: 18, fontWeight: 600, color: "#030408ff" }}>
            Question {currentIndex + 1} of {quiz.length}
          </div>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#2e5dbbff" }}>
            {quiz[currentIndex].question}
          </div>

          {/* Options */}
          <div>
            {quiz[currentIndex].options.map((opt) => (
              <div key={opt.key} onClick={() => handleOptionClick(opt.key)} style={optionStyle(opt.key)}>
                <strong style={{ marginRight: 8 }}>{opt.key}.</strong> {opt.text}
              </div>
            ))}
          </div>

          {/* Timer Bar */}
          <div
  key={timerKey}
  style={{
    marginTop: 20,
    height: 10,
    background: "#f4f6f8",
    borderRadius: 5,
    overflow: "hidden",
    boxShadow: "inset 0 0 5px rgba(0,0,0,0.1)",
  }}
>
  <div
    style={{
      width: `${(timer / TIMER_DURATION) * 100}%`,
      height: "100%",
      background: "linear-gradient(90deg, #d62569, #ea5205)",
      borderRadius: 5,
      transition: "width 1s linear",
      boxShadow: "0 0 8px rgba(234, 82, 5, 0.4)",
    }}
  />
</div>


          {/* Navigation Buttons */}
          <div style={{ marginTop: 25, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        
            {currentIndex > 0 && (
              <button
                onClick={handlePrevious}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: "none",
                  background: "#6c757d",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 1s ease",
                }}
              >
                ⬅ Previous
              </button>
            )}
               <button
              onClick={handleNext}
              style={{
                padding: "8px 16px",
                borderRadius: 8,
                border: "none",
          background: "linear-gradient(90deg, #d62569a0, #ea5205ff)",
                color: "#e9ecf3ff",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 1s ease",
              }}
            >
              Next ➡
            </button>
            
          </div>          
        </div>
      )}
<br/><br/><br/><br/><br/><br/><br/>

      {/* Floating Avatar Guide */}
      <div
        style={{
          position: "fixed", // <-- changed from "flex" to "fixed"
          bottom: 32,
          right: 32,         // <-- fixed distance from the right edge
          zIndex: 300,
          display: "flex",
          alignItems: "flex-end",
          gap: 16,
          pointerEvents: "none", // so it doesn't block quiz clicks
        }}
      >
        {/* Speech Bubble */}
        <div
          style={{
            background: "#fff",
            color: "#182848",
            borderRadius: "16px 16px 16px 0",
            boxShadow: "0 4px 16px rgba(30,40,90,0.10)",
            padding: "18px 24px",
            fontSize: 16,
            fontWeight: 500,
            maxWidth: 320,
            marginBottom: 8,
            pointerEvents: "auto",
            transition: "all 0.3s",
            animation: "bounce 3s infinite", // <-- add this line
          }}
        >
          {quiz.length === 0
            ? "👋 Hi! load a quiz to get started."
            : timer > 3
            ? "Let's go! Read the question and pick your answer."
            : timer > 0
            ? "⏳ Time is running out."
            : "Time's up! Moving to the next question."}
        </div>
        {/* Avatar */}
        <img
          src={caricature}
           alt="Guide Avatar"
           style={{
             width: 64,
             height: 64,
             borderRadius: "50%",
             boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
             border: "3px solid #fff",
             background: "#ffb400",
             objectFit: "cover",
             pointerEvents: "auto",
             transition: "all 0.3s",
             animation: "bounce 3s infinite",
           }}
         />
      </div>
      {/* Right Sidebar for Question Navigation */}
{quiz.length > 0 && (
  <div
    style={{
      position: "fixed",
      top: 0,
      right: 0,
      height: "100vh",
      width: 80,
      background: "#fff",
      boxShadow: "-2px 0 12px rgba(30,40,90,0.07)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      paddingTop: 40,
      zIndex: 101,
    }}
  >
    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 18, color: "#4b6cb7" }}>
      Q.No.
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {quiz.map((_, idx) => {
        let bg, color;
        if (idx === currentIndex) {
          bg = "#28a745"; // green for current
          color = "#fff";
        } else if (answers[idx]) {
          bg = "#007bff"; // blue for attempted
          color = "#fff";
        } else {
          bg = "#ff9800"; // orange for not attempted
          color = "#fff";
        }
        return (
          <button
            key={idx}
            // Only enable the button for the current question
            disabled={idx !== currentIndex}
            onClick={() => {
              if (idx === currentIndex) {
                setCurrentIndex(idx);
                setTimer(TIMER_DURATION);
                setTimerKey((k) => k + 1);
              }
            }}
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              background: bg,
              color: color,
              fontWeight: 700,
              fontSize: 18,
              cursor: idx === currentIndex ? "pointer" : "not-allowed",
              opacity: idx === currentIndex ? 1 : 0.6,
              boxShadow: idx === currentIndex ? "0 2px 8px #28a74555" : "none",
              outline: "none",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            aria-label={`Go to question ${idx + 1}`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  </div>
)}
      <style>
{`
@keyframes bounce {
  0%, 100% { transform: translateY(0);}
  50% { transform: translateY(-18px);}
}
`}
</style>
    </div>
  );
}

export default QuizPage;
