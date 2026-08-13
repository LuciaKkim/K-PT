package cloud.intensive.kpt.domain.member.dto;


import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginReq(

        @Email
        @NotBlank
        String email,

        @NotBlank
        String password
) {
}