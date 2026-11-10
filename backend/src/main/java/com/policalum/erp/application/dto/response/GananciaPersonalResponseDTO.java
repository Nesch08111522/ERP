package com.policalum.erp.application.dto.response;

import com.policalum.erp.domain.enums.BaseRepartoUtilidad;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/**
 * Dos bolsillos separados para el periodo.
 *
 * <p>BOLSO 1 — GANANCIA DE LA EMPRESA ({@code empresa*}): la utilidad neta real del periodo
 * calculada por Finanzas. Ojo: esa fórmula YA restó las nóminas PAGADAS del periodo, y la
 * nómina del propio administrador está dentro de ese gasto. Su sueldo y su comisión, por
 * tanto, ya salieron del resultado de la empresa.
 *
 * <p>BOLSO 2 — GANANCIA PERSONAL DEL ADMIN ({@code personal*}): lo que el admin se lleva.
 * Suma solo los componentes que tiene habilitados en su régimen.
 *
 * <p>{@code saldoEmpresaTrasReparto} = utilidadNeta − reparto. Se resta ÚNICAMENTE el reparto,
 * porque es la parte que se distribuye como ganancia de socio; volver a restar el sueldo lo
 * contaría dos veces. Si la nómina del admin aún no está pagada, se avisa: en ese caso el
 * sueldo todavía no apareció en los gastos de la empresa.
 */
public record GananciaPersonalResponseDTO(
        UUID sedeId,
        String periodo,
        LocalDate desde,
        LocalDate hasta,

        // ── Ganancia de la empresa ──
        BigDecimal empresaVentasNetas,
        BigDecimal empresaComprasNetas,
        BigDecimal empresaUtilidadBruta,
        BigDecimal empresaGastosOperativos,
        BigDecimal empresaGastosEmpresariales,
        BigDecimal empresaUtilidadNeta,
        BigDecimal empresaMargenNetoPct,
        BigDecimal empresaRetirosSocios,

        // ── Ganancia personal del admin ──
        Boolean sueldoHabilitado,
        BigDecimal personalSueldo,
        BigDecimal personalSueldoBase,
        Integer personalDiasComputados,
        /** Divisor de la política (§8.1) usado en el periodo. null si todavía no tiene legajo. */
        Integer personalDivisorPolitica,
        PoliticaDivisionSueldo personalPoliticaDivision,

        Boolean comisionHabilitada,
        BigDecimal personalComisionPct,
        BigDecimal personalComisionBaseVentas,
        BigDecimal personalComision,

        Boolean repartoHabilitado,
        BaseRepartoUtilidad personalBaseReparto,
        BigDecimal personalPorcentajeReparto,
        BigDecimal personalMontoBaseReparto,
        BigDecimal personalTopeRepartoMensual,
        BigDecimal personalRepartoUtilidad,

        BigDecimal personalTotal,
        BigDecimal personalNominasPagadas,

        // ── Cruce entre ambos bolsillos ──
        BigDecimal saldoEmpresaTrasReparto,
        BigDecimal personalSobreEmpresaPct,

        // ── Advertencias de coherencia ──
        String advertencia
) { }
