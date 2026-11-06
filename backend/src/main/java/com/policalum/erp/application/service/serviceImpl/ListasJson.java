package com.policalum.erp.application.service.serviceImpl;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.policalum.erp.domain.model.ProyectoPortafolio;
import java.util.List;

/** Listas cortas del portafolio, guardadas como JSON en una columna de texto. */
final class ListasJson {

    private static final ObjectMapper JSON = new ObjectMapper();
    private static final TypeReference<List<String>> LISTA = new TypeReference<>() {};

    private ListasJson() {}

    static String escribir(List<String> valores) {
        if (valores == null || valores.isEmpty()) return null;
        try {
            return JSON.writeValueAsString(valores);
        } catch (JsonProcessingException ex) {
            throw new IllegalArgumentException("No se pudieron guardar las etiquetas o las imágenes del proyecto");
        }
    }

    static List<String> leer(String crudo) {
        if (crudo == null || crudo.isBlank()) return List.of();
        try {
            List<String> lista = JSON.readValue(crudo, LISTA);
            if (lista == null) return List.of();
            return lista.stream().filter(item -> item != null && !item.isBlank()).map(String::trim).toList();
        } catch (JsonProcessingException ex) {
            return List.of();
        }
    }

    static List<String> imagenes(ProyectoPortafolio proyecto) {
        List<String> imagenes = leer(proyecto.getImagenesJson());
        if (imagenes.isEmpty() && proyecto.getImagenUrl() != null && !proyecto.getImagenUrl().isBlank()) {
            return List.of(proyecto.getImagenUrl());
        }
        return imagenes;
    }
}
