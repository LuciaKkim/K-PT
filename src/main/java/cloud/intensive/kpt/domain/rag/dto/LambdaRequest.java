package cloud.intensive.kpt.domain.rag.dto;

public record LambdaRequest(

        Long apartmentId,

        String question
) {}