package com.policalum.erp.application.dto.response;

/** Nombre, RUC, teléfono y ubicación que comparten la configuración global y el sitio. */
public record DatoEmpresaSitioDTO(
        String nombreComercial,
        String razonSocial,
        String ruc,
        String telefono,
        String email,
        String direccionFiscal,
        String ubigeo
) {}
