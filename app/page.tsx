"use client";

import { useState, useCallback } from "react";
import { QuizAnswers, EMPTY_ANSWERS } from "@/lib/types";
import IntroScreen from "@/components/IntroScreen";
import QuizScreen from "@/components/QuizScreen";
import ResultsScreen from "@/components/ResultsScreen";

type Screen = "intro" | "quiz" | "results";

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [sessionId] = useState(() => generateSessionId());

  const handleBegin = useCallback(() => setScreen("quiz"), []);

  const handleComplete = useCallback((finalAnswers: QuizAnswers) => {
    setAnswers(finalAnswers);
    setScreen("results");
  }, []);

  const handleRestart = useCallback(() => {
    setAnswers(EMPTY_ANSWERS);
    setScreen("intro");
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {screen === "intro" && <IntroScreen onBegin={handleBegin} />}
      {screen === "quiz" && (
        <QuizScreen onComplete={handleComplete} />
      )}
      {screen === "results" && (
        <ResultsScreen
          answers={answers}
          sessionId={sessionId}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}
