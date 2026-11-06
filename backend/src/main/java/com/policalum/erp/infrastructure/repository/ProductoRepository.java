package com.policalum.erp.infrastructure.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.policalum.erp.domain.enums.TipoProducto;
import com.policalum.erp.domain.model.Producto;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, UUID> {

    @EntityGraph(attributePaths = { "categoria", "proveedor" })
    @Query("SELECT p FROM Producto p WHERE "
            + "(CAST(:searchTerm AS string) IS NULL OR "
            + " LOWER(p.nombre) LIKE LOWER(CONCAT('%', CAST(:searchTerm AS string), '%')) OR "
            + " LOWER(COALESCE(p.codigoSku, '')) LIKE LOWER(CONCAT('%', CAST(:searchTerm AS string), '%'))) AND "
            + "(CAST(:categoriaId AS string) IS NULL OR p.categoria.id = :categoriaId) AND "
            + "(CAST(:tipo AS string) IS NULL OR p.tipo = :tipo) AND "
            + "(CAST(:activo AS boolean) IS NULL OR p.activo = :activo) AND "
            + "(CAST(:esFraccionable AS boolean) IS NULL OR p.esFraccionable = :esFraccionable)")
    Page<Producto> search(@Param("searchTerm") String searchTerm,
                          @Param("categoriaId") UUID categoriaId,
                          @Param("tipo") TipoProducto tipo,
                          @Param("activo") Boolean activo,
                          @Param("esFraccionable") Boolean esFraccionable,
                          Pageable pageable);


    @Query("SELECT p FROM Producto p "
            + "LEFT JOIN FETCH p.categoria "
            + "LEFT JOIN FETCH p.proveedor "
            + "LEFT JOIN FETCH p.fracciones "
            + "WHERE p.id = :id")
    Optional<Producto> findWithRelationsById(@Param("id") UUID id);

    @EntityGraph(attributePaths = { "categoria" })
    @Query(value = "SELECT p FROM Producto p WHERE p.activo = true AND "
            + "(CAST(:categoriaId AS string) IS NULL OR p.categoria.id = :categoriaId) AND "
            + "(CAST(:soloDestacados AS boolean) = false OR p.destacado = true) AND "
            + "(CAST(:q AS string) IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.codigoSku, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.descripcion, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.categoria.nombre, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))",
            countQuery = "SELECT COUNT(p) FROM Producto p WHERE p.activo = true AND "
            + "(CAST(:categoriaId AS string) IS NULL OR p.categoria.id = :categoriaId) AND "
            + "(CAST(:soloDestacados AS boolean) = false OR p.destacado = true) AND "
            + "(CAST(:q AS string) IS NULL OR LOWER(p.nombre) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.codigoSku, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.descripcion, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')) OR "
            + " LOWER(COALESCE(p.categoria.nombre, '')) LIKE LOWER(CONCAT('%', CAST(:q AS string), '%')))")
    Page<Producto> catalogoPublico(@Param("categoriaId") UUID categoriaId,
                                   @Param("soloDestacados") boolean soloDestacados,
                                   @Param("q") String q,
                                   Pageable pageable);

    @Query("""
            SELECT DISTINCT p FROM Producto p
            LEFT JOIN FETCH p.categoria
            LEFT JOIN FETCH p.fracciones
            WHERE p.id = :id AND p.activo = true
            """)
    Optional<Producto> findActivoParaPortal(@Param("id") UUID id);

    @EntityGraph(attributePaths = { "categoria", "fracciones" })
    List<Producto> findTop8ByActivoTrueAndOfertaTrueOrderByNombreAsc();

    Optional<Producto> findByCodigoSkuIgnoreCase(String codigoSku);

    boolean existsByCodigoSkuIgnoreCase(String codigoSku);

    boolean existsByIdAndEsFraccionableTrue(UUID id);

    long countByActivo(Boolean activo);

    long countByEsFraccionable(Boolean esFraccionable);

    long countByTipo(TipoProducto tipo);

    @Query("""
            SELECT CASE WHEN
                EXISTS (SELECT 1 FROM KardexMovimiento k WHERE k.producto.id = :id)
                OR EXISTS (SELECT 1 FROM Stock s WHERE s.producto.id = :id)
                OR EXISTS (SELECT 1 FROM AjusteStock a WHERE a.producto.id = :id)
                OR EXISTS (SELECT 1 FROM TransferenciaStock t WHERE t.producto.id = :id)
                OR EXISTS (SELECT 1 FROM DetalleVenta d WHERE d.producto.id = :id OR d.fraccion.producto.id = :id)
                OR EXISTS (SELECT 1 FROM DetalleCompra d WHERE d.producto.id = :id OR d.fraccion.producto.id = :id)
                OR EXISTS (SELECT 1 FROM DetalleCotizacion d WHERE d.producto.id = :id OR d.fraccion.producto.id = :id)
                OR EXISTS (SELECT 1 FROM DetallePreforma d WHERE d.producto.id = :id OR d.fraccion.producto.id = :id)
                OR EXISTS (SELECT 1 FROM DetalleDevolucion d WHERE d.producto.id = :id OR d.fraccion.producto.id = :id)
            THEN TRUE ELSE FALSE END
            """)
    boolean tieneHistorial(@Param("id") UUID id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
            UPDATE productos p SET oferta = TRUE
            WHERE p.activo = TRUE
            AND (p.oferta_manual = FALSE OR p.oferta_manual IS NULL)
            AND NOT EXISTS (
                SELECT 1 FROM kardex_movimientos k
                WHERE k.producto_id = p.id
                AND k.tipo_movimiento = 'SALIDA'
                AND k.created_at >= :desde)
            """, nativeQuery = true)
    int marcarOfertasEstancadas(@Param("desde") LocalDateTime desde);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
            UPDATE productos p SET oferta = FALSE
            WHERE (p.oferta_manual = FALSE OR p.oferta_manual IS NULL)
            AND EXISTS (
                SELECT 1 FROM kardex_movimientos k
                WHERE k.producto_id = p.id
                AND k.tipo_movimiento = 'SALIDA'
                AND k.created_at >= :desde)
            """, nativeQuery = true)
    int quitarOfertasConRotacion(@Param("desde") LocalDateTime desde);

@EntityGraph(attributePaths = { "categoria", "proveedor" })
@Query("SELECT p FROM Producto p WHERE "
        + "(CAST(:searchTerm AS string) IS NULL OR "
        + " LOWER(p.nombre) LIKE LOWER(CONCAT('%', CAST(:searchTerm AS string), '%')) OR "
        + " LOWER(COALESCE(p.codigoSku, '')) LIKE LOWER(CONCAT('%', CAST(:searchTerm AS string), '%'))) AND "
        + "(CAST(:categoriaId AS string) IS NULL OR p.categoria.id = :categoriaId) AND "
        + "(CAST(:tipo AS string) IS NULL OR p.tipo = :tipo) AND "
        + "(CAST(:activo AS boolean) IS NULL OR p.activo = :activo) AND "
        + "(CAST(:esFraccionable AS boolean) IS NULL OR p.esFraccionable = :esFraccionable) AND "
        + "(CAST(:almacenId AS string) IS NULL OR EXISTS (SELECT 1 FROM Stock s WHERE s.producto = p AND s.almacen.id = :almacenId)) AND "
        + "(CAST(:sedeId AS string) IS NULL OR EXISTS (SELECT 1 FROM Stock s WHERE s.producto = p AND s.almacen.sede.id = :sedeId))")
Page<Producto> searchPorUbicacion(@Param("searchTerm") String searchTerm,
                                  @Param("categoriaId") UUID categoriaId,
                                  @Param("tipo") TipoProducto tipo,
                                  @Param("activo") Boolean activo,
                                  @Param("esFraccionable") Boolean esFraccionable,
                                  @Param("sedeId") UUID sedeId,
                                  @Param("almacenId") UUID almacenId,
                                  Pageable pageable);

}
