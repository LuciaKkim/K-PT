package cloud.intensive.kpt.domain.rag.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record RagQueryRes(

        @Schema(
                description = "AI 생성 답변",
                example = "방문 차량은 최대 4시간까지 무료 주차가 가능합니다."
        )
        String answer,

        @Schema(description = "참고한 관리규정")
        List<String> references
) {}