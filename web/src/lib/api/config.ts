/**
 * K-PT Apartment API 서버 주소. docs/api-docs.json (Swagger) 기준.
 *
 * 기본값은 빈 문자열 = same-origin 입니다. 이 경우 요청은 Next 서버의
 * /api/v1/* rewrite(next.config.js)를 통해 http 백엔드로 중계됩니다.
 * https 로 배포되는 환경(Vercel)에서 mixed content 차단을 피하려면 이 값을 비워두세요.
 *
 * 백엔드를 브라우저에서 직접 호출하고 싶을 때만(예: 로컬에서 http 로 띄운 경우)
 * .env.local 에 NEXT_PUBLIC_API_BASE_URL 을 지정하세요.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() ?? "";
