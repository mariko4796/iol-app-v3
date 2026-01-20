// app/staff-logs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { loadPrintLogs, clearPrintLogs, type PrintLogEntry } from "@/src/lib/storage/printLogs";
import { questionText, choiceLabels, questionNotes } from "@/src/data/questions/questionData";
import { questionKeys } from "@/src/state/types";
import { pageInner, sectionTitle, headerButtonStyle } from "@/src/ui/styles/ui";

export default function StaffLogsPage() {
  const [logs, setLogs] = useState<PrintLogEntry[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  useEffect(() => {
    setLogs(loadPrintLogs());
  }, []);

  const handleClear = () => {
    if (window.confirm("すべてのログを削除しますか？")) {
      clearPrintLogs();
      setLogs([]);
      setSelectedIndex(null);
    }
  };

  const selected = selectedIndex !== null ? logs[selectedIndex] : null;

  return (
    <>
      <div className="screen-only">
        <section style={pageInner}>
          <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 16 }}>印刷ログ（スタッフ用）</h1>

          {logs.length === 0 ? (
            <p>保存されたログはありません。</p>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <button style={headerButtonStyle} onClick={handleClear}>すべてのログを削除</button>
              </div>

              <ul style={{ listStyle: "none", padding: 0 }}>
                {logs.map((log, idx) => {
                  const date = new Date(log.createdAt);
                  const dateStr = date.toLocaleString("ja-JP");
                  const isSelected = selectedIndex === idx;
                  return (
                    <li key={idx} onClick={() => setSelectedIndex(idx)} style={{ padding: "12px 16px", marginBottom: 8, borderRadius: 8, backgroundColor: isSelected ? "#e0e7ff" : "#f4f4f5", border: isSelected ? "2px solid #00083d" : "1px solid #d4d4d8", cursor: "pointer" }}>
                      <strong>{log.label}</strong><br />
                      <span style={{ fontSize: 14, color: "#666" }}>{dateStr}</span>
                    </li>
                  );
                })}
              </ul>

              {selected && (
                <div style={{ marginTop: 24 }}>
                  <h2 style={sectionTitle}>詳細プレビュー</h2>
                  <p><strong>最終選択レンズ：</strong>{selected.data.finalLensType}（{selected.data.finalDistanceText}）</p>
                  <p style={{ marginTop: 8 }}><strong>選択理由：</strong>{selected.data.reasonText}</p>
                  {selected.data.visionWarning && <p style={{ marginTop: 8 }}><strong>視力履歴との注意点：</strong>{selected.data.visionWarning}</p>}
                  {selected.data.glassesWarning && <p style={{ marginTop: 8 }}><strong>メガネに関する注意点：</strong>{selected.data.glassesWarning}</p>}
                  {selected.data.retinaWarning && <p style={{ marginTop: 8 }}><strong>眼の病気に関する注意点：</strong>{selected.data.retinaWarning}</p>}

                  <button onClick={() => window.print()} style={{ marginTop: 16, padding: "10px 24px", fontSize: 16, borderRadius: 9999, border: "none", cursor: "pointer", backgroundColor: "#0070f3", color: "white" }}>
                    このログを印刷する
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {selected && (
        <div className="print-only">
          <h1><strong>IOL選択結果と最終確認（ログから再印刷）</strong></h1>

          <section style={{ marginTop: 16 }}>
            <p style={{ fontSize: 24, fontWeight: "bold", marginTop: 6 }}>最終選択レンズ：{selected.data.finalLensType}（{selected.data.finalDistanceText}）</p>
            <h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 24 }}>ご回答内容にもとづく選択理由</h2>
            <p style={{ marginTop: 6 }}>{selected.data.reasonText}</p>
            {selected.data.visionWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>視力履歴との注意点</h2><p style={{ marginTop: 6 }}>{selected.data.visionWarning}</p></>)}
            {selected.data.glassesWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>メガネに関する注意点</h2><p style={{ marginTop: 6 }}>{selected.data.glassesWarning}</p></>)}
            {selected.data.retinaWarning && (<><h2 style={{ fontSize: 16, fontWeight: "bold", marginTop: 16 }}>眼の病気に関する注意点</h2><p style={{ marginTop: 6 }}>{selected.data.retinaWarning}</p></>)}
          </section>

          <section style={{ marginTop: 40 }}>
            <div style={{ border: "2px solid #000", borderRadius: 6, padding: "8px 12px", marginBottom: 12 }}>
              <p style={{ marginTop: 4, fontSize: 16, fontWeight: "bold" }}>白内障手術での希望レンズと術後の見え方について、最終確認</p>
              <p style={{ marginTop: 12, fontSize: 18 }}>・レンズの希望：　{selected.data.finalKey?.includes("Mono") ? "☑ 単焦点レンズ" : "□ 単焦点レンズ"}　{selected.data.finalKey === "EDOF" ? "☑ EDOFレンズ" : "□ EDOFレンズ"}　{selected.data.finalKey === "MF" ? "☑ 多焦点レンズ" : "□ 多焦点レンズ"}</p>
              <p style={{ marginTop: 8, fontSize: 18 }}>・術後の見え方の希望：　{selected.data.finalKey === "farMono" || selected.data.finalKey === "EDOF" || selected.data.finalKey === "MF" ? "☑ 遠方" : "□ 遠方"}　{selected.data.finalKey === "midMono" || selected.data.finalKey === "EDOF" || selected.data.finalKey === "MF" ? "☑ 中間" : "□ 中間"}　{selected.data.finalKey === "nearMono" || selected.data.finalKey === "MF" ? "☑ 近方" : "□ 近方"}</p>
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
                const value = selected.data.answers[key];
                const labels = choiceLabels[key];
                const note = questionNotes[key];
                return (
                  <li key={key} style={{ marginBottom: 14, lineHeight: 1.6 }}>
                    <div style={{ fontSize: 13, fontWeight: "bold" }}>{questionText[key]}</div>
                    <div style={{ fontSize: 11, color: "#666", marginLeft: 12, whiteSpace: "pre-line" }}>{note}</div>
                    <div style={{ marginLeft: 12, marginTop: 4 }}>
                      {labels.map((label, idx) => {
                        const sel = value === idx + 1;
                        return (
                          <span key={idx} style={{ display: "inline-block", marginRight: 12, marginBottom: 4, padding: "2px 6px", borderRadius: 4, backgroundColor: sel ? "#e0e0e0" : "transparent", border: sel ? "1px solid #999" : "1px solid transparent", fontWeight: sel ? "bold" : "normal", whiteSpace: "nowrap", fontSize: 11 }}>
                            {sel ? "✔" : "□"} {idx + 1}. {label}
                          </span>
                        );
                      })}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {selected.data.extraConfirmations && selected.data.extraConfirmations.length > 0 && (
            <section style={{ marginTop: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: "bold" }}>追加質問でのご回答</h2>
              <div style={{ marginTop: 6 }}>
                {selected.data.extraConfirmations.map((text, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "flex-start", marginBottom: 4, fontSize: 14 }}>
                    <span style={{ width: 18, textAlign: "center", flexShrink: 0 }}>☑</span>
                    <span style={{ marginLeft: 4 }}>{text}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </>
  );
}
