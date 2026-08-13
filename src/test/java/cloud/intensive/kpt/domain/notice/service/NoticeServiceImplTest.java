package cloud.intensive.kpt.domain.notice.service;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.apartment.entity.Building;
import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.domain.notice.dto.CreateNoticeReq;
import cloud.intensive.kpt.domain.notice.dto.NoticeInfoRes;
import cloud.intensive.kpt.domain.notice.dto.NoticeListRes;
import cloud.intensive.kpt.domain.notice.dto.UpdateNoticeReq;
import cloud.intensive.kpt.domain.notice.entity.Notice;
import cloud.intensive.kpt.domain.notice.entity.NoticeStatus;
import cloud.intensive.kpt.domain.notice.repository.NoticeRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class NoticeServiceImplTest {

    @Mock
    MemberRepository memberRepository;

    @Mock
    NoticeRepository noticeRepository;

    @InjectMocks
    NoticeServiceImpl noticeService;

    private Member admin;
    private Member user;
    private Apartment apartment;
    private Notice notice;

    @BeforeEach
    void setUp() {

        apartment = Apartment.builder()
                .id(1L)
                .name("래미안")
                .address("서울")
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
                .area(84)
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

        notice = Notice.builder()
                .id(1L)
                .apartment(apartment)
                .writer(admin)
                .title("엘리베이터 점검")
                .content("8월 20일 점검")
                .status(NoticeStatus.ACTIVE)
                .build();
    }

    @Test
    @DisplayName("공지 목록 조회 성공")
    void getNotices() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(noticeRepository.findAllByApartmentIdAndStatusOrderByCreatedAtDesc(
                1L,
                NoticeStatus.ACTIVE
        )).willReturn(List.of(notice));

        List<NoticeListRes> result = noticeService.getNotices(2L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).title()).isEqualTo("엘리베이터 점검");
        assertThat(result.get(0).writer()).isEqualTo("관리자");
    }

    @Test
    @DisplayName("공지 상세 조회 성공")
    void getNotice() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(noticeRepository.findById(1L))
                .willReturn(Optional.of(notice));

        NoticeInfoRes result = noticeService.getNotice(2L, 1L);

        assertThat(result.noticeId()).isEqualTo(1L);
        assertThat(result.title()).isEqualTo("엘리베이터 점검");
        assertThat(result.content()).isEqualTo("8월 20일 점검");
    }

    @Test
    @DisplayName("관리자 공지 등록 성공")
    void createNotice() {

        CreateNoticeReq req = new CreateNoticeReq(
                "정기 소독",
                "8월 15일 실시",
                false,
                false
        );

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(admin));

        noticeService.createNotice(1L, req);

        then(noticeRepository).should().save(any(Notice.class));
    }

    @Test
    @DisplayName("관리자가 아니면 등록 실패")
    void createNotice_fail_forbidden() {

        CreateNoticeReq req = new CreateNoticeReq(
                "정기 소독",
                "내용",
                false,
                false
        );

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        assertThatThrownBy(() -> noticeService.createNotice(2L, req))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.FORBIDDEN);
    }

    @Test
    @DisplayName("공지 수정 성공")
    void updateNotice() {

        UpdateNoticeReq req = new UpdateNoticeReq(
                "수정 제목",
                "수정 내용",
                false,
                false
        );

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(admin));

        given(noticeRepository.findById(1L))
                .willReturn(Optional.of(notice));

        noticeService.updateNotice(1L, 1L, req);

        assertThat(notice.getTitle()).isEqualTo("수정 제목");
        assertThat(notice.getContent()).isEqualTo("수정 내용");
    }

    @Test
    @DisplayName("공지 삭제 성공")
    void deleteNotice() {

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(admin));

        given(noticeRepository.findById(1L))
                .willReturn(Optional.of(notice));

        noticeService.deleteNotice(1L, 1L);

        assertThat(notice.getStatus()).isEqualTo(NoticeStatus.DELETED);
    }

    @Test
    @DisplayName("존재하지 않는 공지 조회 실패")
    void getNotice_fail_notFound() {

        given(memberRepository.findById(2L))
                .willReturn(Optional.of(user));

        given(noticeRepository.findById(1L))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> noticeService.getNotice(2L, 1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.NOT_FOUND);
    }

    @Test
    @DisplayName("존재하지 않는 회원이면 실패")
    void memberNotFound() {

        given(memberRepository.findById(any()))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> noticeService.getNotices(1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEMBER_NOT_FOUND);
    }
}