"use client";

import { useEffect, useState } from "react";
import { getComplaintDetail } from "@/lib/api/domains/complaints";
import { ApiError } from "@/lib/api/httpClient";
import type { ComplaintInfoRes, ComplaintStatus } from "@/lib/api/types";
import { ScreenGradient } from "@/components/ui/bloom-field-gradient";
import { ArrowLeftIcon, CheckIcon } from "./icons";

const STATUS_LABEL: Record<ComplaintStatus, string> = {
  RECEIVED: "접수",
  CHECKING: "확인",
  PROCESSING: "처리중",
  COMPLETED: "완료",
};

const STATUS_ORDER: ComplaintStatus[] = ["RECEIVED", "CHECKING", "PROCESSING", "COMPLETED"];

interface Props {
  complaintId: number | null;
  onClose: () => void;
}

export function ComplaintDetailOverlay({ complaintId, onClose }: Props) {
  const [complaint, setComplaint] = useState<ComplaintInfoRes | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (complaintId === null) {
      setComplaint(null);
      return;
    }
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getComplaintDetail(complaintId)
      .then((data) => {
        if (cancelled) return;
        setComplaint(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof ApiError ? err.message : "민원 정보를 불러오지 못했어요.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [complaintId]);

  if (complaintId === null) return null;

  const currentStepIndex = complaint ? STATUS_ORDER.indexOf(complaint.status) : -1;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[420px] flex-col bg-bg">
      <ScreenGradient />
      <div className="flex flex-none items-center gap-2.5 border-b border-border px-4 pb-3.5 pt-6">
        <button
          onClick={onClose}
          aria-label="뒤로"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-fg transition hover:bg-white/60"
        >
          <ArrowLeftIcon />
        </button>
        <p className="font-display text-base font-bold">민원 상세</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {isLoading ? (
          <div className="space-y-3.5 pt-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-3.5 w-full animate-pulse rounded-full bg-white/60" />
            ))}
          </div>
        ) : error ? (
          <p className="py-14 text-center text-sm text-muted">{error}</p>
        ) : complaint ? (
          <>
            <h3 className="mb-1.5 text-xl font-bold">{complaint.title}</h3>
            <p className="mb-6 text-sm text-fg-2">
              C-{complaint.complaintId} · {complaint.writer}
            </p>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold text-fg-2">발생 위치</label>
              <input
                value={complaint.location}
                readOnly
                className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm text-fg-2 outline-none"
              />
            </div>

            <div className="mb-4">
              <label className="mb-1.5 block text-xs font-bold text-fg-2">상세 내용</label>
              <input
                value={complaint.content}
                readOnly
                className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm text-fg-2 outline-none"
              />
            </div>

            {complaint.resolution && (
              <div className="mb-4">
                <label className="mb-1.5 block text-xs font-bold text-fg-2">처리 결과</label>
                <input
                  value={complaint.resolution}
                  readOnly
                  className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm text-fg-2 outline-none"
                />
              </div>
            )}

            <p className="mt-6 pb-2 font-display text-base font-bold">처리 단계</p>
            <ul className="mt-2">
              {STATUS_ORDER.map((status, i) => {
                const done = currentStepIndex >= i;
                const isLast = i === STATUS_ORDER.length - 1;
                const at =
                  i === 0
                    ? complaint.createdAt
                    : status === "COMPLETED"
                      ? complaint.completedAt
                      : undefined;
                return (
                  <li key={status} className="relative flex gap-3 pb-[18px]">
                    {!isLast && (
                      <span className="absolute left-[9px] top-[22px] bottom-0 w-[1.5px] bg-border" />
                    )}
                    <span
                      className={`mt-0.5 flex h-[19px] w-[19px] flex-none items-center justify-center rounded-full text-white ${
                        done ? "bg-accent-deep" : "bg-border"
                      }`}
                    >
                      {done && <CheckIcon size={11} />}
                    </span>
                    <span>
                      <span
                        className={`block text-sm font-semibold ${done ? "text-fg" : "text-muted"}`}
                      >
                        {STATUS_LABEL[status]}
                      </span>
                      <span className="block text-xs text-muted">
                        {at ? new Date(at).toLocaleString("ko-KR") : done ? "완료" : "대기"}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </>
        ) : null}
      </div>
    </div>
  );
}
