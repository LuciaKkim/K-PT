import { httpClient, setAccessToken } from "../httpClient";
import type { AuthTokenRes, CreateMemberReq, LoginReq, MemberInfoRes } from "../types";

/** POST /api/v1/auth/signup */
export function signup(payload: CreateMemberReq): Promise<void> {
  return httpClient.post<void>("/api/v1/auth/signup", payload);
}

/** POST /api/v1/auth/login */
export async function login(payload: LoginReq): Promise<AuthTokenRes> {
  const data = await httpClient.post<AuthTokenRes>("/api/v1/auth/login", payload);
  setAccessToken(data.accessToken);
  return data;
}

/** GET /api/v1/auth/me */
export function getMe(): Promise<MemberInfoRes> {
  return httpClient.get<MemberInfoRes>("/api/v1/auth/me");
}

export function logout(): void {
  setAccessToken(null);
}
