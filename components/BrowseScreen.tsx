"use client";

import courses from "@/data/courses.json";

interface Props {
  onBack: () => void;
}

const TAG_LABELS: Record<string, string> = {
  aqeedah: "Aqeedah",
  fiqh: "Fiqh",
  seerah: "Seerah",
  "quran-tafseer": "Qur'an & Tafseer",
  arabic: "Arabic",
  "family-marriage": "Family & Marriage",
  spirituality: "Spirituality",
  eschatology: "Eschatology",
};

const FORMAT_LABELS: Record<string, string> = {
  recorded: "Recorded",
  "live-online": "Live online",
  "in-person": "In person",
};

const activeCourses = courses.filter((c) => c.active);

export default function BrowseScreen({ onBack }: Props) {
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Nav */}
      <div style={{
        background: "#ffffff",
        borderBottom: "1px solid #f0ebff",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: "rgb(129, 79, 255)",
            fontSize: 14,
            fontWeight: 500,
            cursor: "pointer",
            fontFamily: "inherit",
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Back to my results
        </button>
        <span style={{
          color: "rgb(129, 79, 255)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          marginLeft: "auto",
        }}>
          Karima Academy
        </span>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 60px" }}>
        <h1 style={{
          fontSize: "clamp(22px, 4vw, 28px)",
          fontWeight: 700,
          color: "#040313",
          marginBottom: 8,
        }}>
          All Courses
        </h1>
        <p style={{ fontSize: 15, color: "#5e5e5e", marginBottom: 36 }}>
          {activeCourses.length} courses available
        </p>

        {/* Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 24,
        }}>
          {activeCourses.map((course) => {
            const scholar = course.scholar === "TBC" ? "Coming soon" : course.scholar;
            const url = course.signup_url || "https://www.skool.com/karima/about";
            const formatLabel = FORMAT_LABELS[course.format] ?? course.format;

            return (
              <div
                key={course.id}
                style={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #ede8ff",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 2px 12px rgba(129, 79, 255, 0.08)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {/* Thumbnail */}
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
                <div style={{ padding: "16px 16px 18px", display: "flex", flexDirection: "column", flex: 1 }}>
                  {/* Format badge */}
                  <span style={{
                    fontSize: 11,
                    fontWeight: 500,
                    padding: "3px 9px",
                    borderRadius: 20,
                    backgroundColor: "#f0ebff",
                    color: "rgb(129, 79, 255)",
                    alignSelf: "flex-start",
                    marginBottom: 10,
                  }}>
                    {formatLabel}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#040313",
                    lineHeight: 1.3,
                    marginBottom: 4,
                  }}>
                    {course.title}
                  </h3>

                  {/* Scholar */}
                  <p style={{ fontSize: 12, color: "rgb(129, 79, 255)", fontWeight: 500, marginBottom: 10 }}>
                    {scholar}
                  </p>

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
                    {course.topic_tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: 11,
                          fontWeight: 500,
                          padding: "2px 8px",
                          borderRadius: 99,
                          backgroundColor: "rgba(129, 79, 255, 0.08)",
                          color: "rgb(129, 79, 255)",
                          border: "1px solid rgba(129, 79, 255, 0.2)",
                        }}
                      >
                        {TAG_LABELS[tag] ?? tag}
                      </span>
                    ))}
                  </div>

                  {/* Enrol button — pushed to bottom */}
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
                        fontSize: 13,
                        padding: "9px 18px",
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
          })}
        </div>
      </div>
    </div>
  );
}
