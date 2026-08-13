package cloud.intensive.kpt.global.response;

public record CommonResponse<T>(
        String resultCode,
        String message,
        T data
) {

    /**
     * 성공 응답 (데이터 포함)
     */
    public static <T> CommonResponse<T> success(ResultCode resultCode, T data) {
        return new CommonResponse<>(
                resultCode.getCode(),
                resultCode.getMessage(),
                data
        );
    }

    /**
     * 성공 응답 (데이터 없음)
     */
    public static CommonResponse<Void> success(ResultCode resultCode) {
        return new CommonResponse<>(
                resultCode.getCode(),
                resultCode.getMessage(),
                null
        );
    }

    /**
     * 실패 응답
     */
    public static CommonResponse<Void> fail(String resultCode, String message) {
        return new CommonResponse<>(
                resultCode,
                message,
                null
        );
    }
}