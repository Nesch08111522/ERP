package com.policalum.erp.application.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.Mapping;

import com.policalum.erp.application.dto.request.CotizacionRequestDTO;
import com.policalum.erp.application.dto.response.CotizacionListadoDTO;
import com.policalum.erp.application.dto.response.CotizacionResponseDTO;
import com.policalum.erp.domain.model.Cotizacion;

@Mapper(componentModel = "spring")
public interface CotizacionMapper {

    /**
     * Cotización completa (con líneas y cargos).
     * El DTO de respuesta tiene muchos campos que se calculan o cargan aparte
     * (líneas, cargos, ventaId, origen). El Service los completa después.
     */
    CotizacionResponseDTO toResponseDto(Cotizacion cotizacion);

    /**
     * Cotización resumida para listados paginados.
     * Los campos clienteId, clienteNombre, sedeId, origen NO existen como
     * propiedades directas en la entidad (son derivadas). MapStruct los mapea
     * automáticamente si los nombres coinciden con los getters anidados:
     *   - clienteId     ← cliente.id
     *   - clienteNombre ← cliente.nombre
     *   - sedeId        ← sede.id
     *   - origen        ← (lo calcula el Service; aquí se ignora y se sobreescribe después)
     */
    @Mapping(target = "clienteId", source = "cliente.id")
    @Mapping(target = "clienteNombre", source = "cliente.nombre")
    @Mapping(target = "sedeId", source = "sede.id")
    @Mapping(target = "origen", ignore = true)
    CotizacionListadoDTO toListadoDto(Cotizacion cotizacion);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sede", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "total", ignore = true)
    @Mapping(target = "venta", ignore = true)
    @Mapping(target = "canal", ignore = true)
    @Mapping(target = "contactoRuc", ignore = true)
    @Mapping(target = "contactoRazonSocial", ignore = true)
    @Mapping(target = "contactoCorreo", ignore = true)
    @Mapping(target = "contactoTelefono", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    Cotizacion toEntity(CotizacionRequestDTO requestDTO);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "sede", ignore = true)
    @Mapping(target = "user", ignore = true)
    @Mapping(target = "cliente", ignore = true)
    @Mapping(target = "estado", ignore = true)
    @Mapping(target = "total", ignore = true)
    @Mapping(target = "venta", ignore = true)
    @Mapping(target = "canal", ignore = true)
    @Mapping(target = "contactoRuc", ignore = true)
    @Mapping(target = "contactoRazonSocial", ignore = true)
    @Mapping(target = "contactoCorreo", ignore = true)
    @Mapping(target = "contactoTelefono", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    void updateEntityFromDto(CotizacionRequestDTO dto, @MappingTarget Cotizacion entity);
}