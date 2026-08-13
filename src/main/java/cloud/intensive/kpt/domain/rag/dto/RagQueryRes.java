package cloud.intensive.kpt.domain.rag.dto;

import java.util.List;

public record RagQueryRes(

        String answer,

        List<String> references
) {}