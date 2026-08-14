"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

export interface CoverflowItem {
  id: string;
  /** 표지 이미지 경로. 없으면 fallbackIcon으로 대체됩니다. */
  image?: string;
  title: string;
  fallbackIcon?: ReactNode;
}

interface CoverflowCarouselProps {
  items: CoverflowItem[];
  /** 현재 중앙에 있어야 하는 아이템 id (선택 상태와 동기화할 때 사용) */
  selectedId?: string;
  /** 중앙 카드가 바뀔 때마다 호출됩니다 (스크롤이 멈춘 뒤 최종값 기준) */
  onSelect?: (id: string) => void;
  /** 이미 중앙에 있는 카드를 다시 탭했을 때 호출됩니다 (= "열기" 액션) */
  onActivate?: (id: string) => void;
  className?: string;
  /** 카드 너비(px). 기본 168px */
  cardWidth?: number;
  /** 카드 높이(px). 기본 224px (3:4 비율) */
  cardHeight?: number;
  /** true면 컨테이너가 부모의 남은 높이를 그대로 채웁니다(카드는 세로 중앙 정렬) */
  fillHeight?: boolean;
}

/**
 * 다용도 3D 코버플로우 캐러셀.
 * - 가운데 카드가 크게, 양옆 카드는 회전/축소되어 부분적으로 보입니다.
 * - 마우스 드래그(데스크톱) + 네이티브 터치 스크롤(모바일) 모두 지원합니다.
 * - CSS scroll-snap으로 항상 카드 중앙에 스냅됩니다.
 */
