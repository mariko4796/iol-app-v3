// app/components/QuestionPage.tsx
"use client";

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

export default function QuestionPage({ questionKey }: Props) {
  const router = useRouter();
  const { answers, setAnswer } = useAnswers();

  const data = questionDataMap[questionKey];
  const currentValue = answers[questionKey];

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