package com.policalum.erp.application.service.serviceImpl;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.policalum.erp.application.dto.request.RolRequestDTO;
import com.policalum.erp.application.dto.response.RolResponseDTO;
import com.policalum.erp.application.mapper.RolMapper;
import com.policalum.erp.application.service.RolService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.infrastructure.repository.RolRepository;

import jakarta.transaction.Transactional;
import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
@Transactional
@RequiredArgsConstructor
@Service

public class RolImpl implements RolService {
    
    private final RolRepository rolRepository;
    private final RolMapper rolMapper;

    @Transactional
    @Override
    public RolResponseDTO createRol(RolRequestDTO rolRequestDTO) {
       if (rolRepository.existsByNombre(rolRequestDTO.nombre())) {
           throw new ValidationException("Los roles Administrador y Multifuncional ya existen; edita sus permisos.");
       }
       Rol rol = rolMapper.toEntity(rolRequestDTO);
        Rol rolGuardado = rolRepository.save(rol);
       return rolMapper.toResponseDto(rolGuardado);
    }


    @Override
    public List<RolResponseDTO> getRoles() {
        return rolRepository.findAll().stream()
                .map(rolMapper::toResponseDto)
                .collect(Collectors.toList());
    }


    
    @Transactional
    @Override
    public RolResponseDTO updateRol(UUID id, RolRequestDTO rolRequestDTO) {
        Rol rolExistente = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));
        if (rolRequestDTO.nombre() != rolExistente.getNombre()) {
            throw new ValidationException("No se puede cambiar el tipo de un rol del sistema.");
        }

        rolMapper.updateEntityFromDto(rolRequestDTO, rolExistente);

        Rol rolActualizado = rolRepository.save(rolExistente);
        return rolMapper.toResponseDto(rolActualizado);
    }

    @Transactional
    @Override
    public void deleteRol(UUID id) {
        if(!rolRepository.existsById(id)) {
            throw new RuntimeException("Rol no encontrado con id: " + id);
        }
        throw new ValidationException("Los roles del sistema no se pueden eliminar.");
    }

    @Override
    public RolResponseDTO getRolById (UUID id) {

     
        Rol rol = rolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

        return rolMapper.toResponseDto(rol);
    }

    @Transactional
@Override
public RolResponseDTO actualizarPermisos(UUID id, String grupo, Map<String, Boolean> permisos) {
    if (grupo == null || grupo.isBlank()) {
        throw new ValidationException("El grupo de permisos es obligatorio.");
    }
    Rol rol = rolRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Rol no encontrado con id: " + id));

    // No permitir editar permisos del ADMIN (dios).
    if (rol.getNombre() == RolNombre.ROLE_ADMIN) {
        throw new ValidationException("Los permisos del ADMIN no se pueden editar.");
    }

    Map<String, Object> actuales = rol.getPermisosJson() == null
            ? new HashMap<>()
            : new HashMap<>(rol.getPermisosJson());

    Map<String, Boolean> permisosGrupo = new HashMap<>();
    Object existente = actuales.get(grupo);
    if (existente instanceof Map<?, ?> mapaExistente) {
        for (Map.Entry<?, ?> e : mapaExistente.entrySet()) {
            if (e.getKey() instanceof String clave && e.getValue() instanceof Boolean valor) {
                permisosGrupo.put(clave, valor);
            }
        }
    }
    permisosGrupo.putAll(permisos);
    actuales.put(grupo, permisosGrupo);

    rol.setPermisosJson(actuales);
    return rolMapper.toResponseDto(rolRepository.save(rol));
}

}
