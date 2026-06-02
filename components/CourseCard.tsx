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

export default function CourseCard({ scored, rank }: Props) {
  const { course, matchReasons } = scored;
  const url = course.signup_url || "https://www.skool.com/karima/about";
  const formatLabel = FORMAT_LABELS[course.format] ?? course.format;
  const scholar = course.scholar === "TBC" ? "Coming soon" : course.scholar;

  return (
    <div
      style={{
        backgroundColor: "#222222",
        border: rank === 1 ? "1.5px solid #4ECBA040" : "1px solid #2E2E2E",
        borderRadius: 12,
        overflow: "hidden",
      }}
    >
      {/* Thumbnail — only when URL is set */}
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
      <div style={{ padding: "20px 20px 18px" }}>
      {/* Top row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 6,
        }}
      >
        <h3
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#FFFFFF",
            lineHeight: 1.3,
            flex: 1,
          }}
        >
          {course.title}
        </h3>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: "3px 10px",
            borderRadius: 99,
            backgroundColor: "#1A1A1A",
            border: "1px solid #333",
            color: "#A0A0A0",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          {formatLabel}
        </span>
      </div>

      {/* Scholar */}
      <p style={{ fontSize: 13, color: "#4ECBA0", marginBottom: 10, fontWeight: 500 }}>
        {scholar}
      </p>

      {/* Description */}
      <p
        style={{
          fontSize: 14,
          color: "#AAAAAA",
          lineHeight: 1.6,
          marginBottom: 14,
        }}
      >
        {course.short_description}
      </p>

      {/* Why this course */}
      {matchReasons.length > 0 && (
        <p
          style={{
            fontSize: 13,
            color: "#6EDBB5",
            fontStyle: "italic",
            marginBottom: 16,
            paddingTop: 10,
            borderTop: "1px solid #2a2a2a",
          }}
        >
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
          backgroundColor: "#4ECBA0",
          color: "#1A1A1A",
          fontWeight: 700,
          fontSize: 14,
          padding: "10px 22px",
          borderRadius: 7,
          textDecoration: "none",
          transition: "opacity 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
      >
        Enrol now →
      </a>
      </div>{/* end card body */}
    </div>
  );
}
