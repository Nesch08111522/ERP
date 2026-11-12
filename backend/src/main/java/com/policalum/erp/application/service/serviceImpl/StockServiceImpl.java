package com.policalum.erp.application.service.serviceImpl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policalum.erp.application.dto.request.KardexMovimientoRequestDTO;
import com.policalum.erp.application.dto.request.StockRequestDTO;
import com.policalum.erp.application.dto.response.ProductoStockResumenDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.application.mapper.StockMapper;
import com.policalum.erp.application.service.KardexService;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.TipoMovimiento;
import com.policalum.erp.domain.enums.TipoReferencia;
import com.policalum.erp.domain.model.Almacen;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.Stock;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.AlmacenRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;
    private final ProductoRepository productoRepository;
    private final AlmacenRepository almacenRepository;
    private final KardexService kardexService;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public StockResponseDTO findByAlmacenAndProducto(UUID almacenId, UUID productoId) {
        Almacen almacen = almacenConAcceso(almacenId);
        Stock stock = stockRepository.findByAlmacen_IdAndProducto_Id(almacen.getId(), productoId)
                .orElseThrow(() -> new ResourceNotFoundException("No existe stock para ese producto en ese almacén"));
        return stockMapper.toResponseDto(stock);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockResponseDTO> findByProducto(UUID productoId) {
        return stockRepository.findByProducto_Id(productoId).stream()
                .map(stockMapper::toResponseDto)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockResponseDTO> searchByAlmacen(UUID almacenId, String searchTerm, boolean soloBajoStock, Pageable pageable) {
        String normalizedSearchTerm = searchTerm == null || searchTerm.isBlank() ? null : searchTerm.trim();
        return stockRepository.searchByAlmacen(almacenId, normalizedSearchTerm, soloBajoStock, pageable)
                .map(stockMapper::toResponseDto);
    }

    /**
     * Carga directa del stock de un (almacén, producto): el cliente dice la cantidad FINAL y el
     * sistema mueve solo la diferencia por kardex, para que el kardex siga siendo la fuente de
     * verdad y no se pierda trazabilidad.
     *
     * <p>Hasta ahora este método lanzaba {@code UnsupportedOperationException}, o sea que
     * {@code POST /api/v1/stock} devolvía 500 siempre. Las reglas que implementa son las que ya
     * estaban escritas en {@code StockServiceImplTest}.
     */
    @Override
    public StockResponseDTO saveOrUpdate(StockRequestDTO dto) {
        if (dto.cantidad() == null || dto.cantidad().signum() < 0) {
            throw new jakarta.validation.ValidationException("La cantidad no puede ser negativa");
        }

        Almacen almacen = almacenConAcceso(dto.almacen().getId());
        Producto producto = dto.producto();
        if (producto == null || producto.getId() == null) {
            throw new jakarta.validation.ValidationException("El producto es obligatorio");
        }

        // Si no existe la fila, se crea en cero y se vuelve a leer: así la entrada completa
        // queda registrada como movimiento de kardex y no como un setter directo de cantidad.
        Stock stock = stockRepository.findByAlmacen_IdAndProducto_Id(almacen.getId(), producto.getId())
                .orElseGet(() -> {
                    stockRepository.save(Stock.builder()
                            .producto(producto)
                            .almacen(almacen)
                            .cantidad(BigDecimal.ZERO)
                            .stockMinimo(BigDecimal.ZERO)
                            .build());
                    return stockRepository.findByAlmacen_IdAndProducto_Id(almacen.getId(), producto.getId())
                            .orElseThrow(() -> new ResourceNotFoundException(
                                    "No se pudo crear la fila de stock"));
                });

        BigDecimal anterior = stock.getCantidad() == null ? BigDecimal.ZERO : stock.getCantidad();
        BigDecimal objetivo = dto.cantidad();
        BigDecimal diferencia = objetivo.subtract(anterior);

        if (diferencia.signum() != 0) {
            kardexService.registrarMovimiento(new KardexMovimientoRequestDTO(
                    producto,
                    almacen,
                    null,
                    TipoReferencia.AJUSTE,
                    diferencia.signum() > 0 ? TipoMovimiento.ENTRADA : TipoMovimiento.SALIDA,
                    diferencia.abs(),
                    objetivo,
                    usuarioActual(),
                    "Carga directa de stock: " + anterior.stripTrailingZeros().toPlainString()
                            + " -> " + objetivo.stripTrailingZeros().toPlainString()));
        }

        if (dto.stockMinimo() != null) stock.setStockMinimo(dto.stockMinimo());
        stock.setUpdatedAt(LocalDateTime.now());
        Stock guardado = stockRepository.save(stock);
        return stockMapper.toResponseDto(guardado);
    }

    

@Override
public Stock registrarStockInicial(UUID productoId,
                                   UUID almacenId,
                                   BigDecimal cantidad,
                                   BigDecimal stockMinimo,
                                   BigDecimal stockMaximo,
                                   BigDecimal puntoReposicion) {
    if (cantidad == null || cantidad.signum() < 0) {
        throw new ValidationException("El stock inicial no puede ser negativo");
    }
    Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
    Almacen almacen = almacenRepository.findById(almacenId)
            .orElseThrow(() -> new ResourceNotFoundException("Almacén no encontrado"));
    if (Boolean.FALSE.equals(almacen.getActivo())) {
        throw new ValidationException("El almacén está inactivo");
    }

    Stock stock = stockRepository.findParaActualizar(almacenId, productoId)
            .orElseGet(() -> stockRepository.save(
                    Stock.builder()
                            .producto(producto)
                            .almacen(almacen)
                            .cantidad(BigDecimal.ZERO)
                            .stockMinimo(BigDecimal.ZERO)
                            .build()));

    stock.setCantidad(stock.getCantidad().add(cantidad));
    if (stockMinimo != null) stock.setStockMinimo(stockMinimo);
    if (stockMaximo != null) stock.setStockMaximo(stockMaximo);
    if (puntoReposicion != null) stock.setPuntoReposicion(puntoReposicion);
    return stockRepository.save(stock);
}

@Override
@Transactional(readOnly = true)
public List<ProductoStockResumenDTO> findResumenPorProducto(UUID productoId) {
    return stockRepository.findConSedeByProducto(productoId).stream()
            .map(s -> new ProductoStockResumenDTO(
                    s.getId(),
                    s.getAlmacen().getId(),
                    s.getAlmacen().getNombre(),
                    s.getAlmacen().getSede().getId(),
                    s.getAlmacen().getSede().getNombre(),
                    s.getCantidad(),
                    s.getStockMinimo(),
                    s.getStockMaximo(),
                    s.getPuntoReposicion()))
            .toList();
}

    // ===================== CONTROL DE SEDE =====================

    /**
     * Resuelve el almacén y comprueba el acceso ANTES de tocar la tabla de stock.
     *
     * <p>Un MULTIFUNCIONAL solo puede ver el stock de su propia sede; pedir otra es 403, no una
     * lista vacía. Se hace la comprobación antes de la consulta para no filtrar ni cargar datos de
     * otras sedes ni por accidente. Mismo criterio que {@code StockOperacionServiceImpl}.
     */
    private Almacen almacenConAcceso(UUID almacenId) {
        Almacen almacen = almacenRepository.findWithSedeById(almacenId)
                .orElseThrow(() -> new ResourceNotFoundException("Almacén no encontrado: " + almacenId));
        User actual = usuarioActual();
        if (esAdmin(actual)) return almacen;

        UUID propia = actual.getSede() != null ? actual.getSede().getId() : null;
        UUID delAlmacen = almacen.getSede() != null ? almacen.getSede().getId() : null;
        if (propia == null) {
            throw new AccessDeniedException("Su usuario no tiene una sede asignada");
        }
        if (!Objects.equals(propia, delAlmacen)) {
            throw new AccessDeniedException("El almacén " + almacen.getNombre() + " no pertenece a su sede");
        }
        return almacen;
    }

    private boolean esAdmin(User user) {
        return user.getRol() != null && user.getRol().getNombre() == RolNombre.ROLE_ADMIN;
    }

    private User usuarioActual() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmailAndActivoTrue(email)
                .orElseThrow(() -> new AccessDeniedException("Usuario autenticado no válido"));
    }
}