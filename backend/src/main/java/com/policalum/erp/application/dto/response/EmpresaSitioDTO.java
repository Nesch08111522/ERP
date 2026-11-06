package com.policalum.erp.application.dto.response;

import java.util.List;

/** Lo que el sitio muestra, lo que tiene el ERP y los datos nuevos que se pueden aceptar. */
public record EmpresaSitioDTO(
        boolean personalizado,
        DatoEmpresaSitioDTO sitio,
        DatoEmpresaSitioDTO global,
        List<PropuestaEmpresaDTO> propuestas
) {}
