// app/components/QuestionPage.tsx
"use client";

import { useEffect, useRef } from "react";  // ★ 追加
import { useRouter } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";
import { questionDataMap } from "@/src/data/questions/questionData";
import { nextQuestionRoute, type QuestionKey } from "@/src/state/types";
import { computeScores } from "@/src/domain/lens/scoring/computeScores";
import { decideInitialNext } from "@/src/domain/lens/scoring/decideNext";
import {
  pageInner,
  questionTitle,
  subText,
  mainButtonStyle,
  warningText,
} from "@/src/ui/styles/ui";

type Props = {
  questionKey: QuestionKey;
};

const iconMap: Record<string, string> = {
  pink: "/iol_pink.png",
  green: "/iol_green.png",
  blue: "/iol_blue.png",
  yellow: "/iol_y.png",
};

// ★ 質問ごとの音声URLマップ（まずは q1 だけ）
const QUESTION_AUDIO_URLS: Partial<Record<QuestionKey, string>> = {
  q1: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q1.mp3",
  q2: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q2.mp3",
  q3: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q3.mp3",
  q4: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q4.mp3",
  q5: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q5.mp3",
  q6: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q6.mp3",
  q7: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q7.mp3",
  q8: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q8.mp3",
  q9: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q9.mp3",
  q10: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q10n.mp3",
  q11: "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/q11.mp3",
};

export default function QuestionPage({ questionKey }: Props) {
  const router = useRouter();
  const { answers, setAnswer } = useAnswers();

  const data = questionDataMap[questionKey];
  const currentValue = answers[questionKey];

  // ★ 音声オブジェクトを保持
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ★ 質問が切り替わるたびに該当の音声を自動再生（q1 だけ URL がある状態）
  useEffect(() => {
    const url = QUESTION_AUDIO_URLS[questionKey];
    if (!url) {
      // この質問に音声が設定されていない場合は何もしない
      return;
    }

    const audio = new Audio(url);
    audioRef.current = audio;

    // 0.5秒待ってから再生（画面が出てからしゃべらせる）
    const timer = setTimeout(() => {
      audio
        .play()
        .catch(() => {
          // 自動再生がブロックされた場合は静かに諦める
        });
    }, 500);

    // 質問が変わる／ページを離れる時に停止
    return () => {
      clearTimeout(timer);
      audio.pause();
      audioRef.current = null;
    };
  }, [questionKey]);

  // 選択肢をクリックしたら自動で次へ（少し遅延）
  const handleSelect = (choiceValue: number) => {
    setAnswer(questionKey, choiceValue);

    setTimeout(() => {
      const nextRoute = nextQuestionRoute[questionKey];

      if (nextRoute) {
        router.push(nextRoute);
      } else {
        const updatedAnswers = { ...answers, [questionKey]: choiceValue };
        const result = computeScores(updatedAnswers);
        const next = decideInitialNext(result.flags);

        if (next.type === "extra") {
          router.push(`/extra?mode=${next.mode}`);
        } else {
          router.push("/result");
        }
      }
    }, 800);
  };

  const showWarning =
    data.warning && currentValue !== null && data.warning.condition(currentValue);

  return (
    <section style={pageInner}>
      <h2 style={questionTitle}>
        <img
          src={iconMap[data.icon]}
          alt=""
          style={{ width: 35, height: 21, display: "inline-block" }}
        />
        {data.title}
      </h2>

      <p style={subText}>{data.description}</p>

      <div>
        {data.choices.map((label, idx) => {
          const choiceValue = idx + 1;
          const isActive = currentValue === choiceValue;

          return (
            <button
              key={idx}
              style={mainButtonStyle(isActive)}
              onClick={() => handleSelect(choiceValue)}
            >
              {choiceValue}. {label}
            </button>
          );
        })}
      </div>

      {showWarning && <p style={warningText}>{data.warning!.message}</p>}
    </section>
  );
}
