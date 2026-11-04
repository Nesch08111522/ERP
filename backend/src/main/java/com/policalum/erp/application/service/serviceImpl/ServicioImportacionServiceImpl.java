package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.domain.model.Servicio;
import com.policalum.erp.infrastructure.export.ExcelEstilos;
import com.policalum.erp.infrastructure.export.ReporteSolicitud;
import com.policalum.erp.infrastructure.repository.ServicioRepository;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.DataFormatter;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class ServicioImportacionServiceImpl {

    private final ServicioRepository repository;

    public byte[] plantilla() {
        ReporteSolicitud solicitud = new ReporteSolicitud(
                "Plantilla de servicios", "Servicios", "sistema",
                List.of("Columnas: nombre, descripcion, precio, activo (true/false)."),
                List.of(ReporteSolicitud.Columna.texto("nombre"), ReporteSolicitud.Columna.texto("descripcion"),
                        ReporteSolicitud.Columna.moneda("precio"), ReporteSolicitud.Columna.texto("activo")),
                List.of(List.of("Instalación de plancha", "Incluye mano de obra", new BigDecimal("80.00"), "true")));
        return ExcelEstilos.generar(solicitud);
    }

    @Transactional
    public Map<String, Integer> importar(MultipartFile archivo) {
        if (archivo == null || archivo.isEmpty()) throw new IllegalArgumentException("Adjunta un archivo CSV o Excel");
        String nombre = archivo.getOriginalFilename() == null ? "" : archivo.getOriginalFilename().toLowerCase(Locale.ROOT);
        List<String[]> filas = nombre.endsWith(".xlsx") || nombre.endsWith(".xls") ? leerExcel(archivo) : leerCsv(archivo);
        int creados = 0;
        int actualizados = 0;
        for (int indice = 0; indice < filas.size(); indice++) {
            String[] fila = filas.get(indice);
            int numeroFila = indice + 1;
            if (fila.length == 0 || fila[0].isBlank() || fila[0].equalsIgnoreCase("nombre")) continue;
            if (fila.length < 3) {
                throw new IllegalArgumentException("Fila " + numeroFila + ": se requieren nombre, descripción y precio");
            }
            String titulo = fila[0].trim();
            String descripcion = fila.length > 1 ? fila[1].trim() : "";
            BigDecimal precio;
            try {
                precio = new BigDecimal(fila[2].trim().replace(",", ""));
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Fila " + numeroFila + ": el precio no es válido", e);
            }
            boolean activo = fila.length < 4 || fila[3].isBlank() || parseActivo(fila[3], numeroFila);
            Servicio servicio = repository.findByNombreIgnoreCase(titulo).orElseGet(Servicio::new);
            boolean nuevo = servicio.getId() == null;
            servicio.setNombre(titulo);
            servicio.setDescripcion(descripcion);
            servicio.setPrecio(precio);
            servicio.setActivo(activo);
            repository.save(servicio);
            if (nuevo) creados++; else actualizados++;
        }
        return Map.of("creados", creados, "actualizados", actualizados);
    }

    private boolean parseActivo(String valor, int numeroFila) {
        if ("true".equalsIgnoreCase(valor.trim())) return true;
        if ("false".equalsIgnoreCase(valor.trim())) return false;
        throw new IllegalArgumentException("Fila " + numeroFila + ": activo debe ser true o false");
    }

    private List<String[]> leerCsv(MultipartFile archivo) {
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(archivo.getInputStream(), StandardCharsets.UTF_8))) {
            String contenido = reader.lines().collect(java.util.stream.Collectors.joining("\n"));
            if (contenido.startsWith("\uFEFF")) contenido = contenido.substring(1);
            char separador = detectarSeparador(contenido);
            List<String[]> filas = new ArrayList<>();
            List<String> campos = new ArrayList<>();
            StringBuilder campo = new StringBuilder();
            boolean entreComillas = false;
            boolean despuesDeComillas = false;
            int numeroFila = 1;

            for (int i = 0; i < contenido.length(); i++) {
                char actual = contenido.charAt(i);
                if (entreComillas) {
                    if (actual == '"' && i + 1 < contenido.length() && contenido.charAt(i + 1) == '"') {
                        campo.append('"');
                        i++;
                    } else if (actual == '"') {
                        entreComillas = false;
                        despuesDeComillas = true;
                    } else {
                        campo.append(actual);
                        if (actual == '\n') numeroFila++;
                    }
                } else if (despuesDeComillas && actual != separador && actual != '\n' && actual != '\r') {
                    throw new IllegalArgumentException("Fila " + numeroFila + ": formato CSV inválido después de las comillas");
                } else if (actual == '"' && campo.isEmpty()) {
                    entreComillas = true;
                } else if (actual == separador) {
                    campos.add(campo.toString());
                    campo.setLength(0);
                    despuesDeComillas = false;
                } else if (actual == '\n' || actual == '\r') {
                    if (actual == '\r' && i + 1 < contenido.length() && contenido.charAt(i + 1) == '\n') i++;
                    campos.add(campo.toString());
                    filas.add(campos.toArray(String[]::new));
                    campos.clear();
                    campo.setLength(0);
                    despuesDeComillas = false;
                    numeroFila++;
                } else {
                    campo.append(actual);
                }
            }
            if (entreComillas) throw new IllegalArgumentException("Fila " + numeroFila + ": campo CSV sin comillas de cierre");
            if (campo.length() > 0 || !campos.isEmpty()) {
                campos.add(campo.toString());
                filas.add(campos.toArray(String[]::new));
            }
            return filas;
        } catch (IOException e) {
            throw new IllegalArgumentException("No se pudo leer el CSV", e);
        }
    }

    private char detectarSeparador(String contenido) {
        boolean entreComillas = false;
        int comas = 0;
        int puntoYComas = 0;
        for (int i = 0; i < contenido.length(); i++) {
            char actual = contenido.charAt(i);
            if (actual == '"' && entreComillas && i + 1 < contenido.length() && contenido.charAt(i + 1) == '"') {
                i++;
            } else if (actual == '"') {
                entreComillas = !entreComillas;
            } else if (!entreComillas && (actual == '\n' || actual == '\r')) {
                break;
            } else if (!entreComillas && actual == ',') {
                comas++;
            } else if (!entreComillas && actual == ';') {
                puntoYComas++;
            }
        }
        return puntoYComas > comas ? ';' : ',';
    }

    private List<String[]> leerExcel(MultipartFile archivo) {
        try (var libro = WorkbookFactory.create(archivo.getInputStream())) {
            Sheet hoja = libro.getSheet("Datos") != null ? libro.getSheet("Datos") : libro.getSheetAt(0);
            DataFormatter formato = new DataFormatter();
            List<String[]> filas = new ArrayList<>();
            for (Row row : hoja) {
                String[] valores = new String[4];
                for (int i = 0; i < 4; i++) valores[i] = formato.formatCellValue(row.getCell(i)).trim();
                if (!valores[0].isBlank()) filas.add(valores);
            }
            return filas;
        } catch (Exception e) {
            throw new IllegalArgumentException("No se pudo leer el Excel");
        }
    }
}
