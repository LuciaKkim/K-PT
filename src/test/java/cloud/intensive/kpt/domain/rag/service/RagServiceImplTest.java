package cloud.intensive.kpt.domain.rag.service;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.apartment.entity.Building;
import cloud.intensive.kpt.domain.apartment.entity.Unit;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.member.repository.MemberRepository;
import cloud.intensive.kpt.domain.rag.client.LambdaClient;
import cloud.intensive.kpt.domain.rag.dto.*;
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
import static org.mockito.BDDMockito.*;

@ExtendWith(MockitoExtension.class)
class RagServiceImplTest {

    @Mock
    MemberRepository memberRepository;

    @Mock
    LambdaClient lambdaClient;

    @InjectMocks
    RagServiceImpl ragService;

    private Member member;

    @BeforeEach
    void setUp() {

        Apartment apartment = Apartment.builder()
                .id(3L)
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

        member = Member.builder()
                .id(1L)
                .email("test@test.com")
                .password("1234")
                .name("한민희")
                .role(MemberRole.USER)
                .unit(unit)
                .build();
    }

    @Test
    @DisplayName("RAG 질문 성공")
    void query() {

        // given
        RagQueryReq req = new RagQueryReq("주차는 몇 대까지 가능해?");

        given(memberRepository.findById(1L))
                .willReturn(Optional.of(member));

        given(lambdaClient.query(any()))
                .willReturn(new LambdaResponse(
                        "세대당 2대까지 가능합니다.",
                        List.of("제12조 주차관리")
                ));

        // when
        RagQueryRes result = ragService.query(1L, req);

        // then
        assertThat(result.answer())
                .isEqualTo("세대당 2대까지 가능합니다.");

        assertThat(result.references())
                .containsExactly("제12조 주차관리");

        then(lambdaClient).should()
                .query(new LambdaRequest(
                        3L,
                        "주차는 몇 대까지 가능해?"
                ));
    }

    @Test
    @DisplayName("존재하지 않는 회원이면 실패")
    void query_fail_memberNotFound() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.empty());

        // when & then
        assertThatThrownBy(() ->
                ragService.query(1L, new RagQueryReq("질문"))
        )
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.MEMBER_NOT_FOUND);
    }

    @Test
    @DisplayName("Lambda Timeout 예외 전달")
    void query_fail_timeout() {

        // given
        given(memberRepository.findById(1L))
                .willReturn(Optional.of(member));

        given(lambdaClient.query(any()))
                .willThrow(new BaseException(
                        ErrorCode.RAG_TIMEOUT,
                        "timeout",
                        "AI 응답 지연"
                ));

        // when & then
        assertThatThrownBy(() ->
                ragService.query(1L, new RagQueryReq("질문"))
        )
                .isInstanceOf(BaseException.class)
                .extracting("errorCode")
                .isEqualTo(ErrorCode.RAG_TIMEOUT);
    }
}