export function CoverflowCarousel({
  items,
  selectedId,
  onSelect,
  onActivate,
  className,
  cardWidth = 168,
  cardHeight = 224,
  fillHeight = false,
}: CoverflowCarouselProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [transforms, setTransforms] = useState<string[]>([]);
  const dragState = useRef<{
    /** 눌린 포인터 id. null이면 "누르지 않은 상태"이므로 이동 이벤트를 무시합니다. */
    pointerId: number | null;
    /** 마우스·펜은 scrollLeft를 직접 옮기고, 터치는 네이티브 스크롤에 맡깁니다. */
    manual: boolean;
    startX: number;
    startScrollLeft: number;
    dragging: boolean;
    pressedIndex: number | null;
  }>({
    pointerId: null,
    manual: false,
    startX: 0,
    startScrollLeft: 0,
    dragging: false,
    pressedIndex: null,
  });
  const settleTimeout = useRef<ReturnType<typeof setTimeout>>();
  const rafId = useRef<number>();
  const [failedImageIds, setFailedImageIds] = useState<Set<string>>(new Set());
  const DRAG_THRESHOLD = 6;

  const scrollToIndex = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const scroller = scrollerRef.current;
    const card = scroller?.children[index] as HTMLElement | undefined;
    if (!scroller || !card) return;
    const target = card.offsetLeft + card.clientWidth / 2 - scroller.clientWidth / 2;
    scroller.scrollTo({ left: target, behavior });
  }, []);

  const updateTransforms = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const center = scroller.scrollLeft + scroller.clientWidth / 2;

    let closestIndex = 0;
    let closestDist = Infinity;
    const next: string[] = [];

    Array.from(scroller.children).forEach((child, idx) => {
      const el = child as HTMLElement;
      const cardCenter = el.offsetLeft + el.clientWidth / 2;
      const dist = cardCenter - center;
      const absDist = Math.abs(dist);
      if (absDist < closestDist) {
        closestDist = absDist;
        closestIndex = idx;
      }
      const norm = Math.max(-1, Math.min(1, dist / (cardWidth * 1.6)));
      const rotateY = norm * -38;
      const scale = 1 - Math.min(0.32, Math.abs(norm) * 0.32);
      const translateZ = -Math.abs(norm) * 90;
      const translateX = -norm * cardWidth * 0.28;
      const opacity = 1 - Math.min(0.55, Math.abs(norm) * 0.55);
      next[idx] = `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      void opacity;
    });

    setTransforms(next);
    setActiveIndex(closestIndex);
  }, [cardWidth]);

  const handleScroll = useCallback(() => {
    if (rafId.current) cancelAnimationFrame(rafId.current);
    rafId.current = requestAnimationFrame(updateTransforms);

    if (settleTimeout.current) clearTimeout(settleTimeout.current);
    settleTimeout.current = setTimeout(() => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let closestIndex = 0;
      let closestDist = Infinity;
      Array.from(scroller.children).forEach((child, idx) => {
        const el = child as HTMLElement;
        const cardCenter = el.offsetLeft + el.clientWidth / 2;
        const dist = Math.abs(cardCenter - center);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = idx;
        }
      });
      const item = items[closestIndex];
      if (item) onSelect?.(item.id);
    }, 140);
  }, [items, onSelect, updateTransforms]);

  // 카테고리 전환 등으로 items 배열 자체가 바뀌면 첫 카드로 즉시 리셋
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToIndex(0, "auto");
      updateTransforms();
      if (items[0]) onSelect?.(items[0].id);
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  useEffect(() => {
    if (!selectedId) return;
    const idx = items.findIndex((i) => i.id === selectedId);
    if (idx >= 0 && idx !== activeIndex) {
      scrollToIndex(idx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function endDrag() {
    const scroller = scrollerRef.current;
    scroller?.classList.remove("cf-dragging");
    dragState.current.pointerId = null;
    dragState.current.dragging = false;
    dragState.current.pressedIndex = null;
  }

  function handlePointerDown(e: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const cardEl = (e.target as HTMLElement).closest<HTMLElement>("[data-cf-index]");
    const pressedIndex = cardEl ? Number(cardEl.dataset.cfIndex) : null;
    dragState.current = {
      pointerId: e.pointerId,
      manual: e.pointerType !== "touch",
      startX: e.clientX,
      startScrollLeft: scroller.scrollLeft,
      dragging: false,
      pressedIndex,
    };
  }

  function handlePointerMove(e: ReactPointerEvent<HTMLDivElement>) {
    const scroller = scrollerRef.current;
    const state = dragState.current;
    // 누르지 않은 채 커서만 움직이는 경우(hover)에는 절대 스크롤을 건드리지 않습니다.
    if (!scroller || state.pointerId !== e.pointerId) return;
    if (e.pointerType === "mouse" && e.buttons === 0) {
      endDrag();
      return;
    }

    const delta = e.clientX - state.startX;

    if (!state.dragging) {
      if (Math.abs(delta) < DRAG_THRESHOLD) return;
      // 드래그 임계값을 넘는 순간에만 포인터를 캡처합니다.
      // 처음부터 캡처해두면 클릭 이벤트가 카드가 아니라 스크롤러로 리다이렉트되어
      // 탭(클릭) 동작이 아예 무시되는 문제가 있었습니다.
      state.dragging = true;
      if (state.manual) {
        scroller.setPointerCapture(e.pointerId);
        scroller.classList.add("cf-dragging");
      }
    }

    // 터치는 브라우저 네이티브 스크롤 + scroll-snap이 처리합니다.
    if (!state.manual) return;

    scroller.scrollLeft = state.startScrollLeft - delta;
    handleScroll();
  }

  function handlePointerUp(e: ReactPointerEvent<HTMLDivElement>) {
    const { pointerId, dragging, pressedIndex } = dragState.current;
    if (pointerId !== e.pointerId) return;
    endDrag();

    // 드래그였다면 scroll-snap이 가까운 카드에 스냅하도록 두고 끝냅니다.
    if (dragging) return;

    // 움직임이 임계값 미만이었다면 탭(클릭)으로 간주해 바로 열어줍니다.
    if (pressedIndex !== null) {
      const item = items[pressedIndex];
      if (item) {
        scrollToIndex(pressedIndex);
        onActivate?.(item.id);
      }
    }
  }

  function handlePointerLeave() {
    // 드래그 중이면 포인터를 캡처한 상태이므로 pointerup/cancel까지 유지합니다.
    if (dragState.current.dragging) return;
    if (dragState.current.pointerId !== null) endDrag();
  }

  return (
    <div
      className={cn("relative w-full", fillHeight && "flex h-full flex-col", className)}
      style={{ perspective: "1000px" }}
    >
      <div
        ref={scrollerRef}
        onScroll={handleScroll}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={endDrag}
        onPointerLeave={handlePointerLeave}
        className="no-scrollbar cf-scroller flex cursor-grab items-center overflow-x-auto [scroll-snap-type:x_mandatory] [&.cf-dragging]:cursor-grabbing [&.cf-dragging]:[scroll-snap-type:none]"
        style={{
          height: fillHeight ? "100%" : cardHeight + 24,
          paddingInline: `calc(50% - ${cardWidth / 2}px)`,
          transformStyle: "preserve-3d",
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.id}
            data-cf-index={idx}
            role="button"
            tabIndex={0}
            aria-label={item.title}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                scrollToIndex(idx);
                onActivate?.(item.id);
              }
            }}
            className="relative mx-2 flex-none cursor-pointer overflow-hidden rounded-2xl bg-surface shadow-md [scroll-snap-align:center] [scroll-snap-stop:always]"
            style={{
              width: cardWidth,
              height: cardHeight,
              transform: transforms[idx],
              transition: dragState.current.dragging ? "none" : "transform 0.25s ease-out",
              zIndex: idx === activeIndex ? 10 : 1,
            }}
          >
            {item.image && !failedImageIds.has(item.id) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.image}
                alt={item.title}
                draggable={false}
                className="h-full w-full select-none object-cover"
                onError={() =>
                  setFailedImageIds((prev) => new Set(prev).add(item.id))
                }
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-2.5 bg-surface p-4 text-fg-2">
                {item.fallbackIcon}
                <span className="line-clamp-3 text-center text-xs font-semibold leading-snug">
                  {item.title}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
