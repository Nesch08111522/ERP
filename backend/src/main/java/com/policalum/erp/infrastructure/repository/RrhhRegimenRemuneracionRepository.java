package com.policalum.erp.infrastructure.repository;

import com.policalum.erp.domain.model.RrhhRegimenRemuneracion;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RrhhRegimenRemuneracionRepository extends JpaRepository<RrhhRegimenRemuneracion, UUID> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT r FROM RrhhRegimenRemuneracion r WHERE r.user.id = :userId")
    Optional<RrhhRegimenRemuneracion> findDetalleByUserId(@Param("userId") UUID userId);

    Optional<RrhhRegimenRemuneracion> findByUser_Id(UUID userId);
}
