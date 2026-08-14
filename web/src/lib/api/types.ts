/**
 * docs/api-docs.json (Swagger UI로부터 직접 추출한 OpenAPI 3.1 스펙, K-PT Apartment API v1) 기준 타입 정의.
 * 백엔드 응답 스키마가 바뀌면 이 파일만 맞춰주면 됩니다.
 * 모든 필드/enum은 실제 스펙에 정의된 것만 포함합니다.
 */

export interface ApiEnvelope<T> {
  resultCode: string;
  message: string;
  data: T;
}

export interface PageableObject {
  offset: number;
  sort: SortObject;
  unpaged: boolean;
  paged: boolean;
  pageNumber: number;
  pageSize: number;
}

export interface SortObject {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface Page<T> {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  content: T[];
  number: number;
  sort: SortObject;
  numberOfElements: number;
  pageable: PageableObject;
  empty: boolean;
}

// ---------- Auth ----------

export interface CreateMemberReq {
  name: string;
  email: string;
  password: string;
  apartmentId: number;
  buildingId: number;
  unitId: number;
}

export interface LoginReq {
  email: string;
  password: string;
}

export interface AuthTokenRes {
  accessToken: string;
  tokenType: string;
}

export interface MemberInfoRes {
  memberId: number;
  name: string;
  email: string;
  apartmentName: string;
  buildingNumber: string;
  unitNumber: string;
}

// ---------- Apartment ----------

export interface ApartmentListRes {
  apartmentId: number;
  name: string;
  roadAddress: string;
}

export interface BuildingInfoRes {
  buildingId: number;
  buildingNumber: string;
}

export interface UnitSelectRes {
  unitId: number;
  unitNumber: string;
  area: number;
}

export interface ApartmentInfoRes {
  apartmentId: number;
  name: string;
  roadAddress: string;
}

export interface UnitInfoRes {
  apartmentId: number;
  apartmentName: string;
  buildingNumber: string;
  unitNumber: string;
  area: number;
}

// ---------- Notice ----------

export interface NoticeListRes {
  noticeId: number;
  title: string;
  writer: string;
  createdAt: string;
  isImportant: boolean;
  isEmergency: boolean;
}

export interface NoticeInfoRes {
  noticeId: number;
  title: string;
  content: string;
  writer: string;
  createdAt: string;
  updatedAt: string;
}

// ---------- Complaint ----------

export type ComplaintCategory = "FACILITY" | "PARKING" | "NOISE" | "CLEANING" | "OTHER";

export type ComplaintStatus = "RECEIVED" | "CHECKING" | "PROCESSING" | "COMPLETED";

export interface CreateComplaintReq {
  category: ComplaintCategory;
  title: string;
  location: string;
  content: string;
}

export interface ComplaintListRes {
  complaintId: number;
  category: ComplaintCategory;
  title: string;
  status: ComplaintStatus;
  createdAt: string;
}

export interface ComplaintInfoRes {
  complaintId: number;
  writer: string;
  category: ComplaintCategory;
  title: string;
  content: string;
  location: string;
  status: ComplaintStatus;
  resolution?: string;
  createdAt: string;
  completedAt?: string;
}

// ---------- 자료실(Materials) UI ----------
// ⚠️ 현재 Backend API(docs/api-docs.json)에는 자료실 조회 엔드포인트가 없습니다.
// 화면 구조(UI/UX)만 유지하기 위해 형태(shape)만 남겨두었고, 실제 데이터를 채우는 곳은 없습니다.

export type DocumentCategory = "규약" | "주차" | "생활수칙" | "회계" | "서식";

export interface ApartmentDocument {
  id: string;
  title: string;
  shortTitle?: string;
  category: DocumentCategory;
  version: string;
  updatedAt: string;
  fileType: "PDF" | "HWP";
  fileSize: string;
  pages: number;
  author: string;
  summary: string;
  coverImage: string;
}

// ---------- RAG ----------

export interface RagQueryReq {
  question: string;
  sessionId?: string;
}

export interface RagQueryRes {
  answer: string;
  references: string[];
  sessionId?: string;
}
