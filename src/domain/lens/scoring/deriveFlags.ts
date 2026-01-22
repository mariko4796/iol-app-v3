// src/domain/lens/scoring/deriveFlags.ts

import type { Answers } from "@/src/state/types";
import type { Scores, LensKey } from "../lensTypes";

export type DerivedFlags = {
  costPriorityHigh: boolean;
  hasRetinaDisease: boolean;
  haloAbsoluteNo: boolean;
  nightDrivingOften: boolean;
  veryHateGlasses: boolean;
  strong2orMore: boolean;
  allStrong3: boolean;
  premiumRawTopIsEDOF: boolean;
  premiumRawTopIsMF: boolean;
  edofVsMfClose: boolean;
  requiresExtraByCost: boolean;
  requiresExtraByRetina: boolean;
  requiresExtraByHaloNight: boolean;
  requiresExtraByPremiumCompare: boolean;
};

export function deriveFlags(answers: Answers, rawScores: Scores): DerivedFlags {
  // Q7: 費用（v3の連番）
  const costPriorityHigh = answers.q7 === 1 || answers.q7 === 2;
  const costPriorityLow = answers.q7 === 3 || answers.q7 === 4 || answers.q7 === 5; // 保険優先でない

  // Q10: 眼疾患（v3の連番、旧Q11）
  const hasRetinaDisease =
    answers.q10 === 1 || answers.q10 === 2 || answers.q10 === 3;

  // Q5: ハロー（v3の連番）
  const haloAbsoluteNo = answers.q5 === 1 || answers.q5 === 2;

  // Q9: 夜間運転（v3の連番、旧Q10）
  const nightDrivingOften = answers.q9 === 1 || answers.q9 === 2;

  // Q6: メガネ
  const veryHateGlasses = answers.q6 === 1;

  // Q1〜Q3の強い希望カウント
  const strongCount =
    (answers.q1 === 1 || answers.q1 === 2 ? 1 : 0) +
    (answers.q2 === 1 || answers.q2 === 2 ? 1 : 0) +
    (answers.q3 === 1 || answers.q3 === 2 ? 1 : 0);

  const strong2orMore = strongCount >= 2;
  const allStrong3 = strongCount === 3;

  // 素点ランキング
  const ranking = (Object.keys(rawScores) as LensKey[])
    .map((key) => ({ key, score: rawScores[key] }))
    .sort((a, b) => b.score - a.score);

  const top = ranking[0];
  const premiumRawTopIsEDOF = top?.key === "EDOF";
  const premiumRawTopIsMF = top?.key === "MF";
  const edofVsMfClose = Math.abs(rawScores.EDOF - rawScores.MF) <= 2;

  const hasPremiumWish =
    strong2orMore || premiumRawTopIsEDOF || premiumRawTopIsMF;

  // ★ 修正: requiresExtraByCost は保険優先(Q7=1,2)かつ複数距離希望
  const requiresExtraByCost = costPriorityHigh && strong2orMore;

  // ★ 修正: requiresExtraByRetina は眼疾患あり かつ 保険優先でない(Q7=3,4,5)
  const requiresExtraByRetina = hasRetinaDisease && costPriorityLow;

  // ★ 修正: requiresExtraByHaloNight はハロー/夜間運転リスクあり かつ 保険優先でない(Q7=3,4,5)
  const requiresExtraByHaloNight = (haloAbsoluteNo || nightDrivingOften) && costPriorityLow;

  const requiresExtraByPremiumCompare =
    edofVsMfClose &&
    (premiumRawTopIsEDOF || premiumRawTopIsMF) &&
    !costPriorityHigh;

  return {
    costPriorityHigh,
    hasRetinaDisease,
    haloAbsoluteNo,
    nightDrivingOften,
    veryHateGlasses,
    strong2orMore,
    allStrong3,
    premiumRawTopIsEDOF,
    premiumRawTopIsMF,
    edofVsMfClose,
    requiresExtraByCost,
    requiresExtraByRetina,
    requiresExtraByHaloNight,
    requiresExtraByPremiumCompare,
  };
}