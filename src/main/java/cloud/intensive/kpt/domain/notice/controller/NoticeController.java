package cloud.intensive.kpt.domain.notice.controller;

import cloud.intensive.kpt.domain.notice.dto.*;
import cloud.intensive.kpt.domain.notice.service.NoticeService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.response.ResultCode;
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

import java.util.List;

@Tag(name = "Notice", description = "공지사항 조회 및 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class NoticeController {

    private final NoticeService noticeService;

    @Operation(
            summary = "공지사항 목록 조회",
            description = "로그인한 사용자의 소속 아파트 공지사항 목록을 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping("/notices")
    public ResponseEntity<CommonResponse<List<NoticeListRes>>> getNotices(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        noticeService.getNotices(user.getMemberId())
                )
        );
    }

    @Operation(
            summary = "공지사항 상세 조회",
            description = "선택한 공지사항의 상세 내용을 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @ApiResponse(responseCode = "404", description = "공지 없음")
    @GetMapping("/notices/{noticeId}")
    public ResponseEntity<CommonResponse<NoticeInfoRes>> getNotice(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long noticeId
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        noticeService.getNotice(
                                user.getMemberId(),
                                noticeId
                        )
                )
        );
    }

    @Operation(
            summary = "공지사항 등록",
            description = "관리자가 자신의 아파트 공지사항을 등록합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "201", description = "등록 성공")
    @ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    @PostMapping("/admin/notices")
    public ResponseEntity<CommonResponse<Void>> createNotice(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CreateNoticeReq request
    ) {

        noticeService.createNotice(
                user.getMemberId(),
                request
        );

        return ResponseEntity.ok(
                CommonResponse.success(ResultCode.CREATED)
        );
    }

    @Operation(
            summary = "공지사항 수정",
            description = "관리자가 공지사항을 수정합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "수정 성공")
    @ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    @PatchMapping("/admin/notices/{noticeId}")
    public ResponseEntity<CommonResponse<Void>> updateNotice(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long noticeId,
            @Valid @RequestBody UpdateNoticeReq request
    ) {

        noticeService.updateNotice(
                user.getMemberId(),
                noticeId,
                request
        );

        return ResponseEntity.ok(
                CommonResponse.success(ResultCode.UPDATED)
        );
    }

    @Operation(
            summary = "공지사항 삭제",
            description = "관리자가 공지사항을 삭제합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "삭제 성공")
    @ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    @DeleteMapping("/admin/notices/{noticeId}")
    public ResponseEntity<CommonResponse<Void>> deleteNotice(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long noticeId
    ) {

        noticeService.deleteNotice(
                user.getMemberId(),
                noticeId
        );

        return ResponseEntity.ok(
                CommonResponse.success(ResultCode.DELETED)
        );
    }
}