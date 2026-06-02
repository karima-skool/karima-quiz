import coursesData from "@/data/courses.json";

export interface Course {
  id: string;
  title: string;
  short_description: string;
  topic_tags: string[];
  difficulty: string;
  time_commitment: string;
  format: string;
  scholar: string;
  signup_url: string;
  active: boolean;
}

export interface QuizAnswers {
  q1: string;
  q1b: string[];
  q1b_other: string;
  q2: string;
  q3: string[];
  q4: string;
  q4_other: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
}

export interface ScoredCourse {
  course: Course;
  score: number;
  matchReasons: string[];
}

const TIME_MAP: Record<string, string> = {
  "Less than 1 hour — I need something light and flexible": "less-than-1hr",
  "1–2 hours — I can commit to a short course": "1-2hrs",
  "3–5 hours — I'm ready for something more structured": "3-5hrs",
  "As much as it takes — I'm serious about this": "any",
};

const TAG_LABELS: Record<string, string> = {
  aqeedah: "Islamic belief",
  fiqh: "Fiqh",
  seerah: "Seerah",
  "quran-tajweed": "Quran & Tajweed",
  arabic: "Arabic",
  "family-marriage": "family life",
  spirituality: "spirituality",
  eschatology: "eschatology",
};

function getMatchReasons(course: Course, answers: QuizAnswers): string[] {
  const reasons: string[] = [];
  const matchedTags = course.topic_tags.filter((t) => answers.q3.includes(t));
  if (matchedTags.length > 0) {
    const labels = matchedTags.map((t) => TAG_LABELS[t] ?? t);
    reasons.push(
      `Recommended because you're interested in ${labels.join(" and ")}.`
    );
  }
  return reasons;
}

export function getRecommendations(answers: QuizAnswers): {
  results: ScoredCourse[];
  topCourse: Course;
} {
  const courses = (coursesData as Course[]).filter((c) => c.active);
  const preferredTime = TIME_MAP[answers.q5] ?? "any";

  const scored: ScoredCourse[] = courses.map((course) => {
    let score = 0;

    // Tag matching (primary signal)
    const tagMatches = course.topic_tags.filter((t) =>
      answers.q3.includes(t)
    ).length;
    score += tagMatches;

    // Time compatibility bonus
    if (preferredTime !== "any") {
      if (course.time_commitment === preferredTime) {
        score += 0.5;
      }
    }

    const matchReasons = getMatchReasons(course, answers);
    return { course, score, matchReasons };
  });

  // Sort descending
  scored.sort((a, b) => b.score - a.score);

  // Top course is always the highest scorer
  const topCourse = scored[0].course;

  // Return top 3 with score > 0; fallback if none match
  let results = scored.filter((s) => s.score > 0).slice(0, 3);

  if (results.length === 0) {
    // Best tag overlap regardless; ultimate fallback is KA-001
    const fallback =
      scored[0].score >= 0
        ? scored[0]
        : scored.find((s) => s.course.id === "KA-001") ?? scored[0];
    results = [fallback];
  }

  return { results, topCourse };
}

export function buildProfileSummary(answers: QuizAnswers): string {
  const levelMap: Record<string, string> = {
    "No, I'm just getting started": "new to formal Islamic study",
    "I've attended a few classes or lectures": "someone who's attended a few classes",
    "Yes, I've studied with a teacher or institution":
      "someone who has studied formally",
    "I have some knowledge but want to go deeper":
      "someone with foundational knowledge looking to go deeper",
  };

  const timeMap: Record<string, string> = {
    "Less than 1 hour — I need something light and flexible":
      "less than an hour",
    "1–2 hours — I can commit to a short course": "1–2 hours",
    "3–5 hours — I'm ready for something more structured": "3–5 hours",
    "As much as it takes — I'm serious about this": "as much time as needed",
  };

  const motivationMap: Record<string, string> = {
    "I want to strengthen my personal faith and connection with Allah":
      "strengthen your personal faith and connection with Allah",
    "I want to understand the rulings and practices of my religion properly":
      "understand the rulings and practices of your religion properly",
    "I want to be able to teach or pass knowledge on to my family":
      "pass knowledge on to your family",
    "I'm going through a life change and want guidance":
      "find guidance through a life change",
    "I'm curious and want to explore Islam more deeply":
      "explore Islam more deeply",
  };

  const level = levelMap[answers.q1] ?? "on a learning journey";
  const time = timeMap[answers.q5] ?? "some time";
  const motivation = motivationMap[answers.q2] ?? "deepen your understanding";
  const topics =
    answers.q3.length > 0
      ? answers.q3.map((t) => TAG_LABELS[t] ?? t).join(", ")
      : "Islamic knowledge";

  let summary = `You're ${level}, with a keen interest in ${topics}. `;
  summary += `You're looking to ${motivation}, `;
  summary += `and can commit around ${time} a week to learning. `;

  if (answers.q4_other && answers.q4_other.trim()) {
    summary += `Given where you are right now, we've tailored these suggestions with your situation in mind.`;
  } else {
    summary += `We've matched you with courses that suit both your background and your goals.`;
  }

  return summary;
}
