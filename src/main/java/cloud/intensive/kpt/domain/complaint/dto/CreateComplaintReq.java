package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateComplaintReq(

        @Schema(
                description = "민원 유형",
                example = "FACILITY"
        )
        @NotNull
        ComplaintCategory category,

        @Schema(description = "민원 제목", example = "103동 계단 난간 파손")
        @NotBlank
        @Size(max = 100)
        String title,

        @Schema(description = "민원 발생 위치", example = "103동 11층 계단")
        @NotBlank
        @Size(max = 100)
        String location,

        @Schema(description = "민원 내용", example = "5층 계단 난간이 파손되어 있습니다.")
        @NotBlank
        String content
) {}