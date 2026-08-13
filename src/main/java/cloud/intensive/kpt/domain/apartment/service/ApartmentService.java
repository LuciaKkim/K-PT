package cloud.intensive.kpt.domain.apartment.service;

import cloud.intensive.kpt.domain.apartment.dto.*;

import java.util.List;

public interface ApartmentService {

    ApartmentInfoRes getMyApartment(Long memberId);

    UnitInfoRes getMyUnit(Long memberId);

    List<ApartmentListRes> getApartments();

    List<BuildingInfoRes> getBuildings(Long apartmentId);

    List<UnitSelectRes> getUnits(Long buildingId);
}