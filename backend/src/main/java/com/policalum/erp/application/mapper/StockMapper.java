package com.policalum.erp.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;

import com.policalum.erp.application.dto.request.StockRequestDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.domain.model.Almacen;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.Stock;

@Mapper(componentModel = "spring")
public interface StockMapper {
    StockResponseDTO toResponseDto(Stock stock);

    StockResponseDTO.ProductoResumen toProductoResumen(Producto producto);

    StockResponseDTO.AlmacenResumen toAlmacenResumen(Almacen almacen);

    StockResponseDTO.SedeResumen toSedeResumen(Sede sede);

    Stock toEntity(StockRequestDTO stockRequestDTO);

    void updateEntityFromDto(StockRequestDTO dto, @MappingTarget Stock entity);
}
