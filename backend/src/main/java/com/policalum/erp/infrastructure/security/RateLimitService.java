package com.policalum.erp.infrastructure.security;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import java.time.Duration;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

/** Token buckets acotados para proteger endpoints sensibles por IP y por usuario. */
@Service
public class RateLimitService {
    private final Cache<String, Bucket> buckets = Caffeine.newBuilder()
            .expireAfterAccess(Duration.ofMinutes(5))
            .maximumSize(200_000)
            .build();

    private final long loginCapacity;
    private final Duration loginWindow;
    private final long qrCapacity;
    private final Duration qrWindow;

    public RateLimitService(
            @Value("${app.rate-limit.login.capacity:10}") long loginCapacity,
            @Value("${app.rate-limit.login.window-seconds:60}") long loginWindowSeconds,
            @Value("${app.rate-limit.qr-publico.capacity:30}") long qrCapacity,
            @Value("${app.rate-limit.qr-publico.window-seconds:60}") long qrWindowSeconds) {
        this.loginCapacity = positivo(loginCapacity, 10);
        this.loginWindow = Duration.ofSeconds(positivo(loginWindowSeconds, 60));
        this.qrCapacity = positivo(qrCapacity, 30);
        this.qrWindow = Duration.ofSeconds(positivo(qrWindowSeconds, 60));
    }

    public ConsumptionProbe consumirLoginIp(String ip) {
        return consumir("login:ip:" + normalizar(ip), loginCapacity, loginWindow);
    }

    public ConsumptionProbe consumirLoginUsuario(String email) {
        return consumir("login:user:" + normalizar(email), loginCapacity, loginWindow);
    }

    public ConsumptionProbe consumirQrIp(String ip) {
        return consumir("qr:ip:" + normalizar(ip), qrCapacity, qrWindow);
    }

    private ConsumptionProbe consumir(String clave, long capacidad, Duration ventana) {
        return buckets.get(clave, ignored -> Bucket.builder()
                .addLimit(Bandwidth.builder().capacity(capacidad).refillIntervally(capacidad, ventana).build())
                .build()).tryConsumeAndReturnRemaining(1);
    }

    private static String normalizar(String value) {
        return value == null || value.isBlank() ? "unknown" : value.trim().toLowerCase(Locale.ROOT);
    }

    private static long positivo(long value, long fallback) {
        return value > 0 ? value : fallback;
    }
}
