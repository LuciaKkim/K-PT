package cloud.intensive.kpt.global.exception;

import lombok.Getter;

@Getter
public class BaseException extends RuntimeException {

    private final ErrorCode errorCode;
    private final String logMessage;
    private final String clientMessage;

    public BaseException(
            ErrorCode errorCode,
            String logMessage,
            String clientMessage
    ) {
        super(clientMessage);
        this.errorCode = errorCode;
        this.logMessage = logMessage;
        this.clientMessage = clientMessage;
    }

    @Override
    public synchronized Throwable fillInStackTrace() {
        return this;
    }
}