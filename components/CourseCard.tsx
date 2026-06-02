"use client";

import { ScoredCourse } from "@/lib/recommend";

interface Props {
  scored: ScoredCourse;
  rank: number;
}

const FORMAT_LABELS: Record<string, string> = {
  recorded: "Recorded",
  "live-online": "Live online",
  "in-person": "In person",
};

export default function CourseCard({ scored }: Props) {
  const { course, matchReasons } = scored;
  const url = course.signup_url || "https://www.skool.com/karima/about";
  const formatLabel = FORMAT_LABELS[course.format] ?? course.format;
  const scholar = course.scholar === "TBC" ? "Coming soon" : course.scholar;

  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #ede8ff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(129, 79, 255, 0.08)",
    }}>
      {/* Thumbnail */}
      {course.thumbnail_url && (
        <div style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail_url}
            alt={course.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "20px 20px 20px" }}>
        {/* Top row — title + format badge */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 6 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#040313", lineHeight: 1.3, flex: 1 }}>
            {course.title}
          </h3>
          <span style={{
            fontSize: 12,
            fontWeight: 500,
            padding: "4px 10px",
            borderRadius: 20,
            backgroundColor: "#f0ebff",
            color: "rgb(129, 79, 255)",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}>
            {formatLabel}
          </span>
        </div>

        {/* Scholar */}
        <p style={{ fontSize: 13, color: "rgb(129, 79, 255)", marginBottom: 10, fontWeight: 500 }}>
          {scholar}
        </p>

        {/* Description */}
        <p style={{ fontSize: 14, color: "#000000", lineHeight: 1.6, marginBottom: 14 }}>
          {course.short_description}
        </p>

        {/* Why this course */}
        {matchReasons.length > 0 && (
          <p style={{
            fontSize: 13,
            color: "rgb(129, 79, 255)",
            fontStyle: "italic",
            marginBottom: 16,
            paddingTop: 12,
            borderTop: "1px solid #ede8ff",
          }}>
            {matchReasons[0]}
          </p>
        )}

        {/* Enrol button */}
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
