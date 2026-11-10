package com.policalum.erp.domain.model;

import com.policalum.erp.domain.enums.BaseRepartoUtilidad;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

/**
 * Régimen de remuneración del ADMINISTRADOR, visto como trabajador de su propia empresa.
 *
 * <p>Existe una fila por usuario y solo aplica a ROLE_ADMIN. Los importes NO viven aquí:
 * el sueldo se lee de {@link RrhhLegajoDigital#getSueldoBase()} y el porcentaje de comisión
 * de ventas propias de {@link RrhhLegajoDigital#getPorcentajeComision()}. Esta tabla guarda
 * qué componentes cobra y cómo se calcula el reparto de utilidad, que es lo único que
 * un empleado normal no puede fijar.
 *
 * <p>Separa dos bolsillos que el ERP debe mantener distinctos:
 * <ul>
 *   <li><b>Ganancia personal</b> = sueldo (si está habilitado) + comisión por ventas propias
 *       (si está habilitada) + % de reparto sobre la base elegida (si está habilitado).</li>
 *   <li><b>Ganancia de la empresa</b> = utilidad neta del periodo, sin descontar el reparto.</li>
 * </ul>
 */
@Entity
@Table(name = "rrhh_regimen_remuneracion",
        uniqueConstraints = @UniqueConstraint(name = "uk_regimen_user", columnNames = {"user_id"}))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class RrhhRegimenRemuneracion {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    /** Cobra el sueldo base de su legajo. Falso = solo vive del reparto y/o comisiones. */
    @Builder.Default
    @Column(name = "sueldo_habilitado", nullable = false)
    private Boolean sueldoHabilitado = true;

    /** Cobra % de comisión sobre sus propias ventas del periodo. */
    @Builder.Default
    @Column(name = "comision_habilitada", nullable = false)
    private Boolean comisionHabilitada = true;

    /** Participa del reparto de la utilidad de la empresa. */
    @Builder.Default
    @Column(name = "reparto_habilitado", nullable = false)
    private Boolean repartoHabilitado = false;

    /** % del admin sobre la base de reparto elegida. 0-100. */
    @Builder.Default
    @Column(name = "porcentaje_reparto", nullable = false, precision = 5, scale = 2)
    private BigDecimal porcentajeReparto = BigDecimal.ZERO;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "base_reparto", nullable = false, length = 20)
    private BaseRepartoUtilidad baseReparto = BaseRepartoUtilidad.UTILIDAD_NETA;

    /**
     * Tope mensual del reparto. Null o 0 = sin tope. Evita que un % alto se coma la caja
     * en un mes excepcionalmente bueno.
     */
    @Column(name = "tope_reparto_mensual", precision = 12, scale = 2)
    private BigDecimal topeRepartoMensual;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = this.createdAt;
        if (this.sueldoHabilitado == null) this.sueldoHabilitado = true;
        if (this.comisionHabilitada == null) this.comisionHabilitada = true;
        if (this.repartoHabilitado == null) this.repartoHabilitado = false;
        if (this.porcentajeReparto == null) this.porcentajeReparto = BigDecimal.ZERO;
        if (this.baseReparto == null) this.baseReparto = BaseRepartoUtilidad.UTILIDAD_NETA;
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
