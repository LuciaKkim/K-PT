package cloud.intensive.kpt.domain.complaint.controller;

import cloud.intensive.kpt.domain.complaint.dto.*;
import cloud.intensive.kpt.domain.complaint.service.ComplaintService;
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
public class ComplaintController {

    private final ComplaintService complaintService;

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

    @GetMapping("/complaints/me")
    public ResponseEntity<CommonResponse<List<ComplaintListRes>>> getMyComplaints(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getMyComplaints(user.getMemberId())
                )
        );
    }

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

    @GetMapping("/admin/complaints")
    public ResponseEntity<CommonResponse<List<ComplaintListRes>>> getApartmentComplaints(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        complaintService.getApartmentComplaints(user.getMemberId())
                )
        );
    }

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
}