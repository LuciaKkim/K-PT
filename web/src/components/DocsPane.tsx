"use client";

import { useMemo, useState } from "react";
import { BookText, Car, ClipboardList, FileEdit, Receipt } from "lucide-react";
import type { ApartmentDocument, DocumentCategory } from "@/lib/api/types";
import { MOCK_DOCUMENTS } from "@/lib/api/mock/documents.mock";
import { CoverflowCarousel, type CoverflowItem } from "./ui/coverflow-carousel";

const CATEGORIES: (DocumentCategory | "전체")[] = ["전체", "규약", "주차", "생활수칙", "회계", "서식"];

const CATEGORY_ICON: Record<string, typeof BookText> = {
  규약: BookText,
  주차: Car,
  생활수칙: ClipboardList,
  회계: Receipt,
  서식: FileEdit,
};

interface Props {
  onOpenDoc: (doc: ApartmentDocument) => void;
}

/**
 * 자료실(Materials) 화면.
 * ⚠️ 현재 Backend API(docs/api-docs.json)에는 자료실/문서 조회 엔드포인트가 없어
 * 실제 데이터를 연동할 수 없습니다. UI/UX를 확인/검증할 수 있도록 프런트엔드 전용
 * 목업 데이터(MOCK_DOCUMENTS)로 채워두었으며, 백엔드 API가 추가되면 이 부분을
 * 실제 API 호출로 교체하면 됩니다.
 */
export function DocsPane({ onOpenDoc }: Props) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("전체");
  const docs = useMemo(
    () =>
      category === "전체"
        ? MOCK_DOCUMENTS
        : MOCK_DOCUMENTS.filter((doc) => doc.category === category),
    [category]
  );
  const [selectedId, setSelectedId] = useState<string | undefined>();

  const carouselItems: CoverflowItem[] = useMemo(
    () =>
      docs.map((doc) => {
        const Icon = CATEGORY_ICON[doc.category] ?? BookText;
        return {
          id: doc.id,
          image: doc.coverImage,
          title: doc.shortTitle ?? doc.title,
          fallbackIcon: <Icon size={28} strokeWidth={1.6} />,
        };
      }),
    [docs]
  );

  const selectedDoc = docs.find((d) => d.id === selectedId) ?? docs[0];

  function handleActivate(id: string) {
    const doc = docs.find((d) => d.id === id);
    if (doc) onOpenDoc(doc);
  }

  return (
    <section className="flex h-full flex-col">
      <div className="flex flex-none items-start justify-between gap-3 px-5 pb-4 pt-6">
        <div>
          <p className="text-[13px] font-semibold text-muted">관리사무소</p>
          <p className="mt-1 font-display text-[27px] font-bold">자료실</p>
        </div>
      </div>

      <div className="flex flex-none gap-1.5 overflow-x-auto px-5 pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={`flex-none rounded-xl px-3.5 py-2 text-xs font-bold transition ${
              category === c
                ? "bg-accent-soft text-accent-deep"
                : "bg-surface text-fg-2 hover:bg-border/60"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {docs.length === 0 ? (
        <p className="px-6 py-14 text-center text-sm leading-relaxed text-muted">
          이 분류에 등록된 자료가 없어요.
        </p>
      ) : (
        <>
          <div className="min-h-0 flex-1">
            <CoverflowCarousel
              items={carouselItems}
              selectedId={selectedId}
              onSelect={setSelectedId}
              onActivate={handleActivate}
              cardWidth={196}
              cardHeight={272}
              fillHeight
            />
          </div>

          {selectedDoc && (
            <button
              onClick={() => onOpenDoc(selectedDoc)}
              className="flex-none px-8 pb-28 pt-1 text-center transition active:opacity-70"
            >
              <p className="font-display text-base font-bold">
                {selectedDoc.shortTitle ?? selectedDoc.title}
              </p>
              <p className="mx-auto mt-1 line-clamp-2 max-w-[30ch] text-xs leading-relaxed text-fg-2">
                {selectedDoc.summary}
              </p>
            </button>
          )}
        </>
      )}
    </section>
  );
}
