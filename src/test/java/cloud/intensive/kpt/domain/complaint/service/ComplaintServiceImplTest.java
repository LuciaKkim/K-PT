package cloud.intensive.kpt.domain.complaint.service;

import cloud.intensive.kpt.domain.apartment.entity.*;
import cloud.intensive.kpt.domain.complaint.dto.*;
import cloud.intensive.kpt.domain.complaint.entity.*;
import cloud.intensive.kpt.domain.complaint.repository.ComplaintRepository;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class ComplaintServiceImplTest {

    @Mock
    MemberRepository memberRepository;

    @Mock
    ComplaintRepository complaintRepository;

    @InjectMocks
    ComplaintServiceImpl complaintService;

    private Member admin;
    private Member user;
    private Complaint complaint;

    @BeforeEach
    void setUp() {

        Apartment apartment = Apartment.builder()
                .id(1L)
                .name("래미안")
                .roadAddress("서울")
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

        admin = Member.builder()
                .id(1L)
                .name("관리자")
                .email("admin@test.com")
                .role(MemberRole.ADMIN)
                .unit(unit)
                .build();

        user = Member.builder()
                .id(2L)
                .name("입주민")
                .email("user@test.com")
                .role(MemberRole.USER)
                .unit(unit)
                .build();

        complaint = Complaint.builder()
                .id(1L)
                .apartment(apartment)
                .member(user)
                .category(ComplaintCategory.FACILITY)
                .title("엘리베이터 고장")
                .content("2층에서 멈춥니다.")
                .status(ComplaintStatus.RECEIVED)
                .build();
    }

    @Test
    @DisplayName("민원 등록 성공")
    void createComplaint() {

        CreateComplaintReq req = new CreateComplaintReq(
                ComplaintCategory.FACILITY,
                "엘리베이터 고장",
                "101동 엘리베이터",   // location
                "2층에서 멈춤"
        );

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        complaintService.createComplaint(2L, req);

        then(complaintRepository).should().save(any(Complaint.class));
    }

    @Test
    @DisplayName("내 민원 목록 조회 성공")
    void getMyComplaints() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        Page<Complaint> page = new PageImpl<>(List.of(complaint));

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(complaintRepository.findAllByMemberIdOrderByCreatedAtDesc(
                eq(2L), any(Pageable.class)))
                .willReturn(page);

        // when
        Page<ComplaintListRes> result =
                complaintService.getMyComplaints(2L, 0, 10);

        // then
        assertThat(result.getContent()).hasSize(1);
        assertThat(result.getContent().get(0).title())
                .isEqualTo("엘리베이터 고장");
        assertThat(result.getContent().get(0).status())
                .isEqualTo(ComplaintStatus.RECEIVED);

        assertThat(result.getTotalElements()).isEqualTo(1);
    }

    @Test
    @DisplayName("민원 상세 조회 성공")
    void getComplaint() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(complaintRepository.findById(1L))
                .willReturn(Optional.of(complaint));

        ComplaintInfoRes result = complaintService.getComplaint(2L, 1L);

        assertThat(result.complaintId()).isEqualTo(1L);
        assertThat(result.writer()).isEqualTo("입주민");
        assertThat(result.category()).isEqualTo(ComplaintCategory.FACILITY);
    }

    @Test
    @DisplayName("관리자 상태 변경 성공")
    void updateStatus() {

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(admin));

        given(complaintRepository.findById(1L))
                .willReturn(Optional.of(complaint));

        UpdateComplaintStatusReq req =
                new UpdateComplaintStatusReq(
                        ComplaintStatus.COMPLETED,
                        "엘리베이터 수리 완료"
                );

        complaintService.updateStatus(1L, 1L, req);

        assertThat(complaint.getStatus()).isEqualTo(ComplaintStatus.COMPLETED);
        assertThat(complaint.getCompletedAt()).isNotNull();
    }

    @Test
    @DisplayName("관리자가 아니면 상태 변경 실패")
    void updateStatus_forbidden() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        UpdateComplaintStatusReq req =
                new UpdateComplaintStatusReq(
                        ComplaintStatus.PROCESSING,
                        "부품 교체 진행 중"
                );

        assertThatThrownBy(() ->
                complaintService.updateStatus(2L, 1L, req))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.FORBIDDEN);
    }

    @Test
    @DisplayName("존재하지 않는 민원 조회 실패")
    void complaintNotFound() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(complaintRepository.findById(1L))
                .willReturn(Optional.empty());

        assertThatThrownBy(() ->
                complaintService.getComplaint(2L, 1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.COMPLAINT_NOT_FOUND);
    }

    @Test
    @DisplayName("관리자 아파트 민원 목록 조회 성공")
    void getApartmentComplaints() {

        Page<Complaint> page = new PageImpl<>(List.of(complaint));

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(admin));

        given(complaintRepository.findAllByApartmentIdOrderByCreatedAtDesc(
                eq(1L), any(Pageable.class)))
                .willReturn(page);

        Page<ComplaintListRes> result =
                complaintService.getApartmentComplaints(1L, 0, 10);

        assertThat(result.getContent()).hasSize(1);
    }
}