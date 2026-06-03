"use client";

import courses from "@/data/courses.json";

interface Props {
  onBegin: () => void;
}

// All courses with thumbnails
const withThumbs = courses
  .filter((c) => c.thumbnail_url && c.thumbnail_url !== "")
  .map((c) => ({ id: c.id, url: c.thumbnail_url, title: c.title }));

// Split into 3 groups as evenly as possible
const total = withThumbs.length; // 35
const sizes = [Math.ceil(total / 3), Math.ceil(total / 3), total - 2 * Math.ceil(total / 3)];
const row1 = withThumbs.slice(0, sizes[0]);
const row2 = withThumbs.slice(sizes[0], sizes[0] + sizes[1]);
const row3 = withThumbs.slice(sizes[0] + sizes[1]);

// Duplicate each row for seamless looping
const ticker1 = [...row1, ...row1];
const ticker2 = [...row2, ...row2];
const ticker3 = [...row3, ...row3];

const THUMB_H = 160;
const THUMB_W = Math.round(THUMB_H * (16 / 9)); // 284px
const GAP = 14;

// Single-copy widths (what one full loop of each row covers)
const w1 = row1.length * (THUMB_W + GAP);
const w2 = row2.length * (THUMB_W + GAP);
const w3 = row3.length * (THUMB_W + GAP);

export default function IntroScreen({ onBegin }: Props) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0ebff 0%, #e8e0ff 50%, #ede8ff 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Nav */}
      <div style={{ background: "#ffffff", padding: "16px 20px", display: "flex", alignItems: "center" }}>
        <span style={{ color: "rgb(129, 79, 255)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Karima Academy
        </span>
      </div>

      {/* Hero — vertically centred in the space above the banner */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "48px 24px 40px",
        }}
      >
        {/* Logo mark */}
        <div style={{
          width: 56, height: 56, borderRadius: 16,
          background: "#ffffff", border: "1.5px solid rgba(129, 79, 255, 0.3)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 24,
        }}>
          <span style={{ fontSize: 24 }}>☪</span>
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 40px)", fontWeight: 700, color: "#040313",
          marginBottom: 16, lineHeight: 1.2, maxWidth: 480,
        }}>
          Find Your Path
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 16, color: "#5e5e5e", lineHeight: 1.6,
          marginBottom: 36, maxWidth: 420,
        }}>
          Starting your Islamic learning journey can feel overwhelming. Answer a
          few questions and we&apos;ll match you with the right course for where
          you are right now.
        </p>

        {/* Begin button */}
        <button
          onClick={onBegin}
          style={{
            background: "linear-gradient(155deg, rgb(214, 228, 255) -25%, rgb(129, 79, 255) 22%, rgb(63, 15, 201) 76%, rgb(212, 228, 255) 128%)",
            color: "#ffffff", border: "none", borderRadius: 24,
            padding: "14px 40px", fontSize: 15, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit", transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Begin
        </button>
      </div>

      {/* 3-row scrolling banner */}
      <div
        style={{
          width: "100%",
          marginTop: 40,
          paddingBottom: 48,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          gap: 12,
          WebkitMaskImage: "linear-gradient(to right, transparent 0px, black 60px, black calc(100% - 60px), transparent 100%)",
          maskImage:       "linear-gradient(to right, transparent 0px, black 60px, black calc(100% - 60px), transparent 100%)",
        }}
      >
        <style>{`
          @keyframes ka-left-1  { 0% { transform: translateX(0); }         100% { transform: translateX(-${w1}px); } }
          @keyframes ka-right-2 { 0% { transform: translateX(-${w2}px); }  100% { transform: translateX(0); } }
          @keyframes ka-left-3  { 0% { transform: translateX(0); }         100% { transform: translateX(-${w3}px); } }

          .ka-row { display: flex; width: max-content; gap: ${GAP}px; }
          .ka-row-1 { animation: ka-left-1  35s linear infinite; }
          .ka-row-2 { animation: ka-right-2 28s linear infinite; }
          .ka-row-3 { animation: ka-left-3  40s linear infinite; }
          .ka-row img { height: ${THUMB_H}px; width: ${THUMB_W}px; object-fit: cover; border-radius: 10px; flex-shrink: 0; display: block; }
        `}</style>

        {/* Row 1 — left */}
        <div className="ka-row ka-row-1">
          {ticker1.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`r1-${item.id}-${i}`} src={item.url} alt={item.title} />
          ))}
        </div>

        {/* Row 2 — right */}
        <div className="ka-row ka-row-2">
          {ticker2.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`r2-${item.id}-${i}`} src={item.url} alt={item.title} />
          ))}
        </div>

        {/* Row 3 — left */}
        <div className="ka-row ka-row-3">
          {ticker3.map((item, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={`r3-${item.id}-${i}`} src={item.url} alt={item.title} />
          ))}
        </div>
      </div>
    </div>
  );
}
