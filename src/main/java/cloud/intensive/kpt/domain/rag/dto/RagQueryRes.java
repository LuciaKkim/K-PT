package cloud.intensive.kpt.domain.rag.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

@Schema(description = "관리규정 RAG 질의 응답")
public record RagQueryRes(

        @Schema(
                description = "AI 생성 답변",
                example = "방문 차량은 최대 4시간까지 무료 주차가 가능합니다."
        )
        String answer,

        @Schema(
                description = "참고한 관리규정",
                example = "[\"주차관리규정 제5조\", \"주차관리규정 제8조\"]"
        )
        List<String> references,

        @Schema(
                description = "대화를 이어가기 위한 세션 ID (다음 질문 시 그대로 전달)",
                example = "7d065ed2-9f16-4b0b-a1e4-8a8c7d2f123"
        )
        String sessionId
) {}