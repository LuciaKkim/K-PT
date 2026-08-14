package cloud.intensive.kpt.domain.apartment.service;

import cloud.intensive.kpt.domain.apartment.dto.*;
import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.apartment.entity.Building;
import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.apartment.repository.ApartmentRepository;
import cloud.intensive.kpt.domain.apartment.repository.BuildingRepository;
import cloud.intensive.kpt.domain.apartment.repository.UnitRepository;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.given;

@ExtendWith(MockitoExtension.class)
class ApartmentServiceImplTest {

    @Mock
    MemberRepository memberRepository;

    @Mock
    ApartmentRepository apartmentRepository;

    @Mock
    BuildingRepository buildingRepository;

    @Mock
    UnitRepository unitRepository;

    @InjectMocks
    ApartmentServiceImpl apartmentService;

    private Member member;

    @BeforeEach
    void setUp() {

        Apartment apartment = Apartment.builder()
                .id(1L)
                .name("래미안")
                .roadAddress("서울특별시 강남구")
                .build();

        Building building = Building.builder()
                .id(1L)
                .buildingNumber("101")
                .apartment(apartment)
                .build();

        Unit unit = Unit.builder()
                .id(1L)
                .building(building)
                .unitNumber("1201")
                .area(BigDecimal.valueOf(84))
                .build();

        member = Member.builder()
                .id(1L)
                .name("한민희")
                .email("test@test.com")
                .role(MemberRole.USER)
                .unit(unit)
                .build();
    }

    @Test
    @DisplayName("내 아파트 조회 성공")
    void getMyApartment() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.of(member));

        // when
        ApartmentInfoRes result = apartmentService.getMyApartment(1L);

        // then
        assertThat(result.apartmentId()).isEqualTo(1L);
        assertThat(result.name()).isEqualTo("래미안");
        assertThat(result.roadAddress()).isEqualTo("서울특별시 강남구");
    }

    @Test
    @DisplayName("존재하지 않는 회원이면 아파트 조회 실패")
    void getMyApartment_fail_memberNotFound() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> apartmentService.getMyApartment(1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEMBER_NOT_FOUND);
    }

    @Test
    @DisplayName("내 세대 조회 성공")
    void getMyUnit() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.of(member));

        // when
        UnitInfoRes result = apartmentService.getMyUnit(1L);

        // then
        assertThat(result.apartmentId()).isEqualTo(1L);
        assertThat(result.apartmentName()).isEqualTo("래미안");
        assertThat(result.buildingNumber()).isEqualTo("101");
        assertThat(result.unitNumber()).isEqualTo("1201");
        assertThat(result.area()).isEqualTo(BigDecimal.valueOf(84));
    }

    @Test
    @DisplayName("존재하지 않는 회원이면 세대 조회 실패")
    void getMyUnit_fail_memberNotFound() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() -> apartmentService.getMyUnit(1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEMBER_NOT_FOUND);
    }

    @Test
    @DisplayName("아파트 목록 조회 성공")
    void getApartments() {

        Apartment apartment = Apartment.builder()
                .id(1L)
                .name("래미안")
                .roadAddress("서울")
                .build();

        given(apartmentRepository.findAll())
                .willReturn(List.of(apartment));

        List<ApartmentListRes> result = apartmentService.getApartments();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).name()).isEqualTo("래미안");
    }

    @Test
    @DisplayName("동 목록 조회 성공")
    void getBuildings() {

        Building building = member.getUnit().getBuilding();

        given(buildingRepository.findAllByApartmentId(1L))
                .willReturn(List.of(building));

        List<BuildingInfoRes> result = apartmentService.getBuildings(1L);

        assertThat(result.get(0).buildingNumber()).isEqualTo("101");
    }

    @Test
    @DisplayName("호수 목록 조회 성공")
    void getUnits() {

        Unit unit = member.getUnit();

        given(unitRepository.findAllByBuildingId(1L))
                .willReturn(List.of(unit));

        List<UnitSelectRes> result = apartmentService.getUnits(1L);

        assertThat(result.get(0).unitNumber()).isEqualTo("1201");
    }
}