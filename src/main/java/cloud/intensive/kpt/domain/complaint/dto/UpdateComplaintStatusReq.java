package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record UpdateComplaintStatusReq(

        @Schema(
                description = "변경할 상태",
                example = "PROCESSING"
        )
        @NotNull
        ComplaintStatus status,

        @Schema(description = "처리 결과", example = "103동 11층 난간 교체 완료")
        @Size(max = 500)
        String resolution
) {}