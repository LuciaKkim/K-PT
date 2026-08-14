import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "아파톡 — 아파트 생활 도우미",
  description: "관리규정을 학습한 AI가 답하고, 민원·투표까지 이어지는 아파트 생활 도우미",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="font-body bg-surface text-fg antialiased">{children}</body>
    </html>
  );
}
