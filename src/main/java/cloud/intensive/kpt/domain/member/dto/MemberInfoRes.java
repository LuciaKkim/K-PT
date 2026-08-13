package cloud.intensive.kpt.domain.member.dto;


import io.swagger.v3.oas.annotations.media.Schema;

public record MemberInfoRes(

        @Schema(example = "1")
        Long memberId,

        @Schema(example = "홍길동")
        String name,

        @Schema(example = "user@example.com")
        String email,

        @Schema(example = "래미안 아파트")
        String apartmentName,

        @Schema(example = "103")
        String buildingNumber,

        @Schema(example = "1201")
        String unitNumber
) {
}