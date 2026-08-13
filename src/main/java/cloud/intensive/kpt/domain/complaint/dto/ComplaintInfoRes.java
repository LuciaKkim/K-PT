package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;
import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record ComplaintInfoRes(

        @Schema(example = "1")
        Long complaintId,

        @Schema(example = "홍길동")
        String writer,

        @Schema(example = "FACILITY")
        ComplaintCategory category,

        @Schema(example = "103동 계단 난간 파손")
        String title,

        @Schema(example = "5층 계단 난간이 파손되어 있습니다.")
        String content,

        @Schema(example = "PROCESSING")
        ComplaintStatus status,

        @Schema(description = "등록일시")
        LocalDateTime createdAt,

        @Schema(description = "처리 완료일시")
        LocalDateTime completedAt
) {}