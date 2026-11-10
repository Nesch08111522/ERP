package com.policalum.erp.domain.enums;

/**
 * Nivel de la cadena de herencia del que salió una decisión de política de remuneración.
 *
 * <p>Se expone en la respuesta para que la pantalla pueda decir "esto viene de la sede" en vez
 * de mostrar un valor que parece no tener efecto. Sin esto, el administrador configura un
 * override y no tiene forma de saber cuál de los tres niveles ganó.
 */
public enum AmbitoPoliticaRemuneracion {
    EMPLEADO, SEDE, EMPRESA
}
