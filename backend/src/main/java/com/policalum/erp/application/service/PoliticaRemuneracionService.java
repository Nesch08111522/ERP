package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.response.PoliticaRemuneracionDTO;
import com.policalum.erp.domain.enums.PoliticaDivisionSueldo;
import com.policalum.erp.domain.model.RrhhLegajoDigital;
import java.math.BigDecimal;
import java.time.YearMonth;
import java.util.UUID;

/**
 * Política de división mensual, días laborables y tratamiento de ausencias (§8.1), y su
 * aplicación al prorrateo de un sueldo.
 *
 * <p>Existe una sola definición de estas reglas a propósito. Antes, {@code NominaServiceImpl}
 * tenía {@code DIAS_MES = 30} y {@code RegimenRemuneracionServiceImpl} reusaba esa constante;
 * cualquier cambio de política exigía tocar los dos. Ahora los dos preguntan acá.
 */
public interface PoliticaRemuneracionService {

    /**
     * Sueldo del periodo ya resuelto: días computados, divisor usado, la política que lo produjo
     * y el importe. Se guarda en la nómina como snapshot, para que cambiar la política después
     * no reescriba una boleta emitida.
     *
     * @param divisor los días en que se divide según la política del mes dado
     */
    record LiquidacionSueldo(int diasComputados, int divisor, PoliticaDivisionSueldo politica,
                             BigDecimal sueldo) {
        public boolean mesCompleto() { return divisor > 0 && diasComputados >= divisor; }
    }

    /**
     * Política efectiva de un legajo, resuelta empleado → sede → empresa, campo por campo.
     * Un nivel solo gana si definió ese campo: null significa "hereda".
     */
    PoliticaRemuneracionDTO resolver(RrhhLegajoDigital legajo);

    /** Prorrateo del sueldo del legajo en el periodo, con la política efectiva. */
    LiquidacionSueldo liquidar(RrhhLegajoDigital legajo, YearMonth periodo);

    /**
     * Política efectiva del legajo de un empleado, para que la pantalla pueda mostrar qué nivel
     * ganó y entre cuántos días se divide este mes. Solo ADMIN.
     */
    PoliticaRemuneracionDTO deEmpleado(UUID empleadoId);

    /** Política efectiva del usuario autenticado. Cualquier rol, solo la suya (§2.4). */
    PoliticaRemuneracionDTO mia();
}
