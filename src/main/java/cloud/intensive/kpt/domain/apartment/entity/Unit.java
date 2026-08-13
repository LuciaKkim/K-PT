package cloud.intensive.kpt.domain.apartment.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(
        name = "units",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"building_id", "unit_number"}
                )
        }
)
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "building_id")
    private Building building;

    @Column(name = "unit_number", nullable = false)
    private String unitNumber;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal area;
}