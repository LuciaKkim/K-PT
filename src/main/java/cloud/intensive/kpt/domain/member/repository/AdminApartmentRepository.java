package cloud.intensive.kpt.domain.member.repository;

import cloud.intensive.kpt.domain.member.entity.AdminApartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AdminApartmentRepository
        extends JpaRepository<AdminApartment, Long> {

    List<AdminApartment> findAllByMemberId(Long memberId);
}