# 관리규정 RAG API 명세서 (실제 배포 기준)

> 이 문서는 `기존 API 명세서.pdf`의 RAG 파트(14~16절)를 대체하는 **실제 배포된 Lambda 기준** 최종 명세입니다.
> 해커톤 MVP 특성상 API Gateway 없이 **Lambda Function URL을 직접** 호출합니다 (JWT 인증 없음).

## 1. 엔드포인트

```
POST https://mqxiojwj64lolksmvkk7w6ukqe0inpdl.lambda-url.ap-northeast-2.on.aws/
Content-Type: application/json
```

- 인증: 없음 (Auth type: NONE). 지금은 아무나 호출 가능한 상태입니다.
- CORS: 현재 `Allow-Origin: *`로 열려 있음. 배포 도메인이 정해지면 좁힐 예정입니다.
- 기존 명세서의 `/rag/v1/chat`, JWT, `resultCode/msg/data` 공통 응답 포맷은 **이 엔드포인트에는 적용되지 않습니다.** 아래 실제 포맷을 기준으로 연동해주세요.

## 2. 요청 (Request)

```json
{
  "question": "주차 등록은 어떻게 해?",
  "sessionId": "이전 응답에서 받은 sessionId (선택, 멀티턴 대화 시 전달)"
}
```

| 필드 | 필수 | 설명 |
|---|---|---|
| `question` | ✅ | 사용자 질문 (자연어) |
| `sessionId` | ❌ | 후속 질문 시, 직전 응답의 `sessionId`를 그대로 넣으면 대화 맥락이 이어짐 (다중 아파트 비교 모드에서는 미지원) |

질문에 아래 아파트명이 포함되면 자동으로 인식됩니다 (현재는 하드코딩, 로그인 연동 전까지 임시):

| 이름 | apartment_id |
|---|---|
| 잠실엘스아파트 / 잠실엘스 (미지정 시 기본값) | APT001 |
| 래미안대치팰리스 / 래미안 | APT002 |
| 헬리오시티 | APT003 |

## 3. 응답 (Response) — 공통 헤더

```
Content-Type: application/json; charset=utf-8
Access-Control-Allow-Origin: *
```

응답 바디는 **엔벨로프 없이** 아래 필드를 최상위로 바로 반환합니다 (`resultCode`/`data` 래핑 없음).

### 3-1. 성공 — 단일 아파트 모드 (`mode: "single"`)

질문에 아파트가 없거나(내 아파트 기본 검색) 아파트 1곳만 지정된 경우.

```json
{
  "answer": "주차 등록 절차는 다음과 같습니다...",
  "sources": [
    {
      "n": 1,
      "label": "잠실엘스아파트 주차관리규정",
      "apartmentId": "APT001",
      "apartmentName": "잠실엘스아파트",
      "documentType": "주차관리규정",
      "category": "주차관리",
      "isPublic": true,
      "uri": "s3://hr-kb-docs-k-pt/rules/주차관리규정.pdf",
      "text": "제5조 (차량의 신고 및 등록) ..."
    }
  ],
  "segments": [
    { "text": "답변 문장 일부", "sources": [1, 2] }
  ],
  "sessionId": "7d065ed2-...",
  "matchedApartmentIds": ["APT001"],
  "mode": "single",
  "elapsedMs": 9566
}
```

- `segments`: 답변을 문장 단위로 나눠 각 문장이 몇 번(`sources[n]`) 출처에서 나왔는지 매핑. 프론트에서 답변 옆에 각주(`[1]`, `[2]`)를 붙이는 데 사용.
- 내 아파트(APT001) 질문일 때는 비공개 문서(계약서 등, `isPublic: false`)도 검색 대상에 포함됩니다.

### 3-2. 성공 — 다중 아파트 비교 모드 (`mode: "compare"`)

질문에 아파트 2곳 이상이 언급된 경우 (예: "잠실엘스아파트와 헬리오시티의 주차 규정 차이를 알려줘").

```json
{
  "answer": "## 잠실엘스아파트 vs 헬리오시티 주차 규정 비교\n\n| 구분 | ... |",
  "sources": [
    { "n": 1, "label": "잠실엘스아파트 주차관리규정", "apartmentId": "APT001", "apartmentName": "잠실엘스아파트", "documentType": "주차관리규정", "uri": "...", "text": "..." },
    { "n": 5, "label": "헬리오시티 주차관리규정", "apartmentId": "APT003", "apartmentName": "헬리오시티", "documentType": "주차관리규정", "uri": "...", "text": "..." }
  ],
  "segments": [],
  "matchedApartmentIds": ["APT001", "APT003"],
  "mode": "compare",
  "elapsedMs": 7397
}
```

- `segments`가 항상 빈 배열입니다(비교 모드는 문장 단위 각주를 만들지 않음). 프론트는 `answer`를 마크다운으로 렌더링하고, `sources`는 하단에 "참고 문서" 목록으로만 보여주면 됩니다.
- `sources`에 다른 아파트끼리 항상 `isPublic: true`인 문서만 섞여 나옵니다 (비공개 계약서 등은 비교 모드에서 절대 노출되지 않음 — 보안 검증 완료).
- `sessionId`가 없습니다 (비교 모드는 멀티턴 미지원).

### 3-3. 실패

```json
{ "error": "question 이 비어 있습니다." }
```

| statusCode | 상황 |
|---|---|
| 204 | OPTIONS 사전 요청 (CORS preflight, 브라우저가 자동 처리하므로 프론트 코드에서 신경 안 써도 됨) |
| 400 | `question`이 비어 있음 |
| 200 | 그 외 모든 정상 처리 (Bedrock 오류 등 예외 상황은 아직 세분화된 에러 코드가 없음 — 필요 시 추가 가능) |

## 4. 프론트 연동 예시 (fetch)

```javascript
const RAG_ENDPOINT = "https://mqxiojwj64lolksmvkk7w6ukqe0inpdl.lambda-url.ap-northeast-2.on.aws/";

async function askRag(question, sessionId) {
  const res = await fetch(RAG_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sessionId ? { question, sessionId } : { question }),
  });
  if (!res.ok) throw new Error("RAG 요청 실패: " + res.status);
  return res.json(); // { answer, sources, segments, sessionId, matchedApartmentIds, mode, elapsedMs }
}
```

## 5. 알려진 제약 (MVP 한계)

- JWT/로그인 연동이 없어 "내 아파트"가 `APT001`(잠실엘스)로 하드코딩되어 있습니다. 로그인 붙이면 `DEFAULT_APARTMENT_ID`를 사용자의 실제 apartment_id로 바꿔야 합니다.
- 다중 아파트 비교 모드는 멀티턴(세션 유지)을 지원하지 않습니다.
- API Gateway 없이 Function URL을 직접 호출하므로, 기존 명세서의 Base Path(`/rag/v1`) 규칙이 적용되지 않습니다. 나중에 API Gateway를 앞에 두게 되면 이 문서의 엔드포인트 URL만 교체하면 됩니다 (요청/응답 포맷은 그대로 유지 가능).
