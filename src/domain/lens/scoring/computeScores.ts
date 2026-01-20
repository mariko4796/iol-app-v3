// src/domain/lens/scoring/computeScores.ts

import type { Answers, QuestionKey } from "@/src/state/types";
import type { LensKey, Scores, RankingItem } from "../lensTypes";
import { allScoreTables } from "./scoreTable";
import { deriveFlags, type DerivedFlags } from "./deriveFlags";

export type Recommendation = {
  scores: Scores;
  ranking: RankingItem[];
  top1?: RankingItem;
  top2?: RankingItem;
  allAnswered: boolean;
  flags: DerivedFlags;
  exceptionMessages: string[];
};

export function computeScores(answers: Answers): Recommendation {
  const scores: Scores = {
    farMono: 0,
    midMono: 0,
    nearMono: 0,
    EDOF: 0,
    MF: 0,
  };

  const questionIds: QuestionKey[] = [
    "q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11"
  ];

  for (const qId of questionIds) {
    const answer = answers[qId];
    if (answer === null) continue;

    const table = allScoreTables[qId];
    const entry = table[answer];
    if (!entry) continue;

    for (const [lensKey, value] of Object.entries(entry)) {
      scores[lensKey as LensKey] += value as number;
    }
  }

  const flags = deriveFlags(answers, scores);

  let ranking: RankingItem[];
  if (flags.costPriorityHigh) {
    ranking = (["farMono", "midMono", "nearMono"] as LensKey[])
      .map((key) => ({ key, score: scores[key] }))
      .sort((a, b) => b.score - a.score);
  } else {
    ranking = (Object.keys(scores) as LensKey[])
      .map((key) => ({ key, score: scores[key] }))
      .sort((a, b) => b.score - a.score);
  }

  const top1 = ranking[0];
  const top2 = ranking[1];

  const exceptionMessages: string[] = [];

  const monoVals = [scores.farMono, scores.midMono, scores.nearMono];
  const monoMax = Math.max(...monoVals);
  const monoMin = Math.min(...monoVals);
  const monoClose = monoMax - monoMin <= 2;

  if (flags.costPriorityHigh && (monoClose || flags.allStrong3)) {
    exceptionMessages.push(
      "保険適用内の単焦点レンズでは、遠・中・近すべてを裸眼で同時に満たすことはできません。この点をご理解いただいたうえで、最も優先したい距離を一つ選択していただいています。"
    );
  }

  const allAnswered = Object.values(answers).every((v) => v !== null);

  return {
    scores,
    ranking,
    top1,
    top2,
    allAnswered,
    flags,
    exceptionMessages,
  };
}
