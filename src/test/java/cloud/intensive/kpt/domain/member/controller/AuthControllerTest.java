package cloud.intensive.kpt.domain.member.controller;

import cloud.intensive.kpt.domain.member.dto.AuthTokenRes;
import cloud.intensive.kpt.domain.member.dto.MemberInfoRes;
import cloud.intensive.kpt.domain.member.service.AuthService;
import cloud.intensive.kpt.global.security.config.SecurityConfig;
import cloud.intensive.kpt.global.security.handler.JwtAuthenticationEntryPoint;
import cloud.intensive.kpt.global.security.jwt.JwtAuthenticationFilter;
import cloud.intensive.kpt.global.security.jwt.JwtProvider;
import cloud.intensive.kpt.global.security.test.WithMockCustomUser;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.mockito.BDDMockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(AuthController.class)
@Import(SecurityConfig.class)
class AuthControllerTest {

    @Autowired
    WebApplicationContext context;

    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    JwtProvider jwtProvider;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @BeforeEach
    void setUp() throws Exception {
        mockMvc = MockMvcBuilders.webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        willAnswer(invocation -> {
            ServletRequest request = invocation.getArgument(0);
            ServletResponse response = invocation.getArgument(1);
            FilterChain chain = invocation.getArgument(2);
            chain.doFilter(request, response);
            return null;
        }).given(jwtAuthenticationFilter).doFilter(any(), any(), any());

        willAnswer(invocation -> {
            HttpServletResponse response = invocation.getArgument(1);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            return null;
        }).given(jwtAuthenticationEntryPoint).commence(any(), any(), any());
    }

    @Test
    @DisplayName("회원가입 API 성공")
    void signup() throws Exception {

        String body = """
                {
                  "email":"test@test.com",
                  "password":"12345678",
                  "name":"한민희",
                  "unitId":1
                }
                """;

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.message")
                        .value("회원가입이 완료되었습니다."));

        then(authService).should().signup(any());
    }

    @Test
    @DisplayName("회원가입 API 실패 - 비밀번호 길이 검증 실패")
    void signup_invalidPassword() throws Exception {

        String body = """
                {
                  "email":"test@test.com",
                  "password":"1234",
                  "name":"한민희",
                  "unitId":1
                }
                """;

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());

        then(authService).shouldHaveNoInteractions();
    }

    @Test
    @DisplayName("회원가입 API 실패 - 필수값 누락")
    void signup_blankName() throws Exception {

        String body = """
                {
                  "email":"test@test.com",
                  "password":"12345678",
                  "name":"",
                  "unitId":1
                }
                """;

        mockMvc.perform(post("/api/v1/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("로그인 API 성공")
    void login() throws Exception {

        given(authService.login(any()))
                .willReturn(AuthTokenRes.of("access-token"));

        String body = """
                {
                  "email":"test@test.com",
                  "password":"12345678"
                }
                """;

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.accessToken")
                        .value("access-token"));
    }

    @Test
    @WithMockCustomUser(id = 1L, email = "test@test.com")
    @DisplayName("내 정보 조회 API 성공")
    void me() throws Exception {

        MemberInfoRes res = new MemberInfoRes(
                1L, "한민희", "test@test.com", "래미안", "101", "1201"
        );

        given(authService.getMyInfo(1L)).willReturn(res);

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.name").value("한민희"));
    }

    @Test
    @DisplayName("내 정보 조회 API 실패 - 인증 없음")
    void me_unauthenticated() throws Exception {

        mockMvc.perform(get("/api/v1/auth/me"))
                .andExpect(status().isUnauthorized());

        then(authService).shouldHaveNoInteractions();
    }
}