// src/domain/lens/scoring/scoreTable.ts
// v3スコア表：Q1〜Q11連番
// Q5(ハロー),Q9(夜間運転),Q10(眼疾患)はスコア影響なし

import type { Scores } from "../lensTypes";

type ScoreEntry = Partial<Scores>;
type QuestionScoreTable = Record<number, ScoreEntry>;

// Q1: 遠方の希望
export const q1Scores: QuestionScoreTable = {
  1: { farMono: 4, EDOF: 3, MF: 3 },
  2: { farMono: 3, EDOF: 2, MF: 2 },
  3: {},
  4: { midMono: 1, nearMono: 1 },
  5: { midMono: 1, nearMono: 1 },
};

// Q2: 中間の希望
export const q2Scores: QuestionScoreTable = {
  1: { midMono: 4, EDOF: 4, MF: 3 },
  2: { midMono: 3, EDOF: 3, MF: 2 },
  3: {},
  4: { farMono: 1, nearMono: 1 },
  5: { farMono: 1, nearMono: 1 },
};

// Q3: 近方の希望
export const q3Scores: QuestionScoreTable = {
  1: { nearMono: 4, MF: 4 },
  2: { nearMono: 3, MF: 3 },
  3: {},
  4: { farMono: 1, midMono: 1, EDOF: 1 },
  5: { farMono: 1, midMono: 1, EDOF: 1 },
};

// Q4: 見え方の質
export const q4Scores: QuestionScoreTable = {
  1: { farMono: 2, midMono: 2, nearMono: 2 },
  2: { farMono: 1, midMono: 1, nearMono: 1 },
  3: {},
  4: { EDOF: 1, MF: 1 },
  5: { EDOF: 1, MF: 1 },
};

// Q5: ハロー・グレア → スコア影響なし
export const q5Scores: QuestionScoreTable = {
  1: {}, 2: {}, 3: {}, 4: {}, 5: {},
};

// Q6: メガネ許容度
export const q6Scores: QuestionScoreTable = {
  1: { EDOF: 3, MF: 4 },
  2: { EDOF: 2, MF: 3 },
  3: {},
  4: { farMono: 1, midMono: 1, nearMono: 1 },
  5: { farMono: 2, midMono: 2, nearMono: 2 },
};

// Q7: 費用
export const q7Scores: QuestionScoreTable = {
  1: { farMono: 2, midMono: 2, nearMono: 2 },
  2: { farMono: 1, midMono: 1, nearMono: 1 },
  3: {},
  4: { EDOF: 1, MF: 1 },
  5: { EDOF: 1, MF: 1 },
};

// Q8: 一番大切な距離（6択）
export const q8Scores: QuestionScoreTable = {
  1: { farMono: 5, EDOF: 2, MF: 1 },
  2: { farMono: 2, midMono: 5, EDOF: 5, MF: 2 },
  3: { midMono: 5, nearMono: 1, EDOF: 5, MF: 3 },
  4: { midMono: 5, nearMono: 3, EDOF: 4, MF: 4 },
  5: { midMono: 1, nearMono: 5, EDOF: 2, MF: 5 },
  6: { nearMono: 5, EDOF: 1, MF: 5 },
};

// Q9: 夜間運転 → スコア影響なし
export const q9Scores: QuestionScoreTable = {
  1: {}, 2: {}, 3: {}, 4: {},
};

// Q10: 眼の病気 → スコア影響なし
export const q10Scores: QuestionScoreTable = {
  1: {}, 2: {}, 3: {}, 4: {},
};

// Q11: 視力履歴
export const q11Scores: QuestionScoreTable = {
  1: { nearMono: 1 },
  2: { farMono: 1 },
  3: {},
};

export const allScoreTables = {
  q1: q1Scores,
  q2: q2Scores,
  q3: q3Scores,
  q4: q4Scores,
  q5: q5Scores,
  q6: q6Scores,
  q7: q7Scores,
  q8: q8Scores,
  q9: q9Scores,
  q10: q10Scores,
  q11: q11Scores,
} as const;
