package cloud.intensive.kpt.domain.notice.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateNoticeReq(

        @Schema(description = "공지 제목", example = "주차장 공사 일정 변경")
        @NotBlank
        @Size(max = 100)
        String title,

        @Schema(description = "수정된 공지 내용", example = "공사 일정이 8월 22일로 변경되었습니다.")
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
) {}