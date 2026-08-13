package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import cloud.intensive.kpt.domain.complaint.entity.ComplaintStatus;

import java.time.LocalDateTime;

public record ComplaintListRes(
        Long complaintId,
        ComplaintCategory category,
        String title,
        ComplaintStatus status,
        LocalDateTime createdAt
) {}