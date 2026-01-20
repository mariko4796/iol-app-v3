// app/contexts/AnswersContext.tsx
"use client";

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import {
  type QuestionKey,
  type Answers,
  initialAnswers,
} from "@/src/state/types";

type AnswersContextType = {
  answers: Answers;
  setAnswer: (key: QuestionKey, value: number) => void;
  reset: () => void;
};

const AnswersContext = createContext<AnswersContextType | undefined>(undefined);

export function AnswersProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<Answers>(initialAnswers);

  const setAnswer = (key: QuestionKey, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const reset = () => setAnswers(initialAnswers);

  return (
    <AnswersContext.Provider value={{ answers, setAnswer, reset }}>
      {children}
    </AnswersContext.Provider>
  );
}

export function useAnswers() {
  const ctx = useContext(AnswersContext);
  if (!ctx) {
    throw new Error("useAnswers must be used within AnswersProvider");
  }
  return ctx;
}

export type { QuestionKey, Answers };
