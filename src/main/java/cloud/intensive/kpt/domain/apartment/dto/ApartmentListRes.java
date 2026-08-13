package cloud.intensive.kpt.domain.apartment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record ApartmentListRes(

        @Schema(example = "1")
        Long apartmentId,

        @Schema(example = "래미안 아파트")
        String name,

        @Schema(example = "서울특별시 강남구 ...")
        String address
) {}