package com.policalum.erp.infrastructure.repository;

import com.policalum.erp.domain.model.RrhhHistorialSalarial;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface RrhhHistorialSalarialRepository extends JpaRepository<RrhhHistorialSalarial, UUID> {

    /**
     * Línea de tiempo completa de un legajo, de la primera vigencia a la vigente.
     * Se ordena ASC porque el servicio necesita el vecino siguiente para calcular
     * "vigente hasta"; el orden DESC que consume la UI se aplica al mapear.
     * {@code registradoPor} viaja en el mismo join para no generar N+1 al armar el nombre.
     */
    @EntityGraph(attributePaths = {"registradoPor"})
    @Query("SELECT h FROM RrhhHistorialSalarial h WHERE h.legajo.id = :legajoId " +
            "ORDER BY h.vigenciaDesde ASC, h.createdAt ASC")
    List<RrhhHistorialSalarial> findTimelineByLegajo(@Param("legajoId") UUID legajoId);

    /** Última vigencia registrada. Null si el legajo todavía no tiene historial. */
    Optional<RrhhHistorialSalarial> findFirstByLegajo_IdOrderByVigenciaDesdeDescCreatedAtDesc(UUID legajoId);
}
