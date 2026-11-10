package com.policalum.erp.infrastructure.security;

import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/** Límite temprano por IP para login y QR público; el login añade otro bucket por usuario. */
@Component
public class RateLimitFilter extends OncePerRequestFilter {
    private static final String LOGIN_PATH = "/api/v1/auth/login";
    private static final String QR_PUBLICO_PATH = "/api/v1/rrhh/asistencias/qr-publico";

    private final RateLimitService rateLimitService;

    @Autowired
    public RateLimitFilter(RateLimitService rateLimitService) {
        this.rateLimitService = rateLimitService;
    }

    /** Constructor de compatibilidad para pruebas unitarias y consumidores legacy. */
    public RateLimitFilter(long loginCapacity, long loginWindowSeconds,
                           long qrCapacity, long qrWindowSeconds) {
        this(new RateLimitService(loginCapacity, loginWindowSeconds, qrCapacity, qrWindowSeconds));
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = requestPath(request);
        return !(LOGIN_PATH.equals(path) || QR_PUBLICO_PATH.equals(path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = requestPath(request);
        ConsumptionProbe probe = LOGIN_PATH.equals(path)
                ? rateLimitService.consumirLoginIp(ipDe(request))
                : rateLimitService.consumirQrIp(ipDe(request));
        if (!probe.isConsumed()) {
            escribirDemasiadasPeticiones(response, probe);
            return;
        }
        chain.doFilter(request, response);
    }

    static void escribirDemasiadasPeticiones(HttpServletResponse response, ConsumptionProbe probe) throws IOException {
        long retryAfterSeconds = Math.max(1, probe.getNanosToWaitForRefill() / 1_000_000_000L);
        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"error\":\"demasiadas_peticiones\",\"retryAfterSeconds\":" + retryAfterSeconds + "}");
    }

    private static String requestPath(HttpServletRequest request) {
        String uri = request.getRequestURI();
        String ctx = request.getContextPath();
        if (ctx != null && !ctx.isEmpty() && uri.startsWith(ctx)) uri = uri.substring(ctx.length());
        return uri;
    }

    /** Para producción debe configurarse el proxy para sobrescribir este encabezado de forma confiable. */
    static String ipDe(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        String ip = header != null && !header.isBlank() ? header.split(",")[0].trim() : request.getRemoteAddr();
        return ip == null ? "unknown" : ip;
    }
}