# 자료실 카탈로그 표지 이미지

이 폴더에 아래 파일명 그대로 이미지를 넣으면 코드를 건드리지 않고 자료실 카탈로그(코버플로우)에
자동으로 반영됩니다. 이미지가 없는 동안은 카탈로그에 카테고리 아이콘이 있는 플레이스홀더 카드가 표시됩니다.

권장 사이즈: 3:4 세로 비율 (예: 480×640px), PNG 또는 JPG.

| 문서 ID | 문서명 | 파일명 |
|---|---|---|
| D-1 | 골드아파트 관리규약 | `material-gyuyak-management-rules.png` |
| D-2 | 주차 관리 규정 | `material-jucha-parking-rules.png` |
| D-3 | 층간소음 관리 규정 | `material-saenghwal-noise-rules.png` |
| D-4 | 커뮤니티 시설 이용 안내 | `material-saenghwal-community-guide.png` |
| D-5 | 2026년 7월 관리비 부과 내역 | `material-hoegye-fee-statement.png` |
| D-6 | 장기수선충당금 사용계획서 | `material-hoegye-reserve-fund-plan.png` |
| D-7 | 방문차량 등록 신청서 | `material-seosik-visitor-form.png` |
| D-8 | 세대 내부 공사 신고서 | `material-seosik-renovation-form.png` |

파일 경로는 `src/lib/api/mock/documents.mock.ts` 의 각 문서 `coverImage` 필드에 매핑돼 있습니다.
