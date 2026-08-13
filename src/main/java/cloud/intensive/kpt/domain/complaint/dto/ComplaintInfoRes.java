package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;

import java.time.LocalDateTime;

public record ComplaintInfoRes(
        Long complaintId,
        String writer,
        ComplaintCategory category,
        String title,
        String content,
        ComplaintStatus status,
        LocalDateTime createdAt,
        LocalDateTime completedAt
) {}