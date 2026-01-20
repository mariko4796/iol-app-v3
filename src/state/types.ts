// src/state/types.ts
// v3: Q1〜Q11の連番（旧Q9削除、旧Q10→Q9、旧Q11→Q10、旧Q12→Q11）

export type QuestionKey =
  | "q1"
  | "q2"
  | "q3"
  | "q4"
  | "q5"
  | "q6"
  | "q7"
  | "q8"
  | "q9"
  | "q10"
  | "q11";

export type Answers = {
  [K in QuestionKey]: number | null;
};

export const questionKeys: QuestionKey[] = [
  "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"
];

export const initialAnswers: Answers = {
  q1: null,
  q2: null,
  q3: null,
  q4: null,
  q5: null,
  q6: null,
  q7: null,
  q8: null,
  q9: null,
  q10: null,
  q11: null,
};

// 質問ページのルート
export const questionRoutes: Record<QuestionKey, string> = {
  q1: "/q1",
  q2: "/q2",
  q3: "/q3",
  q4: "/q4",
  q5: "/q5",
  q6: "/q6",
  q7: "/q7",
  q8: "/q8",
  q9: "/q9",
  q10: "/q10",
  q11: "/q11",
};

// 次の質問ページ
export const nextQuestionRoute: Record<QuestionKey, string | null> = {
  q1: "/q2",
  q2: "/q3",
  q3: "/q4",
  q4: "/q5",
  q5: "/q6",
  q6: "/q7",
  q7: "/q8",
  q8: "/q9",
  q9: "/q10",
  q10: "/q11",
  q11: null, // 最後
};

// 前の質問ページ
export const prevQuestionRoute: Record<QuestionKey, string | null> = {
  q1: null,
  q2: "/q1",
  q3: "/q2",
  q4: "/q3",
  q5: "/q4",
  q6: "/q5",
  q7: "/q6",
  q8: "/q7",
  q9: "/q8",
  q10: "/q9",
  q11: "/q10",
};
