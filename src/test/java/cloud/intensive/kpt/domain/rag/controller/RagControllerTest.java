package cloud.intensive.kpt.domain.rag.controller;

import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
import cloud.intensive.kpt.domain.rag.dto.RagQueryRes;
import cloud.intensive.kpt.domain.rag.service.RagService;
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

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willAnswer;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(RagController.class)
@Import(SecurityConfig.class)
class RagControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    RagService ragService;

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
                .email("test@test.com")
                .password("1234")
                .name("한민희")
                .role(MemberRole.USER)
                .build();

        return new CustomUserDetails(member);
    }

    @Test
    @DisplayName("RAG 질문 성공")
    void query() throws Exception {

        // given
        given(ragService.query(any(), any()))
                .willReturn(new RagQueryRes(
                        "우리 아파트는 2대까지 가능합니다.",
                        List.of("제12조")
                ));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        String body = """
                {
                  "question":"우리 아파트 주차 규정 알려줘"
                }
                """;

        // when & then
        mockMvc.perform(
                        post("/api/v1/rag/query")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                                .contentType(APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.answer")
                        .value("우리 아파트는 2대까지 가능합니다."))
                .andExpect(jsonPath("$.data.references[0]")
                        .value("제12조"));
    }
}