package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.request.KardexMovimientoRequestDTO;
import com.policalum.erp.application.dto.request.StockRequestDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.application.mapper.StockMapper;
import com.policalum.erp.application.service.KardexService;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.domain.enums.TipoMovimiento;
import com.policalum.erp.domain.enums.TipoReferencia;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Almacen;
import com.policalum.erp.domain.model.Stock;
import com.policalum.erp.domain.model.User;
import org.springframework.data.domain.Pageable;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.AlmacenRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Service
@RequiredArgsConstructor
@Transactional(rollbackFor = Exception.class)
public class StockServiceImpl implements StockService {

    private final StockRepository stockRepository;
    private final StockMapper stockMapper;
    private final KardexService kardexService;
    private final AlmacenRepository almacenRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public StockResponseDTO findByAlmacenAndProducto(UUID almacenId, UUID productoId) {
        exigirAccesoSede(almacen(almacenId));
        Stock stock = stockRepository.findByAlmacen_IdAndProducto_Id(almacenId, productoId)
                .orElseThrow(() -> new ResourceNotFoundException("No se encontraron existencias del producto en el almacén especificado"));
        return stockMapper.toResponseDto(stock);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<StockResponseDTO> searchByAlmacen(UUID almacenId, String searchTerm, boolean soloBajoStock, Pageable pageable) {
        exigirAccesoSede(almacen(almacenId));
        String normalizedSearch = (searchTerm == null || searchTerm.isBlank()) ? null : searchTerm.trim();
        return stockRepository.searchByAlmacen(almacenId, normalizedSearch, soloBajoStock, pageable)
                .map(stockMapper::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public List<StockResponseDTO> findByProducto(UUID productoId) {
        User actual = usuarioActual();
        List<Stock> stock = esAdmin(actual)
                ? stockRepository.findByProducto_Id(productoId)
                : stockRepository.findByProducto_IdAndAlmacen_Sede_Id(productoId, sedeId(actual));
        return stock.stream()
                .map(stockMapper::toResponseDto)
                .toList();
    }

    /**
     * La cantidad no se escribe directo: la diferencia entra o sale por el kardex
     * y el saldo de {@code stock} queda igual al movimiento. El mínimo sí se actualiza aquí.
     */
    @Override
    public StockResponseDTO saveOrUpdate(StockRequestDTO dto) {
        if (dto.producto().getId() == null || dto.almacen().getId() == null) {
            throw new ValidationException("El producto y el almacén deben indicar su identificador");
        }
        Almacen almacen = almacen(dto.almacen().getId());
        exigirAccesoSede(almacen);
        if (dto.cantidad().signum() < 0) {
            throw new ValidationException("La cantidad de stock no puede ser negativa");
        }

        Stock stock = stockRepository.findByAlmacen_IdAndProducto_Id(almacen.getId(), dto.producto().getId()).orElse(null);
        BigDecimal actual = stock == null || stock.getCantidad() == null ? BigDecimal.ZERO : stock.getCantidad();
        BigDecimal delta = dto.cantidad().subtract(actual);
        if (delta.signum() != 0) {
            TipoMovimiento tipo = delta.signum() > 0 ? TipoMovimiento.ENTRADA : TipoMovimiento.SALIDA;
            kardexService.registrarMovimiento(new KardexMovimientoRequestDTO(
                    dto.producto(),
                    almacen,
                    null,
                    TipoReferencia.AJUSTE,
                    tipo,
                    delta.abs(),
                    null,
                    null,
                    "Ajuste de saldo para mantener el kardex alineado con el stock"));
            stock = stockRepository.findByAlmacen_IdAndProducto_Id(dto.almacen().getId(), dto.producto().getId())
                    .orElseThrow(() -> new IllegalStateException("El movimiento de kardex no dejó saldo de stock"));
        } else if (stock == null) {
            stock = Stock.builder()
                    .producto(dto.producto())
                    .almacen(almacen)
                    .cantidad(BigDecimal.ZERO)
                    .build();
        }

        if (dto.stockMinimo() != null) {
            stock.setStockMinimo(dto.stockMinimo());
        }
        stock.setUpdatedAt(LocalDateTime.now());
        return stockMapper.toResponseDto(stockRepository.save(stock));
    }

    private Almacen almacen(UUID id) {
        return almacenRepository.findWithSedeById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Almacén no encontrado: " + id));
    }

    private User usuarioActual() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null || authentication.getName().isBlank()) {
            throw new AccessDeniedException("No hay un usuario autenticado");
        }
        return userRepository.findByEmailAndActivoTrue(authentication.getName())
                .orElseThrow(() -> new AccessDeniedException("Usuario autenticado no válido"));
    }

    private void exigirAccesoSede(Almacen almacen) {
        User actual = usuarioActual();
        if (esAdmin(actual)) return;
        if (actual.getSede() == null || almacen.getSede() == null
                || !Objects.equals(actual.getSede().getId(), almacen.getSede().getId())) {
            throw new AccessDeniedException("No tiene acceso al almacén de otra sede");
        }
    }

    private boolean esAdmin(User user) {
        return user.getRol() != null && user.getRol().getNombre() == RolNombre.ROLE_ADMIN;
    }

    private UUID sedeId(User user) {
        if (user.getSede() == null || user.getSede().getId() == null) {
            throw new AccessDeniedException("El usuario no tiene una sede asignada");
        }
        return user.getSede().getId();
    }
}
