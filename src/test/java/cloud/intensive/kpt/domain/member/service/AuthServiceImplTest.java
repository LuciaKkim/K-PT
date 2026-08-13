package cloud.intensive.kpt.domain.member.service;

import cloud.intensive.kpt.domain.apartment.entity.*;
import cloud.intensive.kpt.domain.apartment.repository.UnitRepository;
import cloud.intensive.kpt.domain.member.dto.*;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.global.exception.BaseException;
import cloud.intensive.kpt.global.exception.ErrorCode;
import cloud.intensive.kpt.global.security.jwt.JwtProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock MemberRepository memberRepository;
    @Mock UnitRepository unitRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtProvider jwtProvider;

    @InjectMocks
    AuthServiceImpl authService;

    private Unit unit;
    private Member member;

    @BeforeEach
    void setUp() {

        Apartment apartment = Apartment.builder()
                .id(1L)
                .name("래미안")
                .build();

        Building building = Building.builder()
                .id(1L)
                .buildingNumber("101")
                .apartment(apartment)
                .build();

        unit = Unit.builder()
                .id(1L)
                .unitNumber("1201")
                .building(building)
                .build();

        member = Member.builder()
                .id(1L)
                .name("한민희")
                .email("test@test.com")
                .password("encodedPw")
                .role(MemberRole.USER)
                .unit(unit)
                .build();
    }

    @Test
    @DisplayName("회원가입 성공")
    void shouldSignup() {

        // given
        CreateMemberReq req = new CreateMemberReq(
                "한민희",
                "test@test.com",
                "1234",
                1L
        );

        given(memberRepository.existsByEmail(req.email())).willReturn(false);
        given(unitRepository.findById(1L)).willReturn(Optional.of(unit));
        given(passwordEncoder.encode("1234")).willReturn("encoded");

        // when
        authService.signup(req);

        // then
        then(memberRepository).should().save(any(Member.class));
    }

    @Test
    @DisplayName("중복 이메일이면 회원가입 실패")
    void shouldThrowDuplicateEmail() {

        CreateMemberReq req = new CreateMemberReq(
                "test@test.com",
                "1234",
                "한민희",
                1L
        );

        given(memberRepository.existsByEmail(req.email())).willReturn(true);

        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.DUPLICATE_EMAIL);
    }

    @Test
    @DisplayName("존재하지 않는 호수면 회원가입 실패")
    void shouldThrowUnitNotFound() {

        CreateMemberReq req = new CreateMemberReq(
                "test@test.com",
                "1234",
                "한민희",
                1L
        );

        given(memberRepository.existsByEmail(any())).willReturn(false);
        given(unitRepository.findById(1L)).willReturn(Optional.empty());

        assertThatThrownBy(() -> authService.signup(req))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.UNIT_NOT_FOUND);
    }

    @Test
    @DisplayName("로그인 성공")
    void shouldLogin() {

        LoginReq req = new LoginReq("test@test.com", "1234");

        given(memberRepository.findByEmail(req.email()))
                .willReturn(Optional.of(member));
        given(passwordEncoder.matches("1234", "encodedPw"))
                .willReturn(true);
        given(jwtProvider.createAccessToken(any(), any(), any()))
                .willReturn("access-token");

        AuthTokenRes result = authService.login(req);

        assertThat(result.accessToken()).isEqualTo("access-token");
    }

    @Test
    @DisplayName("비밀번호가 틀리면 로그인 실패")
    void shouldThrowInvalidPassword() {

        LoginReq req = new LoginReq("test@test.com", "wrong");

        given(memberRepository.findByEmail(any()))
                .willReturn(Optional.of(member));
        given(passwordEncoder.matches(any(), any()))
                .willReturn(false);

        assertThatThrownBy(() -> authService.login(req))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.INVALID_PASSWORD);
    }

    @Test
    @DisplayName("내 정보 조회 성공")
    void shouldGetMyInfo() {

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(member));

        MemberInfoRes result = authService.getMyInfo(1L);

        assertThat(result.name()).isEqualTo("한민희");
        assertThat(result.apartmentName()).isEqualTo("래미안");
        assertThat(result.buildingNumber()).isEqualTo("101");
        assertThat(result.unitNumber()).isEqualTo("1201");
    }

    @Test
    @DisplayName("존재하지 않는 회원이면 내 정보 조회 실패")
    void shouldThrowMemberNotFound() {

        given(memberRepository.findById(any()))
                .willReturn(Optional.empty());

        assertThatThrownBy(() -> authService.getMyInfo(1L))
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEMBER_NOT_FOUND);
    }
}