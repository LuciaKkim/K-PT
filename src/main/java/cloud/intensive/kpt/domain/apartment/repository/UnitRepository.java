package cloud.intensive.kpt.domain.apartment.repository;

import cloud.intensive.kpt.domain.apartment.entity.Unit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UnitRepository extends JpaRepository<Unit, Long> {

    List<Unit> findAllByBuildingId(Long buildingId);

    Optional<Unit> findByBuildingIdAndUnitNumber(
            Long buildingId,
            String unitNumber
    );
}