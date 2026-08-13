package cloud.intensive.kpt.domain.apartment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "apartments")
public class Apartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 공공 API 식별자
    @Column(name = "kapt_code", nullable = false, unique = true)
    private String kaptCode;

    // 아파트명
    @Column(nullable = false)
    private String name;

    // 도로명 주소
    @Column(name = "road_address", nullable = false)
    private String roadAddress;

    // 법정동 코드
    @Column(name = "bjd_code", nullable = false)
    private String bjdCode;

    // 총 동 수
    @Column(name = "dong_count")
    private Integer dongCount;

    // 총 세대 수
    @Column(name = "household_count")
    private Integer householdCount;

    // 준공일
    @Column(name = "use_date")
    private LocalDate useDate;

    // 관리사무소 연락처
    @Column(name = "management_office_phone")
    private String managementOfficePhone;

    // 계약 여부
    @Builder.Default
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;
}