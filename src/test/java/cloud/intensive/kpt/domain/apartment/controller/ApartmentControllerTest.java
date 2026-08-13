package cloud.intensive.kpt.domain.apartment.controller;

import cloud.intensive.kpt.domain.apartment.dto.*;
import cloud.intensive.kpt.domain.apartment.service.ApartmentService;
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
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.context.annotation.Import;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.BDDMockito.willAnswer;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(ApartmentController.class)
@Import(SecurityConfig.class)
class ApartmentControllerTest {

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    ApartmentService apartmentService;

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
                .name("한민희")
                .role(MemberRole.USER)
                .build();

        return new CustomUserDetails(member);
    }

    @Test
    @DisplayName("내 아파트 조회 성공")
    void getMyApartment() throws Exception {

        // given
        given(apartmentService.getMyApartment(1L))
                .willReturn(new ApartmentInfoRes(
                        1L,
                        "래미안",
                        "서울특별시 강남구"
                ));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        // when & then
        mockMvc.perform(
                        get("/api/v1/apartments/me")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.apartmentId").value(1))
                .andExpect(jsonPath("$.data.name").value("래미안"))
                .andExpect(jsonPath("$.data.address").value("서울특별시 강남구"));
    }

    @Test
    @DisplayName("내 세대 조회 성공")
    void getMyUnit() throws Exception {

        // given
        given(apartmentService.getMyUnit(1L))
                .willReturn(new UnitInfoRes(
                        1L,
                        "래미안",
                        "101",
                        "1201",
                        84
                ));

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        createUser(),
                        null,
                        createUser().getAuthorities()
                );

        // when & then
        mockMvc.perform(
                        get("/api/v1/apartments/me/unit")
                                .with(SecurityMockMvcRequestPostProcessors.authentication(authentication))
                )
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.resultCode").value("200-1"))
                .andExpect(jsonPath("$.data.apartmentId").value(1))
                .andExpect(jsonPath("$.data.buildingNumber").value("101"))
                .andExpect(jsonPath("$.data.unitNumber").value("1201"))
                .andExpect(jsonPath("$.data.area").value(84));
    }

    @Test
    @DisplayName("아파트 목록 조회 성공")
    void getApartments() throws Exception {

        given(apartmentService.getApartments())
                .willReturn(List.of(
                        new ApartmentListRes(1L, "래미안", "서울")
                ));

        mockMvc.perform(get("/api/v1/apartments"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].name").value("래미안"));
    }

    @Test
    @DisplayName("동 목록 조회 성공")
    void getBuildings() throws Exception {

        given(apartmentService.getBuildings(1L))
                .willReturn(List.of(
                        new BuildingInfoRes(1L, "101")
                ));

        mockMvc.perform(get("/api/v1/apartments/1/buildings"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].buildingNumber").value("101"));
    }

    @Test
    @DisplayName("호수 목록 조회 성공")
    void getUnits() throws Exception {

        given(apartmentService.getUnits(1L))
                .willReturn(List.of(
                        new UnitSelectRes(1L, "1201", 84)
                ));

        mockMvc.perform(get("/api/v1/apartments/buildings/1/units"))
                .andDo(print())
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.data[0].unitNumber").value("1201"))
                .andExpect(jsonPath("$.data[0].area").value(84));
    }
}