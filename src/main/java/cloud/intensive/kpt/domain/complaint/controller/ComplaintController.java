package cloud.intensive.kpt.domain.complaint.controller;

import cloud.intensive.kpt.domain.complaint.dto.ComplaintInfoRes;
import cloud.intensive.kpt.domain.complaint.dto.ComplaintListRes;
import cloud.intensive.kpt.domain.complaint.dto.CreateComplaintReq;
import cloud.intensive.kpt.domain.complaint.dto.UpdateComplaintStatusReq;
import cloud.intensive.kpt.domain.complaint.service.ComplaintService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.response.ResultCode;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Complaint", description = "민원 등록 및 관리 API")
@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1")
public class ComplaintController {

    private final ComplaintService complaintService;

    @Operation(
            summary = "민원 등록",
            description = "입주민이 시설 민원을 등록합니다. 위치(location)는 자유롭게 입력합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "201", description = "등록 성공")
    @ApiResponse(responseCode = "401", description = "인증 실패")
    @PostMapping("/complaints")
    public ResponseEntity<CommonResponse<Void>> createComplaint(
            @AuthenticationPrincipal CustomUserDetails user,
            @Valid @RequestBody CreateComplaintReq request
    ) {

        complaintService.createComplaint(
                user.getMemberId(),
                request
        );

        return ResponseEntity.ok(
                CommonResponse.success(ResultCode.CREATED)
        );
    }

    @Operation(
            summary = "내 민원 목록",
            description = "로그인한 사용자가 등록한 민원을 페이지 단위로 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/complaints/me")
    public ResponseEntity<CommonResponse<Page<ComplaintListRes>>> getMyComplaints(

            @AuthenticationPrincipal CustomUserDetails user,

            @Parameter(
                    description = "페이지 번호 (0부터 시작)",
                    example = "0"
            )
            @RequestParam(defaultValue = "0") int page,

            @Parameter(
                    description = "페이지 크기",
                    example = "10"
            )
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getMyComplaints(
                                user.getMemberId(),
                                page,
                                size
                        )
                )
        );
    }

    @Operation(
            summary = "민원 상세 조회",
            description = "본인이 등록한 민원의 상세 정보를 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @ApiResponse(responseCode = "404", description = "민원 없음")
    @GetMapping("/complaints/{complaintId}")
    public ResponseEntity<CommonResponse<ComplaintInfoRes>> getComplaint(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long complaintId
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getComplaint(
                                user.getMemberId(),
                                complaintId
                        )
                )
        );
    }

    @Operation(
            summary = "관리자 민원 목록",
            description = "관리자가 자신의 아파트 민원을 페이지 단위로 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @GetMapping("/admin/complaints")
    public ResponseEntity<CommonResponse<Page<ComplaintListRes>>> getApartmentComplaints(

            @AuthenticationPrincipal CustomUserDetails user,

            @Parameter(
                    description = "페이지 번호",
                    example = "0"
            )
            @RequestParam(defaultValue = "0") int page,

            @Parameter(
                    description = "페이지 크기",
                    example = "10"
            )
            @RequestParam(defaultValue = "10") int size
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getApartmentComplaints(
                                user.getMemberId(),
                                page,
                                size
                        )
                )
        );
    }

    @Operation(
            summary = "민원 상태 변경",
            description = "관리자가 민원의 처리 상태와 처리 결과를 변경합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "변경 성공")
    @ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    @PatchMapping("/admin/complaints/{complaintId}/status")
    public ResponseEntity<CommonResponse<Void>> updateStatus(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long complaintId,
            @Valid @RequestBody UpdateComplaintStatusReq request
    ) {

        complaintService.updateStatus(
                user.getMemberId(),
                complaintId,
                request
        );

        return ResponseEntity.ok(
                CommonResponse.success(ResultCode.UPDATED)
        );
    }

    @Operation(
            summary = "관리자 민원 상세 조회",
            description = "관리자가 자신의 아파트 민원의 상세 정보를 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @ApiResponse(responseCode = "403", description = "관리자 권한 필요")
    @ApiResponse(responseCode = "404", description = "민원 없음")
    @GetMapping("/admin/complaints/{complaintId}")
    public ResponseEntity<CommonResponse<ComplaintInfoRes>> getApartmentComplaint(
            @AuthenticationPrincipal CustomUserDetails user,
            @PathVariable Long complaintId
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getApartmentComplaint(
                                user.getMemberId(),
                                complaintId
                        )
                )
        );
    }
}