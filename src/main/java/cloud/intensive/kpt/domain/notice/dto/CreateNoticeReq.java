package cloud.intensive.kpt.domain.notice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateNoticeReq(

        @Schema(description = "공지 제목", example = "주차장 공사 안내")
        @NotBlank
        @Size(max = 100)
        String title,

        @Schema(description = "공지 내용", example = "8월 20일부터 지하주차장 공사가 진행됩니다.")
        @NotBlank
        String content,

        @Schema(
                description = "중요 공지 여부",
                example = "true"
        )
        Boolean isImportant,

        @Schema(
                description = "긴급 공지 여부",
                example = "false"
        )
        Boolean isEmergency
) {
}