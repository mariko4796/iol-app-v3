// app/extra/page.tsx
"use client";

import { useState, useEffect, Suspense, useCallback, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";
import { computeScores } from "@/src/domain/lens/scoring/computeScores";
import { decideNext, type ExtraMode } from "@/src/domain/lens/scoring/decideNext";
import { pageInner, questionTitle, mainButtonStyle, extraDescriptionText } from "@/src/ui/styles/ui";

// 追加質問用の距離テキスト（q8DistanceTextとは別に定義）
const extraDistanceText: Record<number, string> = {
  1: "遠方（約5m以上）：道路標識・信号・屋外で人の顔",
  2: "中間（約2m）：テレビ・リビング内",
  3: "中間（約1m）：腕を伸ばしたくらい・作業台全体",
  4: "中間〜近方（約70cm）：料理・PC画面・調理台の手元",
  5: "近方（約40cm）：読書・スマホの文字",
  6: "近方（約33cm）：細かい作業・小さい文字",
};

// ★ 追加質問ページ用の音声URL
const EXTRA_AUDIO_URLS: Record<ExtraMode, string> = {
  singleFocusChoice:
    "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/singleFocusChoice.mp3",
  retina:
    "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/retina.mp3",
  haloNight:
    "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/haloNight.mp3",
  premiumCompare:
    "https://parmafajzkhcfnpsecsy.supabase.co/storage/v1/object/public/iolapp-audio/premiumCompare.mp3",
};


export default function ExtraPage() {
  return (
    <Suspense fallback={<section style={pageInner}><p>読み込み中...</p></section>}>
      <ExtraPageWrapper />
    </Suspense>
  );
}

function ExtraPageWrapper() {
  const searchParams = useSearchParams();
  return <ExtraPageInner key={searchParams.toString()} />;
}

function ExtraPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { answers } = useAnswers();

  const modeParam = searchParams.get("mode") as ExtraMode | null;
  const afterRetina = searchParams.get("afterRetina") === "1";
  const overridePremiumFlag = searchParams.get("overridePremium") === "1";

  const result = computeScores(answers);
  const { flags } = result;
  const mode: ExtraMode = modeParam || "singleFocusChoice";

  // singleFocusChoice: 1〜6は距離、7は自費希望
  const [distanceChoice, setDistanceChoice] = useState<number | null>(null);
  const [premiumOverride, setPremiumOverride] = useState(false);
  const [premiumChoice, setPremiumChoice] = useState<"EDOF" | "MF" | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);

    // ★ 追加質問ページ用の音声オブジェクト
  const extraAudioRef = useRef<HTMLAudioElement | null>(null);

// ★ 追加: mode が変わったら選択状態をリセット
useEffect(() => {
  setDistanceChoice(null);
  setPremiumOverride(false);
  setPremiumChoice(null);
}, [searchParams.toString()]);

  useEffect(() => {
    if (!modeParam) router.replace("/result");
  }, [modeParam, router]);

  // スクロールが必要かチェック & スクロールしたら非表示
