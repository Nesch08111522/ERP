package com.policalum.erp.infrastructure.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import java.util.UUID;
import org.springframework.stereotype.Component;

/**
 * Un QR de asistencia es de un solo uso.
 *
 * <p>El código TOTP es válido durante la ventana actual y la anterior (tolerancia de reloj,
 * ver {@code TotpService.verify}). Sin este control, fotografiar el QR y volver a presentarlo
 * dentro de esa tolerancia genera una segunda marcación: en las pruebas del 2026-11-06 reenviar
 * el mismo QR produjo una SALIDA 0,1 s después de la ENTRADA, algo que el §2.3.7 de la
 * especificación prohíbe ("se impide registrar dos entradas incompatibles para el mismo turno").
 *
 * <p>Se marca la pareja (empleado, ventana) y no el código completo: así sigue funcionando el
 * caso legítimo de dos personas distintas marcando con el QR público de la misma ventana, y se
 * bloquea solo la repetición del mismo empleado.
 *
 * <p>Mismo alcance que {@link TokenDenylist}: es por proceso. Si el ERP llegara a correr en
 * varias instancias detrás de un balanceador, esto debe migrar a la base o a un almacén común.
 */
@Component
public class MarcacionQrUnica {

    /** La ventana TOTP es de 60 s y se acepta la anterior: con 5 min basta y sobra. */
    private static final Duration TTL = Duration.ofMinutes(5);

    private final Cache<String, Boolean> consumidos = Caffeine.newBuilder()
            .expireAfterWrite(TTL)
            .maximumSize(50_000)
            .build();

    /** true si la marcación puede registrarse; false si esa ventana ya se usó para este empleado. */
    public boolean registrar(UUID empleadoId, long ventana) {
        if (empleadoId == null) return true;
        String clave = empleadoId + "|" + ventana;
        // asMap().putIfAbsent es atómico: dos escaneos simultáneos no pasan los dos.
        return consumidos.asMap().putIfAbsent(clave, Boolean.TRUE) == null;
    }

    /** Devuelve el permiso cuando la transacción asociada no llegó a completarse. */
    public void liberar(UUID empleadoId, long ventana) {
        if (empleadoId == null) return;
        consumidos.asMap().remove(empleadoId + "|" + ventana);
    }

    public boolean yaUsada(UUID empleadoId, long ventana) {
        return empleadoId != null && consumidos.getIfPresent(empleadoId + "|" + ventana) != null;
    }
}
