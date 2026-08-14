package cloud.intensive.kpt.domain.member.controller;


import cloud.intensive.kpt.domain.member.dto.AuthTokenRes;
import cloud.intensive.kpt.domain.member.dto.CreateMemberReq;
import cloud.intensive.kpt.domain.member.dto.LoginReq;
import cloud.intensive.kpt.domain.member.dto.MemberInfoRes;
import cloud.intensive.kpt.domain.member.service.AuthService;
import cloud.intensive.kpt.global.response.CommonResponse;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Auth", description = "회원가입, 로그인 및 인증 API")
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @Operation(
            summary = "회원가입",
            description = """
                입주민 계정을 생성합니다.

                회원가입 전 조회 API를 이용하여
                아파트 → 동 → 호수를 선택한 뒤
                선택된 ID를 전달합니다.
                """
    )
    @ApiResponse(responseCode = "201", description = "회원가입 성공")
    @ApiResponse(responseCode = "400", description = "잘못된 아파트/동/호수 선택")
    @ApiResponse(responseCode = "409", description = "중복 이메일")
    @PostMapping("/signup")
    public ResponseEntity<CommonResponse<Void>> signup(
            @Valid @RequestBody CreateMemberReq request
    ) {

        authService.signup(request);

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(CommonResponse.success("회원가입이 완료되었습니다."));
    }

    @Operation(
            summary = "로그인",
            description = "이메일과 비밀번호를 입력하여 로그인합니다."
    )
    @ApiResponse(responseCode = "200", description = "로그인 성공")
    @ApiResponse(responseCode = "401", description = "잘못된 자격 증명")
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

    @Operation(
            summary = "내 정보 조회",
            description = "로그인된 사용자의 정보를 조회합니다."
    )
    @ApiResponse(responseCode = "200", description = "정보 조회 성공")
    @ApiResponse(responseCode = "404", description = "사용자 찾을 수 없음")
    @SecurityRequirement(name = "bearerAuth")
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