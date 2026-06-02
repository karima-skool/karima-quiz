"use client";

interface Props {
  onBegin: () => void;
}

export default function IntroScreen({ onBegin }: Props) {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
      }}
    >
      {/* Logo mark */}
      <div
        style={{
          marginBottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 12,
            backgroundColor: "#4ECBA020",
            border: "1.5px solid #4ECBA040",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: 22 }}>☪</span>
        </div>
        <span
          style={{
            color: "#4ECBA0",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Karima Academy
        </span>
      </div>

      {/* Heading */}
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <h1
          style={{
            fontSize: "clamp(28px, 6vw, 40px)",
            fontWeight: 700,
            color: "#FFFFFF",
            marginBottom: 16,
            lineHeight: 1.2,
          }}
        >
          Find Your Path
        </h1>
        <p
          style={{
            fontSize: 16,
            color: "#A0A0A0",
            lineHeight: 1.6,
            marginBottom: 40,
          }}
        >
          Answer a few questions and we&apos;ll guide you to the right course
          for where you are in your journey.
        </p>

        <button
          onClick={onBegin}
          style={{
            backgroundColor: "#4ECBA0",
            color: "#1A1A1A",
            border: "none",
            borderRadius: 8,
            padding: "14px 40px",
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            maxWidth: 320,
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Begin
        </button>
      </div>
    </div>
  );
}
