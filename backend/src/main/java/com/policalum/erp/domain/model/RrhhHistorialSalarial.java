package com.policalum.erp.domain.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

import org.hibernate.annotations.UuidGenerator;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Una fila = un estado remunerativo del legajo que empezó a regir en {@code vigenciaDesde}.
 *
 * <p>Es historial, no auditoría: {@code audit_log} guarda "quién tocó qué y cuándo" con
 * instantáneas JSON; esta tabla guarda de cuánto a cuánto cambió el dinero, en columnas
 * tipadas, para poder responder "cuánto ganaba esta persona en marzo".
 *
 * <p>Inmutable por diseño. No existe endpoint de edición ni borrado: un historial salarial
 * que se puede reescribir deja de servir como prueba. Si un registro llega mal, se corrige
 * con uno nuevo cuya vigencia reemplace la anterior.
 *
 * <p>Los campos {@code ...Anterior} pueden ser nulos en la primera fila del legajo (el sueldo
 * inicial no tiene un "antes" que mostrar).
 */
@Entity
@Table(name = "rrhh_historial_salarial",
        indexes = @Index(name = "idx_historial_salarial_legajo_vigencia", columnList = "legajo_id, vigencia_desde"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RrhhHistorialSalarial {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "legajo_id", nullable = false)
    private RrhhLegajoDigital legajo;

    /** Día desde el que rige este sueldo. No es la fecha en que se guardó, sino la de efecto. */
    @Column(name = "vigencia_desde", nullable = false)
    private LocalDate vigenciaDesde;

    @Column(name = "tipo_contrato_anterior", length = 50)
    private String tipoContratoAnterior;

    @Column(name = "tipo_contrato_nuevo", length = 50)
    private String tipoContratoNuevo;

    @Column(name = "sueldo_anterior", precision = 12, scale = 2)
    private BigDecimal sueldoAnterior;

    @Column(name = "sueldo_nuevo", nullable = false, precision = 12, scale = 2)
    private BigDecimal sueldoNuevo;

    @Column(name = "comision_anterior", precision = 5, scale = 2)
    private BigDecimal comisionAnterior;

    @Column(name = "comision_nuevo", nullable = false, precision = 5, scale = 2)
    private BigDecimal comisionNuevo;

    @Column(name = "dia_cobro_anterior")
    private Integer diaCobroAnterior;

    @Column(name = "dia_cobro_nuevo")
    private Integer diaCobroNuevo;

    /** Por qué cambió (aumento, corrección, cambio de contrato). Texto libre, opcional. */
    @Column(length = 255)
    private String motivo;

    /**
     * Quién guardó el cambio. Null solo en las filas sembradas por la migración
     * (ver backend/sql/20261107_rrhh_historial_salarial.sql): atribuirlas a un usuario
     * sería inventar responsabilidad.
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "registrado_por")
    private User registradoPor;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // FIX: @Builder ignora los inicializadores de campo; se normaliza aquí (misma lección
    // que RrhhLegajoDigital y el bug histórico de Producto).
    @PrePersist
    void prePersist() {
        if (this.createdAt == null) this.createdAt = LocalDateTime.now();
        if (this.comisionNuevo == null) this.comisionNuevo = BigDecimal.ZERO;
    }
}
