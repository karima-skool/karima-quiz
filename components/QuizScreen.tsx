"use client";

import { useState } from "react";
import { QuizAnswers, EMPTY_ANSWERS } from "@/lib/types";
import ProgressBar from "@/components/ProgressBar";
import SingleSelect from "@/components/SingleSelect";
import MultiSelect from "@/components/MultiSelect";
import TextInput from "@/components/TextInput";

interface Props {
  onComplete: (answers: QuizAnswers) => void;
}

// Steps: q1, q1b (conditional), q2, q3, q4, q5, q6, q7, q8
// We manage a dynamic step list based on q1 answer

const Q1_OPTIONS = [
  "No, I'm just getting started",
  "I've attended a few classes or lectures",
  "Yes, I've studied with a teacher or institution",
  "I have some knowledge but want to go deeper",
];

const Q1B_OPTIONS = [
  "Aqeedah / Islamic belief",
  "Fiqh / rulings",
  "Seerah",
  "Quran / Tajweed",
  "Arabic",
  "Spirituality",
  "Hadith sciences",
  "Other",
];

const Q2_OPTIONS = [
  "I want to strengthen my personal faith and connection with Allah",
  "I want to understand the rulings and practices of my religion properly",
  "I want to be able to teach or pass knowledge on to my family",
  "I'm going through a life change and want guidance",
  "I'm curious and want to explore Islam more deeply",
];

const Q3_OPTIONS = [
  { label: "Islamic belief and theology (Aqeedah)", tag: "aqeedah" },
  { label: "Rulings and Islamic law (Fiqh)", tag: "fiqh" },
  { label: "The life of the Prophet ﷺ (Seerah)", tag: "seerah" },
  { label: "Quran recitation and Tajweed", tag: "quran-tajweed" },
  { label: "Arabic language", tag: "arabic" },
  { label: "Family, marriage and relationships", tag: "family-marriage" },
  { label: "Spirituality and the inner self", tag: "spirituality" },
  { label: "End times and eschatology", tag: "eschatology" },
];

const Q4_OPTIONS = [
  "I'm a young adult figuring out my faith",
  "I'm married or about to be and want to build an Islamic home",
  "I'm a parent wanting to raise my children Islamically",
  "I'm seeking knowledge purely for my own development",
  "I'm going through a difficult period and looking for grounding",
  "Other",
];

const Q5_OPTIONS = [
  "Less than 1 hour — I need something light and flexible",
  "1–2 hours — I can commit to a short course",
  "3–5 hours — I'm ready for something more structured",
  "As much as it takes — I'm serious about this",
];

const Q6_OPTIONS = [
  "Watching recorded video lessons in my own time",
  "Attending live online classes with a teacher",
  "In-person with a teacher and other students",
  "Reading and self-study with some guidance",
  "A mix of everything",
];

type StepId = "q1" | "q1b" | "q2" | "q3" | "q4" | "q5" | "q6" | "q7" | "q8";

function getSteps(answers: QuizAnswers): StepId[] {
  const base: StepId[] = ["q1"];
  if (answers.q1 && answers.q1 !== "No, I'm just getting started") {
    base.push("q1b");
  }
  base.push("q2", "q3", "q4", "q5", "q6", "q7", "q8");
  return base;
}

