// src/domain/lens/lensTypes.ts

export type MonoLensKey = "farMono" | "midMono" | "nearMono";
export type LensKey = MonoLensKey | "EDOF" | "MF";
export type Scores = Record<LensKey, number>;
export type RankingItem = { key: LensKey; score: number };

export const lensLabel: Record<LensKey, string> = {
  farMono: "単焦点（遠方）",
  midMono: "単焦点（中間）",
  nearMono: "単焦点（近方）",
  EDOF: "EDOF レンズ",
  MF: "多焦点レンズ",
};

export const lensTypeText: Record<LensKey, string> = {
  farMono: "単焦点レンズ",
  midMono: "単焦点レンズ",
  nearMono: "単焦点レンズ",
  EDOF: "EDOFレンズ",
  MF: "多焦点レンズ",
};

export const distanceText: Record<LensKey, string> = {
  farMono: "遠方",
  midMono: "中間",
  nearMono: "近方",
  EDOF: "遠方〜中間",
  MF: "遠方〜中間〜近方",
};
