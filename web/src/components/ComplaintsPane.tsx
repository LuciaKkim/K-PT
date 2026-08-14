"use client";

import { useEffect, useState } from "react";
import { getMyComplaints } from "@/lib/api/domains/complaints";
import { ApiError } from "@/lib/api/httpClient";
import { useNewItemIds } from "@/lib/hooks/useNewItemIds";
import type { ComplaintListRes } from "@/lib/api/types";
import { DocEditIcon, InboxIcon } from "./icons";

const STATUS_LABEL: Record<ComplaintListRes["status"], string> = {
  RECEIVED: "접수",
  CHECKING: "확인",
  PROCESSING: "처리중",
  COMPLETED: "완료",
};

/** 시연 중 민원 상태 변화가 바로 보이도록 하는 폴링 주기 */
const COMPLAINT_POLL_MS = 5000;

interface Props {
  onNewComplaint: () => void;
  onOpenDetail: (complaintId: number) => void;
  refreshKey: number;
}

export function ComplaintsPane({ onNewComplaint, onOpenDetail, refreshKey }: Props) {
  const [complaints, setComplaints] = useState<ComplaintListRes[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const newComplaintIds = useNewItemIds(complaints.map((c) => c.complaintId));

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    function load(isPoll: boolean) {
      if (isPoll && typeof document !== "undefined" && document.hidden) return;
      getMyComplaints()
        .then((page) => {
          if (cancelled) return;
          setComplaints(page.content);
          setError(null);
        })
        .catch((err) => {
          // 폴링 실패는 기존 목록을 유지한 채 조용히 무시합니다.
          if (cancelled || isPoll) return;
          setError(err instanceof ApiError ? err.message : "민원 목록을 불러오지 못했어요.");
        })
        .finally(() => {
          if (!cancelled && !isPoll) setIsLoading(false);
        });
    }

    load(false);
    const timer = setInterval(() => load(true), COMPLAINT_POLL_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [refreshKey]);

  return (
    <section className="h-full overflow-y-auto pb-32">
      <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-6">
        <div>
          <p className="text-[13px] font-semibold text-muted">처리 현황</p>
          <p className="mt-1 font-display text-[27px] font-bold">내 민원</p>
        </div>
        <button
          onClick={onNewComplaint}
          className="flex-none rounded-xl bg-white/70 px-3 py-2 text-xs font-bold text-fg-2 backdrop-blur-sm transition hover:bg-white"
        >
          새 민원
        </button>
      </div>

      {isLoading ? (
        <div className="space-y-3.5 px-5 pt-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3.5 w-full animate-pulse rounded-full bg-white/60" />
          ))}
        </div>
      ) : error ? (
        <div className="px-6 py-14 text-center text-sm leading-relaxed text-muted">{error}</div>
      ) : complaints.length === 0 ? (
        <div className="px-6 py-14 text-center text-sm leading-relaxed text-muted">
          <InboxIcon size={40} className="mx-auto mb-3.5 text-border" />
          접수한 민원이 없어요.
          <br />
          불편한 점이 있으면 새 민원으로 남겨 주세요.
        </div>
      ) : (
        <ul className="flex flex-col px-5">
          {complaints.map((c) => {
            const isNew = newComplaintIds.has(c.complaintId);
            return (
              <li
                key={c.complaintId}
                className={`flex items-center gap-3 border-b border-border py-3.5 last:border-none ${
                  isNew ? "item-arrive" : ""
                }`}
              >
                <button
                  onClick={() => onOpenDetail(c.complaintId)}
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="relative flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-white/70 text-fg-2 backdrop-blur-sm">
                    <DocEditIcon size={19} />
                    {isNew && (
                      <i className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg" />
                    )}
                  </span>
                  <span className="flex-1">
                    <span className="block text-[15.5px] font-semibold">{c.title}</span>
                    <span className="block text-xs text-muted">
                      C-{c.complaintId} · {new Date(c.createdAt).toLocaleString("ko-KR")}
                    </span>
                  </span>
                  <span
                    className={`flex-none rounded-lg px-2.5 py-1 text-[11px] font-bold ${
                      c.status === "COMPLETED"
                        ? "text-[oklch(0.455_0.115_152)]"
                        : "bg-accent-soft text-accent-deep"
                    }`}
                  >
                    {STATUS_LABEL[c.status]}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
