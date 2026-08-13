package cloud.intensive.kpt.domain.rag.controller;

import cloud.intensive.kpt.domain.rag.dto.RagQueryReq;
import cloud.intensive.kpt.domain.rag.dto.RagQueryRes;
import cloud.intensive.kpt.domain.rag.service.RagService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "RAG", description = "관리규정 AI 질의응답 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rag")
public class RagController {

    private final RagService ragService;

    @Operation(
            summary = "관리규정 질의",
            description = "사용자의 아파트 관리규정을 기반으로 AI 답변과 참고 규정을 반환합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "답변 생성 성공")
    @ApiResponse(responseCode = "401", description = "인증 실패")
    @PostMapping("/query")
    public ResponseEntity<CommonResponse<RagQueryRes>> query(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody RagQueryReq request
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        ragService.query(
                                user.getMemberId(),
                                request
                        )
                )
        );
    }
}