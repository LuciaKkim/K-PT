"use client";

import { useEffect, useState } from "react";
import type { ApartmentDocument } from "@/lib/api/types";
import { ChatIcon, CheckIcon, DownloadIcon } from "./icons";

interface Props {
  doc: ApartmentDocument;
  onAskAbout: (title: string) => void;
  /** 지정하면 제목이 클릭 가능해지고(자세히 보기), 눌렀을 때 이 콜백이 실행됩니다. */
  onTitleClick?: () => void;
  className?: string;
}

/**
 * 문서 상세 정보(제목/설명/메타데이터/다운로드/문서 질문하기)를 렌더링하는 공유 컴포넌트.
 * `DocDetailOverlay`(전체 화면 상세)와 자료실 카탈로그 하단 정보 패널에서 함께 사용합니다.
 * 다운로드 로직/질문하기 로직을 한 곳에서만 관리하기 위해 분리했습니다.
 */
export function DocumentDetailBody({ doc, onAskAbout, onTitleClick, className }: Props) {
  const [downloaded, setDownloaded] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // 문서가 바뀌면(카탈로그에서 다른 카드로 이동 등) 다운로드 상태를 초기화합니다.
  useEffect(() => {
    setDownloaded(false);
    setDownloading(false);
  }, [doc.id]);

  function handleDownload() {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloaded(true);
    }, 900);
  }

  return (
    <div className={className}>
      {onTitleClick ? (
        <button
          type="button"
          onClick={onTitleClick}
          className="mb-2 block text-left text-xl font-bold transition hover:text-accent-deep"
        >
          {doc.title}
        </button>
      ) : (
        <h3 className="mb-2 text-xl font-bold">{doc.title}</h3>
      )}
      <p className="mb-5 text-sm leading-relaxed text-fg-2">{doc.summary}</p>

      <ul className="rounded-2xl bg-surface px-4">
        {[
          ["분류", doc.category],
          ["버전", doc.version],
          ["개정일", doc.updatedAt],
          ["등록 주체", doc.author],
          ["파일", `${doc.fileType} · ${doc.fileSize} · ${doc.pages}쪽`],
        ].map(([label, value]) => (
          <li
            key={label}
            className="flex justify-between gap-3.5 border-b border-border py-2.5 text-sm last:border-none"
          >
            <b className="font-semibold text-muted">{label}</b>
            <span className="text-right font-semibold">{value}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={handleDownload}
        disabled={downloading}
        className={`mt-5 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl font-bold transition ${
          downloaded
            ? "bg-surface text-fg"
            : "bg-accent-deep text-white hover:bg-accent-press disabled:cursor-not-allowed"
        }`}
      >
        {downloading ? (
          "준비 중..."
        ) : downloaded ? (
          <>
            <CheckIcon size={17} />
            내려받기 완료
          </>
        ) : (
          <>
            <DownloadIcon size={17} />
            파일 내려받기
          </>
        )}
      </button>
      <button
        onClick={() => onAskAbout(doc.title)}
        className="mt-2.5 flex h-[54px] w-full items-center justify-center gap-2 rounded-2xl bg-surface font-bold text-fg transition hover:bg-border/60"
      >
        <ChatIcon size={17} />
        이 문서 내용 물어보기
      </button>
    </div>
  );
}
