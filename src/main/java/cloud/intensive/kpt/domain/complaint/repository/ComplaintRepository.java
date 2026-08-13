package cloud.intensive.kpt.domain.complaint.repository;

import cloud.intensive.kpt.domain.complaint.entity.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    Page<Complaint> findAllByMemberIdOrderByCreatedAtDesc(
            Long memberId,
            Pageable pageable
    );


    Page<Complaint> findAllByApartmentIdOrderByCreatedAtDesc(
            Long apartmentId,
            Pageable pageable
    );
}