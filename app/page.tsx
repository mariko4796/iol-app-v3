// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";

const VIDEO_URL =
  "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-videos/iolapp_intro_v2_720p.mp4";

export default function HomePage() {
  const router = useRouter();
  const { reset } = useAnswers();

  const handleVideoThenStart = () => {
    reset();
    router.push("/intro");
  };

  const handleVideoOnly = () => {
    window.open(VIDEO_URL, "_blank");
  };

  const handleStartDirect = () => {
    reset();
    router.push("/q1");
  };

  return (
    <div className="card">
      <p className="card-label">IOL 選択サポート</p>
      
      <div className="card-text">
        こんにちは。<br />
        こちらは眼内レンズ（IOL）選択サポートです。<br />
        白内障手術のあと、あなたの生活スタイルに合った見え方になるように、一緒に確認していきます。<br /><br />
        はじめての方は、まず「説明動画」をご覧ください（おすすめ）。
      </div>

      <div className="btn-group">
        <button className="btn" onClick={handleVideoThenStart}>
          ① 説明動画を見てからアンケートへ（初めての方はこちら）
        </button>
        <button className="btn" onClick={handleVideoOnly}>
          ② 説明動画だけを見る
        </button>
        <button className="btn" onClick={handleStartDirect}>
          ③ アンケートから始める
        </button>
      </div>

      <p className="note">
        ※説明動画をすでにご覧いただいた方、または医師から説明を受けた方は「③アンケートから」でも進めます。
      </p>
    </div>
  );
}