package cloud.intensive.kpt.domain.member.controller;


import cloud.intensive.kpt.domain.member.dto.AuthTokenRes;
import cloud.intensive.kpt.domain.member.dto.CreateMemberReq;
import cloud.intensive.kpt.domain.member.dto.LoginReq;
import cloud.intensive.kpt.domain.member.dto.MemberInfoRes;
import cloud.intensive.kpt.domain.member.service.AuthService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<CommonResponse<Void>> signup(
            @Valid @RequestBody CreateMemberReq request
    ) {

        authService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success("회원가입이 완료되었습니다."));
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponse<AuthTokenRes>> login(
            @Valid @RequestBody LoginReq request
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        authService.login(request)
                )
        );
    }

    @GetMapping("/me")
    public ResponseEntity<CommonResponse<MemberInfoRes>> me(
            @AuthenticationPrincipal CustomUserDetails user
    ) {

        return ResponseEntity.ok(
                CommonResponse.success(
                        authService.getMyInfo(user.getMemberId())
                )
        );
    }
}