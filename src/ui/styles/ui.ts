// src/ui/styles/ui.ts
import type React from "react";

export const pageContainer: React.CSSProperties = {
  minHeight: "100vh",
  backgroundColor: "#f3f4f6",
  boxSizing: "border-box",
  paddingBottom: 80, // フッター分
};

export const pageInner: React.CSSProperties = {
  maxWidth: 840,
  margin: "0 auto",
  padding: 24,
  borderRadius: 16,
  boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  backgroundColor: "#ffffff",
  color: "#111827",
  lineHeight: 1.7,
};

export const questionTitle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: 16,
  fontSize: 22,
  fontWeight: "bold",
  color: "#111827",
  display: "flex",
  alignItems: "center",
  gap: 8,
};

export const subText: React.CSSProperties = {
  marginBottom: 20,
  color: "#444",
  fontSize: 22,//問題と問題文
  lineHeight: 1.8,
  whiteSpace: "pre-line",
};

export const mainButtonStyle = (active = false): React.CSSProperties => ({
  width: "100%",
  padding: "14px 16px",
  marginTop: 8,
  fontSize: 22,//選択肢
  borderRadius: 9999,
  border: active ? "2px solid #00083d" : "1px solid #d4d4d8",
  backgroundColor: active ? "#00083d" : "#f4f4f5",
  color: active ? "white" : "black",
  textAlign: "left",
  cursor: "pointer",
});

export const nextButtonStyle = (enabled = false): React.CSSProperties => ({
  width: "100%",
  padding: "14px 16px",
  marginTop: 32,
  backgroundColor: enabled ? "#00083d" : "#c7d5e8",
  color: "white",
  borderRadius: 9999,
  border: "none",
  fontSize: 18,
  fontWeight: "bold",
  cursor: enabled ? "pointer" : "not-allowed",
});

export const warningText: React.CSSProperties = {
  marginTop: 15,
  color: "red",
  fontWeight: "bold",
  fontSize: 14,
};

export const sectionTitle: React.CSSProperties = {
  fontSize: 18,
  fontWeight: "bold",
  marginTop: 24,
  marginBottom: 8,
  color: "#111827",
};

export const extraDescriptionText: React.CSSProperties = {
  fontSize: 16,
  lineHeight: 1.8,
  color: "#111827",
};

export const headerButtonStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 9999,
  border: "1px solid #d1d5db",
  backgroundColor: "#ffffff",
  fontSize: 10,
  cursor: "pointer",
  color: "#111827",
};
