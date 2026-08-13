package cloud.intensive.kpt.domain.member.entity;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(
        name = "admin_apartments",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"member_id", "apartment_id"}
                )
        }
)
public class AdminApartment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;
}