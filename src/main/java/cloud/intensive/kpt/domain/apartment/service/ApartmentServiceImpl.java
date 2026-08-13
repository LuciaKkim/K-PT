package cloud.intensive.kpt.domain.apartment.service;

import cloud.intensive.kpt.domain.apartment.dto.ApartmentInfoRes;
import cloud.intensive.kpt.domain.apartment.dto.UnitInfoRes;
import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ApartmentServiceImpl implements ApartmentService {

    private final MemberRepository memberRepository;

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
}