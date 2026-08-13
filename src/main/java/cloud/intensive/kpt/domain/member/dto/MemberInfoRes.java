package cloud.intensive.kpt.domain.member.dto;


public record MemberInfoRes(

        Long memberId,

        String name,

        String email,

        String apartmentName,

        String buildingNumber,

        String unitNumber
) {
}