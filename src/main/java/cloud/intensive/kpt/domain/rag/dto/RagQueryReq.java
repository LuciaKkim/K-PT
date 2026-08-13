package cloud.intensive.kpt.domain.rag.dto;

import jakarta.validation.constraints.NotBlank;

public record RagQueryReq(

        @NotBlank
        String question
) {}