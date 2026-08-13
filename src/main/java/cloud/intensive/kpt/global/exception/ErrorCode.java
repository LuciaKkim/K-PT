package cloud.intensive.kpt.global.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    INVALID_REQUEST(
            HttpStatus.BAD_REQUEST,
            "400-1",
            "잘못된 요청입니다."
    ),

    INVALID_STATE(
            HttpStatus.BAD_REQUEST,
            "400-2",
            "잘못된 상태입니다."
    ),

    UNAUTHORIZED(
            HttpStatus.UNAUTHORIZED,
            "401-1",
            "인증이 필요합니다."
    ),

    FORBIDDEN(
            HttpStatus.FORBIDDEN,
            "403-1",
            "접근 권한이 없습니다."
    ),

    NOT_FOUND(
            HttpStatus.NOT_FOUND,
            "404-1",
            "요청한 리소스를 찾을 수 없습니다."
    ),

    CONFLICT(
            HttpStatus.CONFLICT,
            "409-1",
            "요청을 처리할 수 없습니다."
    ),

    INTERNAL_SERVER_ERROR(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "500-1",
            "서버 내부 오류가 발생했습니다."
    );

    private final HttpStatus httpStatus;
    private final String code;
    private final String message;
}