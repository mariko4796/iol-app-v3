// app/components/AppHeader.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { reset } = useAnswers();

  const getPrevRoute = (): string | null => {
    if (pathname === "/") return null;
    if (pathname === "/intro") return "/";
    if (pathname === "/q1") return "/";

    const match = pathname.match(/^\/q(\d+)$/);
    if (match) {
      const qNum = parseInt(match[1], 10);
      return `/q${qNum - 1}`;
    }

    if (pathname === "/extra") return "/q11";
    if (pathname === "/result") return "/extra";
    if (pathname === "/staff-logs") return "/";

    return null;
  };

  const handleBack = () => {
    const prev = getPrevRoute();
    if (prev) router.push(prev);
  };

  const handleReset = () => {
    if (window.confirm("最初からやり直しますか？回答内容はリセットされます。")) {
      reset();
      router.push("/");
    }
  };

  const handleStaffLogs = () => {
    router.push("/staff-logs");
  };

  const prevRoute = getPrevRoute();
  const isHome = pathname === "/";
  const isStaffLogs = pathname === "/staff-logs";

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-left">
          <img src="/iol_icon.png" alt="IOL App" className="app-header-logo" />
          <span className="app-header-title">眼内レンズ選択サポート</span>
        </div>

        <div className="app-header-buttons">
          {prevRoute && (
            <button className="header-btn" onClick={handleBack}>
              ← 戻る
            </button>
          )}
          {!isHome && !isStaffLogs && (
            <button className="header-btn" onClick={handleReset}>
              最初に戻る
            </button>
          )}
          <button className="header-btn-staff" onClick={handleStaffLogs}>
            スタッフ用
          </button>
        </div>
      </div>
    </header>
  );
}