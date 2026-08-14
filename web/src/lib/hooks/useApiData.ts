"use client";

import { useEffect, useRef, useState } from "react";

interface UseApiDataState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: unknown;
}

interface UseApiDataOptions {
  /**
   * 값이 있으면 해당 주기(ms)로 조용히 재요청합니다.
   * 첫 로딩과 달리 스켈레톤을 다시 띄우지 않고, 실패해도 화면에 있는 데이터를 유지합니다.
   */
  refreshInterval?: number;
}

/**
 * 실제 API 호출 함수를 받아 컴포넌트에서 loading/error 상태를 함께 다룰 수 있게 해주는 공용 훅.
 * `refreshInterval`을 주면 폴링으로 최신 데이터를 계속 받아옵니다(실시간 알림·목록용).
 */
export function useApiData<T>(
  loader: () => Promise<T>,
  deps: unknown[] = [],
  { refreshInterval }: UseApiDataOptions = {}
): UseApiDataState<T> {
  const [state, setState] = useState<UseApiDataState<T>>({
    data: undefined,
    isLoading: true,
    error: undefined,
  });

  // loader는 대개 인라인 화살표 함수라 매 렌더 새로 만들어집니다.
  // 폴링 타이머가 항상 최신 loader를 쓰도록 ref에 담아둡니다.
  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setState((prev) => ({ ...prev, isLoading: true, error: undefined }));

    loaderRef
      .current()
      .then((data) => {
        if (cancelled) return;
        setState({ data, isLoading: false, error: undefined });
      })
      .catch((error) => {
        if (cancelled) return;
        setState({ data: undefined, isLoading: false, error });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    if (!refreshInterval) return;
    let cancelled = false;

    const timer = setInterval(() => {
      // 탭이 백그라운드일 때는 굳이 호출하지 않습니다.
      if (typeof document !== "undefined" && document.hidden) return;
      loaderRef
        .current()
        .then((data) => {
          if (cancelled) return;
          setState({ data, isLoading: false, error: undefined });
        })
        .catch(() => {
          // 폴링 실패는 무시하고 기존 데이터를 유지합니다.
        });
    }, refreshInterval);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshInterval, ...deps]);

  return state;
}
