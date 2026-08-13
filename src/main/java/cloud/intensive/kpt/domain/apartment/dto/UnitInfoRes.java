package cloud.intensive.kpt.domain.apartment.dto;

public record UnitInfoRes(
        Long apartmentId,
        String apartmentName,
        String buildingNumber,
        String unitNumber,
        Integer area
) {}