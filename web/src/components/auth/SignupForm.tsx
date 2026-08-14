"use client";

import { useState } from "react";
import { ApiError } from "@/lib/api/httpClient";
import { useAppState } from "@/lib/state/AppStateContext";
import type { ApartmentListRes } from "@/lib/api/types";
import { ArrowLeftIcon, CheckIcon } from "@/components/icons";
import { ApartmentSearch } from "./ApartmentSearch";
import { BuildingUnitForm } from "./BuildingUnitForm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  onBack: () => void;
  onSignedUp: () => void;
}

type Step = 1 | 2 | 3 | "done";

/**
 * 회원가입 플로우 (3단계):
 * 1) 이메일/이름/비밀번호 입력 (클라이언트 검증, 비밀번호는 메모리 state에만 보관)
 * 2) 아파트 검색 후 선택
 * 3) 동/호수 선택 → POST /api/v1/auth/signup { email, name, password, apartmentId, buildingId, unitId }
 *    성공 후 바로 로그인까지 이어서 진행합니다.
 */
export function SignupForm({ onBack, onSignedUp }: Props) {
  const { signup, login } = useAppState();
  const [step, setStep] = useState<Step>(1);

  // Step 1
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Step 2
  const [apartment, setApartment] = useState<ApartmentListRes | null>(null);

  // Step 3
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    let hasError = false;

    if (!name.trim()) {
      setNameError("이름을 입력해 주세요.");
      hasError = true;
    } else {
      setNameError(null);
    }

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !EMAIL_RE.test(trimmedEmail)) {
      setEmailError("올바른 이메일 형식을 입력해 주세요.");
      hasError = true;
    } else {
      setEmailError(null);
    }

    if (password.length < 8 || password.length > 20) {
      setPasswordError("비밀번호는 8~20자로 입력해 주세요.");
      hasError = true;
    } else {
      setPasswordError(null);
    }

    if (hasError) return;
    setStep(2);
  }

  function handleApartmentSelect(selected: ApartmentListRes) {
    setApartment(selected);
    setStep(3);
  }

  async function handleFinalSubmit(buildingId: number, unitId: number) {
    if (!apartment || isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await signup({
        name: name.trim(),
        email: email.trim(),
        password,
        apartmentId: apartment.apartmentId,
        buildingId,
        unitId,
      });
      await login({ email: email.trim(), password });
      setStep("done");
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setSubmitError("이미 가입된 이메일이에요. 로그인을 이용해 주세요.");
      } else if (err instanceof ApiError && err.status === 400) {
        setSubmitError("선택한 아파트/동/호수 정보를 확인해 주세요.");
      } else if (err instanceof ApiError) {
        setSubmitError("회원가입에 실패했어요. 잠시 후 다시 시도해 주세요.");
      } else {
        setSubmitError("네트워크 연결을 확인한 뒤 다시 시도해 주세요.");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  if (step === "done") {
    return (
      <div className="flex flex-1 flex-col items-center justify-center pb-8 text-center">
        <span className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent-deep">
          <CheckIcon size={30} />
        </span>
        <h3 className="text-xl font-bold">회원가입이 완료됐어요</h3>
        <p className="mx-auto mt-2 max-w-[26ch] text-sm text-fg-2">바로 이용을 시작할 수 있어요.</p>
        <button
          onClick={onSignedUp}
          className="mt-8 h-[54px] w-full max-w-[280px] rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press"
        >
          시작하기
        </button>
      </div>
    );
  }

  function handleHeaderBack() {
    if (step === 1) onBack();
    else if (step === 2) setStep(1);
    else setStep(2);
  }

  return (
    <div className="flex-1 overflow-y-auto pb-8">
      <div className="mb-5 flex items-center gap-2.5">
        <button
          onClick={handleHeaderBack}
          aria-label="뒤로"
          className="flex h-10 w-10 flex-none items-center justify-center rounded-xl text-fg transition hover:bg-surface"
        >
          <ArrowLeftIcon />
        </button>
        <p className="font-display text-base font-bold">회원가입</p>
        <span className="ml-auto text-xs font-bold text-muted">{step} / 3</span>
      </div>

      {step === 1 && (
        <form onSubmit={handleStep1Submit}>
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold text-fg-2">이름</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              aria-invalid={!!nameError}
              className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                nameError ? "border-danger ring-2 ring-danger/20" : "border-border focus:border-accent"
              }`}
            />
            {nameError && <p className="mt-1.5 text-xs font-semibold text-danger">{nameError}</p>}
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold text-fg-2">이메일</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!emailError}
              className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                emailError ? "border-danger ring-2 ring-danger/20" : "border-border focus:border-accent"
              }`}
            />
            {emailError && <p className="mt-1.5 text-xs font-semibold text-danger">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-bold text-fg-2">비밀번호 (8~20자)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              maxLength={20}
              aria-invalid={!!passwordError}
              className={`h-[50px] w-full rounded-2xl border bg-surface-2 px-3.5 text-sm outline-none transition focus:bg-bg focus:ring-2 focus:ring-accent-soft ${
                passwordError ? "border-danger ring-2 ring-danger/20" : "border-border focus:border-accent"
              }`}
            />
            {passwordError && (
              <p className="mt-1.5 text-xs font-semibold text-danger">{passwordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="mt-2 flex h-[54px] w-full items-center justify-center rounded-2xl bg-accent-deep font-brand font-bold text-white transition hover:bg-accent-press"
          >
            다음
          </button>
        </form>
      )}

      {step === 2 && <ApartmentSearch onSelect={handleApartmentSelect} />}

      {step === 3 && apartment && (
        <BuildingUnitForm
          apartment={apartment}
          onSubmit={handleFinalSubmit}
          isSubmitting={isSubmitting}
          submitError={submitError}
        />
      )}
    </div>
  );
}
