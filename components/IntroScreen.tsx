"use client";

import courses from "@/data/courses.json";

interface Props {
  onBegin: () => void;
}

// Build thumbnail list at module load (build time in Next.js static pages)
const thumbnails = courses
  .filter((c) => c.thumbnail_url && c.thumbnail_url !== "")
  .map((c) => ({ id: c.id, url: c.thumbnail_url, title: c.title }));

// Duplicate for seamless loop
const tickerItems = [...thumbnails, ...thumbnails];

const THUMB_HEIGHT = 80;
const THUMB_WIDTH = Math.round(THUMB_HEIGHT * (16 / 9)); // 142px
const GAP = 12;
const SINGLE_WIDTH = thumbnails.length * (THUMB_WIDTH + GAP);

export default function IntroScreen({ onBegin }: Props) {
  return (
    <div
      style={{
        flex: 1,
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0ebff 0%, #e8e0ff 50%, #ede8ff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Nav */}
      <div
        style={{
          background: "#ffffff",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "rgb(129, 79, 255)",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          Karima Academy
        </span>
      </div>

      {/* Hero */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "72px 24px 0",
          textAlign: "center",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 16,
            background: "#ffffff",
            border: "1.5px solid rgba(129, 79, 255, 0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 28,
          }}
        >
          <span style={{ fontSize: 24 }}>☪</span>
        </div>

        {/* Heading */}
        <h1
          style={{
            fontSize: "clamp(32px, 6vw, 40px)",
            fontWeight: 700,
            color: "#040313",
            marginBottom: 16,
            lineHeight: 1.2,
            maxWidth: 480,
          }}
        >
          Find Your Path
        </h1>

        {/* Subheading */}
        <p
          style={{
            fontSize: 16,
            color: "#5e5e5e",
            lineHeight: 1.6,
            marginBottom: 36,
            maxWidth: 420,
          }}
        >
          Starting your Islamic learning journey can feel overwhelming. Answer a
          few questions and we&apos;ll match you with the right course for where
          you are right now.
        </p>

        {/* Begin button */}
        <button
          onClick={onBegin}
          style={{
            background:
              "linear-gradient(155deg, rgb(214, 228, 255) -25%, rgb(129, 79, 255) 22%, rgb(63, 15, 201) 76%, rgb(212, 228, 255) 128%)",
            color: "#ffffff",
            border: "none",
            borderRadius: 24,
            padding: "14px 40px",
            fontSize: 15,
            fontWeight: 600,
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
            marginBottom: 0,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Begin
        </button>
      </div>

      {/* Scrolling thumbnail banner */}
      <div
        style={{
          width: "100%",
          marginTop: 32,
          paddingBottom: 40,
          overflow: "hidden",
          position: "relative",
          // Fade edges
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)",
          maskImage:
            "linear-gradient(to right, transparent 0px, black 40px, black calc(100% - 40px), transparent 100%)",
        }}
      >
        <style>{`
          @keyframes ticker {
            0%   { transform: translateX(0); }
            100% { transform: translateX(-${SINGLE_WIDTH}px); }
          }
          .ka-ticker {
            display: flex;
            gap: ${GAP}px;
            width: max-content;
            animation: ticker 30s linear infinite;
          }
        `}</style>

        <div className="ka-ticker">
          {tickerItems.map((item, i) => (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              key={`${item.id}-${i}`}
              src={item.url}
              alt={item.title}
              style={{
                height: THUMB_HEIGHT,
                width: THUMB_WIDTH,
                objectFit: "cover",
                borderRadius: 8,
                flexShrink: 0,
                display: "block",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
