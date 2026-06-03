"use client";

import { Course } from "@/lib/recommend";

interface Props {
  course: Course;
}

export default function LiveCourseCard({ course }: Props) {
  const url = course.signup_url || "https://www.skool.com/karima/about";
  const scholar = course.scholar === "TBC" ? "Coming soon" : course.scholar;

  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #ede8ff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(129, 79, 255, 0.08)",
    }}>
      <style>{`
        @keyframes live-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.85); }
        }
        .live-dot { animation: live-pulse 1.4s ease-in-out infinite; }
      `}</style>

      {/* Thumbnail with LIVE badge */}
      {course.thumbnail_url ? (
        <div style={{ position: "relative", aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail_url}
            alt={course.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <LiveBadge />
        </div>
      ) : (
        <div style={{ position: "relative", aspectRatio: "16/9", width: "100%", backgroundColor: "#f0ebff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <LiveBadge />
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "16px 20px 20px" }}>
        {/* Schedule */}
        <p style={{ fontSize: 13, fontWeight: 600, color: "#16a34a", marginBottom: 10 }}>
          {[course.live_day, course.live_time, course.live_frequency].filter(Boolean).join(" · ")}
        </p>

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#040313", lineHeight: 1.3, marginBottom: 4 }}>
          {course.title}
        </h3>

        {/* live_series */}
        {course.live_series && (
          <p style={{ fontSize: 13, color: "#5e5e5e", marginBottom: 4 }}>{course.live_series}</p>
        )}

        {/* Scholar */}
        <p style={{ fontSize: 13, color: "rgb(129, 79, 255)", fontWeight: 500, marginBottom: course.live_next_date ? 4 : 16 }}>
          {scholar}
        </p>

        {/* Next date */}
        {course.live_next_date && (
          <p style={{ fontSize: 13, color: "#5e5e5e", marginBottom: 16 }}>
            Next class: {course.live_next_date}
          </p>
        )}

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-block",
            background: "linear-gradient(155deg, rgb(214, 228, 255) -25%, rgb(129, 79, 255) 22%, rgb(63, 15, 201) 76%, rgb(212, 228, 255) 128%)",
            color: "#ffffff",
            fontWeight: 600,
            fontSize: 14,
            padding: "10px 22px",
            borderRadius: 24,
            textDecoration: "none",
            fontFamily: "inherit",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
        >
          Enrol now →
        </a>
      </div>
    </div>
  );
}

export function LiveBadge() {
  return (
    <div style={{
      position: "absolute",
      top: 10,
      left: 10,
      display: "flex",
      alignItems: "center",
      gap: 5,
      backgroundColor: "#16a34a",
      color: "#ffffff",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: "0.06em",
      padding: "4px 8px",
      borderRadius: 6,
    }}>
      <span
        className="live-dot"
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          display: "inline-block",
          flexShrink: 0,
        }}
      />
      LIVE
    </div>
  );
}
