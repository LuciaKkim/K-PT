package cloud.intensive.kpt.domain.complaint.entity;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import cloud.intensive.kpt.domain.member.entity.Member;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Table(name = "complaints")
public class Complaint {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "apartment_id")
    private Apartment apartment;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "member_id")
    private Member member;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ComplaintCategory category;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 100)
    private String location;

    @Lob
    @Column(nullable = false)
    private String content;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    @Column(nullable = false)
    private ComplaintStatus status = ComplaintStatus.RECEIVED;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    @Column(nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    private LocalDateTime completedAt;

    public void updateStatus(
            ComplaintStatus status,
            String resolution
    ) {
        this.status = status;
        this.resolution = resolution;

        if (status == ComplaintStatus.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        }
    }
}