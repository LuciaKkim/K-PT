package cloud.intensive.kpt.domain.complaint.repository;

import cloud.intensive.kpt.domain.complaint.entity.Complaint;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findAllByMemberIdOrderByCreatedAtDesc(Long memberId);

    List<Complaint> findAllByApartmentIdOrderByCreatedAtDesc(Long apartmentId);
}