// src/data/questions/questionData.ts
// v3: Q1〜Q11連番、注釈付き

import type { QuestionKey } from "@/src/state/types";

export type QuestionData = {
  id: QuestionKey;
  title: string;           // 質問タイトル
  description: string;     // 注釈（説明文）
  choices: string[];       // 選択肢
  icon: "pink" | "green" | "blue" | "yellow";
  warning?: {              // 特定選択時の警告
    condition: (value: number) => boolean;
    message: string;
  };
};

export const questionDataList: QuestionData[] = [
  {
    id: "q1",
    title: "Q1：遠くの見え方の優先度",
    description: `「遠くを見る場面を、できるだけメガネを使わずに見たいと思いますか？」
・車の運転
・散歩、買い物、外出
・人の顔を遠くから認識
・ゴルフ・スポーツ`,
    choices: [
      "とてもそう思う（メガネなしで見たい）",
      "けっこうそう思う",
      "どちらでもよい",
      "あまりそう思わない",
      "全くそう思わない",
    ],
    icon: "pink",
  },
  {
    id: "q2",
    title: "Q2：中間の見え方の優先度",
    description: `「パソコン作業や家事など、"腕を伸ばしたくらいの距離"を、メガネを使わずに見たいと思いますか？」
・パソコンの画面
・料理の手元`,
    choices: [
      "とてもそう思う",
      "けっこうそう思う",
      "どちらでもよい",
      "あまりそう思わない",
      "全くそう思わない",
    ],
    icon: "green",
  },
  {
    id: "q3",
    title: "Q3：近くの優先度（読書・スマホ・細かい作業）",
    description: `「読書やスマホなど、"手元の距離"をメガネなしで見たいと思いますか？」
・スマホ
・読書
・裁縫など細かい作業`,
    choices: [
      "とてもそう思う（裸眼で見たい）",
      "けっこうそう思う",
      "どちらでもよい",
      "あまりそう思わない",
      "全くそう思わない",
    ],
    icon: "blue",
  },
  {
    id: "q4",
    title: "Q4：見え方のクリアさの優先度",
    description: `多少メガネを使っても "見え方のクリアさ（質）" を最優先したいですか？`,
    choices: [
      "はい、見え方の質が最も大事",
      "どちらかといえばそう思う",
      "どちらでもよい",
      "あまり気にしない",
      "ほとんど気にしない",
    ],
    icon: "yellow",
  },
  {
    id: "q5",
    title: "Q5：ハロー・グレアの気になり方",
    description: `夜にライトが輪のように見える "ハロー・グレア" についてどれくらい気になりますか？`,
    choices: [
      "絶対にイヤ（許容できない）",
      "かなり気になる",
      "慣れれば大丈夫かも",
      "あまり気にしない",
      "全く気にしない",
    ],
    icon: "green",
  },
  {
    id: "q6",
    title: "Q6：メガネの許容度",
    description: `メガネを使うことについてどのように感じますか？`,
    choices: [
      "できれば使いたくない（メガネは避けたい）",
      "あまり使いたくない",
      "場面によっては使ってもよい",
      "気にならない（必要なら使う）",
      "むしろ使ってもいい",
    ],
    icon: "pink",
  },
  {
    id: "q7",
    title: "Q7：費用の優先度",
    description: `見え方よりも "費用（保険適用内）" を優先したいですか？`,
    choices: [
      "はい、費用を優先したい（保険適用内）",
      "どちらかといえば費用を優先",
      "どちらでもよい",
      "多少高くても目的に合えばよい",
      "費用より見え方を優先したい",
    ],
    icon: "blue",
  },
  {
    id: "q8",
    title: "Q8：毎日の生活で、一番大切な距離（メガネなしで一番見たい距離）",
    description: `※今のあなたの生活の中で「最もよく使う距離」を教えてください。`,
    choices: [
      "約5m以上：道路標識・信号・屋外で人の顔",
      "約2m：テレビ・リビング内",
      "約1m：腕を伸ばしたくらい・作業台全体・少し離れた手",
      "約70cm：料理・PC画面・調理台の手元",
      "約40cm：読書・スマホの文字",
      "約33cm：細かい作業・小さい文字",
    ],
    icon: "blue",
  },
  {
    id: "q9",
    title: "Q9：夜間に車の運転をする頻度",
    description: `※夜にライトの多い道路をどのくらい運転するかを教えてください。`,
    choices: [
      "よくある（週に数回以上）",
      "たまにある（月に数回程度）",
      "ほとんどない",
      "まったくない",
    ],
    icon: "green",
  },
  {
    id: "q10",
    title: "Q10：眼の病気の既往（患者申告）",
    description: `※これまでに、次のような眼の病気を指摘されたことはありますか？
複数当てはまる場合は、一番気になるものを1つ選んでください。`,
    choices: [
      "糖尿病網膜症",
      "緑内障",
      "黄斑の病気（黄斑変性など）",
      "なし／わからない",
    ],
    icon: "pink",
    warning: {
      condition: (v) => v >= 1 && v <= 3,
      message: "⚠ 網膜や視神経に病気がある場合、多焦点レンズや EDOF レンズは適さないことがあります。",
    },
  },
  {
    id: "q11",
    title: "Q11：これまでの裸眼の見え方に一番近いもの",
    description: `※メガネやコンタクトを外したときの、おおまかな見え方です。`,
    choices: [
      "近くはよく見えるが、遠くはぼやける（近視ぎみ）",
      "遠くはよく見えるが、近くが見えにくい（遠視・老視ぎみ）",
      "どちらともいえない／特に思い当たらない",
    ],
    icon: "blue",
  },
];

