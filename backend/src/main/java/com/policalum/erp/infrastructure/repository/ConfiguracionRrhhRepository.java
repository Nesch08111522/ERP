package com.policalum.erp.infrastructure.repository;

import com.policalum.erp.domain.model.ConfiguracionRrhh;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/** Tabla de una sola fila (id = {@link ConfiguracionRrhh#ID_UNICO}). */
@Repository
public interface ConfiguracionRrhhRepository extends JpaRepository<ConfiguracionRrhh, Long> {

    /** Bloquea la fila (FOR UPDATE) para serializar ediciones concurrentes. */
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT c FROM ConfiguracionRrhh c WHERE c.id = :id")
    Optional<ConfiguracionRrhh> findParaActualizar(@Param("id") Long id);
}
