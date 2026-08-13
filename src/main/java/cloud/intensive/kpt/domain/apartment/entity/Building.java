package cloud.intensive.kpt.domain.apartment.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(
        name = "buildings",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"apartment_id", "building_number"}
                )
        }
)
public class Building {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @Column(name = "building_number", nullable = false)
    private String buildingNumber;
}