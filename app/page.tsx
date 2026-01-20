// app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";
import { pageInner } from "@/src/ui/styles/ui";

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
    <section style={pageInner}>
      <p style={{ fontSize: 14, color: "#666", marginBottom: 8 }}>IOL 選択サポート</p>

      <h1 style={{ fontSize: 26, fontWeight: "bold", lineHeight: 1.6, marginBottom: 16 }}>
        こんにちは。
        <br />
        こちらは眼内レンズ（IOL）選択サポートです。
      </h1>

      <p style={{ fontSize: 18, lineHeight: 1.8, marginBottom: 24 }}>
        白内障手術のあと、あなたの生活スタイルに合った見え方になるように、一緒に確認していきます。
      </p>

      <p style={{ fontSize: 16, marginBottom: 20 }}>
        はじめての方は、まず「<strong>説明動画</strong>」をご覧ください（おすすめ）。
      </p>

      <button
        onClick={handleVideoThenStart}
        style={{
          width: "100%",
          padding: "16px 24px",
          fontSize: 16,
          fontWeight: "bold",
          borderRadius: 9999,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#00083d",
          color: "white",
          marginBottom: 12,
        }}
      >
        ① 説明動画を見てからアンケートへ（初めての方はこちら）
      </button>

      <button
        onClick={handleVideoOnly}
        style={{
          width: "100%",
          padding: "16px 24px",
          fontSize: 16,
          fontWeight: "bold",
          borderRadius: 9999,
          border: "2px solid #00083d",
          cursor: "pointer",
          backgroundColor: "white",
          color: "#00083d",
          marginBottom: 12,
        }}
      >
        ② 説明動画だけを見る
      </button>

      <button
        onClick={handleStartDirect}
        style={{
          width: "100%",
          padding: "16px 24px",
          fontSize: 16,
          fontWeight: "bold",
          borderRadius: 9999,
          border: "2px solid #00083d",
          cursor: "pointer",
          backgroundColor: "white",
          color: "#00083d",
          marginBottom: 16,
        }}
      >
        ③ アンケートから始める
      </button>

      <p style={{ fontSize: 14, color: "#666" }}>
        ※説明動画をすでにご覧いただいた方、または医師から説明を受けた方は「③アンケートから」でも進めます。
      </p>
    </section>
  );
}