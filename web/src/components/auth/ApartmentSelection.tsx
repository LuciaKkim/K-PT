"use client";

import type { ApartmentListRes } from "@/lib/api/types";
import { BuildingIcon, ChevronRightIcon } from "@/components/icons";

interface Props {
  apartments: ApartmentListRes[];
  onSelect: (apartment: ApartmentListRes) => void;
}

/**
 * 회원가입 2단계 결과 목록: 검색된 아파트 중 하나를 선택합니다.
 */
export function ApartmentSelection({ apartments, onSelect }: Props) {
  if (apartments.length === 0) {
    return (
      <p className="px-2 py-8 text-center text-sm leading-relaxed text-muted">
        검색 결과가 없어요. 다른 이름이나 주소로 검색해 보세요.
      </p>
    );
  }

  return (
    <ul className="max-h-[360px] space-y-2 overflow-y-auto pr-0.5">
      {apartments.map((apartment) => (
        <li key={apartment.apartmentId}>
          <button
            type="button"
            onClick={() => onSelect(apartment)}
            className="flex w-full items-center gap-3 rounded-2xl border border-border bg-surface-2 px-3.5 py-3.5 text-left transition hover:border-accent hover:bg-bg"
          >
            <span className="flex h-10 w-10 flex-none items-center justify-center rounded-xl bg-surface text-fg-2">
              <BuildingIcon size={19} />
            </span>
            <span className="flex-1">
              <span className="block text-sm font-semibold">{apartment.name}</span>
              <span className="block text-xs text-muted">{apartment.roadAddress}</span>
            </span>
            <ChevronRightIcon size={17} className="flex-none text-muted" />
          </button>
        </li>
      ))}
    </ul>
  );
}
