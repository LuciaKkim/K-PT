package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateComplaintStatusReq(

        @NotNull
        ComplaintStatus status
) {}