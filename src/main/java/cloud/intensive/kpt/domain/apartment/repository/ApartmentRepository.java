package cloud.intensive.kpt.domain.apartment.repository;

import cloud.intensive.kpt.domain.apartment.entity.Apartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApartmentRepository extends JpaRepository<Apartment, Long> {
}