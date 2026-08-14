"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseAutoResizeTextareaOptions {
  minHeight: number;
  maxHeight?: number;
}

/**
 * textarea의 ref와 내용에 따라 높이를 자동으로 조절하는 훅.
 * minHeight/maxHeight 범위 내에서 scrollHeight에 맞춰 늘어납니다.
 */
export function useAutoResizeTextarea({ minHeight, maxHeight }: UseAutoResizeTextareaOptions) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      if (reset) {
        textarea.style.height = `${minHeight}px`;
        return;
      }

      textarea.style.height = `${minHeight}px`;
      const newHeight = Math.max(
        minHeight,
        Math.min(textarea.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY)
      );
      textarea.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.minHeight = `${minHeight}px`;
      if (maxHeight) textarea.style.maxHeight = `${maxHeight}px`;
      adjustHeight();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minHeight, maxHeight]);

  useEffect(() => {
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [adjustHeight]);

  return { textareaRef, adjustHeight };
}
