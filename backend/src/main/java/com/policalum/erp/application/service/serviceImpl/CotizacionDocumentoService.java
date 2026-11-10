package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.CotizacionResponseDTO;
import com.policalum.erp.application.dto.response.DetalleCotizacionResponseDTO;
import com.policalum.erp.application.service.CotizacionService;
import com.policalum.erp.domain.model.ConfiguracionEmpresa;
import com.policalum.erp.infrastructure.export.ExcelEstilos;
import com.policalum.erp.infrastructure.export.PdfCorporativo;
import com.policalum.erp.infrastructure.export.ReporteSolicitud;
import com.policalum.erp.infrastructure.repository.ConfiguracionEmpresaRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CotizacionDocumentoService {

    private final CotizacionService cotizacionService;
    private final ConfiguracionEmpresaRepository empresaRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> descargar(UUID id, String formato) {
        return descargar(id, formato, false);
    }

    /**
     * Variante pública: el documento que descarga el portal no debe desglosar la utilidad
     * de la empresa (§4: sin exposición de información privada). El total ya la incorpora.
     */
    @Transactional(readOnly = true)
    public ResponseEntity<byte[]> descargar(UUID id, String formato, boolean publico) {
        CotizacionResponseDTO cotizacion = publico ? cotizacionService.findById(id).sinMargen() : cotizacionService.findById(id);
        boolean pdf = "pdf".equalsIgnoreCase(formato);
        ReporteSolicitud solicitud = armar(cotizacion, publico);
        byte[] cuerpo = pdf ? PdfCorporativo.generar(solicitud, empresa()) : ExcelEstilos.generar(solicitud);
        String nombre = "cotizacion-" + id.toString().substring(0, 8) + (pdf ? ".pdf" : ".xlsx");
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + nombre + "\"")
                .contentType(MediaType.parseMediaType(pdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(cuerpo);
    }

    private ReporteSolicitud armar(CotizacionResponseDTO cotizacion, boolean publico) {
        List<String> filtros = new ArrayList<>(List.of(
                "Cotización: COT-" + cotizacion.id().toString().substring(0, 8).toUpperCase(),
                "Cliente: " + (cotizacion.clienteNombre() == null ? "Público" : cotizacion.clienteNombre()),
                "Estado: " + cotizacion.estado(),
                "Vigencia: " + cotizacion.fechaVigencia(),
                "Sede: " + (cotizacion.sedeNombre() == null ? "" : cotizacion.sedeNombre()),
                "Vendedor: " + (cotizacion.usuarioNombre() == null ? "" : cotizacion.usuarioNombre()),
                "Canal: " + (cotizacion.origen() == null ? "INTERNO" : cotizacion.origen())));
        if (cotizacion.createdAt() != null) {
            filtros.add("Fecha de emisión: " + cotizacion.createdAt().toLocalDate());
        }
        if (cotizacion.observaciones() != null && !cotizacion.observaciones().isBlank()) {
            filtros.add("Observaciones: " + cotizacion.observaciones());
        }
        List<List<Object>> filas = new ArrayList<>();
        BigDecimal igv = BigDecimal.ZERO;
        if (cotizacion.lineas() != null) {
            for (DetalleCotizacionResponseDTO linea : cotizacion.lineas()) {
                String concepto = linea.productoNombre() != null ? linea.productoNombre()
                        : linea.servicioNombre() != null ? linea.servicioNombre()
                        : linea.fraccionNombre() != null ? linea.fraccionNombre() : "Ítem";
                filas.add(List.of(concepto, ReporteSolicitud.texto(linea.cantidad()),
                        ReporteSolicitud.dinero(linea.precioUnitarioConIgv()),
                        ReporteSolicitud.dinero(linea.subtotal())));
                igv = igv.add(ReporteSolicitud.dinero(linea.igvLinea()));
            }
        }
        filas.add(List.of("IGV incluido", "", "", igv));
        if (cotizacion.cargos() != null) {
            var cargos = cotizacion.cargos();
            filas.add(List.of("Subtotal materiales", "", "", ReporteSolicitud.dinero(cargos.subtotalMateriales())));
            if (!publico) {
                filas.add(List.of("Utilidad " + cargos.utilidadPorcentaje() + "%", "", "", ReporteSolicitud.dinero(cargos.utilidadMonto())));
            }
            filas.add(List.of("Movilidad " + (cargos.distrito() == null ? "" : cargos.distrito()), "", "", ReporteSolicitud.dinero(cargos.movilidadMonto())));
            filas.add(List.of("Otros cargos", "", "", ReporteSolicitud.dinero(cargos.otrosMonto())));
            if (cargos.modificada() && cargos.notaCambio() != null) {
                filtros.add("La empresa modificó esta cotización: " + cargos.notaCambio());
            }
        }
        filas.add(List.of("TOTAL", "", "", ReporteSolicitud.dinero(cotizacion.total())));
        return new ReporteSolicitud("Cotización comercial", "Ventas / Cotizaciones", usuario(), filtros, List.of(
                ReporteSolicitud.Columna.texto("Concepto"),
                ReporteSolicitud.Columna.texto("Cantidad"),
                ReporteSolicitud.Columna.moneda("Precio"),
                ReporteSolicitud.Columna.moneda("Subtotal")), filas);
    }

    private PdfCorporativo.EmpresaPdf empresa() {
        ConfiguracionEmpresa empresa = empresaRepository.findById(ConfiguracionEmpresa.ID_UNICO).orElse(null);
        String nombre = empresa == null || empresa.getNombreComercial() == null ? "POLICALUM" : empresa.getNombreComercial();
        String razon = empresa == null || empresa.getRazonSocial() == null || empresa.getRazonSocial().isBlank() ? nombre : empresa.getRazonSocial();
        String ruc = empresa == null || empresa.getRuc() == null || empresa.getRuc().isBlank() ? "pendiente" : empresa.getRuc();
        byte[] logo = new byte[0];
        for (String ruta : List.of("uploads/logo.png", "frontend/public/POLICALUM.png")) {
            try {
                Path path = Path.of(ruta);
                if (Files.exists(path)) { logo = Files.readAllBytes(path); break; }
            } catch (Exception ignored) {
                logo = new byte[0];
            }
        }
        return new PdfCorporativo.EmpresaPdf(nombre, razon, ruc, empresa == null ? "" : empresa.getDireccionFiscal(), logo);
    }

    private String usuario() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null || "anonymousUser".equals(auth.getName())) return "Canal web";
        return userRepository.findByEmailAndActivoTrue(auth.getName())
                .map(user -> ((user.getNombre() == null ? "" : user.getNombre()) + " " + (user.getApellido() == null ? "" : user.getApellido())).trim())
                .orElse(auth.getName());
    }
}
