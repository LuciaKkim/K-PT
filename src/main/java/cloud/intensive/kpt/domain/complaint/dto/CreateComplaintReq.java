package cloud.intensive.kpt.domain.complaint.dto;

import cloud.intensive.kpt.domain.complaint.entity.ComplaintCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateComplaintReq(

        @NotNull
        ComplaintCategory category,

        @NotBlank
        @Size(max = 100)
        String title,

        @NotBlank
        String content
) {}