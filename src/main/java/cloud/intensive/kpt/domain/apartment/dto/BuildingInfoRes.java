package cloud.intensive.kpt.domain.apartment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

public record BuildingInfoRes(

        @Schema(example = "12")
        Long buildingId,

        @Schema(example = "103")
        String buildingNumber
) {}