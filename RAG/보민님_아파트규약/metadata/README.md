# 잠실엘스아파트 RAG — Bedrock Knowledge Base S3 Sidecar Metadata

This folder contains **per-document sidecar metadata files** for Amazon Bedrock
Knowledge Bases (S3 data source + S3 Vectors), following the required AWS
naming convention:

```
<original_filename>.metadata.json
```

Each sidecar file must be uploaded to the **same S3 key prefix** as its
corresponding source PDF (same folder, same base filename). Do **not** upload
a single combined `metadata.json` — Bedrock only recognizes one sidecar file
per source document, named exactly `<source file name>.metadata.json`.

## Folder structure

All 8 documents below live under the `잠실엘스아파트/` prefix in the bucket,
matching the same per-apartment folder pattern used by the other apartments
(`래미안대치팰리스/`, `헬리오시티/`). Nothing at the bucket root anymore —
each apartment gets its own folder containing its source files and their
`.metadata.json` sidecars side by side.

## File mapping

| Sidecar metadata file | Corresponding source PDF | S3 prefix |
|---|---|---|
| `관리규약.pdf.metadata.json` | `관리규약.pdf` | `잠실엘스아파트/` |
| `주차관리규정.pdf.metadata.json` | `주차관리규정.pdf` | `잠실엘스아파트/` |
| `(주)이알케미칼_어린이놀이시설교체공사계약서_2024.7.11.pdf.metadata.json` | `(주)이알케미칼_어린이놀이시설교체공사계약서_2024.7.11.pdf` | `잠실엘스아파트/` |
| `(주)조인존_정자보수계약서_2023.9.25.pdf.metadata.json` | `(주)조인존_정자보수계약서_2023.9.25.pdf` | `잠실엘스아파트/` |
| `(주)에스피리사이클링_재활용품매각계약서_2024.5.7.pdf.metadata.json` | `(주)에스피리사이클링_재활용품매각계약서_2024.5.7.pdf` | `잠실엘스아파트/` |
| `(주)동현이앤아이_어르신쉼터개보수계약서_2024.6.25.pdf.metadata.json` | `(주)동현이앤아이_어르신쉼터개보수계약서_2024.6.25.pdf` | `잠실엘스아파트/` |
| `(주)비젼테크솔루션_경관물보수시공계약서_2023.8.8.pdf.metadata.json` | `(주)비젼테크솔루션_경관물보수시공계약서_2023.8.8.pdf` | `잠실엘스아파트/` |
| `sk쉴더스_통합경비계약서_2024.8.29.pdf.metadata.json` | `sk쉴더스_통합경비계약서_2024.8.29.pdf` | `잠실엘스아파트/` |

> Note: filenames use the **exact original PDF filenames** (including the
> `(주)` company prefixes and contract dates), because Bedrock requires the
> sidecar name to be `<original_filename>.metadata.json`. This differs slightly
> from the shortened example names in the original spec, but is required for
> the S3 data source connector to correctly associate each sidecar with its
> source object.

## Upload instructions (S3)

For each row above, place both files at the **same prefix**, e.g.:

```
s3://hr-kb-docs-k-pt/잠실엘스아파트/관리규약.pdf
s3://hr-kb-docs-k-pt/잠실엘스아파트/관리규약.pdf.metadata.json

s3://hr-kb-docs-k-pt/잠실엘스아파트/(주)이알케미칼_어린이놀이시설교체공사계약서_2024.7.11.pdf
s3://hr-kb-docs-k-pt/잠실엘스아파트/(주)이알케미칼_어린이놀이시설교체공사계약서_2024.7.11.pdf.metadata.json
```

Then sync/re-crawl the Bedrock Knowledge Base S3 data source so it picks up
the moved files and sidecars (each file must not exceed the 10 KB Bedrock
limit — all files here are well under 2.3 KB). If these files previously
lived at the bucket root, re-syncing also clears out the now-deleted root
keys from the index so no stale/duplicate entries remain.

## Metadata schema

Each file follows the Bedrock Knowledge Bases S3 metadata format:

```json
{
  "metadataAttributes": {
    "<attribute_name>": {
      "value": { "type": "STRING" | "NUMBER" | "BOOLEAN" | "STRING_LIST", "stringValue" | "numberValue": ... },
      "includeForEmbedding": true | false
    }
  }
}
```

