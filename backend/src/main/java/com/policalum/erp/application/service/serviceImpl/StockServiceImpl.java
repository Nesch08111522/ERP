package com.policalum.erp.application.service.serviceImpl;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.policalum.erp.application.dto.request.StockRequestDTO;
import com.policalum.erp.application.dto.response.ProductoStockResumenDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.application.mapper.StockMapper;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.domain.model.Almacen;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.domain.model.Stock;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.AlmacenRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;

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

    @Override
    @Transactional(readOnly = true)
    public StockResponseDTO findByAlmacenAndProducto(UUID almacenId, UUID productoId) {
        Stock stock = stockRepository.findByAlmacen_IdAndProducto_Id(almacenId, productoId)
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

    @Override
    public StockResponseDTO saveOrUpdate(StockRequestDTO dto) {
        // Implementación existente — no la toco.
        throw new UnsupportedOperationException("No implementado en este snippet; conserva el existente.");
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
}