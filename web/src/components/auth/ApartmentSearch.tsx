"use client";

import { useEffect, useMemo, useState } from "react";
import { getApartments } from "@/lib/api/domains/apartments";
import { ApiError } from "@/lib/api/httpClient";
import type { ApartmentListRes } from "@/lib/api/types";
import { SearchIcon } from "@/components/icons";
import { ApartmentSelection } from "./ApartmentSelection";

interface Props {
  onSelect: (apartment: ApartmentListRes) => void;
}

/**
 * 회원가입 2단계: 아파트 검색.
 *
 * ⚠️ TODO(backend): 명세서(docs/api-docs.json)에는 "아파트 검색" 전용 엔드포인트가 없습니다.
 * 현재는 `GET /api/v1/apartments`(전체 목록 조회)만 존재하므로, 그 전체 목록을 한 번 불러온 뒤
 * 이름/도로명주소 기준으로 프론트에서만 필터링합니다(임의의 mock 데이터는 사용하지 않음).
 * 아파트 수가 많아지면 서버 사이드 검색(예: GET /api/v1/apartments?keyword=...) API가 추가되는 대로
 * 이 컴포넌트의 필터링 로직만 서버 호출로 교체하면 됩니다.
 */
export function ApartmentSearch({ onSelect }: Props) {
  const [apartments, setApartments] = useState<ApartmentListRes[]>([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);
    getApartments()
      .then((data) => {
        if (cancelled) return;
        setApartments(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiError
            ? "아파트 목록을 불러오지 못했어요. 잠시 후 다시 시도해 주세요."
            : "네트워크 연결을 확인한 뒤 다시 시도해 주세요."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return apartments;
    return apartments.filter(
      (a) => a.name.includes(q) || a.roadAddress.includes(q)
    );
  }, [apartments, query]);

  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold text-fg-2">아파트 검색</label>
      <div className="relative mb-4">
        <SearchIcon
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="아파트 이름 또는 주소로 검색"
          disabled={isLoading || !!error}
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 pl-10 pr-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed"
        />
      </div>

      {isLoading ? (
        <div className="space-y-2.5 pt-1">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[58px] w-full animate-pulse rounded-2xl bg-surface" />
          ))}
        </div>
      ) : error ? (
        <p className="px-2 py-8 text-center text-sm leading-relaxed text-danger">{error}</p>
      ) : (
        <ApartmentSelection apartments={filtered} onSelect={onSelect} />
      )}
    </div>
  );
}
