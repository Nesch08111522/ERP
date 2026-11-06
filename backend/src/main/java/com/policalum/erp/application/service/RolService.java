package com.policalum.erp.application.service;
import java.util.List;
import java.util.UUID;
import java.util.Map;

import com.policalum.erp.application.dto.request.RolRequestDTO;
import com.policalum.erp.application.dto.response.RolResponseDTO;
public interface RolService {

public RolResponseDTO  createRol(RolRequestDTO rolRequestDTO);

public List<RolResponseDTO> getRoles();

public RolResponseDTO updateRol(UUID id, RolRequestDTO rolRequestDTO);

void deleteRol(UUID id);
RolResponseDTO actualizarPermisos(UUID id, String grupo, Map<String, Boolean> permisos);


public RolResponseDTO getRolById(UUID id);
}
