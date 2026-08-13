package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;

public record UpdateComplaintStatusReq(

        @Schema(
                description = "변경할 상태",
                example = "PROCESSING",
                allowableValues = {
                        "RECEIVED",
                        "CHECKING",
                        "PROCESSING",
                        "COMPLETED"
                }
        )
        @NotNull
        ComplaintStatus status
) {}