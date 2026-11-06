package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.response.DatoEmpresaSitioDTO;
import com.policalum.erp.application.dto.response.PropuestaEmpresaDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/** Decide qué dato del ERP se ofrece al sitio y cuál queda pendiente. */
public final class EmpresaSitioVinculo {

    private static final List<Campo> CAMPOS = List.of(
            new Campo("nombreComercial", "Nombre"),
            new Campo("razonSocial", "Razón social"),
            new Campo("ruc", "RUC"),
            new Campo("telefono", "Teléfono"),
            new Campo("email", "Correo"),
            new Campo("direccionFiscal", "Dirección"),
            new Campo("ubigeo", "Ubigeo"));

    private EmpresaSitioVinculo() {}

    public static List<PropuestaEmpresaDTO> propuestas(DatoEmpresaSitioDTO origen, DatoEmpresaSitioDTO global, DatoEmpresaSitioDTO sitio) {
        List<PropuestaEmpresaDTO> salida = new ArrayList<>();
        for (Campo campo : CAMPOS) {
            if (igual(campo.leer(origen), campo.leer(global))) continue;
            salida.add(new PropuestaEmpresaDTO(campo.clave, campo.etiqueta, texto(campo.leer(sitio)), texto(campo.leer(global))));
        }
        return salida;
    }

    public static DatoEmpresaSitioDTO origenAlGuardar(
            DatoEmpresaSitioDTO previo,
            DatoEmpresaSitioDTO global,
            DatoEmpresaSitioDTO sitio,
            Set<String> descartados,
            boolean yaPersonalizado) {
        if (!yaPersonalizado || previo == null) return global;
        return new DatoEmpresaSitioDTO(
                elegir("nombreComercial", previo.nombreComercial(), global.nombreComercial(), sitio.nombreComercial(), descartados),
                elegir("razonSocial", previo.razonSocial(), global.razonSocial(), sitio.razonSocial(), descartados),
                elegir("ruc", previo.ruc(), global.ruc(), sitio.ruc(), descartados),
                elegir("telefono", previo.telefono(), global.telefono(), sitio.telefono(), descartados),
                elegir("email", previo.email(), global.email(), sitio.email(), descartados),
                elegir("direccionFiscal", previo.direccionFiscal(), global.direccionFiscal(), sitio.direccionFiscal(), descartados),
                elegir("ubigeo", previo.ubigeo(), global.ubigeo(), sitio.ubigeo(), descartados));
    }

    private static String elegir(String clave, String previo, String global, String sitio, Set<String> descartados) {
        if (igual(sitio, global) || descartados.contains(clave) || igual(previo, global)) return texto(global);
        return texto(previo);
    }

    private static boolean igual(String izquierda, String derecha) {
        return texto(izquierda).equals(texto(derecha));
    }

    private static String texto(String valor) {
        return valor == null ? "" : valor.trim();
    }

    private record Campo(String clave, String etiqueta) {
        String leer(DatoEmpresaSitioDTO dato) {
            if (dato == null) return "";
            return switch (clave) {
                case "nombreComercial" -> dato.nombreComercial();
                case "razonSocial" -> dato.razonSocial();
                case "ruc" -> dato.ruc();
                case "telefono" -> dato.telefono();
                case "email" -> dato.email();
                case "direccionFiscal" -> dato.direccionFiscal();
                case "ubigeo" -> dato.ubigeo();
                default -> "";
            };
        }
    }
}
