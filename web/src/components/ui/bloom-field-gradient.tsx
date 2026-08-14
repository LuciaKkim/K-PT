import { cn } from "@/lib/utils";

/**
 * GradientBackground — 21st.dev Gradient Builder의 "Bloom Field gradient" 레시피
 * (radial 4-layer + soften-blur + grain 패스)를 그대로 유지하고, 색상만 이 앱의
 * 기존 토큰(bg / surface / accent / accent-deep / accent-soft)으로 치환한 버전입니다.
 * 의존성 없이 부모를 가득 채우는 <div> 하나입니다.
 *
 * 원본 레시피(파란색 계열): https://21st.dev/community/gradients/editor?from=fba2fa02-eb4c-49d4-8490-8d69c5c0baf7
 */
export function GradientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        containerType: "size",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          // surface — oklch(0.962 0.009 22)
          backgroundColor: "#F6F1F0",
          backgroundImage:
            "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.500'/></svg>\"), radial-gradient(circle at 67.04% 45.93%, rgba(255, 253, 253, 1) 0%, rgba(255, 253, 253, 0.844) 19.02%, rgba(255, 253, 253, 0.5) 38.05%, rgba(255, 253, 253, 0.156) 57.07%, rgba(255, 253, 253, 0) 76.1%), radial-gradient(circle at 35.47% 65.92%, rgba(176, 107, 116, 0.22) 0%, rgba(176, 107, 116, 0.186) 12.9%, rgba(176, 107, 116, 0.11) 25.8%, rgba(176, 107, 116, 0.034) 38.7%, rgba(176, 107, 116, 0) 51.6%), radial-gradient(circle at 48.33% 20.11%, rgba(124, 60, 72, 0.14) 0%, rgba(124, 60, 72, 0.118) 16.75%, rgba(124, 60, 72, 0.07) 33.5%, rgba(124, 60, 72, 0.022) 50.25%, rgba(124, 60, 72, 0) 67%), radial-gradient(circle at 80.81% 88.03%, rgba(251, 237, 239, 1) 0%, rgba(251, 237, 239, 0.844) 10.28%, rgba(251, 237, 239, 0.5) 20.55%, rgba(251, 237, 239, 0.156) 30.83%, rgba(251, 237, 239, 0) 41.1%)",
          backgroundSize: "120px 120px, auto, auto, auto, auto",
          backgroundBlendMode: "overlay, normal, normal, normal, normal",
        }}
      />
      <svg
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.28,
          mixBlendMode: "overlay",
        }}
      >
        <filter id="grain-fba2fa02">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.8"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-fba2fa02)" />
      </svg>
    </div>
  );
}

/**
 * 화면(패널·오버레이) 배경 레이어. 부모에 stacking context(z-index 지정 또는 isolate)가
 * 있어야 `-z-10`이 부모 안에 갇혀서 콘텐츠 뒤 / 부모 배경 위에 정확히 깔립니다.
 */
export function ScreenGradient({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0 -z-10", className)}>
      <GradientBackground />
    </div>
  );
}
