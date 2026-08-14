"use client";

import { useEffect, useState } from "react";
import { getBuildings, getUnits } from "@/lib/api/domains/apartments";
import { ApiError } from "@/lib/api/httpClient";
import type { ApartmentListRes, BuildingInfoRes, UnitSelectRes } from "@/lib/api/types";

interface Props {
  apartment: ApartmentListRes;
  onSubmit: (buildingId: number, unitId: number) => void;
  isSubmitting: boolean;
  submitError: string | null;
}

/**
 * 회원가입 3단계: 선택한 아파트의 동 → 호수를 순서대로 선택합니다.
 * GET /api/v1/apartments/{apartmentId}/buildings, GET /api/v1/apartments/buildings/{buildingId}/units
 */
export function BuildingUnitForm({ apartment, onSubmit, isSubmitting, submitError }: Props) {
  const [buildings, setBuildings] = useState<BuildingInfoRes[]>([]);
  const [units, setUnits] = useState<UnitSelectRes[]>([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(true);
  const [isLoadingUnits, setIsLoadingUnits] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [buildingId, setBuildingId] = useState<number | "">("");
  const [unitId, setUnitId] = useState<number | "">("");
  const [selectError, setSelectError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setIsLoadingBuildings(true);
    setLoadError(null);
    getBuildings(apartment.apartmentId)
      .then((data) => {
        if (cancelled) return;
        setBuildings(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError
            ? "동 목록을 불러오지 못했어요."
            : "네트워크 연결을 확인한 뒤 다시 시도해 주세요."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingBuildings(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apartment.apartmentId]);

  useEffect(() => {
    if (buildingId === "") {
      setUnits([]);
      setUnitId("");
      return;
    }
    let cancelled = false;
    setIsLoadingUnits(true);
    setUnitId("");
    getUnits(buildingId)
      .then((data) => {
        if (cancelled) return;
        setUnits(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err instanceof ApiError
            ? "호수 목록을 불러오지 못했어요."
            : "네트워크 연결을 확인한 뒤 다시 시도해 주세요."
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingUnits(false);
      });
    return () => {
      cancelled = true;
    };
  }, [buildingId]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (buildingId === "" || unitId === "") {
      setSelectError("동과 호수를 모두 선택해 주세요.");
      return;
    }
    setSelectError(null);
    onSubmit(buildingId, unitId);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4 rounded-2xl bg-surface px-4 py-3.5">
        <span className="block text-xs font-semibold text-muted">선택한 아파트</span>
        <span className="block text-sm font-bold">{apartment.name}</span>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">동</label>
        <select
          value={buildingId}
          onChange={(e) => setBuildingId(e.target.value ? Number(e.target.value) : "")}
          disabled={isLoadingBuildings}
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:text-muted"
        >
          <option value="">{isLoadingBuildings ? "불러오는 중..." : "동 선택"}</option>
          {buildings.map((b) => (
            <option key={b.buildingId} value={b.buildingId}>
              {b.buildingNumber}동
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="mb-1.5 block text-xs font-bold text-fg-2">호수</label>
        <select
          value={unitId}
          onChange={(e) => setUnitId(e.target.value ? Number(e.target.value) : "")}
          disabled={buildingId === "" || isLoadingUnits}
          className="h-[50px] w-full rounded-2xl border border-border bg-surface-2 px-3.5 text-sm outline-none transition focus:border-accent focus:bg-bg focus:ring-2 focus:ring-accent-soft disabled:cursor-not-allowed disabled:text-muted"
        >
          <option value="">{isLoadingUnits ? "불러오는 중..." : "호수 선택"}</option>
          {units.map((u) => (
            <option key={u.unitId} value={u.unitId}>
              {u.unitNumber}호
            </option>
          ))}
        </select>
      </div>

      {loadError && <p className="mb-4 text-xs font-semibold text-danger">{loadError}</p>}
      {selectError && <p className="mb-4 text-xs font-semibold text-danger">{selectError}</p>}
      {submitError && <p className="mb-4 text-xs font-semibold text-danger">{submitError}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-2 flex h-[54px] w-full items-center justify-center rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press disabled:cursor-not-allowed disabled:bg-border disabled:text-muted"
      >
        {isSubmitting ? "가입 중..." : "회원가입 완료"}
      </button>
    </form>
  );
}
