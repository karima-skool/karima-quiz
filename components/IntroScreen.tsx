"use client";

interface Props {
  onBegin: () => void;
}

export default function IntroScreen({ onBegin }: Props) {
  return (
    <div style={{
      flex: 1,
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0ebff 0%, #e8e0ff 50%, #ede8ff 100%)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Nav */}
      <div style={{
        background: "#ffffff",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
      }}>
        <span style={{
          color: "rgb(129, 79, 255)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
        }}>
          Karima Academy
        </span>
      </div>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
      }}>
        {/* Logo mark */}
        <div style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "#ffffff",
          border: "1.5px solid rgba(129, 79, 255, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 32,
        }}>
          <span style={{ fontSize: 24 }}>☪</span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px, 6vw, 40px)",
          fontWeight: 700,
          color: "#040313",
          marginBottom: 16,
          lineHeight: 1.2,
          maxWidth: 480,
        }}>
          Find Your Path
        </h1>

        <p style={{
          fontSize: 16,
          color: "#5e5e5e",
          lineHeight: 1.6,
          marginBottom: 40,
          maxWidth: 400,
        }}>
          Answer a few questions and we&apos;ll guide you to the right course
          for where you are in your journey.
        </p>

        <button
          onClick={onBegin}
          style={{
            background: "linear-gradient(155deg, rgb(214, 228, 255) -25%, rgb(129, 79, 255) 22%, rgb(63, 15, 201) 76%, rgb(212, 228, 255) 128%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 24,
            padding: "14px 40px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
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
