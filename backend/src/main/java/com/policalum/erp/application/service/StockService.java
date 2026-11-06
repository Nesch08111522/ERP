package com.policalum.erp.application.service;

import com.policalum.erp.application.dto.request.StockRequestDTO;
import com.policalum.erp.application.dto.response.ProductoStockResumenDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.domain.model.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface StockService {
    StockResponseDTO findByAlmacenAndProducto(UUID almacenId, UUID productoId);

    List<StockResponseDTO> findByProducto(UUID productoId);

    Page<StockResponseDTO> searchByAlmacen(UUID almacenId, String searchTerm, boolean soloBajoStock, Pageable pageable);

    StockResponseDTO saveOrUpdate(StockRequestDTO dto);

    /**
     * Crea (o suma) la fila de Stock en (producto, almacén) y devuelve la entidad.
     * NO crea Kardex: el llamador decide qué movimiento registrar.
     */
    Stock registrarStockInicial(UUID productoId,
                                UUID almacenId,
                                BigDecimal cantidad,
                                BigDecimal stockMinimo,
                                BigDecimal stockMaximo,
                                BigDecimal puntoReposicion);

    /** Existencias de un producto con almacén + sede cargados. */
    List<ProductoStockResumenDTO> findResumenPorProducto(UUID productoId);
}