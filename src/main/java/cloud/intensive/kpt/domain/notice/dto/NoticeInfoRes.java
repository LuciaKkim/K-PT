package cloud.intensive.kpt.domain.notice.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.time.LocalDateTime;

public record NoticeInfoRes(

        @Schema(example = "1")
        Long noticeId,

        @Schema(example = "주차장 공사 안내")
        String title,

        @Schema(example = "8월 20일부터 지하주차장 공사가 진행됩니다.")
        String content,

        @Schema(example = "관리사무소")
        String writer,

        @Schema(description = "작성일시")
        LocalDateTime createdAt,

        @Schema(description = "수정일시")
        LocalDateTime updatedAt
) {}