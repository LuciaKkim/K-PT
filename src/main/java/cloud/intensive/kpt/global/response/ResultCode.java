package cloud.intensive.kpt.global.response;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ResultCode {

    SUCCESS("200-1", "요청이 성공했습니다."),
    CREATED("201-1", "생성되었습니다."),
    UPDATED("200-2", "수정되었습니다."),
    DELETED("200-3", "삭제되었습니다.");

    private final String code;
    private final String message;
}