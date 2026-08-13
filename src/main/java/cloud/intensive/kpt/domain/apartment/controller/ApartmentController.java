package cloud.intensive.kpt.domain.apartment.controller;

import cloud.intensive.kpt.domain.apartment.dto.ApartmentInfoRes;
import cloud.intensive.kpt.domain.apartment.dto.UnitInfoRes;
import cloud.intensive.kpt.domain.apartment.service.ApartmentService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/apartments")
@RequiredArgsConstructor
public class ApartmentController {

    private final ApartmentService apartmentService;

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
}