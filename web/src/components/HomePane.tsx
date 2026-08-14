"use client";

import Image from "next/image";
import { useApiData } from "@/lib/hooks/useApiData";
import { useNewItemIds } from "@/lib/hooks/useNewItemIds";
import { getNotices } from "@/lib/api/domains/notices";
import { useAppState } from "@/lib/state/AppStateContext";
import {
  BellIcon,
  BuildingIcon,
  CarIcon,
  ChevronRightIcon,
  CupIcon,
  DocEditIcon,
  DoorIcon,
  ListIcon,
  MegaphoneIcon,
  SmartHomeIcon,
  VoteIcon,
} from "./icons";

type QuickActionKey =
  | "notice"
  | "complaint"
  | "vote"
  | "visitor"
  | "entrance"
  | "smarthome"
  | "community"
  | "mycomplaints";

/** 시연 중 새 공지가 등록되면 바로 보이도록 하는 폴링 주기 */
const NOTICE_POLL_MS = 5000;

const QUICK_ACTIONS: { key: QuickActionKey; label: string; icon: typeof MegaphoneIcon }[] = [
  { key: "notice", label: "공지사항", icon: MegaphoneIcon },
  { key: "complaint", label: "민원신청", icon: DocEditIcon },
  { key: "vote", label: "전자투표", icon: VoteIcon },
  { key: "visitor", label: "방문차량", icon: CarIcon },
  { key: "entrance", label: "공동현관", icon: DoorIcon },
  { key: "smarthome", label: "스마트홈", icon: SmartHomeIcon },
  { key: "community", label: "커뮤니티", icon: CupIcon },
  { key: "mycomplaints", label: "내 민원", icon: ListIcon },
];

interface Props {
  onGoTab: (tab: "notice" | "complaint") => void;
  onOpenComplaintForm: () => void;
  onOpenFeature: (type: "visitor" | "vote") => void;
}

export function HomePane({ onGoTab, onOpenComplaintForm, onOpenFeature }: Props) {
  const { member } = useAppState();
  const notices = useApiData(() => getNotices(), [], {
    refreshInterval: NOTICE_POLL_MS,
  });
  const newNoticeIds = useNewItemIds(notices.data?.map((n) => n.noticeId));
  const heroNotice = notices.data?.[0];
  const feedNotices = notices.data?.slice(1, 4) ?? [];

  function handleQuickAction(key: QuickActionKey) {
    if (key === "notice") onGoTab("notice");
    else if (key === "complaint") onOpenComplaintForm();
    else if (key === "vote") onOpenFeature("vote");
    else if (key === "visitor") onOpenFeature("visitor");
    else if (key === "mycomplaints") onGoTab("complaint");
    // 공동현관/스마트홈/커뮤니티: 백엔드 API가 없어 화면만 유지
  }

  return (
    <section className="h-full overflow-y-auto pb-32">
      <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-6">
        <div className="flex items-center gap-2.5">
          <Image
            src="/logo-elles.png"
            alt={member?.apartmentName ?? "아파트 로고"}
            width={96}
            height={96}
            priority
            className="h-12 w-12 flex-none rounded-full object-contain"
          />
          <div>
            <p className="text-[13px] font-semibold text-muted">
              {member?.apartmentName ?? "아파트 정보"}
            </p>
            <p className="mt-1 font-display text-[27px] font-bold">
              {member ? `${member.buildingNumber}동 ${member.unitNumber}호` : "입주민"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onGoTab("notice")}
            aria-label="알림 보기"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl text-fg transition hover:bg-surface"
          >
            <BellIcon size={21} />
            <i className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-accent ring-2 ring-bg" />
          </button>
        </div>
      </div>

      <button
        onClick={() => onGoTab("notice")}
        className="mx-5 mb-5 block rounded-2xl bg-surface p-4 text-left transition hover:bg-border/60"
      >
        <span className="flex items-center gap-2 text-[11.5px] font-bold tracking-wide text-accent-deep">
          공지
        </span>
        <span className="mt-1 block text-[17.5px] font-semibold">
          {notices.isLoading
            ? "불러오는 중..."
            : notices.error
              ? "공지를 불러오지 못했어요"
              : heroNotice?.title ?? "등록된 공지가 없어요"}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[12.5px] text-muted">
          관리사무소
          <ChevronRightIcon size={16} className="ml-auto" />
        </span>
      </button>

      <div className="mx-5 rounded-2xl bg-[oklch(0.974_0.010_22)] p-3">
        <div className="grid grid-cols-4 gap-y-4">
          {QUICK_ACTIONS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => handleQuickAction(key)}
              className="flex flex-col items-center gap-2 rounded-2xl py-1.5 transition active:scale-95"
            >
              <span className="flex h-[50px] w-[50px] items-center justify-center rounded-2xl bg-white/55 text-accent-deep/70 backdrop-blur-sm">
                <Icon size={23} />
              </span>
              <span className="text-xs font-brand font-semibold text-accent-deep/75">{label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-baseline justify-between px-5 pb-1.5 pt-7">
        <p className="font-display text-[17.5px] font-bold">이번 주 단지 소식</p>
        <button
          onClick={() => onGoTab("notice")}
          className="text-xs font-bold text-muted transition hover:text-fg"
        >
          전체보기
        </button>
      </div>

      {notices.isLoading ? (
        <div className="space-y-3.5 px-5 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-3.5 w-full animate-pulse rounded-full bg-surface" />
          ))}
        </div>
      ) : notices.error ? (
        <p className="px-5 py-6 text-sm text-muted">공지 소식을 불러오지 못했어요.</p>
      ) : feedNotices.length === 0 ? (
        <p className="px-5 py-6 text-sm text-muted">등록된 소식이 없어요.</p>
      ) : (
        <ul className="flex flex-col px-5">
          {feedNotices.map((notice) => {
            const isNew = newNoticeIds.has(notice.noticeId);
            return (
              <li
                key={notice.noticeId}
                className={`flex items-center gap-3 border-b border-border py-3.5 last:border-none ${
                  isNew ? "item-arrive" : ""
                }`}
              >
                <span className="relative flex h-[38px] w-[38px] flex-none items-center justify-center rounded-xl bg-surface text-fg-2">
                  <BuildingIcon size={19} />
                  {isNew && (
                    <i className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-bg" />
                  )}
                </span>
                <span className="flex-1">
                  <span className="block text-[15.5px] font-semibold">{notice.title}</span>
                  <span className="block text-xs text-muted">
                    {isNew ? "방금 등록" : new Date(notice.createdAt).toLocaleDateString("ko-KR")}
                  </span>
                </span>
                {notice.isImportant && (
                  <span className="flex-none rounded-lg bg-accent-soft px-2.5 py-1 text-[11px] font-bold text-accent-deep">
                    중요
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
