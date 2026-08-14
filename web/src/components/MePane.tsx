"use client";

import { useState } from "react";
import Image from "next/image";
import { useAppState } from "@/lib/state/AppStateContext";
import { LogoutIcon } from "./icons";

const NOTIFICATION_ITEMS = [
  { key: "notice", title: "공지사항 알림", sub: "공지 등록 시 즉시 발송", defaultOn: true },
  { key: "complaint", title: "민원 처리 알림", sub: "접수·확인·처리·완료 단계별 발송", defaultOn: true },
  { key: "visitor", title: "방문차량 만료 알림", sub: "주차 종료 30분 전 발송", defaultOn: false },
];

export function MePane() {
  const { member, logout } = useAppState();
  const [switches, setSwitches] = useState(
    Object.fromEntries(NOTIFICATION_ITEMS.map((n) => [n.key, n.defaultOn]))
  );
  const [logoutArmed, setLogoutArmed] = useState(false);

  function handleLogoutClick() {
    if (!logoutArmed) {
      setLogoutArmed(true);
      setTimeout(() => setLogoutArmed(false), 3400);
      return;
    }
    setLogoutArmed(false);
    logout();
  }

  return (
    <section className="h-full overflow-y-auto pb-32">
      <div className="px-5 pb-4 pt-6">
        <p className="text-[13px] font-semibold text-muted">{member?.email ?? "로그인 필요"}</p>
        <p className="mt-1 font-display text-[27px] font-bold">내 정보</p>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-3.5 rounded-[20px] bg-white/70 p-5 backdrop-blur-sm">
          <span className="h-[52px] w-[52px] flex-none overflow-hidden rounded-full bg-accent-soft">
            <Image
              src="/profile-avatar.png"
              alt=""
              width={92}
              height={92}
              className="h-full w-full object-cover"
            />
          </span>
          <span className="flex-1">
            <span className="block text-[15px] font-semibold">
              {member?.name ?? "-"}
            </span>
            <span className="block text-xs text-muted">
              {member
                ? `${member.apartmentName} ${member.buildingNumber}동 ${member.unitNumber}호`
                : "-"}
            </span>
          </span>
        </div>
      </div>

      <p className="px-5 pb-1.5 pt-7 font-display text-[17.5px] font-bold">알림 설정</p>
      <ul className="px-5">
        {NOTIFICATION_ITEMS.map((item) => (
          <li
            key={item.key}
            className="flex items-center gap-3 border-b border-border py-3.5 last:border-none"
          >
            <span className="flex-1">
              <span className="block text-sm font-semibold">{item.title}</span>
              <span className="block text-xs text-muted">{item.sub}</span>
            </span>
            <button
              role="switch"
              aria-checked={switches[item.key]}
              aria-label={item.title}
              onClick={() =>
                setSwitches((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
              }
              className={`relative h-[30px] w-[50px] flex-none rounded-full transition ${
                switches[item.key] ? "bg-accent-deep" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  switches[item.key] ? "translate-x-5" : ""
                }`}
              />
            </button>
          </li>
        ))}
      </ul>

      <p className="px-5 pb-1.5 pt-7 font-display text-[17.5px] font-bold">계정</p>
      <div className="px-5">
        <div className="flex items-center gap-3 border-b border-border py-3.5">
          <span className="flex-1">
            <span className="block text-sm font-semibold">연결된 계정</span>
            <span className="block text-xs text-muted">{member?.email ?? "—"}</span>
          </span>
        </div>
        <button
          onClick={handleLogoutClick}
          className={`mt-3.5 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl font-bold transition ${
            logoutArmed
              ? "bg-accent-soft text-accent-deep"
              : "bg-white/70 text-fg backdrop-blur-sm hover:bg-white"
          }`}
        >
          <LogoutIcon size={17} />
          {logoutArmed ? "한 번 더 누르면 로그아웃" : "로그아웃"}
        </button>
        <p className="mt-2.5 text-center text-xs text-muted">
          로그아웃하면 로그인 화면으로 돌아갑니다
        </p>
      </div>
    </section>
  );
}
