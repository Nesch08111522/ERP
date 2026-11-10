package com.policalum.erp.application.mapper;

import com.policalum.erp.application.dto.request.EmpresaRequestDTO;
import com.policalum.erp.application.dto.request.ParametrosFinanzasRequestDTO;
import com.policalum.erp.application.dto.request.ParametrosInventarioRequestDTO;
import com.policalum.erp.application.dto.request.ParametrosReportesRequestDTO;
import com.policalum.erp.application.dto.request.ParametrosRrhhRequestDTO;
import com.policalum.erp.application.dto.request.ParametrosVentasRequestDTO;
import com.policalum.erp.application.dto.response.EmpresaResponseDTO;
import com.policalum.erp.application.dto.response.ParametrosFinanzasDTO;
import com.policalum.erp.application.dto.response.ParametrosInventarioDTO;
import com.policalum.erp.application.dto.response.ParametrosReportesDTO;
import com.policalum.erp.application.dto.response.ParametrosRrhhDTO;
import com.policalum.erp.application.dto.response.ParametrosVentasDTO;
import com.policalum.erp.domain.model.ConfiguracionEmpresa;
import com.policalum.erp.domain.model.ConfiguracionFinanzas;
import com.policalum.erp.domain.model.ConfiguracionInventario;
import com.policalum.erp.domain.model.ConfiguracionReportes;
import com.policalum.erp.domain.model.ConfiguracionRrhh;
import com.policalum.erp.domain.model.ConfiguracionVentas;
import com.policalum.erp.domain.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

/**
 * Empresa y parÃ¡metros (MÃ³dulo 14). Las tablas de parÃ¡metros son de una sola fila y las crea
 * {@code ConfiguracionServiceImpl#inicializarSiFalta} con los valores de fÃ¡brica, por eso solo tienen
 * toResponseDto y updateEntityFromDto (no hay toEntity desde un request). id, actualizadoPor y la
 * normalizaciÃ³n de textos los asigna el servicio.
 */
@Mapper(componentModel = "spring")
public interface ConfiguracionMapper {

    // ---------------------------------------------------------------- empresa

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    ConfiguracionEmpresa toEntity(EmpresaRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(EmpresaRequestDTO dto, @MappingTarget ConfiguracionEmpresa entity);

    @Mapping(target = "configurada", expression = "java(entity.getRuc() != null && !entity.getRuc().isBlank())")
    @Mapping(target = "actualizadoPor", expression = "java(nombreCompleto(entity.getActualizadoPor()))")
    EmpresaResponseDTO toResponseDto(ConfiguracionEmpresa entity);

    // ---------------------------------------------------------------- parÃ¡metros

    ParametrosVentasDTO toResponseDto(ConfiguracionVentas entity);

    ParametrosInventarioDTO toResponseDto(ConfiguracionInventario entity);

    ParametrosFinanzasDTO toResponseDto(ConfiguracionFinanzas entity);

    ParametrosReportesDTO toResponseDto(ConfiguracionReportes entity);

    ParametrosRrhhDTO toResponseDto(ConfiguracionRrhh entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ParametrosVentasRequestDTO dto, @MappingTarget ConfiguracionVentas entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ParametrosInventarioRequestDTO dto, @MappingTarget ConfiguracionInventario entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ParametrosFinanzasRequestDTO dto, @MappingTarget ConfiguracionFinanzas entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    void updateEntityFromDto(ParametrosReportesRequestDTO dto, @MappingTarget ConfiguracionReportes entity);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "actualizadoPor", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    // diasLaborables se asigna a mano en el servicio: MapStruct intentaría clear() sobre la lista
    // ya guardada, y las máscaras de List.of(...) son inmutables (UnsupportedOperationException).
    @Mapping(target = "diasLaborables", ignore = true)
    void updateEntityFromDto(ParametrosRrhhRequestDTO dto, @MappingTarget ConfiguracionRrhh entity);

    default String nombreCompleto(User u) {
        if (u == null) return null;
        return ((u.getNombre() != null ? u.getNombre() : "") + " " + (u.getApellido() != null ? u.getApellido() : "")).trim();
    }
}
