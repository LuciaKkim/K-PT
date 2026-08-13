package cloud.intensive.kpt.domain.notice.dto;

import java.time.LocalDateTime;

public record NoticeListRes(
        Long noticeId,
        String title,
        String writer,
        LocalDateTime createdAt
) {}