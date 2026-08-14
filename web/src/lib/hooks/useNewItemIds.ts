"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 목록이 폴링으로 갱신될 때 "처음 화면에 들어온 이후에 새로 추가된 항목"의 id를 추적합니다.
 * 시연 중 백엔드에 공지가 새로 등록되면 NEW 배지·등장 애니메이션을 붙이는 데 씁니다.
 *
 * @param ids 현재 목록의 id 배열 (아직 로딩 중이면 undefined)
 * @param highlightMs 새 항목으로 강조해 둘 시간(ms)
 */
export function useNewItemIds(ids: number[] | undefined, highlightMs = 40000) {
  const knownIds = useRef<Set<number> | null>(null);
  const [newIds, setNewIds] = useState<Set<number>>(new Set());
  const idKey = ids?.join(",") ?? "";

  useEffect(() => {
    if (!ids) return;

    // 첫 로드분은 "새 항목"이 아닙니다.
    if (knownIds.current === null) {
      knownIds.current = new Set(ids);
      return;
    }

    const known = knownIds.current;
    const fresh = ids.filter((id) => !known.has(id));
    if (fresh.length === 0) return;
    fresh.forEach((id) => known.add(id));
    setNewIds((prev) => new Set([...prev, ...fresh]));

    const timer = setTimeout(() => {
      setNewIds((prev) => {
        const next = new Set(prev);
        fresh.forEach((id) => next.delete(id));
        return next;
      });
    }, highlightMs);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idKey, highlightMs]);

  return newIds;
}
