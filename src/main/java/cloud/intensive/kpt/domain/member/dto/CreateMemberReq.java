package cloud.intensive.kpt.domain.member.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "회원가입 요청")
public record CreateMemberReq(

        @Schema(
                description = "사용자 이름",
                example = "홍길동"
        )
        @NotBlank(message = "이름은 필수입니다.")
        String name,

        @Schema(
                description = "로그인 이메일",
                example = "user@example.com"
        )
        @Email(message = "이메일 형식이 올바르지 않습니다.")
        @NotBlank(message = "이메일은 필수입니다.")
        String email,

        @Schema(
                description = "비밀번호 (8~20자)",
                example = "password123!"
        )
        @NotBlank(message = "비밀번호는 필수입니다.")
        @Size(min = 8, max = 20, message = "비밀번호는 8~20자입니다.")
        String password,

        @Schema(
                description = "선택한 아파트 ID",
                example = "1"
        )
        @NotNull(message = "아파트 선택은 필수입니다.")
        Long apartmentId,

        @Schema(
                description = "선택한 동 ID",
                example = "1"
        )
        @NotNull(message = "동 선택은 필수입니다.")
        Long buildingId,

        @Schema(
                description = "선택한 호수 ID",
                example = "2"
        )
        @NotNull(message = "호수 선택은 필수입니다.")
        Long unitId
) {}