useEffect(() => {
  const checkScroll = () => {
    const scrollable = document.documentElement.scrollHeight > window.innerHeight;
    const hasScrolled = window.scrollY > 30;
    
    if (scrollable && !hasScrolled) {
      setShowScrollHint(true);
    } else {
      setShowScrollHint(false);
    }
  };

  // ★ mode ごとに追加質問の音声を自動再生
  useEffect(() => {
    const url = EXTRA_AUDIO_URLS[mode];
    if (!url) return;

    const audio = new Audio(url);
    extraAudioRef.current = audio;

    const timer = setTimeout(() => {
      audio
        .play()
        .catch(() => {
          // 自動再生がブロックされた場合は何もしない
        });
    }, 500); // 0.5秒待ってから再生

    // mode が変わる／ページを離れるときに停止
    return () => {
      clearTimeout(timer);
      audio.pause();
      extraAudioRef.current = null;
    };
  }, [mode]);


  const timer = setTimeout(checkScroll, 100);
  window.addEventListener("scroll", checkScroll);
  window.addEventListener("resize", checkScroll);

  return () => {
    clearTimeout(timer);
    window.removeEventListener("scroll", checkScroll);
    window.removeEventListener("resize", checkScroll);
  };
}, [mode]);

  // 遷移処理
  const navigateNext = useCallback((choice: {
    distance?: number | null;
    premium?: "EDOF" | "MF" | null;
    override?: boolean;
  }) => {
    setTimeout(() => {
       // ★ 遷移前に state をリセット
    setDistanceChoice(null);
    setPremiumOverride(false);
    setPremiumChoice(null);

      if (mode === "singleFocusChoice") {
  if (choice.distance) {
    router.push(`/result?distance=${choice.distance}`);
  }
  return;
}

      if (mode === "premiumCompare" && choice.premium) {
        const params = new URLSearchParams();
        params.set("premium", choice.premium);
        if (overridePremiumFlag) params.set("overridePremium", "1");
        router.push(`/result?${params.toString()}`);
        return;
      }

if (mode === "retina") {
  if (choice.override) {
    const hasHaloNightRisk = flags.haloAbsoluteNo || flags.nightDrivingOften;
    if (hasHaloNightRisk) {
  router.push("/extra?mode=haloNight&afterRetina=1");
} else {
      router.push("/extra?mode=premiumCompare&afterRetina=1&overridePremium=1");
    }
  } else if (choice.distance) {
    router.push(`/result?distance=${choice.distance}`);
  }
  return;
}

if (mode === "haloNight") {
  if (choice.override) {
    const params = new URLSearchParams();
    params.set("mode", "premiumCompare");
    if (afterRetina) params.set("afterRetina", "1");
    params.set("overridePremium", "1");
    router.push(`/extra?${params.toString()}`);
  } else if (choice.distance) {
    router.push(`/result?distance=${choice.distance}`);
  }
}
    }, 800);
  }, [mode, flags, afterRetina, overridePremiumFlag, router]);

  // 選択ハンドラー
  const handleDistanceSelect = (dist: number) => {
    setDistanceChoice(dist);
    setPremiumOverride(false);
    navigateNext({ distance: dist });
  };

  const handlePremiumOverride = () => {
    setPremiumOverride(true);
    setDistanceChoice(null);
    navigateNext({ override: true });
  };

  const handlePremiumChoice = (choice: "EDOF" | "MF") => {
    setPremiumChoice(choice);
    navigateNext({ premium: choice });
  };

  // 距離選択肢（6つ）
  const distanceOptions = [1, 2, 3, 4, 5, 6] as const;

  return (
  <>

    {/* スクロール注意表示 */}
{showScrollHint && (
  <div
    style={{
      position: "fixed",
      bottom: 100,
      left: "50%",
      transform: "translateX(-50%)",
      width: "90%",
      maxWidth: 500,
      background: "radial-gradient(ellipse at center, rgba(15, 30, 78, 0.95) 0%, rgba(15, 30, 78, 0.7) 60%, rgba(15, 30, 78, 0) 100%)",
      color: "white",
      padding: "24px 50px",
      borderRadius: 40,
      fontSize: 28,
      fontWeight: 600,
      zIndex: 1000,
      textAlign: "center" as const,
    }}
    onClick={() => setShowScrollHint(false)}
  >
    ↓ 下にスクロールして
    選択肢をご確認ください
  </div>
)}

    <section style={pageInner}>
      {mode === "singleFocusChoice" && (
        <>
          <h2 style={questionTitle}>【保険適応内レンズをご希望の方へ（重要）】</h2>
          <p style={extraDescriptionText}>問診票で<strong>「保険適用内のレンズを優先したい」</strong>と回答されたため、<strong>自費の多焦点レンズや EDOF レンズは今回の候補から外れます。</strong></p>
          <p style={{ ...extraDescriptionText, marginTop: 8 }}>単焦点レンズは、<strong>遠方・中間・近方のどれか１つにピントを合わせるレンズ</strong>です。</p>
          <p style={{ ...extraDescriptionText, marginTop: 8 }}>今回のご回答では、遠方・中間・近方のすべてについて<strong>「裸眼で見たい」</strong>というご希望が強く出ています。しかし単焦点レンズでは、このすべてを同時に満たすことはできません。</p>
          <p style={{ ...extraDescriptionText, marginTop: 8 }}>そのため、<strong>最も大切な距離をもう一度お選びください。</strong></p>
          <div style={{ marginTop: 16 }}>
            {distanceOptions.map((dist) => (
              <button
                key={dist}
                style={mainButtonStyle(distanceChoice === dist)}
                onClick={() => handleDistanceSelect(dist)}
              >
                {extraDistanceText[dist]}
              </button>
            ))}
          </div>
        </>
      )}

      {mode === "retina" && (
        <>
          <h2 style={questionTitle}>【網膜・緑内障などの眼疾患がある方へのご説明（重要）】</h2>
          <p>あなたのご回答（Q10）から、<strong>網膜・黄斑・緑内障などの眼の病気を指摘されたご経験</strong>があることが分かりました。</p>
          <p style={{ marginTop: 8 }}>こうした病気がある場合、<strong>多焦点レンズや EDOF レンズはコントラスト感度の低下や見え方の質の低下が強く出る可能性</strong>があるため、<strong>一般的には単焦点レンズを第一選択とします。</strong></p>
          <p style={{ marginTop: 8 }}>また、<strong>白内障手術では水晶体の濁りは改善しますが、網膜や視神経そのものの病気が良くなるわけではありません。</strong></p>
          <p style={{ marginTop: 8 }}>そのうえで、<strong>「どの距離を優先した単焦点レンズにするか」または「リスクを理解したうえで多焦点/EDOFを希望するか」</strong>をここで確認させてください。</p>
          <div style={{ marginTop: 16 }}>
            {distanceOptions.map((dist) => (
              <button
                key={dist}
                style={mainButtonStyle(distanceChoice === dist && !premiumOverride)}
                onClick={() => handleDistanceSelect(dist)}
              >
                {extraDistanceText[dist]}
              </button>
            ))}
            <button style={mainButtonStyle(premiumOverride)} onClick={handlePremiumOverride}>
              網膜や視神経の病気によるリスクを理解したうえで、多焦点レンズまたは EDOF レンズを希望する
            </button>
          </div>
        </>
      )}

      {mode === "haloNight" && (
        <>
          <h2 style={questionTitle}>【夜間運転とハロー・グレアに関するご説明（重要）】</h2>
          <p>あなたのご回答から、<strong>夜間に車の運転をよくされる（Q9：よくある）</strong>もしくは<strong>ハロー・グレアは「絶対にイヤ」（Q5：1）</strong>という強いご希望があることが分かりました。</p>
          <p style={{ marginTop: 8 }}>多焦点レンズや EDOF レンズでは、<strong>夜間のライトがにじんだり、ギラつき（ハロー・グレア）が出やすくなる</strong>ことがあります。特に夜間運転が多い方では、<strong>運転時の安全性に影響する可能性</strong>があるため、一般的には<strong>単焦点レンズを第一選択とします。</strong></p>
          <p style={{ marginTop: 8 }}>そのうえで、<strong>「どの距離を優先した単焦点レンズにするか」または「夜間の見え方のリスクを理解したうえで多焦点/EDOFを希望するか」</strong>をここで確認させてください。</p>
          <div style={{ marginTop: 16 }}>
            {distanceOptions.map((dist) => (
              <button
                key={dist}
                style={mainButtonStyle(distanceChoice === dist && !premiumOverride)}
                onClick={() => handleDistanceSelect(dist)}
              >
                {extraDistanceText[dist]}
              </button>
            ))}
            <button style={mainButtonStyle(premiumOverride)} onClick={handlePremiumOverride}>
              夜間の見え方（ハロー・グレアなど）のリスクを理解したうえで、多焦点レンズまたは EDOF レンズを希望する
            </button>
          </div>
        </>
      )}

      {mode === "premiumCompare" && (
        <>
          <h2 style={questionTitle}>【EDOF レンズと多焦点レンズのどちらを優先しますか？】</h2>
          <p>あなたのご回答から、<strong>EDOF レンズと多焦点レンズの両方が候補となり、スコアの差がほとんどない</strong>状態であると判定されました。</p>
          <p style={{ marginTop: 8 }}>どちらも「メガネを減らしたい」というご希望に沿うレンズですが、<strong>特に得意なポイントが少し違います。</strong></p>
          <ul style={{ marginTop: 8, paddingLeft: 20, fontSize: 14 }}>
            <li><strong>EDOF レンズ：</strong>遠方〜中間の見え方をバランスよく保ちつつ、夜間のギラつき（ハロー・グレア）は多焦点レンズより少なめになることが多いレンズです。近く（スマホ・読書）ではメガネが必要になる場合があります。</li>
            <li style={{ marginTop: 6 }}><strong>多焦点レンズ：</strong>遠方、中間、近方、<strong>できるだけ多くの距離を裸眼で見たい</strong>というご希望に合いやすい一方、夜間のギラつきやコントラスト低下が EDOF より強く出ることがあります。</li>
          </ul>
          <p style={{ marginTop: 8 }}>どの点をより優先したいかに応じて、<strong>どちらのレンズを優先するかをここでお選びください。</strong></p>
          <div style={{ marginTop: 16 }}>
            <button style={mainButtonStyle(premiumChoice === "EDOF")} onClick={() => handlePremiumChoice("EDOF")}>
              EDOF レンズを優先したい（夜間のギラつきはできるだけ少なく、遠方〜中間をバランスよく見たい）
            </button>
            <button style={mainButtonStyle(premiumChoice === "MF")} onClick={() => handlePremiumChoice("MF")}>
              多焦点レンズを優先したい（スマホ・読書など近方もできるだけ裸眼でしたい）
            </button>
          </div>
        </>
      )}
    </section>
    </>
  );
}