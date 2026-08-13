package cloud.intensive.kpt.domain.notice.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpdateNoticeReq(

        @NotBlank
        @Size(max = 100)
        String title,

        @NotBlank
        String content
) {}