package cloud.intensive.kpt.domain.apartment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ApartmentInfoRes(

        @Schema(description = "아파트 ID", example = "1")
        Long apartmentId,

        @Schema(description = "아파트 이름", example = "래미안 아파트")
        String name,

        @Schema(description = "도로명 주소", example = "서울특별시 강남구 ...")
        String roadAddress
) {}