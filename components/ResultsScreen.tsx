"use client";

import { useEffect, useState } from "react";
import { QuizAnswers } from "@/lib/types";
import { getRecommendations, Course } from "@/lib/recommend";
import { supabase } from "@/lib/supabase";
import CourseCard from "@/components/CourseCard";
import LiveCourseCard from "@/components/LiveCourseCard";
import coursesData from "@/data/courses.json";

interface Props {
  answers: QuizAnswers;
  sessionId: string;
  onRestart: () => void;
  onBrowse: () => void;
}

export default function ResultsScreen({ answers, sessionId, onRestart, onBrowse }: Props) {
  const [saved, setSaved] = useState(false);
  const [aiReasons, setAiReasons] = useState<Record<string, string>>({});

  const { results, topCourse } = getRecommendations(answers);
  const liveCourses = (coursesData as Course[]).filter(c => c.active === true && c.is_live === true);
  // Fix 1: exclude live courses from recommended section to avoid duplication
  const recommendedResults = results.filter(r => r.course.is_live !== true);

  useEffect(() => {
    if (saved) return;
    setSaved(true);

    async function saveResponse() {
      console.log("[quiz] saveResponse fired, supabase client:", supabase ? "initialised" : "NULL — env vars missing at build time");
      if (!supabase) {
        console.error("[quiz] Supabase client is null. NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY must be set as environment variables before the Railway build runs.");
        return;
      }
      try {
        const payload = {
          session_id: sessionId,
          q1_prior_learning: answers.q1 || null,
          q1b_prior_subjects: answers.q1b.length > 0 ? answers.q1b : null,
          q1b_other_text: answers.q1b_other || null,
          q2_motivation: answers.q2 || null,
          q3_topic_tags: answers.q3.length > 0 ? answers.q3 : null,
          q4_life_stage: answers.q4 || null,
          q4_other_text: answers.q4_other || null,
          q5_time_commitment: answers.q5 || null,
          q6_format_preference: answers.q6.length > 0 ? answers.q6 : null,
          q7_interest_text: answers.q7 || null,
          q8_struggle_text: answers.q8 || null,
          q9_age_group: answers.q9 || null,
          recommended_course_ids: results.map((r) => r.course.id),
        };
        console.log("[quiz] inserting row:", JSON.stringify(payload));
        const { error } = await supabase.from("quiz_responses").insert(payload);
        if (error) {
          console.error("[quiz] Supabase insert error:", error.message, error.details, error.hint);
        } else {
          console.log("[quiz] row saved successfully");
        }
      } catch (err) {
        console.error("[quiz] unexpected error saving quiz response:", err);
      }
    }

    saveResponse();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    async function fetchAiReasons() {
      try {
        const candidates = results.map((r) => ({
          id: r.course.id,
          title: r.course.title,
          short_description: r.course.short_description,
          topic_tags: r.course.topic_tags,
        }));
        const res = await fetch("/api/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ answers, candidates }),
        });
        const data = await res.json();
        if (data.reasons) setAiReasons(data.reasons);
      } catch (err) {
        console.error("[results] AI reasons fetch failed, using fallback:", err);
      }
    }
    fetchAiReasons();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#ffffff" }}>
      {/* Sticky nav */}
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 10,
        background: "#ffffff",
        borderBottom: "1px solid #f0ebff",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#040313" }}>
          Your Results
        </span>
        <button
          onClick={onBrowse}
          style={{
            background: "#ffffff",
            border: "1px solid rgb(129, 79, 255)",
            borderRadius: 20,
            color: "rgb(129, 79, 255)",
            fontSize: 14,
            fontWeight: 500,
            padding: "8px 16px",
            cursor: "pointer",
            fontFamily: "inherit",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(129,79,255,0.04)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#ffffff")}
        >
          View all courses →
        </button>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 640, margin: "0 auto", padding: "40px 24px 60px" }}>
        {/* Heading */}
        <h1 style={{
          fontSize: "clamp(24px, 5vw, 28px)",
          fontWeight: 700,
          color: "#040313",
          marginBottom: 8,
          lineHeight: 1.2,
        }}>
          Your Learning Path
        </h1>
        <p style={{ fontSize: 15, color: "#5e5e5e", marginBottom: 32 }}>
          Based on your answers, here&apos;s where we&apos;d suggest you begin.
        </p>

        {/* Section 1 — Profile */}
        <div style={{
          backgroundColor: "rgba(129, 79, 255, 0.06)",
          border: "1px solid rgba(129, 79, 255, 0.2)",
          borderRadius: 16,
          padding: "20px 24px",
          marginBottom: 40,
        }}>
          <p style={{
            fontSize: 11,
            fontWeight: 600,
            color: "rgb(129, 79, 255)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            marginBottom: 12,
          }}>
            Your profile
          </p>
          <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "Prior learning",
                value: answers.q1 || "Not specified",
              },
              {
                label: "Interests",
                value: answers.q3.length > 0
                  ? answers.q3.map((t: string) => ({ aqeedah: "Islamic belief", fiqh: "Fiqh", seerah: "Seerah", "quran-tafseer": "Qur'an & Tafseer", arabic: "Arabic", "family-marriage": "Family life", spirituality: "Spirituality", eschatology: "Eschatology" }[t] ?? t)).join(", ")
                  : "Not specified",
              },
              {
                label: "Goal",
                value: answers.q2 || "Not specified",
              },
              {
                label: "Time available",
                value: answers.q5 || "Not specified",
              },
            ].map(({ label, value }) => (
              <li key={label} style={{ display: "flex", gap: 8, fontSize: 14, lineHeight: 1.5, alignItems: "flex-start" }}>
                <span style={{ color: "rgb(129, 79, 255)", fontWeight: 700, flexShrink: 0 }}>•</span>
                <span style={{ color: "#000000" }}>
                  <span style={{ fontWeight: 600, color: "#040313" }}>{label}: </span>
                  {value}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Live & Weekly Classes */}
        {liveCourses.length > 0 && (
          <div style={{ marginBottom: 40 }}>
            <style>{`
              .live-grid { display: flex; flex-direction: column; gap: 20px; }
              @media (min-width: 768px) { .live-grid { display: grid; grid-template-columns: repeat(2, 1fr); } }
            `}</style>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: "#040313", marginBottom: 6 }}>
              Live &amp; Weekly Classes
            </h2>
            <p style={{ fontSize: 14, color: "#5e5e5e", marginBottom: 20 }}>
              Join a live class — new sessions every week.
            </p>
            <div className="live-grid">
              {liveCourses.map(course => (
                <LiveCourseCard key={course.id} course={course} userTags={answers.q3} />
              ))}
            </div>
          </div>
        )}

        {/* Section 2 — Courses */}
        <div style={{ marginBottom: 40 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#040313", marginBottom: 20 }}>
            Recommended courses
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {recommendedResults.map((scored, i) => (
              <CourseCard key={scored.course.id} scored={scored} rank={i + 1} aiReason={aiReasons[scored.course.id]} />
            ))}
          </div>
        </div>

        {/* Section 3 — Fallback nudge */}
        <div style={{
          backgroundColor: "rgba(129, 79, 255, 0.04)",
          borderLeft: "3px solid rgb(129, 79, 255)",
          borderRadius: 12,
          padding: "18px 20px",
          marginBottom: 40,
        }}>
          <p style={{ fontSize: 14, color: "#000000", lineHeight: 1.6 }}>
            Not sure where to start? Based on your answers, we&apos;d suggest beginning here —{" "}
            <strong style={{ color: "rgb(129, 79, 255)" }}>{topCourse.title}</strong>.{" "}
            <span style={{ color: "#5e5e5e" }}>
              {topCourse.topic_tags.length > 0
                ? "This course covers the areas that matter most to you right now."
                : "This is a great starting point for any learning journey."}
            </span>
          </p>
        </div>

        {/* Restart */}
        <div style={{ textAlign: "center" }}>
          <button
            onClick={onRestart}
            style={{
              background: "none",
              border: "1px solid #e0e0e0",
              borderRadius: 20,
              color: "#5e5e5e",
              fontSize: 14,
              padding: "10px 24px",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Start again
          </button>
        </div>
      </div>
    </div>
  );
}
