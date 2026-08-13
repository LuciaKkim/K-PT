package cloud.intensive.kpt.domain.apartment.controller;

import cloud.intensive.kpt.domain.apartment.dto.*;
import cloud.intensive.kpt.domain.apartment.service.ApartmentService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(name = "Apartment", description = "아파트 및 세대 정보 조회 API")
@RestController
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

    @Operation(
            summary = "내 아파트 조회",
            description = "로그인한 사용자의 소속 아파트 정보를 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @ApiResponse(responseCode = "401", description = "인증 실패")
    @GetMapping("/me")
    public ResponseEntity<CommonResponse<ApartmentInfoRes>> getMyApartment(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        apartmentService.getMyApartment(user.getMemberId())
                )
        );
    }

    @Operation(
            summary = "내 세대 조회",
            description = "로그인한 사용자의 동, 호수, 평형 정보를 조회합니다."
    )
    @SecurityRequirement(name = "bearerAuth")
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @ApiResponse(responseCode = "401", description = "인증 실패")
    @GetMapping("/me/unit")
    public ResponseEntity<CommonResponse<UnitInfoRes>> getMyUnit(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        apartmentService.getMyUnit(user.getMemberId())
                )
        );
    }

    @Operation(
            summary = "아파트 목록 조회",
            description = "회원가입 시 선택 가능한 아파트 목록을 조회합니다."
    )
    @ApiResponse(responseCode = "200", description = "조회 성공")
    @GetMapping
    public ResponseEntity<CommonResponse<List<ApartmentListRes>>> getApartments() {

        return ResponseEntity.ok(
                CommonResponse.success(
                        apartmentService.getApartments()
                )
        );
    }

    @GetMapping("/{apartmentId}/buildings")
    public ResponseEntity<CommonResponse<List<BuildingInfoRes>>> getBuildings(
            @PathVariable Long apartmentId
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        apartmentService.getBuildings(apartmentId)
                )
        );
    }

    @GetMapping("/buildings/{buildingId}/units")
    public ResponseEntity<CommonResponse<List<UnitSelectRes>>> getUnits(
            @PathVariable Long buildingId
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        apartmentService.getUnits(buildingId)
                )
        );
    }
}