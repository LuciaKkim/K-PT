"use client";

import { useState } from "react";
import { createComplaint } from "@/lib/api/domains/complaints";
import { ApiError } from "@/lib/api/httpClient";
import type { ComplaintCategory } from "@/lib/api/types";
import { ScreenGradient } from "@/components/ui/bloom-field-gradient";
import { ArrowLeftIcon, CheckIcon } from "./icons";

const CATEGORY_LABEL: Record<ComplaintCategory, string> = {
  FACILITY: "공용시설",
  PARKING: "주차",
  NOISE: "층간소음",
  CLEANING: "청소",
  OTHER: "기타",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted?: () => void;
}

export function ComplaintOverlay({ open, onClose, onSubmitted }: Props) {
  const [category, setCategory] = useState<ComplaintCategory>("NOISE");
  const [location, setLocation] = useState("");
  const [content, setContent] = useState("");
  const [locationError, setLocationError] = useState(false);
  const [contentError, setContentError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  if (!open) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const okLocation = location.trim().length > 1;
    const okContent = content.trim().length >= 10;
    setLocationError(!okLocation);
    setContentError(!okContent);
    if (!okLocation || !okContent) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await createComplaint({
        category,
        title: CATEGORY_LABEL[category],
        content: content.trim(),
        location: location.trim(),
      });
      setDone(true);
      onSubmitted?.();
    } catch (error) {
      setSubmitError(
        error instanceof ApiError ? error.message : "민원 접수에 실패했어요. 잠시 후 다시 시도해 주세요."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClose() {
    setDone(false);
    setSubmitError(null);
    setContent("");
    setLocation("");
    setLocationError(false);
    setContentError(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[420px] flex-col bg-bg">
      <ScreenGradient />
      <div className="flex flex-none items-center gap-2.5 border-b border-border px-4 pb-3.5 pt-6">
        <button
          onClick={handleClose}
          aria-label="뒤로"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-fg transition hover:bg-white/60"
        >
          <ArrowLeftIcon />
        </button>
        <p className="font-display text-base font-bold">민원 접수</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {done ? (
          <div className="pt-11 text-center">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <CheckIcon size={30} />
            </span>
            <h3 className="text-xl font-bold">민원이 접수됐어요</h3>
            <p className="mx-auto mt-2 max-w-[27ch] text-sm text-fg-2">
              담당자 확인 후 처리 단계마다 알림으로 안내드립니다. &apos;내 민원&apos;에서 진행 상황을
              확인할 수 있어요.
            </p>
            <button
              onClick={handleClose}
              className="mt-8 h-[54px] w-full rounded-2xl bg-white/70 font-bold text-fg backdrop-blur-sm transition hover:bg-white"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="mb-2 text-xl font-bold">불편 사항을 접수해요</h3>
            <p className="mb-6 text-sm leading-relaxed text-fg-2">
              접수된 민원은 담당자 확인 후 처리 단계마다 알림으로 안내됩니다.
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold text-fg-2">민원 유형</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ComplaintCategory)}
                className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft"
              >
                {Object.entries(CATEGORY_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold text-fg-2">발생 위치</label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="예: 102동 1502호 상부 세대"
                className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                  locationError ? "border-danger ring-2 ring-danger/20" : "border-border"
                }`}
              />
              {locationError && (
                <p className="mt-1.5 text-xs font-semibold text-danger">
                  발생 위치를 입력해 주세요
                </p>
              )}
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold text-fg-2">상세 내용</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="언제, 어떤 상황인지 적어 주세요"
                rows={3}
                className={`w-full resize-none rounded-2xl border bg-surface-2 px-3.5 py-3 text-sm leading-relaxed outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                  contentError ? "border-danger ring-2 ring-danger/20" : "border-border"
                }`}
              />
              {contentError && (
                <p className="mt-1.5 text-xs font-semibold text-danger">
                  상세 내용을 10자 이상 적어 주세요
                </p>
              )}
            </div>

            {submitError && (
              <p className="mb-4 text-xs font-semibold text-danger">{submitError}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex h-[54px] w-full items-center justify-center rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
            >
              {isSubmitting ? "접수 중..." : "민원 접수하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