- `includeForEmbedding: true` is used for stable, semantically useful text
  fields (`document_type`, `category`, `property`, `organization`,
  `contractor`, `contract_name`) so that queries mentioning those terms boost
  retrieval relevance.
- `includeForEmbedding: false` is used for filter-only fields that are not
  useful to bake into the embedding text (`source_type`, `language`, and all
  dates/amounts/counts), since these are precise, highly variable values
  better used for metadata filtering than semantic matching.

## Common fields (all documents)

- `property`: `"잠실엘스아파트"`
- `organization`: `"잠실엘스아파트"`
- `language`: `"ko"`

## Per-document fields and source verification

All factual fields (dates, amounts, contractor names, contract periods,
household counts) were extracted directly from the source PDFs. The five
contract PDFs and the SK Shieldus contract are **scanned/image-based PDFs**
with no embedded text layer; they were OCR'd (Tesseract, Korean+English,
300–600 DPI) and cross-checked against rendered page images before any value
was recorded. No field was invented — where a value could not be reliably
read from the source (e.g. illegible handwritten dates), it was omitted.

1. **관리규약.pdf** — 관리규약 (아파트 관리). `document_date: 2023-11`
   (6차 개정, 일자 표기 없음 — 표지에 "2023. 11." 로만 표기됨).

2. **주차관리규정.pdf** — 주차관리규정 (주차관리). `document_date: 2024-01-01`
   (3차 개정일), `effective_date: 2024-03-01` (부칙 제2조 시행일).

3. **(주)이알케미칼_어린이놀이시설교체공사계약서_2024.7.11.pdf** — 공사계약서
   (시설공사). 계약명 "2024년도 잠실엘스아파트 어린이놀이시설 교체공사",
   계약일 2024-07-11, 착공 2024-08-19, 준공 2024-09-18, 계약금액
   315,700,000원(부가세 포함), 하자보수 보증기간 3년.

4. **(주)조인존_정자보수계약서_2023.9.25.pdf** — 공사계약서 (시설공사).
   계약명 "정자 보수공사", 계약일 2023-09-04, 착공 2023-09-18, 준공예정
   2023-09-27, 계약금액 9,108,000원(부가세 포함), 하자담보기간 24개월.

5. **(주)에스피리사이클링_재활용품매각계약서_2024.5.7.pdf** — 매각수거계약서
   (재활용품). 계약명 "재활용품 매각(수거) 계약", 계약기간 2024-06-01 ~
   2025-05-31(1년), 총 계약금액 54,508,800원(부가세 별도, 5,678세대 ×
   800원/월 기준), 세대수 5,678.

6. **(주)동현이앤아이_어르신쉼터개보수계약서_2024.6.25.pdf** — 공사계약서
   (시설보수). 계약명 "잠실엘스아파트 어르신쉼터 경로당 시설 개보수공사",
   계약일 2024-06-25, 착공 2024-06-26, 준공예정 2024-07-31, 계약금액
   24,651,000원(부가세 포함), 하자보수 보증기간 3년.

7. **(주)비젼테크솔루션_경관물보수시공계약서_2023.8.8.pdf** — 공사계약서
   (시설보수). 계약명 "분수대 파고라 경관조명 보수 시공사업", 계약기간
   2023-08-08 ~ 2023-08-31, 계약금액 2,860,000원(부가세 별도).

8. **sk쉴더스_통합경비계약서_2024.8.29.pdf** — 용역계약서 (경비). 계약명
   "잠실엘스 아파트 통합경비 계약", 계약상대자 "에스케이쉴더스 주식회사",
   계약일 2024-08-29, 계약기간 2024-09-01 ~ 2027-02-28(30개월), 월정료
   194,220,000원(부가세 별도), 세대수 5,678.

## Validation performed

- Every `.metadata.json` file was parsed with `json.load` to confirm valid JSON.
- Every file was checked to contain the `metadataAttributes` wrapper, and that
  every attribute has a `value.type` in `STRING | NUMBER | BOOLEAN |
  STRING_LIST` with the matching `stringValue`/`numberValue`, plus an
  `includeForEmbedding` boolean.
- All files are 1.1–2.3 KB, well under the 10 KB per-file Bedrock limit, and
  each file has far fewer than the 35-metadata-key limit that applies when
  using S3 Vectors as the vector store.
