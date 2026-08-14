"use client";

import { useState } from "react";
import { useAppState } from "@/lib/state/AppStateContext";
import { ScreenGradient } from "@/components/ui/bloom-field-gradient";
import { ArrowLeftIcon, CheckIcon } from "./icons";

type FeatureType = "visitor" | "vote";

interface Props {
  type: FeatureType | null;
  onClose: () => void;
}

function VisitorForm({ onDone }: { onDone: () => void }) {
  const [plate, setPlate] = useState("");
  const [purpose, setPurpose] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-2 text-xl font-bold">방문차량을 등록해요</h3>
      <p className="mb-6 text-sm leading-relaxed text-fg-2">
        등록 즉시 방문자 구역에 최대 4시간까지 무료로 주차할 수 있어요.
      </p>
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">차량번호</label>
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          placeholder="12가 3456"
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">방문 목적</label>
        <input
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          placeholder="지인 방문"
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft"
        />
      </div>
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">방문 예정 시간</label>
        <input
          defaultValue="오늘 14:00 ~ 18:00"
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft"
        />
      </div>
      <button
        type="submit"
        className="mt-2 flex h-[54px] w-full items-center justify-center rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press"
      >
        등록 완료하기
      </button>
    </form>
  );
}

function VoteForm({ onDone }: { onDone: () => void }) {
  const { member } = useAppState();
  const [choice, setChoice] = useState<"agree" | "disagree">("agree");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onDone();
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="mb-2 text-xl font-bold">승강기 교체 안건</h3>
      <p className="mb-6 text-sm leading-relaxed text-fg-2">
        102동 1·2호기 노후 승강기 교체 안건입니다. 8/20 18:00까지 세대당 1표를 행사할 수
        있어요.
      </p>
      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">세대 정보</label>
        <input
          value={member ? `${member.buildingNumber}동 ${member.unitNumber}호` : ""}
          readOnly
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm text-fg-2 outline-none"
        />
      </div>
      <ul className="mb-4 rounded-2xl bg-white/70 px-4 backdrop-blur-sm">
        {[
          { key: "agree" as const, title: "찬성", sub: "교체 공사를 진행합니다" },
          { key: "disagree" as const, title: "반대", sub: "현행 유지 후 재논의합니다" },
        ].map((opt) => (
          <li
            key={opt.key}
            className="flex items-center gap-3 border-b border-border py-3.5 last:border-none"
          >
            <span className="flex-1">
              <span className="block text-sm font-semibold">{opt.title}</span>
              <span className="block text-xs text-muted">{opt.sub}</span>
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={choice === opt.key}
              onClick={() => setChoice(opt.key)}
              className={`relative h-[30px] w-[50px] flex-none rounded-full transition ${
                choice === opt.key ? "bg-accent-deep" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] h-6 w-6 rounded-full bg-white shadow transition-transform ${
                  choice === opt.key ? "translate-x-5" : ""
                }`}
              />
            </button>
          </li>
        ))}
      </ul>
      <button
        type="submit"
        className="flex h-[54px] w-full items-center justify-center rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press"
      >
        투표하기
      </button>
    </form>
  );
}

export function FeatureOverlay({ type, onClose }: Props) {
  const [done, setDone] = useState(false);

  if (!type) return null;

  function handleClose() {
    setDone(false);
    onClose();
  }

  const title = type === "visitor" ? "방문차량 등록" : "전자투표";

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
        <p className="font-display text-base font-bold">{title}</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6">
        {done ? (
          <div className="pt-11 text-center">
            <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
              <CheckIcon size={30} />
            </span>
            <h3 className="text-xl font-bold">
              {type === "visitor" ? "등록이 완료됐어요" : "투표가 완료됐어요"}
            </h3>
            <button
              onClick={handleClose}
              className="mt-8 h-[54px] w-full rounded-2xl bg-white/70 font-bold text-fg backdrop-blur-sm transition hover:bg-white"
            >
              홈으로 돌아가기
            </button>
          </div>
        ) : type === "visitor" ? (
          <VisitorForm onDone={() => setDone(true)} />
        ) : (
          <VoteForm onDone={() => setDone(true)} />
        )}
      </div>
    </div>
  );
}
