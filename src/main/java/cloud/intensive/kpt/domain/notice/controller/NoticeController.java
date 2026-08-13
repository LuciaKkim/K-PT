package cloud.intensive.kpt.domain.notice.controller;

import cloud.intensive.kpt.domain.notice.dto.*;
import cloud.intensive.kpt.domain.notice.service.NoticeService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.response.ResultCode;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class NoticeController {

    private final NoticeService noticeService;

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