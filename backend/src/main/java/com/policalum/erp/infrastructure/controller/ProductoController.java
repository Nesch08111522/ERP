package com.policalum.erp.infrastructure.controller;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.net.URI;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.policalum.erp.application.dto.request.ProductoImportacionFilaDTO;
import com.policalum.erp.application.dto.request.ProductoImportacionRequestDTO;
import com.policalum.erp.application.dto.request.ProductoRequestDTO;
import com.policalum.erp.application.dto.response.ProductoImportacionResultadoDTO;
import com.policalum.erp.application.dto.response.ProductoResponseDTO;
import com.policalum.erp.application.dto.response.ProductoStockResumenDTO;
import com.policalum.erp.application.service.ProductoImportacionService;
import com.policalum.erp.application.service.ProductoService;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.application.service.serviceImpl.ProductoImagenService;
import com.policalum.erp.domain.enums.TipoProducto;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

/**
 * Controlador REST para la gestión integral de productos y su catálogo de fracciones.
 */
@Tag(name = "Catálogo")
@RestController
@PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'leer')")
@RequestMapping("/api/v1/productos")
@RequiredArgsConstructor
public class ProductoController {

    private final ProductoService productoService;
    private final ProductoImportacionService productoImportacionService;
    private final ProductoImagenService productoImagenService;
    private final StockService stockService;

    /**
     * Registra un nuevo producto en el sistema.
     * <p>
     * Si el body incluye {@code almacenId} y {@code stockInicial > 0}, además se crea
     * la fila de Stock en ese almacén y el movimiento de apertura en el Kardex.
     * </p>
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'crear')")
    public ResponseEntity<ProductoResponseDTO> create(@Valid @RequestBody ProductoRequestDTO requestDTO) {
        ProductoResponseDTO response = productoService.create(requestDTO);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    /**
     * Actualiza la información de un producto existente.
     */
    @PutMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'editar')")
    public ResponseEntity<ProductoResponseDTO> update(
            @PathVariable UUID id,
            @Valid @RequestBody ProductoRequestDTO requestDTO) {
        return ResponseEntity.ok(productoService.update(id, requestDTO));
    }

    /** Actualiza el producto y, si viene un archivo, guarda la imagen. Sin archivo, usa la URL del JSON. */
    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'editar')")
    public ResponseEntity<ProductoResponseDTO> updateConImagen(
            @PathVariable UUID id,
            @RequestPart("producto") @Valid ProductoRequestDTO requestDTO,
            @RequestPart(value = "archivo", required = false) MultipartFile archivo) {
        return ResponseEntity.ok(productoService.update(id, productoImagenService.aplicar(requestDTO, archivo)));
    }

    /**
     * Obtiene el detalle de un producto por su ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ProductoResponseDTO> findById(@PathVariable UUID id) {
        return ResponseEntity.ok(productoService.findById(id));
    }

    /**
     * Existencias del producto con almacén + sede. Útil para el form de edición.
     */
    @GetMapping("/{id}/stock")
    public ResponseEntity<List<ProductoStockResumenDTO>> findStockByProducto(@PathVariable UUID id) {
        return ResponseEntity.ok(stockService.findResumenPorProducto(id));
    }

    /**
     * Consulta paginada y filtrada del catálogo de productos.
     * <p>
     * Si se envía {@code sedeId} o {@code almacenId}, se filtra por ubicación:
     * un producto aparece si tiene al menos una fila de Stock en un almacén de esa sede
     * (o en el almacén indicado). Cantidad 0 cuenta como pertenencia.
     * </p>
     */
    @GetMapping
    public ResponseEntity<Page<ProductoResponseDTO>> search(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) TipoProducto tipo,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) Boolean esFraccionable,
            @RequestParam(required = false) UUID sedeId,
            @RequestParam(required = false) UUID almacenId,
            @PageableDefault(size = 20) Pageable pageable) {

        Page<ProductoResponseDTO> result;
        if (sedeId != null || almacenId != null) {
            result = productoService.searchPorUbicacion(
                    searchTerm, categoriaId, tipo, activo, esFraccionable, sedeId, almacenId, pageable);
        } else {
            result = productoService.search(
                    searchTerm, categoriaId, tipo, activo, esFraccionable, pageable);
        }

        return ResponseEntity.ok(result);
    }

    /**
     * Elimina un producto por su ID.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'eliminar')")
    public ResponseEntity<ProductoResponseDTO> delete(@PathVariable UUID id) {
        ProductoResponseDTO respuesta = productoService.delete(id);
        if (respuesta == null) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(respuesta);
    }

    /**
     * Verifica la disponibilidad de un código SKU.
     */
    @GetMapping("/check-sku")
    public ResponseEntity<Map<String, Boolean>> isSkuDisponible(
            @RequestParam String codigoSku,
            @RequestParam(required = false) UUID excludeId) {

        boolean disponible = productoService.isSkuDisponible(codigoSku, excludeId);
        return ResponseEntity.ok(Map.of("disponible", disponible));
    }

    /**
     * Obtiene las estadísticas globales del catálogo para el dashboard.
     */
    @GetMapping("/dashboard/statistics")
    public ResponseEntity<Map<String, Object>> getDashboardStatistics() {
        return ResponseEntity.ok(productoService.getDashboardStatistics());
    }

    /**
     * Importa el catálogo desde JSON (el Excel se lee en el navegador).
     * Si una fila falla, no se guarda ninguna.
     */
    @PostMapping("/importacion-masiva")
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'crear')")
    public ResponseEntity<ProductoImportacionResultadoDTO> importar(@Valid @RequestBody ProductoImportacionRequestDTO request) {
        return ResponseEntity.ok(productoImportacionService.importar(request));
    }

    /** Catálogo en el mismo formato de la importación, para que Angular arme el archivo. */
    @GetMapping("/exportacion")
    public ResponseEntity<List<ProductoImportacionFilaDTO>> exportar(
            @RequestParam(required = false) String searchTerm,
            @RequestParam(required = false) UUID categoriaId,
            @RequestParam(required = false) TipoProducto tipo,
            @RequestParam(required = false) Boolean activo,
            @RequestParam(required = false) Boolean esFraccionable) {
        return ResponseEntity.ok(productoImportacionService.exportar(searchTerm, categoriaId, tipo, activo, esFraccionable));
    }

    @PostMapping(value = "/imagenes", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('ADMIN','MULTIFUNCIONAL') and @rolePermissionGuard.permite(authentication, 'productos', 'editar')")
    public ResponseEntity<Map<String, String>> subirImagen(@RequestParam("archivo") MultipartFile archivo) {
        return ResponseEntity.ok(Map.of("ruta", productoImagenService.guardar(archivo)));
    }

    @GetMapping("/imagenes")
    public ResponseEntity<Resource> verImagen(@RequestParam String ruta) {
        Resource resource = productoImagenService.cargar(ruta);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + (resource.getFilename() != null ? resource.getFilename() : "imagen") + "\"")
                .contentType(tipoImagen(resource.getFilename()))
                .body(resource);
    }

    private MediaType tipoImagen(String nombre) {
        String lower = nombre == null ? "" : nombre.toLowerCase(Locale.ROOT);
        if (lower.endsWith(".png")) return MediaType.IMAGE_PNG;
        if (lower.endsWith(".webp")) return MediaType.parseMediaType("image/webp");
        if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) return MediaType.IMAGE_JPEG;
        return MediaType.APPLICATION_OCTET_STREAM;
    }
}