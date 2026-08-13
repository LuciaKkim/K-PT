package cloud.intensive.kpt.domain.notice.repository;

import cloud.intensive.kpt.domain.notice.entity.Notice;
import cloud.intensive.kpt.domain.notice.entity.NoticeStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NoticeRepository extends JpaRepository<Notice, Long> {

    List<Notice> findAllByApartmentIdAndStatusOrderByCreatedAtDesc(
            Long apartmentId,
            NoticeStatus status
    );
}