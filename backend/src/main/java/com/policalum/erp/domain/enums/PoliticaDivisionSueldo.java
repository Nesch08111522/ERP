package com.policalum.erp.domain.enums;

/**
 * Cómo se convierte un sueldo mensual en costo diario (§8.1: "no asumir automáticamente que
 * todos los casos se dividen entre 30").
 *
 * <p>La misma política define el divisor y la base de conteo de días: si se elige
 * {@code DIAS_LABORABLES}, el prorrateo por ingreso tardío cuenta días laborables, no días
 * de calendario. Mezclar ambas (contar calendario y dividir entre laborables) daría un sueldo
 * mayor que el pactado.
 */
public enum PoliticaDivisionSueldo {

    /** Convención legal peruana: mes de 30 días, sin importar cuántos tenga. Es el valor que
     *  el sistema ya usaba, y por eso sigue siendo el default: no cambia ni un céntimo emitido. */
    DIAS_30,

    /** Días reales del mes (28, 29, 30 o 31). Coherente con calendarios y con meses cortos. */
    DIAS_CALENDARIO,

    /** Solo los días cuyo día de semana está en la máscara de días laborables.
     *  Exige máscara no vacía. Es la base correcta cuando el pago es por día trabajado. */
    DIAS_LABORABLES;
}
