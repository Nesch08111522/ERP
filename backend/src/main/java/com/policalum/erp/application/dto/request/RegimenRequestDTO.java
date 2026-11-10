package com.policalum.erp.application.dto.request;

import com.policalum.erp.domain.enums.BaseRepartoUtilidad;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

/**
 * El administrador configura cuánto gana. Los importes de sueldo y comisión por ventas
 * propias NO se envían aquí: se leen del legajo (una sola fuente de verdad).
 *
 * @param sueldoHabilitado   cobra el sueldo base de su legajo
 * @param comisionHabilitada cobra % de comisión sobre sus ventas propias
 * @param repartoHabilitado  participa del reparto de utilidad de la empresa
 * @param porcentajeReparto  % del admin sobre la base elegida; 0-100; requiere repartoHabilitado
 * @param baseReparto        sobre qué magnitud se calcula el reparto
 * @param topeRepartoMensual tope en soles del reparto; null o 0 = sin tope
 */
public record RegimenRequestDTO(
        @NotNull(message = "Indique si cobra sueldo base")
        Boolean sueldoHabilitado,

        @NotNull(message = "Indique si cobra comisión por ventas")
        Boolean comisionHabilitada,

        @NotNull(message = "Indique si participa del reparto de utilidad")
        Boolean repartoHabilitado,

        @DecimalMin(value = "0.00", message = "El porcentaje de reparto no puede ser negativo")
        @DecimalMax(value = "100.00", message = "El porcentaje de reparto no puede superar 100%")
        @Digits(integer = 3, fraction = 2, message = "Porcentaje de reparto inválido")
        BigDecimal porcentajeReparto,

        BaseRepartoUtilidad baseReparto,

        @DecimalMin(value = "0.00", message = "El tope mensual no puede ser negativo")
        @Digits(integer = 10, fraction = 2, message = "Tope mensual inválido")
        BigDecimal topeRepartoMensual
) { }
