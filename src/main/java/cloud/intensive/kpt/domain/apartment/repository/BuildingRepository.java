package cloud.intensive.kpt.domain.apartment.repository;

import cloud.intensive.kpt.domain.apartment.entity.Building;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BuildingRepository extends JpaRepository<Building, Long> {

    List<Building> findAllByApartmentId(Long apartmentId);
}