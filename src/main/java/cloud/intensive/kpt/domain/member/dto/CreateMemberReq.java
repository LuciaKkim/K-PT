package cloud.intensive.kpt.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

public record CreateMemberReq(

        @Schema(description = "사용자 이름", example = "홍길동")
        @NotBlank(message = "이름은 필수입니다.")
        String name,

        @Schema(description = "로그인 이메일", example = "user@example.com")
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        String email,

        @Schema(description = "비밀번호(8~20자)", example = "password123!")
        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 8, max = 20)
        String password,

        @Schema(description = "소속 호수 ID", example = "1201")
        @NotNull(message = "호수 선택은 필수입니다.")
        Long unitId
) {
}