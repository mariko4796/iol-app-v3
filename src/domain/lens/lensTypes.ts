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

// Q8の回答に基づく具体的な距離テキスト
export const q8DistanceText: Record<number, string> = {
  1: "約5m以上:道路標識・信号・屋外で人の顔",
  2: "約2m:テレビ・リビング内",
  3: "約1m:作業台全体・少し離れた手",
  4: "約70cm:料理・PC画面・調理台の手元",
  5: "約40cm:読書・スマホの文字",
  6: "約33cm:細かい作業・小さい文字",
};