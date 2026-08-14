"use client";

import { CornerRightUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { useAutoResizeTextarea } from "@/lib/hooks/use-auto-resize-textarea";
import { cn } from "@/lib/utils";

interface AIInputWithLoadingProps {
  id?: string;
  placeholder?: string;
  minHeight?: number;
  maxHeight?: number;
  /** 실제 API 호출 등 외부 로딩 상태와 연동하는 loading 상태. 컴포넌트 내부에서 타이머로 흉내내지 않습니다. */
  isLoading?: boolean;
  /** 입력값을 제출할 때 호출됩니다. 기존 전송 핸들러(예: send(question))를 그대로 연결하면 됩니다. */
  onSubmit: (value: string) => void | Promise<void>;
  autoFocus?: boolean;
  className?: string;
}

export function AIInputWithLoading({
  id = "ai-input-with-loading",
  placeholder = "궁금한 점을 입력하세요",
  minHeight = 52,
  maxHeight = 140,
  isLoading = false,
  onSubmit,
  autoFocus,
  className,
}: AIInputWithLoadingProps) {
  const [inputValue, setInputValue] = useState("");
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({
    minHeight,
    maxHeight,
  });

  const canSubmit = inputValue.trim().length > 0 && !isLoading;

  async function handleSubmit() {
    const value = inputValue.trim();
    if (!value || isLoading) return;

    setInputValue("");
    adjustHeight(true);
    await onSubmit(value);
  }

  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex w-full items-end gap-2 rounded-2xl border border-border bg-surface-2 px-3 py-2 transition focus-within:border-accent focus-within:bg-bg focus-within:ring-2 focus-within:ring-accent-soft">
        <Textarea
          id={id}
          ref={textareaRef}
          value={inputValue}
          placeholder={placeholder}
          disabled={isLoading}
          autoFocus={autoFocus}
          aria-label="메시지 입력"
          onChange={(e) => {
            setInputValue(e.target.value);
            adjustHeight();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          style={{ minHeight, maxHeight }}
          className="flex-1 resize-none border-none bg-transparent px-1 py-2 text-sm leading-relaxed text-fg placeholder:text-muted focus-visible:border-none focus-visible:bg-transparent focus-visible:ring-0"
        />
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          aria-label="전송"
          className={cn(
            "flex h-9 w-9 flex-none items-center justify-center rounded-xl transition",
            isLoading
              ? "cursor-wait bg-accent-soft text-accent-deep"
              : canSubmit
                ? "bg-accent-deep text-white hover:bg-accent-press"
                : "cursor-not-allowed bg-border text-muted"
          )}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CornerRightUp className="h-4 w-4" />
          )}
        </button>
      </div>
      <p className="mt-1.5 px-1 text-[11px] text-muted">사진과 영상을 첨부할 수 있습니다.</p>
    </div>
  );
}
