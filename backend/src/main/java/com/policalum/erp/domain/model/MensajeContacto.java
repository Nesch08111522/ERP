package com.policalum.erp.domain.model;

import com.policalum.erp.domain.enums.EstadoMensajeWeb;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.UuidGenerator;

/** Prospecto que llega del formulario de contacto del portal. */
@Entity
@Table(name = "mensajes_web")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MensajeContacto {

    @Id
    @GeneratedValue
    @UuidGenerator
    @Column(updatable = false, nullable = false)
    private UUID id;

    @Column(nullable = false, length = 120)
    private String nombre;

    @Column(nullable = false, length = 150)
    private String correo;

    @Column(length = 20)
    private String telefono;

    @Column(length = 150)
    private String empresa;

    @Column(nullable = false, length = 120)
    private String asunto;

    @Column(name = "tipo_mensaje", length = 20)
    private String tipoMensaje;

    @Column(name = "documento_tipo", length = 20)
    private String documentoTipo;

    @Column(name = "documento_numero", length = 20)
    private String documentoNumero;

    @Column(length = 200)
    private String direccion;

    @Column(length = 160)
    private String bien;

    @Column(length = 40)
    private String monto;

    @Column(length = 1000)
    private String pedido;

    @Column(nullable = false, length = 2000)
    private String mensaje;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private EstadoMensajeWeb estado = EstadoMensajeWeb.NUEVO;

    /** Null o falso: todavía no lo abrieron en la bandeja. */
    private Boolean leido;

    /** Null o falso: sigue en la bandeja principal. */
    private Boolean archivado;

    @Column(length = 500)
    private String notaGestion;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "gestionado_at")
    private LocalDateTime gestionadoAt;

    @PrePersist
    void prePersist() {
        if (estado == null) estado = EstadoMensajeWeb.NUEVO;
        if (createdAt == null) createdAt = LocalDateTime.now();
    }
}