// IDからデータを取得
export const questionDataMap: Record<QuestionKey, QuestionData> = 
  questionDataList.reduce((acc, q) => {
    acc[q.id] = q;
    return acc;
  }, {} as Record<QuestionKey, QuestionData>);

// 印刷用の質問テキスト
export const questionText: Record<QuestionKey, string> = {
  q1: "Q1：遠くの見え方の優先度（運転・外出・スポーツ）",
  q2: "Q2：中間距離（PC・家事・料理・テレビなど）",
  q3: "Q3：近くの優先度（読書・スマホ・細かい作業）",
  q4: "Q4：見え方のクリアさ（質）の優先度",
  q5: "Q5：ハロー・グレアの気になり方",
  q6: "Q6：メガネの許容度（全体）",
  q7: "Q7：費用（保険適用）の優先度",
  q8: "Q8：毎日の生活で、一番大切な距離（メガネなしで一番見たい距離）",
  q9: "Q9：夜間に車の運転をする頻度",
  q10: "Q10：眼の病気の既往（患者申告）",
  q11: "Q11：これまでの裸眼の見え方に一番近いもの",
};

// 印刷用の選択肢ラベル
export const choiceLabels: Record<QuestionKey, string[]> = {
  q1: questionDataMap.q1.choices,
  q2: questionDataMap.q2.choices,
  q3: questionDataMap.q3.choices,
  q4: questionDataMap.q4.choices,
  q5: questionDataMap.q5.choices,
  q6: questionDataMap.q6.choices,
  q7: questionDataMap.q7.choices,
  q8: questionDataMap.q8.choices,
  q9: questionDataMap.q9.choices,
  q10: questionDataMap.q10.choices,
  q11: questionDataMap.q11.choices,
};

// 印刷用の注釈
export const questionNotes: Record<QuestionKey, string> = {
  q1: questionDataMap.q1.description,
  q2: questionDataMap.q2.description,
  q3: questionDataMap.q3.description,
  q4: questionDataMap.q4.description,
  q5: questionDataMap.q5.description,
  q6: questionDataMap.q6.description,
  q7: questionDataMap.q7.description,
  q8: questionDataMap.q8.description,
  q9: questionDataMap.q9.description,
  q10: questionDataMap.q10.description,
  q11: questionDataMap.q11.description,
};
