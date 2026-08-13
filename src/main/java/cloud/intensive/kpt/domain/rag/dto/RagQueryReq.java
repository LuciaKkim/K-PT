package cloud.intensive.kpt.domain.rag.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

public record RagQueryReq(

        @Schema(
                description = "관리규정 질문",
                example = "방문 차량은 몇 시간까지 주차할 수 있나요?"
        )
        @NotBlank
        String question
) {}