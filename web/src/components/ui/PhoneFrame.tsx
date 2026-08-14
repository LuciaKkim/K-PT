"use client";

import type { ReactNode } from "react";

/**
 * 앱 화면(로그인 이후 전부)을 감싸는 폰 목업 프레임.
 *
 * - 화면 높이를 꽉 채우지 않고 상·하단에 여백을 두어 "기기 안의 화면"처럼 보이게 합니다.
 * - 스크린 영역에 `transform`이 걸려 있어, 내부의 `position: fixed` 요소(탭바·오버레이)가
 *   뷰포트가 아니라 이 프레임을 기준으로 배치됩니다. (transform이 fixed의 containing block이 됨)
 * - 640px 미만(실제 모바일)에서는 베젤 없이 전체 화면으로 렌더링합니다.
 */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-shell">
        <div className="phone-screen bg-bg">{children}</div>
      </div>
    </div>
  );
}
