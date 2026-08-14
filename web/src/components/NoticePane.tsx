"use client";

import { useState } from "react";
import { getNoticeDetail, getNotices } from "@/lib/api/domains/notices";
import { ApiError } from "@/lib/api/httpClient";
import { useApiData } from "@/lib/hooks/useApiData";
import { useNewItemIds } from "@/lib/hooks/useNewItemIds";
import type { NoticeInfoRes } from "@/lib/api/types";
import { ChevronDownIcon } from "./icons";

/** 시연 중 새 공지가 등록되면 바로 보이도록 하는 폴링 주기 */
const NOTICE_POLL_MS = 5000;

export function NoticePane() {
  const notices = useApiData(() => getNotices(), [], {
    refreshInterval: NOTICE_POLL_MS,
  });
  const newNoticeIds = useNewItemIds(notices.data?.map((n) => n.noticeId));
  const [openId, setOpenId] = useState<number | null>(null);
  const [details, setDetails] = useState<Record<number, NoticeInfoRes>>({});
  const [detailErrors, setDetailErrors] = useState<Record<number, string>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);

  function toggle(noticeId: number) {
    if (openId === noticeId) {
      setOpenId(null);
      return;
    }
    setOpenId(noticeId);
    if (details[noticeId] || detailErrors[noticeId]) return;
    setLoadingId(noticeId);
    getNoticeDetail(noticeId)
      .then((data) => {
        setDetails((prev) => ({ ...prev, [noticeId]: data }));
      })
      .catch((err) => {
        setDetailErrors((prev) => ({
          ...prev,
          [noticeId]: err instanceof ApiError ? err.message : "상세 내용을 불러오지 못했어요.",
        }));
      })
      .finally(() => setLoadingId(null));
  }

  return (
    <section className="h-full overflow-y-auto pb-32">
      <div className="flex items-start justify-between gap-3 px-5 pb-4 pt-6">
        <div>
          <p className="text-[13px] font-semibold text-muted">공지사항</p>
          <p className="mt-1 font-display text-[27px] font-bold">공지사항</p>
        </div>
      </div>

      {notices.isLoading ? (
        <div className="space-y-3.5 px-5 pt-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-3.5 w-full animate-pulse rounded-full bg-surface" />
          ))}
        </div>
      ) : notices.error ? (
        <p className="px-6 py-14 text-center text-sm leading-relaxed text-muted">
          공지사항을 불러오지 못했어요.
        </p>
      ) : !notices.data || notices.data.length === 0 ? (
        <p className="px-6 py-14 text-center text-sm leading-relaxed text-muted">
          등록된 공지사항이 없어요.
        </p>
      ) : (
        <div className="px-5">
          {notices.data.map((notice) => {
            const isOpen = openId === notice.noticeId;
            const detail = details[notice.noticeId];
            const detailError = detailErrors[notice.noticeId];
            const isNew = newNoticeIds.has(notice.noticeId);
            return (
              <div
                key={notice.noticeId}
                className={`border-b border-border last:border-none ${
                  isNew ? "item-arrive" : ""
                }`}
              >
                <button
                  onClick={() => toggle(notice.noticeId)}
                  aria-expanded={isOpen}
                  className="flex w-full items-start gap-3 py-4 text-left"
                >
                  <span className="flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="block text-[15.5px] font-semibold">{notice.title}</span>
                      {isNew && (
                        <span className="flex flex-none items-center gap-1 rounded-lg bg-accent-deep px-2 py-0.5 text-[10.5px] font-bold text-white">
                          <i className="h-1.5 w-1.5 rounded-full bg-white/90" />
                          NEW
                        </span>
                      )}
                      {notice.isEmergency && (
                        <span className="flex-none rounded-lg bg-danger/10 px-2 py-0.5 text-[10.5px] font-bold text-danger">
                          긴급
                        </span>
                      )}
                      {notice.isImportant && (
                        <span className="flex-none rounded-lg bg-accent-soft px-2 py-0.5 text-[10.5px] font-bold text-accent-deep">
                          중요
                        </span>
                      )}
                    </span>
                    <span className="block text-xs text-muted">
                      {notice.writer} · {new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                    </span>
                  </span>
                  <ChevronDownIcon
                    size={18}
                    className={`mt-1 flex-none text-muted transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <div
                  className="overflow-hidden transition-all"
                  style={{ maxHeight: isOpen ? "420px" : "0px" }}
                >
                  <div className="mb-4 rounded-2xl bg-surface px-4 py-[22px]">
                    <p className="text-sm leading-relaxed text-fg-2">
                      {loadingId === notice.noticeId
                        ? "불러오는 중..."
                        : detailError ?? detail?.content ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
