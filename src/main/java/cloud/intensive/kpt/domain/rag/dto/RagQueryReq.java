package cloud.intensive.kpt.domain.rag.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RagQueryReq(

        @Schema(description = "질문", example = "주차 등록은 어떻게 하나요?")
        @NotBlank
        String question,

        @Schema(
                description = "이전 대화의 세션 ID (첫 질문이면 생략)",
                example = "7d065ed2-9f16-4b0b-a1e4-8a8c7d..."
        )
        String sessionId
) {
}