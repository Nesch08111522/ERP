package com.policalum.erp.domain.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.UuidGenerator;
import org.hibernate.type.SqlTypes;

import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.enums.TratamientoAusencias;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "sedes")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Sede {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(length = 100)
    private String pais = "Perú";

    @Column(length = 100)
    private String ciudad;

    @Column(length = 255)
    private String direccion;

    @Column(name = "celular_sede", length = 20)
    private String celularSede;

    @Column(length = 10)
    private String moneda = "PEN";

    @Column(nullable = false)
    private Boolean activa = true;

    /** Grados decimales. El geocodificador local los completa si la ciudad es conocida. */
    private Double latitud;

    private Double longitud;

    /** Ruta relativa en el almacén de archivos o una URL. */
    @Column(length = 500)
    private String imagen;

    // ============ POLÍTICA DE REMUNERACIÓN (§8.1, nivel SEDE) ============
    // Los tres campos son opcionales: null = "hereda de la empresa". La herencia se resuelve
    // campo por campo en PoliticaRemuneracionService, no como bloque completo.

    @Enumerated(EnumType.STRING)
    @Column(name = "politica_division", length = 20)
    private PoliticaDivisionSueldo politicaDivision;

    /** Máscara de días laborables, mismo formato que RrhhTurnoTrabajo.diasSemana. */
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "dias_laborables", columnDefinition = "jsonb")
    private List<String> diasLaborables;

    @Enumerated(EnumType.STRING)
    @Column(name = "tratamiento_ausencias", length = 30)
    private TratamientoAusencias tratamientoAusencias;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;


    @PrePersist
    public void prePersist() {
        // FIX deuda técnica: @Builder (y MapStruct, que usa el builder) ignora los inicializadores de campo
        if (this.pais == null) this.pais = "Perú";
        if (this.moneda == null) this.moneda = "PEN";
        if (this.activa == null) this.activa = true;
        this.createdAt = LocalDateTime.now();
    }

}