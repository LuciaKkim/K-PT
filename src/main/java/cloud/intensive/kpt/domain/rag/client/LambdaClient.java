package cloud.intensive.kpt.domain.rag.client;

import cloud.intensive.kpt.domain.rag.dto.LambdaRequest;
import cloud.intensive.kpt.domain.rag.dto.LambdaResponse;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;

@Component
@RequiredArgsConstructor
public class LambdaClient {

    private final RestClient restClient;

    @Value("${lambda.rag.url}")
    private String lambdaUrl;

    public LambdaResponse query(LambdaRequest request) {

        try {
            return restClient.post()
                    .uri(lambdaUrl)
                    .body(request)
                    .retrieve()
                    .body(LambdaResponse.class);

        } catch (ResourceAccessException e) {

            throw new BaseException(
                    ErrorCode.RAG_TIMEOUT,
                    "[LambdaClient] Lambda timeout",
                    "AI 응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요."
            );
        }
    }
}