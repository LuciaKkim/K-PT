package cloud.intensive.kpt.domain.apartment.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.math.BigDecimal;

public record UnitSelectRes(

        @Schema(example = "88")
        Long unitId,

        @Schema(example = "1201")
        String unitNumber,

        @Schema(description = "전용면적", example = "84")
        BigDecimal area
) {}