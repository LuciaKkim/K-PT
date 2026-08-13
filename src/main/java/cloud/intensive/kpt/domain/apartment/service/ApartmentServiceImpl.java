package cloud.intensive.kpt.domain.apartment.service;

import cloud.intensive.kpt.domain.apartment.dto.*;
import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.apartment.repository.ApartmentRepository;
import cloud.intensive.kpt.domain.apartment.repository.BuildingRepository;
import cloud.intensive.kpt.domain.apartment.repository.UnitRepository;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApartmentServiceImpl implements ApartmentService {

    private final MemberRepository memberRepository;
    private final ApartmentRepository apartmentRepository;
    private final BuildingRepository buildingRepository;
    private final UnitRepository unitRepository;

    @Override
    public ApartmentInfoRes getMyApartment(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "[ApartmentServiceImpl#getMyApartment] member not found",
                        "존재하지 않는 회원입니다."
                ));

        Apartment apartment = member.getUnit()
                .getBuilding()
                .getApartment();

        return new ApartmentInfoRes(
                apartment.getId(),
                apartment.getName(),
                apartment.getAddress()
        );
    }

    @Override
    public UnitInfoRes getMyUnit(Long memberId) {

        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new BaseException(
                        ErrorCode.MEMBER_NOT_FOUND,
                        "[ApartmentServiceImpl#getMyUnit] member not found",
                        "존재하지 않는 회원입니다."
                ));

        Unit unit = member.getUnit();

        return new UnitInfoRes(
                unit.getBuilding().getApartment().getId(),
                unit.getBuilding().getApartment().getName(),
                unit.getBuilding().getBuildingNumber(),
                unit.getUnitNumber(),
                unit.getArea()
        );
    }

    @Override
    public List<ApartmentListRes> getApartments() {

        return apartmentRepository.findAll()
                .stream()
                .map(apartment -> new ApartmentListRes(
                        apartment.getId(),
                        apartment.getName(),
                        apartment.getAddress()
                ))
                .toList();
    }

    @Override
    public List<BuildingInfoRes> getBuildings(Long apartmentId) {

        return buildingRepository.findAllByApartmentId(apartmentId)
                .stream()
                .map(building -> new BuildingInfoRes(
                        building.getId(),
                        building.getBuildingNumber()
                ))
                .toList();
    }

    @Override
    public List<UnitSelectRes> getUnits(Long buildingId) {

        return unitRepository.findAllByBuildingId(buildingId)
                .stream()
                .map(unit -> new UnitSelectRes(
                        unit.getId(),
                        unit.getUnitNumber(),
                        unit.getArea()
                ))
                .toList();
    }
}