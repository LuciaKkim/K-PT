"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as loginApi, logout as logoutApi, signup as signupApi } from "@/lib/api/domains/auth";
import { getAccessToken } from "@/lib/api/httpClient";
import type { CreateMemberReq, LoginReq, MemberInfoRes } from "@/lib/api/types";

interface AppState {
  member: MemberInfoRes | null;
  /** 저장된 토큰으로 세션을 복구하는 중인지 여부 (앱 최초 로드 시) */
  isInitializing: boolean;
  login: (payload: LoginReq) => Promise<void>;
  signup: (payload: CreateMemberReq) => Promise<void>;
  logout: () => void;
}

const AppStateContext = createContext<AppState | null>(null);

/**
 * 시연용 아파트명 표시 override.
 * 백엔드 계정에 등록된 아파트명이 시연에 쓸 이름과 다를 때 `.env.local`의
 * `NEXT_PUBLIC_DEMO_APARTMENT_NAME`으로 화면 표시만 바꿉니다. (값이 없으면 서버 값 그대로)
 */
const DEMO_APARTMENT_NAME = process.env.NEXT_PUBLIC_DEMO_APARTMENT_NAME?.trim();

function withDisplayOverrides(me: MemberInfoRes): MemberInfoRes {
  if (!DEMO_APARTMENT_NAME) return me;
  return { ...me, apartmentName: DEMO_APARTMENT_NAME };
}

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [member, setMember] = useState<MemberInfoRes | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!getAccessToken()) {
      setIsInitializing(false);
      return;
    }
    getMe()
      .then((data) => {
        if (!cancelled) setMember(withDisplayOverrides(data));
      })
      .catch(() => {
        if (!cancelled) logoutApi();
      })
      .finally(() => {
        if (!cancelled) setIsInitializing(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (payload: LoginReq) => {
    await loginApi(payload);
    const me = await getMe();
    setMember(withDisplayOverrides(me));
  }, []);

  const signup = useCallback(async (payload: CreateMemberReq) => {
    await signupApi(payload);
  }, []);

  const logout = useCallback(() => {
    logoutApi();
    setMember(null);
  }, []);

  const value = useMemo(
    () => ({ member, isInitializing, login, signup, logout }),
    [member, isInitializing, login, signup, logout]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState는 AppStateProvider 내부에서만 사용할 수 있습니다.");
  return ctx;
}
