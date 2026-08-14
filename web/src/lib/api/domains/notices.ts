import { httpClient } from "../httpClient";
import type { NoticeInfoRes, NoticeListRes } from "../types";

/** GET /api/v1/notices */
export function getNotices(): Promise<NoticeListRes[]> {
  return httpClient.get<NoticeListRes[]>("/api/v1/notices");
}

/** GET /api/v1/notices/{noticeId} */
export function getNoticeDetail(noticeId: number): Promise<NoticeInfoRes> {
  return httpClient.get<NoticeInfoRes>(`/api/v1/notices/${noticeId}`);
}
