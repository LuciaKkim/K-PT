"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/httpClient";
import { useAppState } from "@/lib/state/AppStateContext";
import { Button } from "@/components/ui/button";
import {
  AppleIcon,
  ArrowLeftIcon,
  KakaoIcon,
  LogoMarkIcon,
  NaverIcon,
  PhoneIcon,
} from "@/components/icons";

/** 이메일 형식 검증 (백엔드 500/기술 에러 대신 클라이언트에서 먼저 걸러냄) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  onBack: () => void;
  onSwitchToSignup: () => void;
  onLoggedIn: () => void;
}

/**
 * 이메일 + 비밀번호 로그인 폼.
 * POST /api/v1/auth/login (email/password) → accessToken 저장 → GET /api/v1/auth/me.
 * 이름/아파트/동/호수는 절대 요구하지 않습니다.
 */
export function LoginForm({ onBack, onSwitchToSignup, onLoggedIn }: Props) {
  const { login } = useAppState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmedEmail = email.trim();
    let hasError = false;
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      hasError = true;
    } else {
      setEmailError(null);
    }
    if (!password) {
      setPasswordError("비밀번호를 입력해 주세요.");
      hasError = true;
    } else {
      setPasswordError(null);
    }
    if (hasError) return;

    setFormError(null);
    setIsSubmitting(true);
    try {
      await login({ email: trimmedEmail, password });
      onLoggedIn();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setFormError("이메일 또는 비밀번호가 올바르지 않아요.");
      } else if (err instanceof ApiError) {
        setFormError("로그인에 실패했어요. 잠시 후 다시 시도해 주세요.");
      } else {
        setFormError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div className="flex flex-1 flex-col justify-center pb-3.5">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-deep text-white">
              <LogoMarkIcon size={20} />
            </span>
            <span className="font-brand text-lg font-bold">아파톡</span>
          </div>
          <button
            onClick={onBack}
            aria-label="뒤로"
            className="flex h-9 w-9 items-center justify-center rounded-xl text-fg-2 transition hover:bg-surface"
          >
            <ArrowLeftIcon size={19} />
          </button>
        </div>
        <h2 className="font-display text-[26px] font-bold leading-snug">
          우리 건물 규정,
          <br />
          물어보면 답이 와요
        </h2>
        <p className="mt-3 max-w-[24ch] text-sm leading-relaxed text-fg-2">
          공지 확인부터 민원 접수까지 3초 만에 시작하세요.
        </p>
      </div>

      <div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
              autoComplete="email"
              aria-invalid={!!emailError}
              className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                emailError ? "border-danger ring-2 ring-danger/20" : "border-border focus:border-accent"
              }`}
            />
            {emailError && (
              <p className="mt-1.5 text-xs font-semibold text-danger">{emailError}</p>
            )}
          </div>
          <div className="mb-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="current-password"
              aria-invalid={!!passwordError}
              className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                passwordError ? "border-danger ring-2 ring-danger/20" : "border-border focus:border-accent"
              }`}
            />
            {passwordError && (
              <p className="mt-1.5 text-xs font-semibold text-danger">{passwordError}</p>
            )}
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="w-full font-brand text-[15.5px] disabled:bg-border disabled:text-muted"
          >
            {isSubmitting ? "로그인 중..." : "이메일로 로그인"}
          </Button>
        </form>

        {formError && (
          <p className="mt-3 text-center text-xs font-semibold text-danger">{formError}</p>
        )}

        <button
          onClick={onSwitchToSignup}
          className="mt-3.5 w-full text-center text-xs font-semibold text-fg-2 transition hover:text-fg"
        >
          아직 계정이 없으신가요? <b className="text-accent-deep">회원가입</b>
        </button>

        <div className="my-5 flex items-center gap-3 text-[11.5px] font-semibold tracking-wide text-muted">
          <span className="h-px flex-1 bg-border" />
          간편 로그인
          <span className="h-px flex-1 bg-border" />
        </div>

        <div className="flex justify-center gap-4">
          <button
            disabled
            aria-label="카카오로 로그인 (준비 중)"
            title="카카오"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FEE500] text-[#171207] shadow-sm opacity-50 transition disabled:cursor-not-allowed"
          >
            <KakaoIcon size={26} />
          </button>
          <button
            disabled
            aria-label="네이버로 로그인 (준비 중)"
            title="네이버"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[#03C75A] text-white shadow-sm opacity-50 transition disabled:cursor-not-allowed"
          >
            <NaverIcon size={19} />
          </button>
          <button
            disabled
            aria-label="Apple로 로그인 (준비 중)"
            title="Apple"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.20_0.008_20)] text-white shadow-sm opacity-50 transition disabled:cursor-not-allowed"
          >
            <AppleIcon size={22} />
          </button>
          <button
            disabled
            aria-label="휴대폰 번호로 시작하기 (준비 중)"
            title="휴대폰"
            className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-fg-2 shadow-sm opacity-50 transition disabled:cursor-not-allowed"
          >
            <PhoneIcon size={20} />
          </button>
        </div>

        <p className="mt-6 text-center text-[11.5px] leading-relaxed text-muted">
          계속하면 <b className="font-semibold text-fg-2">이용약관</b>과{" "}
          <b className="font-semibold text-fg-2">개인정보 처리방침</b>에 동의하게 됩니다.
        </p>
      </div>
    </>
  );
}
