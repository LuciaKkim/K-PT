package cloud.intensive.kpt.domain.notice.dto;

import java.time.LocalDateTime;

public record NoticeInfoRes(
        Long noticeId,
        String title,
        String content,
        String writer,
        LocalDateTime createdAt,
        LocalDateTime updatedAt
) {}