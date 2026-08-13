package cloud.intensive.kpt.domain.apartment.service;

import cloud.intensive.kpt.domain.apartment.dto.ApartmentInfoRes;
import cloud.intensive.kpt.domain.apartment.dto.UnitInfoRes;

public interface ApartmentService {

    ApartmentInfoRes getMyApartment(Long memberId);

    UnitInfoRes getMyUnit(Long memberId);
}