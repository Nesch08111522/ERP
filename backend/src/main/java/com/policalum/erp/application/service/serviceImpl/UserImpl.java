
package com.policalum.erp.application.service.serviceImpl;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.policalum.erp.application.dto.request.UserRequestDTO;
import com.policalum.erp.application.dto.response.UserResponseDTO;
import com.policalum.erp.application.mapper.UserMapper;
import com.policalum.erp.application.service.UserService;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.exception.ResourceNotFoundException;
import com.policalum.erp.infrastructure.repository.RefreshTokenRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.SesionUsuarioCache;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserImpl implements UserService {

    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final RefreshTokenRepository refreshTokenRepository;
    private final SesionUsuarioCache sesionUsuarioCache;

    // Crear usuario
    @Transactional
    @Override
    public UserResponseDTO createUser(UserRequestDTO userRequestDTO) {

        User user = userMapper.toEntity(userRequestDTO);

        String securedPassword = passwordEncoder.encode(
                userRequestDTO.passwordHash()
        );

        user.setPasswordHash(securedPassword);
        user.setActivo(true);

        User savedUser = userRepository.save(user);

        User userWithRelations = userRepository
                .findByIdWithRelations(savedUser.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No se pudo recuperar el usuario creado"
                        )
                );

        return userMapper.toResponseDto(userWithRelations);
    }

    // Listar usuarios
    @Transactional(readOnly = true)
    @Override
    public List<UserResponseDTO> getUsers() {

        return userRepository.findAllWithRelations()
                .stream()
                .map(userMapper::toResponseDto)
                .toList();
    }

    // Buscar usuario por ID
    @Transactional(readOnly = true)
    @Override
    public Optional<UserResponseDTO> findById(UUID id) {

        return userRepository.findByIdWithRelations(id)
                .map(userMapper::toResponseDto);
    }

    // Actualizar usuario
    @Transactional
    @Override
    public UserResponseDTO updateUser(UUID id, UserRequestDTO dto) {

        User existingUser = userRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario no encontrado"
                        )
                );

        String correoPrevio = existingUser.getEmail();
        String currentPasswordHash = existingUser.getPasswordHash();

        userMapper.updateEntityFromDto(dto, existingUser);

        if (dto.passwordHash() != null && !dto.passwordHash().isBlank()) {

            existingUser.setPasswordHash(
                    passwordEncoder.encode(dto.passwordHash())
            );

            int version = existingUser.getSesionVersion() == null
                    ? 0
                    : existingUser.getSesionVersion();

            existingUser.setSesionVersion(version + 1);

            refreshTokenRepository.revocarDe(existingUser.getId());

            sesionUsuarioCache.invalidar(correoPrevio);

            if (existingUser.getEmail() != null
                    && !existingUser.getEmail().equals(correoPrevio)) {

                sesionUsuarioCache.invalidar(existingUser.getEmail());
            }

        } else {

            existingUser.setPasswordHash(currentPasswordHash);
        }

        userRepository.save(existingUser);

        User updatedUser = userRepository
                .findByIdWithRelations(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "No se pudo recuperar el usuario actualizado"
                        )
                );

        return userMapper.toResponseDto(updatedUser);
    }

    // Eliminar usuario
    @Transactional
    @Override
    public void DeleteUser(UUID id) {

        if (!userRepository.existsById(id)) {

            throw new ResourceNotFoundException(
                    "Usuario no encontrado con el id: " + id
            );
        }

        userRepository.deleteById(id);
    }
}
