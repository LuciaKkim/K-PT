package cloud.intensive.kpt.domain.complaint.controller;

import cloud.intensive.kpt.domain.complaint.dto.*;
import cloud.intensive.kpt.domain.complaint.entity.*;
import cloud.intensive.kpt.domain.complaint.service.ComplaintService;
import cloud.intensive.kpt.domain.member.entity.Member;
import cloud.intensive.kpt.domain.member.entity.MemberRole;
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
import static org.mockito.BDDMockito.*;
import static org.springframework.http.MediaType.APPLICATION_JSON;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ComplaintController.class)
@Import(SecurityConfig.class)
class ComplaintControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ComplaintService complaintService;

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
                .name("관리자")
                .email("admin@test.com")
                .role(MemberRole.ADMIN)
                .build();

        return new CustomUserDetails(member);
    }

    @Test
    @DisplayName("민원 등록 성공")
    void createComplaint() throws Exception {

        String body = """
                {
                  "category":"ELEVATOR",
                  "title":"엘리베이터 고장",
                  "content":"2층에서 멈춤"
                }
                """;

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities());

        mockMvc.perform(
                        post("/api/v1/complaints")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                                .contentType(APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("201-1"));
    }

    @Test
    @DisplayName("내 민원 목록 조회 성공")
    void getMyComplaints() throws Exception {

        given(complaintService.getMyComplaints(1L))
                .willReturn(List.of(
                        new ComplaintListRes(
                                1L,
                                ComplaintCategory.ELEVATOR,
                                "엘리베이터 고장",
                                ComplaintStatus.PENDING,
                                LocalDateTime.now()
                        )
                ));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities());

        mockMvc.perform(
                        get("/api/v1/complaints/me")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].title").value("엘리베이터 고장"));
    }

    @Test
    @DisplayName("민원 상세 조회 성공")
    void getComplaint() throws Exception {

        given(complaintService.getComplaint(1L, 1L))
                .willReturn(new ComplaintInfoRes(
                        1L,
                        "입주민",
                        ComplaintCategory.ELEVATOR,
                        "엘리베이터 고장",
                        "2층에서 멈춤",
                        ComplaintStatus.PENDING,
                        LocalDateTime.now(),
                        null
                ));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities());

        mockMvc.perform(
                        get("/api/v1/complaints/1")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data.writer").value("입주민"));
    }

    @Test
    @DisplayName("관리자 민원 목록 조회 성공")
    void getApartmentComplaints() throws Exception {

        given(complaintService.getApartmentComplaints(1L))
                .willReturn(List.of(
                        new ComplaintListRes(
                                1L,
                                ComplaintCategory.WATER,
                                "누수",
                                ComplaintStatus.IN_PROGRESS,
                                LocalDateTime.now()
                        )
                ));

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities());

        mockMvc.perform(
                        get("/api/v1/admin/complaints")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].category").value("WATER"));
    }

    @Test
    @DisplayName("민원 상태 변경 성공")
    void updateStatus() throws Exception {

        String body = """
                {
                  "status":"COMPLETED"
                }
                """;

        UsernamePasswordAuthenticationToken auth =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities());

        mockMvc.perform(
                        patch("/api/v1/admin/complaints/1/status")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(auth))
                                .contentType(APPLICATION_JSON)
                                .content(body)
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-2"));
    }
}