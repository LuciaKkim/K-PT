package cloud.intensive.kpt.domain.member.dto;


import io.swagger.v3.oas.annotations.media.Schema;

/**
 * 코드에 대한 전체적인 역할을 적습니다.
 * <p>
 * 코드에 대한 작동 원리 등을 적습니다.
 *
 * <p><b>상속 정보:</b><br>
 * 상속 정보를 적습니다.
 *
 * <p><b>주요 생성자:</b><br>
 * {@code ExampleClass(String example)}  <br>
 * 주요 생성자와 그 매개변수에 대한 설명을 적습니다. <br>
 *
 * <p><b>빈 관리:</b><br>
 * 필요 시 빈 관리에 대한 내용을 적습니다.
 *
 * <p><b>외부 모듈:</b><br>
 * 필요 시 외부 모듈에 대한 내용을 적습니다.
 *
 * @author minhee
 * @see
 * @since 2026-08-13
 */

public record AuthTokenRes(

        @Schema(description = "JWT Access Token")
        String accessToken,

        @Schema(description = "토큰 타입", example = "Bearer")
        String tokenType
) {

    public static AuthTokenRes of(String accessToken) {
        return new AuthTokenRes(
                accessToken,
                "Bearer"
        );
    }
}