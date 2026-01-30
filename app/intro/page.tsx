// app/intro/page.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { pageInner } from "@/src/ui/styles/ui";

const VIDEO_URL =
  "https://vkbkpmnpkqhrwvdhmdqk.supabase.co/storage/v1/object/public/iolapp-videos/iol_video_intro_v3_44.mp4";

export default function IntroPage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [ending, setEnding] = useState(false);

  const redirectTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  const handlePlay = async () => {
    const v = videoRef.current;
    if (!v) return;

    try {
      v.muted = false;
      await v.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(true);
    }
  };

  const handleEnded = () => {
    setEnding(true);

    redirectTimerRef.current = window.setTimeout(() => {
      router.push("/q1");
    }, 1600);
  };

  return (
    <section style={pageInner}>
      <h1 style={{ fontSize: 20, marginBottom: 16 }}>
        白内障手術と眼内レンズのお話
      </h1>

      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          controls={isPlaying}
          playsInline
          preload="metadata"
          onPlay={() => {
            setEnding(false);
            setIsPlaying(true);
          }}
          onPause={() => setIsPlaying(false)}
          onEnded={handleEnded}
          style={{
            width: "100%",
            borderRadius: 10,
            display: "block",
            background: "#000",
          }}
        >
          <source src={VIDEO_URL} type="video/mp4" />
          お使いのブラウザでは動画を再生できません。
        </video>

        {ending && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.15)",
              borderRadius: 10,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                padding: "12px 16px",
                borderRadius: 9999,
                background: "rgba(255,255,255,0.95)",
                fontSize: 18,
                fontWeight: 700,
              }}
            >
              アンケートへ進みます…
            </div>
          </div>
        )}

        {!isPlaying && !ending && (
          <button
            type="button"
            onClick={handlePlay}
            aria-label="再生"
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              background: "rgba(0,0,0,0.25)",
              border: "none",
              cursor: "pointer",
              borderRadius: 10,
            }}
          >
            <span
              style={{
                width: 92,
                height: 92,
                borderRadius: 9999,
                background: "rgba(255,255,255,0.92)",
                display: "grid",
                placeItems: "center",
              }}
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                <path d="M8 5v14l11-7L8 5z" fill="#111827" />
              </svg>
            </span>
          </button>
        )}
      </div>

      <p style={{ marginTop: 12 }}>
        再生が終わると、自動的にアンケートへ進みます。
      </p>
    </section>
  );
}