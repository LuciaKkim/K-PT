package cloud.intensive.kpt.domain.apartment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public record UnitInfoRes(

        @Schema(example = "1")
        Long apartmentId,

        @Schema(example = "래미안 아파트")
        String apartmentName,

        @Schema(example = "103")
        String buildingNumber,

        @Schema(example = "1201")
        String unitNumber,

        @Schema(description = "전용면적(㎡)", example = "84")
        BigDecimal area
) {}