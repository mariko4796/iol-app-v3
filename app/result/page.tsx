// app/result/page.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAnswers } from "@/app/contexts/AnswersContext";
import { questionKeys, type QuestionKey } from "@/src/state/types";
import { questionText, choiceLabels, questionNotes } from "@/src/data/questions/questionData";
import { computeScores } from "@/src/domain/lens/scoring/computeScores";
import { lensLabel, lensTypeText, distanceText, q8DistanceText } from "@/src/domain/lens/lensTypes";
import type { LensKey } from "@/src/domain/lens/lensTypes";
import { generateReasonText } from "@/src/domain/lens/explain/reasonText";
import { generateWarnings } from "@/src/domain/lens/explain/warnings";
import { savePrintLog } from "@/src/lib/storage/printLogs";
import { pageInner, sectionTitle } from "@/src/ui/styles/ui";

export default function ResultPage() {
  return (
    <Suspense fallback={<section style={pageInner}><p>結果を読み込み中...</p></section>}>
      <ResultInner />
    </Suspense>
  );
}

function ResultInner() {
  const { answers } = useAnswers();
  const searchParams = useSearchParams();

  // URLパラメータ
  const distanceParam = searchParams.get("distance");
  const overridePremium = searchParams.get("overridePremium") === "1";
  const premiumParam = searchParams.get("premium");
  const premiumChoice: LensKey | null =
    premiumParam === "EDOF" || premiumParam === "MF" ? (premiumParam as LensKey) : null;

  const result = computeScores(answers);
  const { top1, exceptionMessages, flags } = result;

  // Q7=1,2（保険優先）かどうか
  const costPriorityHigh = answers.q7 === 1 || answers.q7 === 2;

  // ★ Q7=1,2（保険優先）かつ追加質問を経由していない場合、Q8の回答を距離として使用
  const distanceChoice = distanceParam 
    ? parseInt(distanceParam, 10) 
    : (costPriorityHigh && answers.q8) 
      ? answers.q8 
      : null;

  // 単焦点かどうか判定
  const isMono = distanceChoice !== null && distanceChoice >= 1 && distanceChoice <= 6;
  const isEDOF = premiumChoice === "EDOF" || (!isMono && !premiumChoice && top1?.key === "EDOF");
  const isMF = premiumChoice === "MF" || (!isMono && !premiumChoice && top1?.key === "MF");

  // 最終レンズキー
  let finalKey: LensKey | null = null;
  if (isMono) {
    // 距離に応じて farMono/midMono/nearMono を設定
    if (distanceChoice <= 2) finalKey = "farMono";
    else if (distanceChoice <= 4) finalKey = "midMono";
    else finalKey = "nearMono";
  } else if (premiumChoice) {
    finalKey = premiumChoice;
  } else if (top1) {
    finalKey = top1.key;
  }

  const finalLabel = finalKey ? lensLabel[finalKey] : "未決定";
  const finalLensType = finalKey ? lensTypeText[finalKey] : "";

  // 単焦点の場合は選択した具体的距離、それ以外は従来のdistanceText
  const finalDistanceText = isMono && distanceChoice
    ? q8DistanceText[distanceChoice]
    : (finalKey ? distanceText[finalKey] : "");

  let hopeFar = false, hopeMid = false, hopeNear = false;
  if (finalKey === "farMono") hopeFar = true;
  else if (finalKey === "midMono") hopeMid = true;
  else if (finalKey === "nearMono") hopeNear = true;
  else if (finalKey === "EDOF") { hopeFar = true; hopeMid = true; }
  else if (finalKey === "MF") { hopeFar = true; hopeMid = true; hopeNear = true; }

  const reasonText = finalKey ? generateReasonText({ finalKey, answers, flags, distanceChoice, overridePremium }) : "";
  const { visionWarning, glassesWarning, retinaWarning } = finalKey
    ? generateWarnings({ finalKey, answers, flags }) : { visionWarning: "", glassesWarning: "", retinaWarning: "" };

  const extraConfirmations: string[] = [];
  const haloNightRisk = flags.haloAbsoluteNo || flags.nightDrivingOften;

  // Q8との矛盾チェック（追加質問を経由した場合のみ）
  if (distanceParam && isMono && distanceChoice && answers.q8 && distanceChoice !== answers.q8) {
    extraConfirmations.push(`【Q8と矛盾】Q8では「${q8DistanceText[answers.q8]}」を選択しましたが、追加質問では「${q8DistanceText[distanceChoice]}」を選択しました。`);
  }

  if (flags.costPriorityHigh && isMono) {
    extraConfirmations.push(`【費用とレンズ選択】費用（保険適応内）を優先するご希望があり、保険適応内の単焦点レンズから「${q8DistanceText[distanceChoice!]}」を優先するレンズを選択した。`);
  }

  if (flags.hasRetinaDisease) {
    if (overridePremium && (isEDOF || isMF)) {
      extraConfirmations.push("【網膜疾患とプレミアム】網膜・黄斑・緑内障などの病気がある場合、多焦点／EDOF レンズでは見え方の質が低下しやすいことを説明し、そのリスクを理解したうえでプレミアムレンズ（多焦点／EDOF）を希望した。");
    } else if (isMono) {
      extraConfirmations.push("【網膜疾患とプレミアム】網膜・黄斑・緑内障などの病気がある場合、多焦点／EDOF レンズでは見え方の質が低下しやすいことを説明し、安全性を優先して単焦点レンズを選択した。");
    }
  }

  if (haloNightRisk) {
    if (overridePremium && (isEDOF || isMF)) {
      extraConfirmations.push("【夜間運転とハロー・グレア】夜間運転やハロー・グレアのリスクについて説明し、そのリスクを理解したうえでプレミアムレンズ（多焦点／EDOF）を希望した。");
    } else if (isMono) {
      extraConfirmations.push("【夜間運転とハロー・グレア】夜間運転やハロー・グレアのリスクについて説明し、夜間の安全性を優先して単焦点レンズを選択した。");
    }
  }

  if (premiumChoice === "EDOF") {
    extraConfirmations.push("【EDOF vs 多焦点】EDOF レンズと多焦点レンズの違いを説明したうえで、夜間のギラつきを少なくしつつ遠方〜中間をバランスよく見たいという希望から、EDOF レンズを優先する選択をした。");
  } else if (premiumChoice === "MF") {
    extraConfirmations.push("【EDOF vs 多焦点】EDOF レンズと多焦点レンズの違いを説明したうえで、近方までできるだけ裸眼で見たいという希望を優先し、多焦点レンズを優先する選択をした。");
  }

  const handlePrintClick = () => {
    const now = new Date().toISOString();
    const label = finalLensType && finalDistanceText ? `${finalLensType}（${finalDistanceText}）` : finalLabel ?? "レンズ未決定";

    savePrintLog({
      createdAt: now, label,
      data: { finalKey, finalLabel, finalLensType, finalDistanceText, reasonText, visionWarning, glassesWarning, retinaWarning, answers, extraConfirmations, exceptionMessages },
    });
    window.print();
  };

  return (
    <>
      {/* 画面表示 */}
      <div className="screen-only">
        <section style={pageInner}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", textAlign: "center", marginBottom: 16 }}>IOL選択結果と最終確認</h1>

          {finalKey ? (
            <p style={{ marginTop: 6, fontSize: 20, textAlign: "center" }}>最終希望レンズ：<strong>{finalLensType}（{finalDistanceText}）</strong></p>
          ) : (<p>有効なレンズ候補が決定していません。</p>)}

          <div style={{ marginTop: 16 }}>
            <h2 style={sectionTitle}>ご回答内容にもとづく選択理由</h2>
            <p style={{ fontSize: 16, lineHeight: 1.8 }}>{reasonText}</p>
            {exceptionMessages.length > 0 && (
              <div style={{ marginTop: 12 }}>
                {exceptionMessages.map((msg, idx) => (<p key={idx} style={{ color: "#b22222", fontSize: 14, marginBottom: 4 }}>※ {msg}</p>))}
              </div>
            )}
          </div>

          {visionWarning && (<div style={{ marginTop: 20 }}><h2 style={sectionTitle}>視力履歴との注意点</h2><p style={{ fontSize: 16, lineHeight: 1.8 }}>{visionWarning}</p></div>)}
          {glassesWarning && (<div style={{ marginTop: 20 }}><h2 style={sectionTitle}>メガネに関する注意点</h2><p style={{ fontSize: 16, lineHeight: 1.8 }}>{glassesWarning}</p></div>)}
          {retinaWarning && (<div style={{ marginTop: 20 }}><h2 style={sectionTitle}>眼の病気に関する注意点</h2><p style={{ fontSize: 16, lineHeight: 1.8 }}>{retinaWarning}</p></div>)}

          <div style={{ marginTop: 20 }}>
            <h2 style={sectionTitle}>印刷と持参のお願い</h2>
            <p style={{ fontSize: 16 }}>この結果をもとに、白内障手術での希望レンズと術後の見え方について最終確認するための<strong>同意書の用紙</strong>を印刷できます。</p>
            <p style={{ marginTop: 4, fontSize: 16 }}>画面下の「印刷する」ボタンを押して印刷し、<strong>レンズの希望・術後の見え方の希望欄にチェックを入れて</strong>から、診察室にお持ちください。</p>
            <button onClick={handlePrintClick} style={{ marginTop: 16, padding: "10px 24px", fontSize: 16, borderRadius: 9999, border: "none", cursor: "pointer", backgroundColor: "#0070f3", color: "white" }}>
              最終確認用の用紙を印刷する
            </button>
          </div>
        </section>
      </div>

      {/* 印刷専用 */}
      <div className="print-only">
        <h1><strong>IOL選択結果と最終確認</strong></h1>

        <section style={{ marginTop: 16 }}>
          {finalKey ? (<p style={{ fontSize: 24, fontWeight: "bold", marginTop: 6 }}>最終選択レンズ：{finalLensType}（{finalDistanceText}）</p>) : (<p>有効なレンズ候補が決定していません。</p>)}
          <h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 24 }}>ご回答内容にもとづく選択理由</h2>
          <p style={{ marginTop: 6 }}>{reasonText}</p>
          {visionWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>視力履歴との注意点</h2><p style={{ marginTop: 6 }}>{visionWarning}</p></>)}
          {glassesWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>メガネに関する注意点</h2><p style={{ marginTop: 6 }}>{glassesWarning}</p></>)}
          {retinaWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>眼の病気に関する注意点</h2><p style={{ marginTop: 6 }}>{retinaWarning}</p></>)}
        </section>

        <section style={{ marginTop: 40 }}>
          <div style={{ border: "2px solid #000", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
            <p style={{ marginTop: 4, fontSize: 16, fontWeight: "bold" }}>白内障手術での希望レンズと術後の見え方について、最終確認</p>
            <p style={{ marginTop: 12, fontSize: 18 }}>・レンズの希望：　{isMono ? "☑ 単焦点レンズ" : "□ 単焦点レンズ"}　{isEDOF ? "☑ EDOFレンズ" : "□ EDOFレンズ"}　{isMF ? "☑ 多焦点レンズ" : "□ 多焦点レンズ"}</p>
            <p style={{ marginTop: 8, fontSize: 18 }}>・術後の見え方の希望：　{hopeFar ? "☑ 遠方" : "□ 遠方"}　{hopeMid ? "☑ 中間" : "□ 中間"}　{hopeNear ? "☑ 近方" : "□ 近方"}</p>
          </div>
          <div style={{ marginTop: 16, fontSize: 15 }}>
            <p>＊乱視や角膜・眼底の状態などにより、すべての距離で眼鏡が必要となる場合があります。</p>
            <p>＊手術後の見え方には個人差があり、「必ずメガネなしになる」ことを保証するものではありません。</p>
            <p>＊将来の白内障以外の眼疾患（緑内障・黄斑疾患など）の進行により、見え方が変化する可能性があります。</p>
            <p>＊必要に応じて、術後に追加の矯正（眼鏡・コンタクトレンズなど）が必要になることがあります。</p>
          </div>
        </section>

        <section style={{ marginTop: 40 }}>
          <p>署名日時：　　年　　月　　日</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, gap: 40, flexWrap: "wrap" }}>
            <p>主治医：　______________________________</p>
            <p>患者様署名：　______________________________</p>
          </div>
        </section>

        <section style={{ marginTop: 32, pageBreakBefore: "always", breakBefore: "page" }}>
          <h2 style={{ fontSize: 16, fontWeight: "bold" }}>質問ごとの回答（ご自身の選択肢）</h2>
          <ul style={{ listStyle: "none", paddingLeft: 0 }}>
            {questionKeys.map((key) => {
              const value = answers[key];
              const labels = choiceLabels[key];
              const note = questionNotes[key];
              return (
                <li key={key} style={{ marginBottom: 14, lineHeight: 1.6 }}>
                  <div style={{ fontSize: 13, fontWeight: "bold" }}>{questionText[key]}</div>
                  <div style={{ fontSize: 11, color: "#666", marginLeft: 12, whiteSpace: "pre-line" }}>{note}</div>
                  <div style={{ marginLeft: 12, marginTop: 4 }}>
                    {labels.map((label, idx) => {
                      const selected = value === idx + 1;
                      return (
                        <span key={idx} style={{ display: "inline-block", marginRight: 12, marginBottom: 4, padding: "2px 6px", borderRadius: 4, backgroundColor: selected ? "#e0e0e0" : "transparent", border: selected ? "1px solid #999" : "1px solid transparent", fontWeight: selected ? "bold" : "normal", whiteSpace: "nowrap", fontSize: 11 }}>
                          {selected ? "✔" : "□"} {idx + 1}. {label}
                        </span>
                      );
                    })}
                  </div>
                </li>
              );
            })}
          </ul>
        </section>

        {extraConfirmations.length > 0 && (
          <section style={{ marginTop: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: "bold" }}>追加質問でのご回答</h2>
            <div style={{ marginTop: 6 }}>
              {extraConfirmations.map((text, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "flex-start", marginBottom: 4, fontSize: 14 }}>
                  <span style={{ width: 18, textAlign: "center", flexShrink: 0 }}>☑</span>
                  <span style={{ marginLeft: 4 }}>{text}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}