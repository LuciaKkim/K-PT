"use client";

import { useState } from "react";
import { useAppState } from "@/lib/state/AppStateContext";
import { Hero1 } from "@/components/ui/hero-1";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { LoginForm } from "@/components/auth/LoginForm";
import { SignupForm } from "@/components/auth/SignupForm";

type Stage = "onboarding" | "login" | "signup";

/**
 * 인증 게이트. 로그인하지 않은 사용자가 앱에 진입하면 이 컴포넌트가 대신 렌더링됩니다.
 * 온보딩(Hero) → 로그인/회원가입 선택 → (필요 시) 회원가입 단계별 플로우 순서로 진행합니다.
 */
export function LoginGate() {
  const { member, isInitializing } = useAppState();
  const [stage, setStage] = useState<Stage>("onboarding");
  const [leaving, setLeaving] = useState(false);

  if (isInitializing) return null;
  if (member && !leaving) return null;

  if (stage === "onboarding") {
    return (
      <div
        className={`fixed inset-0 z-30 overflow-y-auto bg-bg transition-all duration-500 ${
          leaving ? "pointer-events-none scale-105 opacity-0" : ""
        }`}
      >
        <Hero1 className="min-h-screen" onCtaClick={() => setStage("login")} />
      </div>
    );
  }

  return (
    <PhoneFrame>
      <div
        className={`absolute inset-0 flex flex-col overflow-y-auto bg-bg px-6 pb-8 pt-7 transition-all duration-500 ${
          leaving ? "pointer-events-none scale-105 opacity-0" : ""
        }`}
      >
        {stage === "signup" ? (
          <SignupForm onBack={() => setStage("login")} onSignedUp={() => setLeaving(true)} />
        ) : (
          <LoginForm
            onBack={() => setStage("onboarding")}
            onSwitchToSignup={() => setStage("signup")}
            onLoggedIn={() => setLeaving(true)}
          />
        )}
      </div>
    </PhoneFrame>
  );
}
