package com.policalum.erp.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import com.policalum.erp.application.dto.request.ProductoRequestDTO;
import com.policalum.erp.application.dto.response.ProductoResponseDTO;
import com.policalum.erp.domain.model.Producto;

@Mapper(componentModel = "spring")
public interface ProductoMapper {
    ProductoResponseDTO toResponseDto(Producto producto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "proveedor", ignore = true)
    @Mapping(target = "fracciones", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "oferta", ignore = true)
    @Mapping(target = "ofertaManual", ignore = true)
    @Mapping(target = "precioOferta", ignore = true)
    @Mapping(target = "ofertaPorcentaje", ignore = true)
    @Mapping(target = "ofertaDesde", ignore = true)
    @Mapping(target = "ofertaHasta", ignore = true)
    Producto toEntity(ProductoRequestDTO productoRequestDTO);

    /** Las fracciones se concilian aparte. Reemplazar la lista aquí borraría cortes que ya tienen ventas. */
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "categoria", ignore = true)
    @Mapping(target = "proveedor", ignore = true)
    @Mapping(target = "fracciones", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "oferta", ignore = true)
    @Mapping(target = "ofertaManual", ignore = true)
    @Mapping(target = "precioOferta", ignore = true)
    @Mapping(target = "ofertaPorcentaje", ignore = true)
    @Mapping(target = "ofertaDesde", ignore = true)
    @Mapping(target = "ofertaHasta", ignore = true)
    void updateEntityFromDto(ProductoRequestDTO dto, @MappingTarget Producto entity);
}
