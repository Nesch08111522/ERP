
package com.policalum.erp.infrastructure.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {

    // Buscar por email
    // rol se inicializa porque los controladores lo leen (getRol().getNombre()) con
    // open-in-view=false; sin esto, el proxy lazy explota como 500 (LazyInitializationException).
    @EntityGraph(attributePaths = { "rol", "sede" })
    Optional<User> findByEmail(String email);

    // UserRepository.java
    @EntityGraph(attributePaths = { "rol", "sede" })
    Optional<User> findWithRolAndSedeByEmail(String email);

    // Buscar perfil con sus relaciones principales
    @Query("""
                SELECT u
                FROM User u
                JOIN FETCH u.rol
                JOIN FETCH u.sede
                WHERE u.email = :email
            """)
    Optional<User> findPerfilByEmail(@Param("email") String email);

    // Buscar usuarios activos por email (rol/sede inicializados: ver comentario en findByEmail)
    @Query("""
                SELECT u
                FROM User u
                JOIN FETCH u.rol
                LEFT JOIN FETCH u.sede
                WHERE u.email = :email
                AND u.activo = true
            """)
    Optional<User> findByEmailAndActivoTrue(String email);

    @Query("""
                SELECT u
                FROM User u
                WHERE u.email = :email
            """)
    Optional<User> findByEmailWithActivoCheck(String email);

    // Verificar existencia de email activo
    @Query("""
                SELECT COUNT(u) > 0
                FROM User u
                WHERE u.email = :email
                AND u.activo = true
            """)
    boolean existsByEmailAndActivoTrue(String email);

    // Buscar por email, rol y estado
    @Query("""
                SELECT u
                FROM User u
                WHERE u.email = :email
                AND u.activo = true
                AND u.rol.nombre = :rol
            """)
    Optional<User> findByEmailAndRolAndActivoTrue(
            @Param("email") String email,
            @Param("rol") String rol);

    // Buscar primer usuario activo por rol
    Optional<User> findFirstByActivoTrueAndRol_NombreOrderByEmailAsc(
            RolNombre nombre);

    // Listar usuarios cargando explícitamente rol y sede
    @Query("""
                SELECT u
                FROM User u
                LEFT JOIN FETCH u.rol
                LEFT JOIN FETCH u.sede
                ORDER BY u.email ASC
            """)
    List<User> findAllWithRelations();

    // Buscar usuario por ID cargando rol y sede
    @Query("""
                SELECT u
                FROM User u
                LEFT JOIN FETCH u.rol
                LEFT JOIN FETCH u.sede
                WHERE u.id = :id
            """)
    Optional<User> findByIdWithRelations(@Param("id") UUID id);
}