export default function QuizScreen({ onComplete }: Props) {
  const [answers, setAnswers] = useState<QuizAnswers>(EMPTY_ANSWERS);
  const [stepIndex, setStepIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  const steps = getSteps(answers);
  const currentStep = steps[stepIndex];
  // For progress, use a stable total (with q1b) or without, based on current q1
  const stableTotal = answers.q1 && answers.q1 !== "No, I'm just getting started" ? 9 : 8;

  function transition(fn: () => void) {
    setVisible(false);
    setTimeout(() => {
      fn();
      setVisible(true);
    }, 200);
  }

  function canAdvance(): boolean {
    switch (currentStep) {
      case "q1": return !!answers.q1;
      case "q1b": return true; // multi-select, optional to pick
      case "q2": return !!answers.q2;
      case "q3": return answers.q3.length > 0;
      case "q4": return !!answers.q4;
      case "q5": return !!answers.q5;
      case "q6": return answers.q6.length > 0;
      case "q7": return true; // optional
      case "q8": return true; // optional
      default: return false;
    }
  }

  function handleNext() {
    if (!canAdvance()) return;
    const nextSteps = getSteps(answers);
    if (stepIndex < nextSteps.length - 1) {
      transition(() => setStepIndex((i) => i + 1));
    } else {
      onComplete(answers);
    }
  }

  function handleBack() {
    if (stepIndex === 0) return;
    transition(() => setStepIndex((i) => i - 1));
  }

  function setQ1(val: string) {
    setAnswers((a) => {
      const next = { ...a, q1: val };
      // If they select "No, just getting started", clear q1b
      if (val === "No, I'm just getting started") {
        next.q1b = [];
        next.q1b_other = "";
      }
      return next;
    });
  }

  const isLast = stepIndex === steps.length - 1;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#1A1A1A",
      }}
    >
      {/* Progress bar */}
      <ProgressBar current={stepIndex + 1} total={stableTotal} />

      {/* Content */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          padding: "32px 24px 40px",
          maxWidth: 560,
          margin: "0 auto",
          width: "100%",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.2s ease",
        }}
      >
        {/* Back button */}
        {stepIndex > 0 && (
          <button
            onClick={handleBack}
            style={{
              background: "none",
              border: "none",
              color: "#A0A0A0",
              fontSize: 14,
              cursor: "pointer",
              padding: "0 0 24px 0",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            ← Back
          </button>
        )}

        {/* Q1 */}
        {currentStep === "q1" && (
          <SingleSelect
            question="Have you studied Islam formally before?"
            options={Q1_OPTIONS}
            value={answers.q1}
            onChange={setQ1}
          />
        )}

        {/* Q1b */}
        {currentStep === "q1b" && (
          <MultiSelect
            question="What have you studied before? Pick all that apply."
            options={Q1B_OPTIONS}
            selected={answers.q1b}
            onChange={(val) => setAnswers((a) => ({ ...a, q1b: val }))}
            showOtherInput
            otherValue={answers.q1b_other}
            onOtherChange={(val) => setAnswers((a) => ({ ...a, q1b_other: val }))}
          />
        )}

        {/* Q2 */}
        {currentStep === "q2" && (
          <SingleSelect
            question="What's bringing you to Islamic learning right now?"
            options={Q2_OPTIONS}
            value={answers.q2}
            onChange={(val) => setAnswers((a) => ({ ...a, q2: val }))}
          />
        )}

        {/* Q3 */}
        {currentStep === "q3" && (
          <MultiSelect
            question="Which of these topics interest you most? Pick up to three."
            options={Q3_OPTIONS.map((o) => o.label)}
            selected={answers.q3}
            onChange={(selected) => {
              // Store tags, not labels
              const tags = selected.map(
                (label) =>
                  Q3_OPTIONS.find((o) => o.label === label)?.tag ?? label
              );
              setAnswers((a) => ({ ...a, q3: tags }));
            }}
            // Pass current selection as labels for display
            selectedAsLabels={answers.q3.map(
              (tag) => Q3_OPTIONS.find((o) => o.tag === tag)?.label ?? tag
            )}
            maxSelect={3}
            maxNote="You've selected 3 — deselect one to change your choice."
          />
        )}

        {/* Q4 */}
        {currentStep === "q4" && (
          <SingleSelect
            question="Which best describes where you are right now?"
            options={Q4_OPTIONS}
            value={answers.q4}
            onChange={(val) => setAnswers((a) => ({ ...a, q4: val }))}
            showOtherInput
            otherLabel="Tell us a little about where you are right now"
            otherValue={answers.q4_other}
            onOtherChange={(val) => setAnswers((a) => ({ ...a, q4_other: val }))}
          />
        )}

        {/* Q5 */}
        {currentStep === "q5" && (
          <SingleSelect
            question="How much time can you realistically commit to learning each week?"
            options={Q5_OPTIONS}
            value={answers.q5}
            onChange={(val) => setAnswers((a) => ({ ...a, q5: val }))}
          />
        )}

        {/* Q6 */}
        {currentStep === "q6" && (
          <MultiSelect
            question="How do you prefer to learn?"
            options={Q6_OPTIONS}
            selected={answers.q6}
            onChange={(val) => setAnswers((a) => ({ ...a, q6: val }))}
            maxSelect={2}
            maxNote="You've selected 2 — deselect one to change your choice."
          />
        )}

        {/* Q7 */}
        {currentStep === "q7" && (
          <TextInput
            question="In a few words, what topic or question have you always wanted to learn more about?"
            value={answers.q7}
            onChange={(val) => setAnswers((a) => ({ ...a, q7: val }))}
            maxLength={200}
            optional
          />
        )}

        {/* Q8 */}
        {currentStep === "q8" && (
          <TextInput
            question="In a few words, what are you finding most difficult about practising or learning Islam right now?"
            value={answers.q8}
            onChange={(val) => setAnswers((a) => ({ ...a, q8: val }))}
            maxLength={200}
            optional
          />
        )}

        {/* Next / Submit */}
        <div style={{ marginTop: 32 }}>
          <button
            onClick={handleNext}
            disabled={!canAdvance()}
            style={{
              backgroundColor: canAdvance() ? "#4ECBA0" : "#2a2a2a",
              color: canAdvance() ? "#1A1A1A" : "#555",
              border: canAdvance() ? "none" : "1px solid #333",
              borderRadius: 8,
              padding: "14px 32px",
              fontSize: 15,
              fontWeight: 700,
              cursor: canAdvance() ? "pointer" : "not-allowed",
              width: "100%",
              transition: "all 0.15s",
            }}
          >
            {isLast ? "See my recommendations →" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}
