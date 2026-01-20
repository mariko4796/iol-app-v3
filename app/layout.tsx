// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AnswersProvider } from "./contexts/AnswersContext";
import AppHeader from "./components/AppHeader";
import AppFooter from "./components/AppFooter";

export const metadata: Metadata = {
  title: "眼内レンズ選択サポート | eye-meetings",
  description: "白内障手術でのレンズ選択をサポートするアプリケーション",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AnswersProvider>
          <AppHeader />
          <main className="main-content">{children}</main>
          <AppFooter />
        </AnswersProvider>
      </body>
    </html>
  );
}
