package cloud.intensive.kpt.domain.rag.controller;

import cloud.intensive.kpt.domain.rag.dto.RagQueryReq;
import cloud.intensive.kpt.domain.rag.dto.RagQueryRes;
import cloud.intensive.kpt.domain.rag.service.RagService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/rag")
public class RagController {

    private final RagService ragService;

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