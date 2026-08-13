package cloud.intensive.kpt.domain.rag.dto;

import java.util.List;

public record LambdaResponse(

        String answer,

        List<String> references
) {}