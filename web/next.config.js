/**
 * 백엔드(K-PT Apartment API)는 http 로만 서비스되므로, https 로 배포되는
 * 환경(Vercel 등)에서 브라우저가 직접 호출하면 mixed content 로 차단됩니다.
 * 그래서 /api/v1/* 요청을 Next 서버가 받아서 백엔드로 중계합니다.
 * 브라우저 ↔ Next 는 https, Next ↔ 백엔드는 http(서버 간 통신)이므로 차단되지 않습니다.
 *
 * 실제 백엔드 주소는 공개 저장소에 커밋하지 않습니다.
 * 로컬은 web/.env.local, 배포는 호스팅 환경변수에 API_PROXY_TARGET 을 설정하세요.
 */
const API_PROXY_TARGET = (
  process.env.API_PROXY_TARGET || "http://localhost:8080"
).replace(/\/+$/, "");

if (!process.env.API_PROXY_TARGET) {
  console.warn(
    "[next.config] API_PROXY_TARGET 이 설정되지 않아 http://localhost:8080 으로 중계합니다. " +
      "web/.env.local 에 실제 백엔드 주소를 지정하세요."
  );
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: `${API_PROXY_TARGET}/api/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
