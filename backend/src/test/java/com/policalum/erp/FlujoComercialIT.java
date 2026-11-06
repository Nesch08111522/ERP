package com.policalum.erp;

import com.policalum.erp.application.dto.request.AperturaCajaRequestDTO;
import com.policalum.erp.application.dto.request.CatalogoFraccionRequestDTO;
import com.policalum.erp.application.dto.request.CompraRequestDTO;
import com.policalum.erp.application.dto.request.ConvertirCotizacionRequestDTO;
import com.policalum.erp.application.dto.request.CotizacionRequestDTO;
import com.policalum.erp.application.dto.request.DetalleCompraCommandDTO;
import com.policalum.erp.application.dto.request.DetalleCotizacionCommandDTO;
import com.policalum.erp.application.dto.request.LineaVentaCommandDTO;
import com.policalum.erp.application.dto.request.PagoVentaCommandDTO;
import com.policalum.erp.application.dto.request.RegistrarVentaRequestDTO;
import com.policalum.erp.application.dto.response.StockResponseDTO;
import com.policalum.erp.application.service.CatalogoFraccionService;
import com.policalum.erp.application.service.CompraService;
import com.policalum.erp.application.service.CotizacionService;
import com.policalum.erp.application.service.StockService;
import com.policalum.erp.application.service.TurnoCajaService;
import com.policalum.erp.application.service.VentaService;
import com.policalum.erp.application.service.serviceImpl.CmsService;
import com.policalum.erp.domain.enums.CanalVenta;
import com.policalum.erp.domain.enums.EstadoCompra;
import com.policalum.erp.domain.enums.MetodoPago;
import com.policalum.erp.domain.enums.Moneda;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.enums.TipoComprobante;
import com.policalum.erp.domain.enums.TipoMovimiento;
import com.policalum.erp.domain.enums.TipoProducto;
import com.policalum.erp.domain.enums.TipoReferencia;
import com.policalum.erp.domain.model.Almacen;
import com.policalum.erp.domain.model.KardexMovimiento;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.domain.model.Proveedor;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.Sede;
import com.policalum.erp.domain.model.SerieComprobante;
import com.policalum.erp.domain.model.Stock;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.loader.DataLoader;
import com.policalum.erp.infrastructure.repository.AlmacenRepository;
import com.policalum.erp.infrastructure.repository.KardexRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import com.policalum.erp.infrastructure.repository.ProveedorRepository;
import com.policalum.erp.infrastructure.repository.RolRepository;
import com.policalum.erp.infrastructure.repository.SedeRepository;
import com.policalum.erp.infrastructure.repository.SerieComprobanteRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.condition.EnabledIfEnvironmentVariable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Pruebas comerciales sobre una base PostgreSQL aislada y desechable.
 * Solo se ejecuta cuando POLICALUM_IT_DB_URL apunta a una base ERPpoli_it_*.
 * DataLoader exige una sede fija que no existe en una base vacía; el mock evita ese arranque.
 * La creación de una compra registra su recepción, stock y cuenta por pagar en la misma transacción.
 */
@SpringBootTest
@org.springframework.test.context.TestPropertySource(properties = "spring.jpa.hibernate.ddl-auto=create-drop")
@EnabledIfEnvironmentVariable(
        named = "POLICALUM_IT_DB_URL",
        matches = "(?i)jdbc:postgresql://[^/]+/erppoli_it_[A-Za-z0-9_]+")
class FlujoComercialIT {

    @DynamicPropertySource
    static void datasource(DynamicPropertyRegistry registry) {
        String url = System.getenv("POLICALUM_IT_DB_URL");
        if (url == null || !url.matches("(?i)jdbc:postgresql://[^/]+/erppoli_it_[A-Za-z0-9_]+")) {
            throw new IllegalStateException("POLICALUM_IT_DB_URL debe apuntar a una base aislada ERPpoli_it_*");
        }
        registry.add("spring.datasource.url", () -> url);
        registry.add("spring.datasource.username", () -> System.getenv().getOrDefault("POLICALUM_IT_DB_USERNAME", "postgres"));
        registry.add("spring.datasource.password", () -> System.getenv().getOrDefault("POLICALUM_IT_DB_PASSWORD", ""));
    }

