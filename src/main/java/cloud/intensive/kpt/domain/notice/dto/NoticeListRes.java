package cloud.intensive.kpt.domain.notice.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record NoticeListRes(

        @Schema(example = "1")
        Long noticeId,

        @Schema(example = "주차장 공사 안내")
        String title,

        @Schema(example = "관리사무소")
        String writer,

        @Schema(description = "작성일시")
        LocalDateTime createdAt
) {}