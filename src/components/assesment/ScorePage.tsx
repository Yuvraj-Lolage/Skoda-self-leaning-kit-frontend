import React, { useEffect, CSSProperties } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";
import caricature from "../assets/caricature.jpg";

/* -------------------- Props Type -------------------- */
interface ScorePageProps {
  score: number;
  total: number;
  onRestart: () => void;
}

/* -------------------- Component -------------------- */
const ScorePage: React.FC<ScorePageProps> = ({
  score,
  total,
  onRestart,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const percentage: string = ((score / total) * 100).toFixed(1);

  const message: string =
    Number(percentage) >= 80
      ? "🏆 Excellent Work!"
      : Number(percentage) >= 60
      ? "🎉 Great Job!"
      : Number(percentage) >= 40
      ? "👍 Good Effort!"
      : "💪 But keep Practicing!";

  /* -------------------- Styles -------------------- */
  const styles: Record<string, CSSProperties> = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "linear-gradient(135deg, #468e98ff, #ffffff)",
      fontFamily: "'Inter', 'Poppins', sans-serif",
      textAlign: "center",
      padding: "20px",
      position: "relative",
    },
    card: {
      background: "linear-gradient(90deg, #df407dff, #ea5205)",
      borderRadius: 16,
      boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
      padding: "40px 60px",
      maxWidth: 500,
      animation: "fadeIn 1s ease",
    },
    title: {
      fontSize: "2.2rem",
      fontWeight: 700,
      color: "#f9f9f9ff",
      marginBottom: 16,
    },
    message: {
      fontSize: "1.5rem",
      color: "#f5f1f1ff",
      marginBottom: 20,
    },
    score: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#fdfbfbff",
      marginBottom: 10,
    },
    buttons: {
      marginTop: 20,
      display: "flex",
      gap: 15,
      justifyContent: "center",
    },
    button: {
      border: "none",
      padding: "12px 24px",
      borderRadius: 8,
      fontSize: "1rem",
      fontWeight: 600,
      cursor: "pointer",
      transition: "0.3s",
    },
    primary: {
      background: "#020c08ff",
      color: "#fff",
    },
    secondary: {
      background: "#02070cff",
      color: "#fff",
    },
  };

  return (
    <div style={styles.container}>
      {/* Floating Avatar */}
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 230px)",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
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
            animation: "bounce 3s infinite",
          }}
        />
      </div>

      {/* Confetti */}
      <Confetti numberOfPieces={score * 50} recycle={false} />

      {/* Score Card */}
      <div style={styles.card}>
        <h1 style={styles.title}>🎊 Congratulations!</h1>
        <p style={styles.message}>{message}</p>

        <div style={styles.score}>
          Your Score: {score} / {total} ({percentage}%)
        </div>

        <div style={styles.buttons}>
          <button
            style={{ ...styles.button, ...styles.primary }}
            onClick={onRestart}
          >
            🔁 Retry Quiz
          </button>

          <button
            style={{ ...styles.button, ...styles.secondary }}
            onClick={() => navigate("/")}
          >
            🏠 Home
          </button>
        </div>
      </div>

      {/* Animations */}
      <style>
        {`
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-18px); }
          }
        `}
      </style>
    </div>
  );
};

export default ScorePage;
