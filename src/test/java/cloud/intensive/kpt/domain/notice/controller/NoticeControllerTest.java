package cloud.intensive.kpt.domain.notice.controller;

import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.notice.dto.NoticeInfoRes;
import cloud.intensive.kpt.domain.notice.dto.NoticeListRes;
import cloud.intensive.kpt.domain.notice.service.NoticeService;
import cloud.intensive.kpt.global.security.config.SecurityConfig;
import cloud.intensive.kpt.global.security.dto.CustomUserDetails;
import cloud.intensive.kpt.global.security.handler.JwtAuthenticationEntryPoint;
import cloud.intensive.kpt.global.security.jwt.JwtAuthenticationFilter;
import cloud.intensive.kpt.global.security.jwt.JwtProvider;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willAnswer;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(NoticeController.class)
@Import(SecurityConfig.class)
class NoticeControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    NoticeService noticeService;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtProvider jwtProvider;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @BeforeEach
    void setUpFilter() throws Exception {
        willAnswer(invocation -> {
            ServletRequest request = invocation.getArgument(0);
            ServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).given(jwtAuthenticationFilter).doFilter(any(), any(), any());
    }

    private CustomUserDetails createUser() {

        Member member = Member.builder()
                .id(1L)
                .email("admin@test.com")
                .name("관리자")
                .role(MemberRole.ADMIN)
                .build();

        return new CustomUserDetails(member);
    }

    @Test
    @DisplayName("공지 목록 조회 성공")
    void getNotices() throws Exception {

        given(noticeService.getNotices(1L))
                .willReturn(List.of(
                        new NoticeListRes(
                                1L,
                                "엘리베이터 점검",
                                "관리자",
                                LocalDateTime.of(2026, 8, 13, 10, 0)
                        )
                ));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        mockMvc.perform(
                        get("/api/v1/notices")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data[0].noticeId").value(1))
                .andExpect(jsonPath("$.data[0].title").value("엘리베이터 점검"))
                .andExpect(jsonPath("$.data[0].writer").value("관리자"));
    }

    @Test
    @DisplayName("공지 상세 조회 성공")
    void getNotice() throws Exception {

        given(noticeService.getNotice(1L, 1L))
                .willReturn(new NoticeInfoRes(
                        1L,
                        "엘리베이터 점검",
                        "8월 20일 점검 예정입니다.",
                        "관리자",
                        LocalDateTime.of(2026, 8, 13, 10, 0),
                        null
                ));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        mockMvc.perform(
                        get("/api/v1/notices/1")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.noticeId").value(1))
                .andExpect(jsonPath("$.data.title").value("엘리베이터 점검"))
                .andExpect(jsonPath("$.data.content").value("8월 20일 점검 예정입니다."));
    }

    @Test
    @DisplayName("공지 등록 성공")
    void createNotice() throws Exception {

        String body = """
                {
                  "title":"정기 소독",
                  "content":"8월 15일 실시합니다."
                }
                """;

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        mockMvc.perform(
                        post("/api/v1/admin/notices")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                                .contentType(APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("201-1"))
                .andExpect(jsonPath("$.message").value("생성되었습니다."));
    }

    @Test
    @DisplayName("공지 수정 성공")
    void updateNotice() throws Exception {

        String body = """
                {
                  "title":"정기 소독 변경",
                  "content":"8월 16일 실시합니다."
                }
                """;

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        mockMvc.perform(
                        patch("/api/v1/admin/notices/1")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                                .contentType(APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-2"))
                .andExpect(jsonPath("$.message").value("수정되었습니다."));
    }

    @Test
    @DisplayName("공지 삭제 성공")
    void deleteNotice() throws Exception {

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        mockMvc.perform(
                        delete("/api/v1/admin/notices/1")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-3"))
                .andExpect(jsonPath("$.message").value("삭제되었습니다."));
    }
}