    @MockitoBean
    DataLoader dataLoader;

    @Autowired CompraService compraService;
    @Autowired CatalogoFraccionService catalogoFraccionService;
    @Autowired CotizacionService cotizacionService;
    @Autowired VentaService ventaService;
    @Autowired StockService stockService;
    @Autowired TurnoCajaService turnoCajaService;
    @Autowired SedeRepository sedeRepository;
    @Autowired AlmacenRepository almacenRepository;
    @Autowired ProveedorRepository proveedorRepository;
    @Autowired ProductoRepository productoRepository;
    @Autowired RolRepository rolRepository;
    @Autowired UserRepository userRepository;
    @Autowired StockRepository stockRepository;
    @Autowired KardexRepository kardexRepository;
    @Autowired SerieComprobanteRepository serieComprobanteRepository;
    @Autowired CmsService cmsService;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private Sede sede;
    private Almacen almacen;
    private Producto producto;
    private UUID proveedorId;
    private String email;

    @BeforeEach
    void preparar() {
        String sufijo = UUID.randomUUID().toString().substring(0, 8);
        Rol rol = rolRepository.findAll().stream()
                .filter(existente -> existente.getNombre() == RolNombre.ROLE_ADMIN)
                .findFirst()
                .orElseGet(() -> rolRepository.save(
                        Rol.builder().nombre(RolNombre.ROLE_ADMIN).permisosJson(Map.of()).build()));
        email = "it-admin-" + sufijo + "@policalum.test";
        sede = sedeRepository.save(Sede.builder().nombre("Sede IT " + sufijo).activa(true).build());
        serieComprobanteRepository.save(SerieComprobante.builder()
                .sede(sede).tipoComprobante(TipoComprobante.BOLETA)
                .serie("B" + sufijo.substring(0, 3).toUpperCase())
                .ultimoCorrelativo(0).activa(true).build());
        serieComprobanteRepository.save(SerieComprobante.builder()
                .sede(sede).tipoComprobante(TipoComprobante.TICKET)
                .serie("T" + sufijo.substring(0, 3).toUpperCase())
                .ultimoCorrelativo(0).activa(true).build());
        User user = userRepository.save(User.builder()
                .rol(rol).sede(sede).nombreUsuario("it-admin-" + sufijo).nombre("IT").apellido("Admin")
                .email(email).passwordHash("{noop}it").activo(true).build());
        almacen = almacenRepository.save(Almacen.builder().sede(sede).nombre("Principal").activo(true).build());
        String documentoProveedor = "20" + String.format(
                "%09d", Math.floorMod(UUID.randomUUID().hashCode(), 1_000_000_000));
        Proveedor proveedor = proveedorRepository.save(Proveedor.builder()
                .nombreRazon("Proveedor IT " + sufijo).tipoDocumento("RUC")
                .numeroDocumento(documentoProveedor).activo(true).build());
        proveedorId = proveedor.getId();
        producto = productoRepository.save(Producto.builder()
                .proveedor(proveedor).nombre("Perfil IT " + sufijo).codigoSku("IT-" + sufijo).tipo(TipoProducto.FISICO)
                .precioCompra(new BigDecimal("8.00")).precioVentaBase(new BigDecimal("10.00"))
                .unidad("UNID").esFraccionable(false).activo(true).incluyeIgv(true).build());
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                user.getEmail(), "n/a", List.of(new SimpleGrantedAuthority("ROLE_ADMIN"))));
    }

    @AfterEach
    void limpiarSesion() {
        SecurityContextHolder.clearContext();
    }

    @Test
    void compraRecepcionVentaYCaja() {
        var compra = compraService.crear(new CompraRequestDTO(
                proveedorId, sede.getId(), "F001-1", LocalDate.now(), Moneda.PEN, "IT",
                List.of(new DetalleCompraCommandDTO(producto.getId(), null, almacen.getId(),
                        new BigDecimal("10"), new BigDecimal("11.80")))));
        assertThat(compra.estadoCompra()).isEqualTo(EstadoCompra.RECIBIDA);
        assertThat(cantidad()).isEqualByComparingTo("10");
        assertThat(kardexRepository.findByReferenciaIdAndTipoReferencia(compra.id(), TipoReferencia.COMPRA)).hasSize(1);
        StockResponseDTO stockRespuesta = stockService.findByAlmacenAndProducto(almacen.getId(), producto.getId());
        JsonNode stockJson = objectMapper.valueToTree(stockRespuesta);
        assertThat(stockJson.at("/producto/id").asText()).isEqualTo(producto.getId().toString());
        assertThat(stockJson.at("/almacen/sede/id").asText()).isEqualTo(sede.getId().toString());
        assertThat(stockJson.toString()).doesNotContain("hibernateLazyInitializer", "hibernateProxy");

        var turno = turnoCajaService.abrir(new AperturaCajaRequestDTO(sede.getId(), new BigDecimal("100.00"), "Apertura IT"));
        var venta = ventaService.registrar(new RegistrarVentaRequestDTO(
                sede.getId(), almacen.getId(), null, turno.id(), TipoComprobante.BOLETA, null, null, null, null,
                List.of(new LineaVentaCommandDTO(producto.getId(), null, null, new BigDecimal("2"))),
                List.of(new PagoVentaCommandDTO(MetodoPago.EFECTIVO, new BigDecimal("20.00"), null))));

        assertThat(venta.total()).isEqualByComparingTo("20.00");
        assertThat(cantidad()).isEqualByComparingTo("8");
        assertThat(kardexRepository.findByReferenciaIdAndTipoReferencia(venta.id(), TipoReferencia.VENTA)).hasSize(1);
        assertThat(turnoCajaService.resumen(turno.id()).ventasEfectivo()).isEqualByComparingTo("20.00");
        assertThat(turnoCajaService.resumen(turno.id()).esperado()).isEqualByComparingTo("120.00");
    }

    @Test
    void compraCotizaFraccionConvierteAVentaYDescuentaElFactorEnKardex() {
        producto.setEsFraccionable(true);
        producto = productoRepository.saveAndFlush(producto);
        var fraccion = catalogoFraccionService.create(new CatalogoFraccionRequestDTO(
                producto.getId(), "Cuarto", new BigDecimal("0.2500"), new BigDecimal("3.00"), true));

        var compra = compraService.crear(new CompraRequestDTO(
                proveedorId, sede.getId(), "F001-2", LocalDate.now(), Moneda.PEN, "Compra para fracción IT",
                List.of(new DetalleCompraCommandDTO(producto.getId(), null, almacen.getId(),
                        new BigDecimal("8"), new BigDecimal("94.40")))));
        assertThat(compra.estadoCompra()).isEqualTo(EstadoCompra.RECIBIDA);
        assertThat(cantidad()).isEqualByComparingTo("8");

        var cotizacion = cotizacionService.create(new CotizacionRequestDTO(
                sede.getId(), null, LocalDate.now().plusDays(7), "Flujo de fracción IT",
                List.of(new DetalleCotizacionCommandDTO(
                        producto.getId(), fraccion.id(), null, new BigDecimal("2")))));
        assertThat(cotizacion.total()).isEqualByComparingTo("6.00");
        cotizacionService.aceptar(cotizacion.id());

        var turno = turnoCajaService.abrir(new AperturaCajaRequestDTO(
                sede.getId(), new BigDecimal("100.00"), "Caja para fracción IT"));
        var venta = cotizacionService.convertir(cotizacion.id(), new ConvertirCotizacionRequestDTO(
                almacen.getId(), turno.id(), TipoComprobante.BOLETA, CanalVenta.LOCAL, null,
                List.of(new PagoVentaCommandDTO(MetodoPago.EFECTIVO, new BigDecimal("6.00"), null))));

        assertThat(venta.total()).isEqualByComparingTo("6.00");
        assertThat(venta.ticketRegistro()).isNotBlank();
        assertThat(cantidad()).isEqualByComparingTo("7.5000");
        var salidas = kardexRepository.findByReferenciaIdAndTipoReferencia(venta.id(), TipoReferencia.VENTA);
        assertThat(salidas).hasSize(1);
        assertThat(salidas.get(0).getTipoMovimiento()).isEqualTo(TipoMovimiento.SALIDA);
        assertThat(salidas.get(0).getCantidadMovida()).isEqualByComparingTo("0.5000");
        assertThat(salidas.get(0).getAlmacen().getId()).isEqualTo(almacen.getId());
        assertThat(cotizacionService.findById(cotizacion.id()).ventaId()).isEqualTo(venta.id());
        assertThat(turnoCajaService.resumen(turno.id()).ventasEfectivo()).isEqualByComparingTo("6.00");

        var fraccionesRestantes = List.of(
                new CatalogoFraccionRequestDTO(producto.getId(), "Media IT", new BigDecimal("0.5000"), new BigDecimal("6.00"), true),
                new CatalogoFraccionRequestDTO(producto.getId(), "Tres cuartos IT", new BigDecimal("0.7500"), new BigDecimal("9.00"), true),
                new CatalogoFraccionRequestDTO(producto.getId(), "Completa IT", new BigDecimal("1.0000"), new BigDecimal("12.00"), true));
        BigDecimal[] saldosEsperados = {
                new BigDecimal("7.0000"),
                new BigDecimal("6.2500"),
                new BigDecimal("5.2500"),
        };
        for (int i = 0; i < fraccionesRestantes.size(); i++) {
            var fraccionPrueba = fraccionesRestantes.get(i);
            var medida = catalogoFraccionService.create(fraccionPrueba);
            BigDecimal precio = fraccionPrueba.precioVenta();
            var nuevaCotizacion = cotizacionService.create(new CotizacionRequestDTO(
                    sede.getId(), null, LocalDate.now().plusDays(7), "Flujo de fracción IT",
                    List.of(new DetalleCotizacionCommandDTO(
                            producto.getId(), medida.id(), null, BigDecimal.ONE))));
            assertThat(nuevaCotizacion.total()).isEqualByComparingTo(precio);
            cotizacionService.aceptar(nuevaCotizacion.id());
            var nuevaVenta = cotizacionService.convertir(nuevaCotizacion.id(), new ConvertirCotizacionRequestDTO(
                    almacen.getId(), turno.id(), TipoComprobante.BOLETA, CanalVenta.LOCAL, null,
                    List.of(new PagoVentaCommandDTO(MetodoPago.EFECTIVO, precio, null))));
            assertThat(nuevaVenta.ticketRegistro()).isNotBlank();
            assertThat(cantidad()).isEqualByComparingTo(saldosEsperados[i]);
            var movimientos = kardexRepository.findByReferenciaIdAndTipoReferencia(
                    nuevaVenta.id(), TipoReferencia.VENTA);
            assertThat(movimientos).singleElement().satisfies(movimiento -> {
                assertThat(movimiento.getTipoMovimiento()).isEqualTo(TipoMovimiento.SALIDA);
                assertThat(movimiento.getCantidadMovida())
                        .isEqualByComparingTo(fraccionPrueba.factorDescuentoKardex());
                assertThat(movimiento.getAlmacen().getId()).isEqualTo(almacen.getId());
            });
        }
    }

    @Test
    void productoSinSalidaEn90DiasQuedaEnOferta() {
        User usuario = userRepository.findByEmail(email).orElseThrow();
        kardexRepository.saveAndFlush(KardexMovimiento.builder()
                .producto(producto)
                .almacen(almacen)
                .tipoReferencia(TipoReferencia.VENTA)
                .tipoMovimiento(TipoMovimiento.SALIDA)
                .cantidadMovida(new BigDecimal("1.0000"))
                .stockResultante(BigDecimal.ZERO)
                .user(usuario)
                .createdAt(LocalDateTime.now().minusDays(95))
                .build());

        cmsService.sincronizarOfertas();

        Producto recargado = productoRepository.findById(producto.getId()).orElseThrow();
        assertThat(recargado.getOferta()).isTrue();
    }

    private BigDecimal cantidad() {
        return stockRepository.findByProducto_Id(producto.getId()).stream()
                .map(Stock::getCantidad)
                .findFirst()
                .orElse(BigDecimal.ZERO);
    }
}
