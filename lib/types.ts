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

export const EMPTY_ANSWERS: QuizAnswers = {
  q1: "",
  q1b: [],
  q1b_other: "",
  q2: "",
  q3: [],
  q4: "",
  q4_other: "",
  q5: "",
  q6: "",
  q7: "",
  q8: "",
};
