// app/components/AppHeader.tsx
"use client";

import { useRouter, usePathname } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { reset } = useAnswers();

  const handleBack = () => {
    router.back();
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

  const isHome = pathname === "/";
  const isStaffLogs = pathname === "/staff-logs";

  return (
    <header className="app-header">
      <div className="app-header-inner">
        <div className="app-header-left">
          <img
            src="/icon-192.png"
            alt="IOL App"
            className="app-header-logo"
          />
          <span className="app-header-title">眼内レンズ選択サポート</span>
        </div>

        <div className="app-header-buttons">
          {!isHome && (
            <button className="header-btn" onClick={handleBack}>
              戻る
            </button>
          )}
          {!isHome && !isStaffLogs && (
            <button className="header-btn" onClick={handleReset}>
              最初からやり直す
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