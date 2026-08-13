package cloud.intensive.kpt.domain.apartment.dto;

public record ApartmentInfoRes(
        Long apartmentId,
        String name,
        String address
) {}