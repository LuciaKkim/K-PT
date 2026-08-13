package cloud.intensive.kpt.global.exception;

import cloud.intensive.kpt.global.response.CommonResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    /**
     * 프로젝트 커스텀 예외 처리
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<CommonResponse<Void>> handleBaseException(BaseException e) {

        log.warn(e.getLogMessage());

        ErrorCode errorCode = e.getErrorCode();

        return ResponseEntity
                .status(errorCode.getHttpStatus())
                .body(CommonResponse.fail(
                        errorCode.getCode(),
                        e.getClientMessage()
                ));
    }

    /**
     * @Valid DTO 검증 실패
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<CommonResponse<Void>> handleValidationException(
            MethodArgumentNotValidException e
    ) {

        String message = e.getBindingResult()
                .getFieldErrors()
                .stream()
                .findFirst()
                .map(fieldError -> fieldError.getDefaultMessage())
                .orElse("잘못된 요청입니다.");

        log.warn(
                "[GlobalExceptionHandler#handleValidationException] {}",
                message
        );

        return ResponseEntity
                .badRequest()
                .body(CommonResponse.fail(
                        ErrorCode.INVALID_REQUEST.getCode(),
                        message
                ));
    }

    /**
     * PathVariable / RequestParam 검증 실패
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<CommonResponse<Void>> handleConstraintViolation(
            ConstraintViolationException e
    ) {

        log.warn(
                "[GlobalExceptionHandler#handleConstraintViolation] {}",
                e.getMessage()
        );

        return ResponseEntity
                .badRequest()
                .body(CommonResponse.fail(
                        ErrorCode.INVALID_REQUEST.getCode(),
                        ErrorCode.INVALID_REQUEST.getMessage()
                ));
    }

    /**
     * 예상하지 못한 서버 예외
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<CommonResponse<Void>> handleException(Exception e) {

        log.error(
                "[GlobalExceptionHandler#handleException] {}",
                e.getMessage()
        );

        return ResponseEntity
                .internalServerError()
                .body(CommonResponse.fail(
                        ErrorCode.INTERNAL_SERVER_ERROR.getCode(),
                        ErrorCode.INTERNAL_SERVER_ERROR.getMessage()
                ));
    }
}