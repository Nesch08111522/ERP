package com.policalum.erp.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;

/**
 * Parámetros de RRHH (Módulo 14): la política de división mensual, días laborables y
 * tratamiento de ausencias que exige §8.1.
 *
 * <p>Es el valor de la <b>empresa</b>. Puede sobreescribirse por sede ({@code Sede}) y por
 * empleado ({@code RrhhLegajoDigital}); en ambos casos null significa "hereda del nivel
 * superior". La cadena completa la resuelve {@code PoliticaRemuneracionService}.
 *
 * <p>Se guarda acá y no en {@code ConfiguracionEmpresa} a propósito: el PUT de empresa exige
 * RUC, razón social, dirección y ubigeo validados, y obligar a reescribirlos para cambiar una
 * regla de planilla sería un error de diseño.
 */
@Entity
@Table(name = "configuracion_rrhh")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class ConfiguracionRrhh {

    /** Tabla de una sola fila (empresa única): el id siempre es 1. */
    public static final Long ID_UNICO = 1L;

    public static final PoliticaDivisionSueldo DIVISION_DEFAULT = PoliticaDivisionSueldo.DIAS_30;
    public static final TratamientoAusencias AUSENCIAS_DEFAULT = TratamientoAusencias.NO_AFECTA;

    /**
     * Días laborables de la empresa cuando la política es DIAS_LABORABLES. Mismo formato y
     * mismos nombres que {@code RrhhTurnoTrabajo.diasSemana} (jsonb, "LUNES" a "DOMINGO").
     */
    public static final List<String> DIAS_LABORABLES_DEFAULT =
            List.of("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES");

    @Id
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "politica_division", nullable = false, length = 20)
    private PoliticaDivisionSueldo politicaDivision;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dias_laborables", columnDefinition = "jsonb")
    private List<String> diasLaborables;

    @Enumerated(EnumType.STRING)
    @Column(name = "tratamiento_ausencias", nullable = false, length = 30)
    private TratamientoAusencias tratamientoAusencias;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "actualizado_por")
    private User actualizadoPor;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    void prePersist() {
        // FIX: @Builder ignora los inicializadores de campo (lección ya documentada en Sede).
        if (this.id == null) this.id = ID_UNICO;
        if (this.politicaDivision == null) this.politicaDivision = DIVISION_DEFAULT;
        if (this.tratamientoAusencias == null) this.tratamientoAusencias = AUSENCIAS_DEFAULT;
        if (this.diasLaborables == null || this.diasLaborables.isEmpty()) {
            this.diasLaborables = DIAS_LABORABLES_DEFAULT;
        }
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
