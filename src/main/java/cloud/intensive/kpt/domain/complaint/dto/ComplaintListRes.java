package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record ComplaintListRes(

        @Schema(example = "1")
        Long complaintId,

        @Schema(example = "FACILITY")
        ComplaintCategory category,

        @Schema(example = "103동 계단 난간 파손")
        String title,

        @Schema(example = "PROCESSING")
        ComplaintStatus status,

        @Schema(description = "등록일시")
        LocalDateTime createdAt
) {}