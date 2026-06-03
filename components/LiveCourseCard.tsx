"use client";

import { Course, TAG_LABELS } from "@/lib/recommend";

const FREQ_LABELS: Record<string, string> = {
  "Weekly": "Weekly Class",
  "Bi-weekly": "Bi-weekly Class",
  "Monthly": "Monthly Class",
};

interface Props {
  course: Course;
  userTags: string[];
}

function getRecommendReason(course: Course, userTags: string[]): string {
  const matched = course.topic_tags.filter(t => userTags.includes(t));
  if (matched.length === 0) return "Recommended based on your learning goals.";
  const labels = matched.map(t => TAG_LABELS[t] ?? t);
  return `Recommended because you're interested in ${labels.join(" and ")}.`;
}

export default function LiveCourseCard({ course, userTags }: Props) {
  const url = course.signup_url || "https://www.skool.com/karima/about";
  const scholar = course.scholar === "TBC" ? "Coming soon" : course.scholar;
  const freqLabel = FREQ_LABELS[course.live_frequency ?? ""] ?? course.live_frequency;
  const scheduleStr = [course.live_day, course.live_time, freqLabel].filter(Boolean).join(" · ");
  const recommendLine = getRecommendReason(course, userTags);

  return (
    <div style={{
      backgroundColor: "#ffffff",
      border: "1px solid #ede8ff",
      borderRadius: 16,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(129, 79, 255, 0.08)",
      display: "flex",
      flexDirection: "column",
    }}>
      {/* Thumbnail — no badge */}
      {course.thumbnail_url && (
        <div style={{ aspectRatio: "16/9", width: "100%", overflow: "hidden", flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail_url}
            alt={course.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "16px 20px 20px", display: "flex", flexDirection: "column", flex: 1 }}>
        {/* Schedule — in purple, above title */}
        {scheduleStr && (
          <p style={{ fontSize: 13, fontWeight: 600, color: "rgb(129, 79, 255)", marginBottom: 8 }}>
            {scheduleStr}
          </p>
        )}

        {/* Title */}
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#040313", lineHeight: 1.3, marginBottom: 4 }}>
          {course.title}
        </h3>

        {/* live_series */}
        {course.live_series && (
          <p style={{ fontSize: 13, color: "#5e5e5e", marginBottom: 4 }}>{course.live_series}</p>
        )}

        {/* Scholar */}
        <p style={{ fontSize: 13, color: "rgb(129, 79, 255)", fontWeight: 500, marginBottom: 10 }}>
          {scholar}
        </p>

        {/* Description */}
        <p style={{ fontSize: 14, color: "#000000", lineHeight: 1.6, marginBottom: course.live_next_date ? 8 : 12 }}>
          {course.short_description}
        </p>

        {/* Next date */}
        {course.live_next_date && (
          <p style={{ fontSize: 13, color: "#5e5e5e", marginBottom: 12 }}>
            Next class: {course.live_next_date}
          </p>
        )}

        {/* Recommended because line */}
        <p style={{
          fontSize: 13,
          color: "rgb(129, 79, 255)",
          fontStyle: "italic",
          marginBottom: 16,
          paddingTop: 10,
          borderTop: "1px solid #ede8ff",
        }}>
          {recommendLine}
        </p>

        {/* Enrol button */}
        <div style={{ marginTop: "auto" }}>
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
    </div>
  );
}
