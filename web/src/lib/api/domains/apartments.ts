import { httpClient } from "../httpClient";
import type { ApartmentInfoRes, ApartmentListRes, BuildingInfoRes, UnitInfoRes, UnitSelectRes } from "../types";

/** GET /api/v1/apartments */
export function getApartments(): Promise<ApartmentListRes[]> {
  return httpClient.get<ApartmentListRes[]>("/api/v1/apartments");
}

/** GET /api/v1/apartments/{apartmentId}/buildings */
export function getBuildings(apartmentId: number): Promise<BuildingInfoRes[]> {
  return httpClient.get<BuildingInfoRes[]>(`/api/v1/apartments/${apartmentId}/buildings`);
}

/** GET /api/v1/apartments/buildings/{buildingId}/units */
export function getUnits(buildingId: number): Promise<UnitSelectRes[]> {
  return httpClient.get<UnitSelectRes[]>(`/api/v1/apartments/buildings/${buildingId}/units`);
}

/** GET /api/v1/apartments/me */
export function getMyApartment(): Promise<ApartmentInfoRes> {
  return httpClient.get<ApartmentInfoRes>("/api/v1/apartments/me");
}

/** GET /api/v1/apartments/me/unit */
export function getMyUnit(): Promise<UnitInfoRes> {
  return httpClient.get<UnitInfoRes>("/api/v1/apartments/me/unit");
}
