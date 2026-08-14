"use client";

import { useEffect, useRef, useState } from "react";
import { AIInputWithLoading } from "@/components/ui/ai-input-with-loading";
import { ScreenGradient } from "@/components/ui/bloom-field-gradient";
import { queryRag } from "@/lib/api/domains/rag";
import { ApiError } from "@/lib/api/httpClient";
import { useAppState } from "@/lib/state/AppStateContext";
import { ArrowLeftIcon, FileIcon, LogoMarkIcon } from "./icons";

interface ChatMessage {
  id: string;
  role: "bot" | "me";
  text: string;
  references?: string[];
  isError?: boolean;
}

const SUGGESTIONS = [
  "방문차량 몇 시간까지 주차 가능해?",
  "층간소음 민원 넣고 싶어",
  "관리비 연체하면 어떻게 돼?",
  "헬스장 운영시간 알려줘",
  "반려동물 몇 마리까지 키울 수 있어?",
];

interface Props {
  open: boolean;
  onClose: () => void;
  initialQuestion?: string;
}

export function ChatWidget({ open, onClose, initialQuestion }: Props) {
  const { member } = useAppState();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isSending, setIsSending] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const askedInitial = useRef(false);

  useEffect(() => {
    const who = member ? `${member.buildingNumber}동 ${member.unitNumber}호님` : "입주민님";
    setMessages([
      {
        id: "greeting",
        role: "bot",
        text: `안녕하세요, ${who}. 관리규약이나 주차 규정, 민원 접수 무엇이든 물어보세요.`,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [member?.unitNumber]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open && initialQuestion && !askedInitial.current) {
      askedInitial.current = true;
      send(initialQuestion);
    }
    if (!open) askedInitial.current = false;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialQuestion]);

  async function send(question: string) {
    const text = question.trim();
    if (!text || isSending) return;

    setMessages((prev) => [...prev, { id: crypto.randomUUID(), role: "me", text }]);
    setIsSending(true);

    try {
      // sessionId 를 넘기면 Bedrock 이 직전 대화 맥락으로 질문을 재작성해서,
      // 주제가 바뀔 때 이전 주제의 청크만 검색되어 "정보 없음" 답변이 나온다.
      // 매 질문을 독립 세션으로 보낸다.
      const data = await queryRag(text);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text: data.answer,
          references: data.references,
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "bot",
          text:
            error instanceof ApiError
              ? error.message
              : "답변을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.",
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 mx-auto flex max-w-[420px] flex-col bg-bg">
      <ScreenGradient />
      <div className="flex flex-none items-center gap-2.5 border-b border-border px-4 pb-3.5 pt-6">
        <button
          onClick={onClose}
          aria-label="닫기"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-fg transition hover:bg-white/60"
        >
          <ArrowLeftIcon />
        </button>
        <span className="flex h-9 w-9 flex-none items-center justify-center rounded-xl bg-accent-soft text-accent-deep">
          <LogoMarkIcon size={19} />
        </span>
        <div>
          <p className="font-display text-base font-bold">아파톡 생활 도우미</p>
          <p className="text-xs text-muted">관리규정 문서를 근거로 답해요</p>
        </div>
      </div>

      <div ref={bodyRef} className="flex-1 space-y-3.5 overflow-y-auto px-4 py-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col gap-1.5 ${
              msg.role === "me" ? "ml-auto max-w-[86%] items-end" : "w-full items-start"
            }`}
          >
            <div
              className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                msg.role === "me"
                  ? "max-w-full rounded-br-md bg-accent-deep text-white"
                  : msg.isError
                    ? "max-w-[86%] rounded-bl-md bg-danger/10 text-danger"
                    : "max-w-[86%] rounded-bl-md bg-white/75 text-fg backdrop-blur-sm"
              }`}
            >
              {msg.text}
            </div>
            {msg.references && msg.references.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {msg.references.map((ref, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-accent-soft px-2.5 py-1.5 text-xs font-bold text-accent-deep"
                  >
                    <FileIcon size={13} />
                    {ref}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
        {isSending && (
          <div className="flex w-fit gap-1.5 rounded-2xl rounded-bl-md bg-white/75 px-4 py-3.5 backdrop-blur-sm">
            {[0, 1, 2].map((i) => (
              <i
                key={i}
                className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted"
                style={{ animationDelay: `${i * 0.16}s` }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-none flex-wrap gap-1.5 px-4 pb-1 pt-2">
        {SUGGESTIONS.map((q) => (
          <button
            key={q}
            onClick={() => send(q)}
            className="rounded-full border border-border bg-white/70 px-3 py-2 text-xs font-semibold text-fg-2 backdrop-blur-sm transition hover:border-muted hover:bg-white hover:text-fg"
          >
            {q}
          </button>
        ))}
      </div>

      <div className="flex-none px-4 pb-5 pt-3">
        <AIInputWithLoading placeholder="궁금한 점을 입력하세요" isLoading={isSending} onSubmit={send} />
      </div>
    </div>
  );
}
