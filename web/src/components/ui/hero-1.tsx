"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * 온보딩 Hero 섹션.
 *
 * 원본 참고 디자인(그리드 배경 + 하단 radial accent + eyebrow 배지 + 큰 타이틀 +
 * 서브텍스트 + CTA, 흑백 미니멀 톤)의 레이아웃/타이포/스페이싱/반응형 구조는 그대로 유지하고,
 * black/#000 포인트만 이 앱의 버건디 팔레트(accent-deep 계열, tailwind.config.js)로 교체했습니다.
 * 그리드 배경은 옅은 저채도(rgba(115,60,72,0.08) 수준)로만 깔아 색이 튀지 않게 했습니다.
 */
export interface Hero1Props {
  className?: string;
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function Hero1({
  className,
  eyebrow = "아파트 생활, 더 쉽게",
  title = (
    <>
      우리 아파트 규정,
      <br />
      물어보면 답이 와요
    </>
  ),
  description = (
    <>
      공지 확인부터 민원 접수까지, 아파톡 하나면 충분해요.
      <br />
      관리규정을 학습한 AI가 3초 만에 답해드려요.
    </>
  ),
  ctaText = "시작하기",
  onCtaClick,
}: Hero1Props) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-full flex-col items-center overflow-hidden bg-bg",
        className
      )}
    >
      {/* 그리드 배경 (아주 옅은 저채도 버건디) */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(115,60,72,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(115,60,72,0.08) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, black 0%, black 55%, transparent 100%)",
        }}
      />

      {/* 하단 radial accent */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 -z-10 h-1/2 translate-y-1/3"
        style={{
          background:
            "radial-gradient(50% 100% at 50% 100%, rgba(115,60,72,0.16) 0%, rgba(115,60,72,0) 70%)",
        }}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:py-28">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface-2 px-5 py-2 text-[15px] font-bold tracking-wide text-accent-deep sm:text-base">
          <span className="h-2 w-2 flex-none rounded-full bg-accent-deep" />
          {eyebrow}
        </div>

        <h1 className="font-display text-[32px] font-bold leading-[1.2] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          {title}
        </h1>

        <p className="mt-5 max-w-none text-sm leading-relaxed text-fg-2 sm:text-base">
          {description}
        </p>

        <div className="mt-10 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
          <Button
            size="lg"
            onClick={onCtaClick}
            className="group w-full sm:w-auto"
          >
            {ctaText}
            <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

/**
 * 사용 예시 데모. 실제 화면(`LoginGate`)에서는 `onCtaClick`을 온보딩 → 로그인 전환에 연결해
 * 이 컴포넌트를 그대로 재사용합니다.
 */
export function Hero1Demo() {
  return <Hero1 onCtaClick={() => console.log("cta click")} />;
}
