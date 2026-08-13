package cloud.intensive.kpt.global.response;

public record CommonResponse<T>(
        String resultCode,
        String message,
        T data
) {

    public static <T> CommonResponse<T> success(ResultCode resultCode, T data) {
        return new CommonResponse<>(
                resultCode.getCode(),
                resultCode.getMessage(),
                data
        );
    }

    public static <T> CommonResponse<T> success(T data) {
        return new CommonResponse<>(
                ResultCode.SUCCESS.getCode(),
                ResultCode.SUCCESS.getMessage(),
                data
        );
    }

    public static CommonResponse<Void> success(ResultCode resultCode) {
        return new CommonResponse<>(
                resultCode.getCode(),
                resultCode.getMessage(),
                null
        );
    }

    public static CommonResponse<Void> success(String message) {
        return new CommonResponse<>(
                ResultCode.SUCCESS.getCode(),
                message,
                null
        );
    }

    /**
     * 실패 응답 (ResultCode)
     */
    public static CommonResponse<Void> fail(ResultCode resultCode) {
        return new CommonResponse<>(
                resultCode.getCode(),
                resultCode.getMessage(),
                null
        );
    }

    /**
     * 실패 응답 (코드 + 커스텀 메시지)
     */
    public static CommonResponse<Void> fail(String code, String message) {
        return new CommonResponse<>(
                code,
                message,
                null
        );
    }
}