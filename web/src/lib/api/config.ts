/**
 * K-PT Apartment API 서버 주소.
 * docs/api-docs.json (Swagger) 기준. 배포 환경에 맞게 .env.local 의
 * NEXT_PUBLIC_API_BASE_URL 만 바꾸면 됩니다.
 */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://54.116.133.106";
