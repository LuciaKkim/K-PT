import { httpClient } from "../httpClient";
import type { ComplaintInfoRes, ComplaintListRes, CreateComplaintReq, Page } from "../types";

/** POST /api/v1/complaints */
export function createComplaint(payload: CreateComplaintReq): Promise<void> {
  return httpClient.post<void>("/api/v1/complaints", payload);
}

/** GET /api/v1/complaints/me */
export function getMyComplaints(page = 0, size = 50): Promise<Page<ComplaintListRes>> {
  return httpClient.get<Page<ComplaintListRes>>("/api/v1/complaints/me", {
    params: { page, size },
  });
}

/** GET /api/v1/complaints/{complaintId} */
export function getComplaintDetail(complaintId: number): Promise<ComplaintInfoRes> {
  return httpClient.get<ComplaintInfoRes>(`/api/v1/complaints/${complaintId}`);
}
