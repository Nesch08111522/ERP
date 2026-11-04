package com.policalum.erp.application.service.serviceImpl;

import com.policalum.erp.application.dto.response.ProveedorRankingDTO;
import com.policalum.erp.application.dto.response.ProveedoresRankingDTO;
import com.policalum.erp.application.dto.response.RentabilidadItemDTO;
import com.policalum.erp.application.service.ReporteService;
import com.policalum.erp.domain.enums.CriterioRankingCliente;
import com.policalum.erp.domain.enums.CriterioRankingProducto;
import com.policalum.erp.domain.enums.CriterioRankingProveedor;
import com.policalum.erp.domain.enums.CanalVenta;
import com.policalum.erp.domain.model.Cliente;
import com.policalum.erp.domain.model.Compra;
import com.policalum.erp.domain.model.ConfiguracionEmpresa;
import com.policalum.erp.domain.model.GastoEmpresarial;
import com.policalum.erp.domain.model.KardexMovimiento;
import com.policalum.erp.domain.model.Producto;
import com.policalum.erp.domain.model.RrhhNomina;
import com.policalum.erp.domain.model.Stock;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.domain.model.Venta;
import com.policalum.erp.infrastructure.export.ExcelEstilos;
import com.policalum.erp.infrastructure.export.PdfCorporativo;
import com.policalum.erp.infrastructure.export.ReporteSolicitud;
import com.policalum.erp.infrastructure.repository.ClienteRepository;
import com.policalum.erp.infrastructure.repository.CompraRepository;
import com.policalum.erp.infrastructure.repository.ConfiguracionEmpresaRepository;
import com.policalum.erp.infrastructure.repository.GastoEmpresarialRepository;
import com.policalum.erp.infrastructure.repository.KardexRepository;
import com.policalum.erp.infrastructure.repository.ProductoRepository;
import com.policalum.erp.infrastructure.repository.RrhhNominaRepository;
import com.policalum.erp.infrastructure.repository.StockRepository;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.repository.VentaRepository;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Executor;
import java.util.concurrent.TimeUnit;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ExportacionServiceImpl {

    private static final int TOPE = 2000;

    private final ClienteRepository clienteRepository;
    private final ProductoRepository productoRepository;
    private final StockRepository stockRepository;
    private final KardexRepository kardexRepository;
    private final VentaRepository ventaRepository;
    private final CompraRepository compraRepository;
    private final GastoEmpresarialRepository gastoRepository;
    private final RrhhNominaRepository nominaRepository;
    private final ConfiguracionEmpresaRepository empresaRepository;
    private final UserRepository userRepository;
    private final ReporteService reporteService;
    private final @Qualifier("reportes") Executor reportes;
    private final @Lazy ExportacionServiceImpl self;

    public byte[] generar(String modulo, String formato, String filtros) {
        String usuario = usuarioActual();
        try {
            return self.materializar(modulo, formato, filtros, usuario);
        } catch (IllegalArgumentException e) {
            throw e;
        } catch (RuntimeException e) {
            throw new IllegalStateException("No se pudo generar el reporte", e);
        }
    }

    @Transactional(readOnly = true)
    public byte[] materializar(String modulo, String formato, String filtros, String usuario) {
        ReporteSolicitud solicitud = armar(modulo, filtros, usuario);
        if ("pdf".equalsIgnoreCase(formato)) {
            return PdfCorporativo.generar(solicitud, empresa());
        }
        return ExcelEstilos.generar(solicitud);
    }

    private ReporteSolicitud armar(String modulo, String filtros, String usuario) {
        List<String> notas = new ArrayList<>();
        if (filtros != null && !filtros.isBlank()) notas.add(filtros);
        notas.add("Máximo " + TOPE + " filas, las más recientes.");
        return switch (modulo == null ? "" : modulo) {
            case "clientes" -> clientes(usuario, notas);
            case "productos" -> productos(usuario, notas);
            case "stock" -> stock(usuario, notas);
            case "kardex" -> kardex(usuario, notas);
            case "ventas" -> ventas(usuario, notas);
            case "compras" -> compras(usuario, notas);
            case "proveedores" -> proveedores(usuario, notas);
            case "gastos" -> gastos(usuario, notas);
            case "rrhh" -> nominas(usuario, notas);
            case "reporte_ventas" -> reporteVentas(usuario, notas);
            case "reporte_rentabilidad" -> rentabilidad(usuario, notas);
            case "reporte_estrella" -> productosEstrella(usuario, notas);
            case "reporte_clientes" -> clientesFrecuentes(usuario, notas);
            case "reporte_proveedores" -> rankingProveedores(usuario, notas);
            case "reporte_arqueos" -> arqueos(usuario, notas);
            default -> throw new IllegalArgumentException("Módulo de exportación no reconocido");
        };
    }

    private ReporteSolicitud reporteVentas(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        var reporte = reporteService.ventas(
                new com.policalum.erp.application.dto.request.FiltroVentasReporteDTO(
                        rango.desde(), rango.hasta(), sedeId(notas), null, null,
                        enumFiltro(CanalVenta.class, valorFiltro(notas, "canal")), null, null),
                PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "fecha")));
        List<List<Object>> filas = reporte.getContent().stream()
                .map(venta -> List.<Object>of(
                        ReporteSolicitud.fecha(venta.fecha()),
                        ReporteSolicitud.texto(venta.serieCorrelativo()),
                        ReporteSolicitud.texto(venta.sede()),
                        ReporteSolicitud.texto(venta.vendedor()),
                        ReporteSolicitud.texto(venta.cliente()),
                        ReporteSolicitud.texto(venta.clienteDocumento()),
                        ReporteSolicitud.texto(venta.canal()),
                        ReporteSolicitud.texto(venta.tipoComprobante()),
                        ReporteSolicitud.texto(venta.estado()),
                        ReporteSolicitud.dinero(venta.neto()),
                        ReporteSolicitud.dinero(venta.igv()),
                        ReporteSolicitud.dinero(venta.total()),
                        ReporteSolicitud.texto(venta.metodosPago())))
                .toList();
        return new ReporteSolicitud("Reporte de ventas", "Reportes", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Fecha"), ReporteSolicitud.Columna.texto("Comprobante"),
                ReporteSolicitud.Columna.texto("Sede"), ReporteSolicitud.Columna.texto("Vendedor"),
                ReporteSolicitud.Columna.texto("Cliente"), ReporteSolicitud.Columna.texto("Documento"),
                ReporteSolicitud.Columna.texto("Canal"), ReporteSolicitud.Columna.texto("Comprobante"),
                ReporteSolicitud.Columna.texto("Estado"), ReporteSolicitud.Columna.moneda("Neto"),
                ReporteSolicitud.Columna.moneda("IGV"), ReporteSolicitud.Columna.moneda("Total"),
                ReporteSolicitud.Columna.texto("Métodos de pago")), filas);
    }

    private ReporteSolicitud rentabilidad(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        var reporte = reporteService.rentabilidad(rango.desde(), rango.hasta(), sedeId(notas), null);
        List<List<Object>> filas = reporte.items().stream()
                .map(item -> filaRentabilidad(item, reporte.costosVisibles())).toList();
        return new ReporteSolicitud("Rentabilidad por producto y servicio", "Reportes", usuario, notas,
                columnasRentabilidad(reporte.costosVisibles()), filas);
    }

    private ReporteSolicitud productosEstrella(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        var reporte = reporteService.productosEstrella(
                rango.desde(), rango.hasta(), sedeId(notas), null, CriterioRankingProducto.INGRESO, null);
        boolean costosVisibles = reporte.items().stream().anyMatch(item -> item.margen() != null);
        List<List<Object>> filas = reporte.items().stream()
                .map(item -> filaRentabilidad(item, costosVisibles)).toList();
        return new ReporteSolicitud("Productos estrella", "Reportes", usuario, notas,
                columnasRentabilidad(costosVisibles), filas);
    }

    private ReporteSolicitud clientesFrecuentes(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        var reporte = reporteService.clientesFrecuentes(
                rango.desde(), rango.hasta(), sedeId(notas), CriterioRankingCliente.CANTIDAD, null);
        List<List<Object>> filas = reporte.items().stream().map(cliente -> List.<Object>of(
                cliente.posicion(), ReporteSolicitud.texto(cliente.nombre()),
                ReporteSolicitud.texto(cliente.tipoDocumento()), ReporteSolicitud.texto(cliente.numeroDocumento()),
                cliente.compras(), ReporteSolicitud.dinero(cliente.montoTotal()),
                ReporteSolicitud.dinero(cliente.devuelto()), ReporteSolicitud.dinero(cliente.montoNeto()),
                ReporteSolicitud.dinero(cliente.ticketPromedio()), ReporteSolicitud.fecha(cliente.primeraCompra()),
                ReporteSolicitud.fecha(cliente.ultimaCompra()), ReporteSolicitud.texto(cliente.diasEntreCompras()),
                cliente.diasDesdeUltimaCompra())).toList();
        return new ReporteSolicitud("Clientes frecuentes", "Reportes", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Posición"), ReporteSolicitud.Columna.texto("Cliente"),
                ReporteSolicitud.Columna.texto("Tipo documento"), ReporteSolicitud.Columna.texto("Documento"),
                ReporteSolicitud.Columna.texto("Compras"), ReporteSolicitud.Columna.moneda("Monto total"),
                ReporteSolicitud.Columna.moneda("Devuelto"), ReporteSolicitud.Columna.moneda("Monto neto"),
                ReporteSolicitud.Columna.moneda("Ticket promedio"), ReporteSolicitud.Columna.fecha("Primera compra"),
                ReporteSolicitud.Columna.fecha("Última compra"), ReporteSolicitud.Columna.texto("Días entre compras"),
                ReporteSolicitud.Columna.texto("Días desde última compra")), filas);
    }

    private ReporteSolicitud rankingProveedores(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        ProveedoresRankingDTO reporte = reporteService.rankingProveedores(
                rango.desde(), rango.hasta(), sedeId(notas), CriterioRankingProveedor.FRECUENCIA, null);
        List<List<Object>> filas = reporte.items().stream().map(proveedor -> List.<Object>of(
                proveedor.posicion(), ReporteSolicitud.texto(proveedor.nombre()),
                ReporteSolicitud.texto(proveedor.numeroDocumento()), proveedor.compras(), proveedor.recibidas(),
                proveedor.pendientes(), proveedor.anuladas(),
                reporte.montosVisibles() ? ReporteSolicitud.dinero(proveedor.montoRecibido()) : "",
                reporte.montosVisibles() ? ReporteSolicitud.dinero(proveedor.ticketPromedio()) : "",
                ReporteSolicitud.texto(proveedor.ultimaCompra()),
                ReporteSolicitud.texto(proveedor.diasEntregaPromedio()),
                ReporteSolicitud.texto(proveedor.diasEntregaMaximo()))).toList();
        return new ReporteSolicitud("Ranking de proveedores", "Reportes", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Posición"), ReporteSolicitud.Columna.texto("Proveedor"),
                ReporteSolicitud.Columna.texto("RUC / documento"), ReporteSolicitud.Columna.texto("Compras"),
                ReporteSolicitud.Columna.texto("Recibidas"), ReporteSolicitud.Columna.texto("Pendientes"),
                ReporteSolicitud.Columna.texto("Anuladas"), ReporteSolicitud.Columna.moneda("Monto recibido"),
                ReporteSolicitud.Columna.moneda("Ticket promedio"), ReporteSolicitud.Columna.texto("Última compra"),
                ReporteSolicitud.Columna.texto("Entrega promedio (días)"),
                ReporteSolicitud.Columna.texto("Entrega máxima (días)")), filas);
    }

    private ReporteSolicitud arqueos(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        var reporte = reporteService.arqueos(
                rango.desde(), rango.hasta(), sedeId(notas), null, null, PageRequest.of(0, TOPE));
        List<List<Object>> filas = reporte.turnos().stream().map(arqueo -> List.<Object>of(
                ReporteSolicitud.fecha(arqueo.apertura()),
                arqueo.cierre() == null ? "" : ReporteSolicitud.fecha(arqueo.cierre()),
                ReporteSolicitud.texto(arqueo.sede()), ReporteSolicitud.texto(arqueo.cajero()),
                ReporteSolicitud.texto(arqueo.estado()), ReporteSolicitud.dinero(arqueo.montoInicial()),
                ReporteSolicitud.dinero(arqueo.ventasEfectivo()), ReporteSolicitud.dinero(arqueo.retirosSocios()),
                ReporteSolicitud.dinero(arqueo.reembolsos()), ReporteSolicitud.dinero(arqueo.esperado()),
                ReporteSolicitud.dinero(arqueo.declarado()), ReporteSolicitud.dinero(arqueo.diferencia()),
                ReporteSolicitud.texto(arqueo.resultado()),
                ReporteSolicitud.dinero(arqueo.efectivoVentasAnuladas()))).toList();
        return new ReporteSolicitud("Arqueos de caja", "Reportes", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Apertura"), ReporteSolicitud.Columna.fecha("Cierre"),
                ReporteSolicitud.Columna.texto("Sede"), ReporteSolicitud.Columna.texto("Cajero"),
                ReporteSolicitud.Columna.texto("Estado"), ReporteSolicitud.Columna.moneda("Monto inicial"),
                ReporteSolicitud.Columna.moneda("Ventas efectivo"), ReporteSolicitud.Columna.moneda("Retiros socios"),
                ReporteSolicitud.Columna.moneda("Reembolsos"), ReporteSolicitud.Columna.moneda("Esperado"),
                ReporteSolicitud.Columna.moneda("Declarado"), ReporteSolicitud.Columna.moneda("Diferencia"),
                ReporteSolicitud.Columna.texto("Resultado"),
                ReporteSolicitud.Columna.moneda("Efectivo ventas anuladas")), filas);
    }

    private List<Object> filaRentabilidad(RentabilidadItemDTO item, boolean costosVisibles) {
        List<Object> fila = new ArrayList<>(List.of(
                ReporteSolicitud.texto(item.tipo()), ReporteSolicitud.texto(item.nombre()),
                ReporteSolicitud.texto(item.sku()), ReporteSolicitud.texto(item.categoria()),
                ReporteSolicitud.texto(item.unidad()), item.ventas(),
                ReporteSolicitud.dinero(item.cantidadVendida()), ReporteSolicitud.dinero(item.cantidadDevuelta()),
                ReporteSolicitud.dinero(item.cantidadNeta()), ReporteSolicitud.dinero(item.ingresoNeto()),
                ReporteSolicitud.dinero(item.devolucionesNeto()), ReporteSolicitud.dinero(item.ingresoNetoReal()),
                ReporteSolicitud.dinero(item.participacionPorcentaje())));
        if (costosVisibles) {
            fila.addAll(List.of(ReporteSolicitud.dinero(item.costoUnitario()),
                    ReporteSolicitud.dinero(item.costoEstimado()), ReporteSolicitud.dinero(item.margen()),
                    ReporteSolicitud.dinero(item.margenPorcentaje())));
        }
        return fila;
    }

    private List<ReporteSolicitud.Columna> columnasRentabilidad(boolean costosVisibles) {
        List<ReporteSolicitud.Columna> columnas = new ArrayList<>(List.of(
                ReporteSolicitud.Columna.texto("Tipo"), ReporteSolicitud.Columna.texto("Producto/servicio"),
                ReporteSolicitud.Columna.texto("SKU"), ReporteSolicitud.Columna.texto("Categoría"),
                ReporteSolicitud.Columna.texto("Unidad"), ReporteSolicitud.Columna.texto("Ventas"),
                ReporteSolicitud.Columna.texto("Cantidad vendida"), ReporteSolicitud.Columna.texto("Cantidad devuelta"),
                ReporteSolicitud.Columna.texto("Cantidad neta"), ReporteSolicitud.Columna.moneda("Ingreso neto"),
                ReporteSolicitud.Columna.moneda("Devoluciones netas"), ReporteSolicitud.Columna.moneda("Ingreso neto real"),
                ReporteSolicitud.Columna.texto("Participación %")));
        if (costosVisibles) {
            columnas.addAll(List.of(ReporteSolicitud.Columna.moneda("Costo unitario"),
                    ReporteSolicitud.Columna.moneda("Costo estimado"), ReporteSolicitud.Columna.moneda("Margen"),
                    ReporteSolicitud.Columna.texto("Margen %")));
        }
        return columnas;
    }

    private ReporteSolicitud clientes(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        for (Cliente cliente : clienteRepository.findAll(PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "createdAt")))) {
            filas.add(List.of(ReporteSolicitud.texto(cliente.getNombre()), ReporteSolicitud.texto(cliente.getTipoDocumento()),
                    ReporteSolicitud.texto(cliente.getNumeroDocumento()), ReporteSolicitud.texto(cliente.getCelular()),
                    ReporteSolicitud.texto(cliente.getEmail()), Boolean.TRUE.equals(cliente.getActivo()) ? "Sí" : "No",
                    ReporteSolicitud.fecha(cliente.getCreatedAt())));
        }
        return new ReporteSolicitud("Clientes", "Clientes", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Nombre"), ReporteSolicitud.Columna.texto("Documento"),
                ReporteSolicitud.Columna.texto("Número"), ReporteSolicitud.Columna.texto("Celular"),
                ReporteSolicitud.Columna.texto("Correo"), ReporteSolicitud.Columna.texto("Activo"),
                ReporteSolicitud.Columna.fecha("Registro")), filas);
    }

    private ReporteSolicitud productos(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        for (Producto producto : productoRepository.findAll(PageRequest.of(0, TOPE, Sort.by("nombre")))) {
            filas.add(List.of(ReporteSolicitud.texto(producto.getCodigoSku()), ReporteSolicitud.texto(producto.getNombre()),
                    ReporteSolicitud.texto(producto.getUnidad()), ReporteSolicitud.dinero(producto.getPrecioCompra()),
                    ReporteSolicitud.dinero(producto.getPrecioVentaBase()), Boolean.TRUE.equals(producto.getActivo()) ? "Sí" : "No"));
        }
        return new ReporteSolicitud("Catálogo de productos", "Productos", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("SKU"), ReporteSolicitud.Columna.texto("Producto"),
                ReporteSolicitud.Columna.texto("Unidad"), ReporteSolicitud.Columna.moneda("Precio compra"),
                ReporteSolicitud.Columna.moneda("Precio venta"), ReporteSolicitud.Columna.texto("Activo")), filas);
    }

    private ReporteSolicitud stock(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        for (Stock stock : stockRepository.alertasDeStock()) {
            filas.add(List.of(ReporteSolicitud.texto(stock.getProducto().getNombre()), ReporteSolicitud.texto(stock.getAlmacen().getNombre()),
                    stock.getCantidad(), stock.getStockMinimo(), ReporteSolicitud.dinero(stock.getProducto().getPrecioCompra()),
                    ReporteSolicitud.dinero(stock.getProducto().getPrecioVentaBase())));
        }
        notas.add("Solo artículos en mínimo o crítico.");
        return new ReporteSolicitud("Alertas de stock", "Stock", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Producto"), ReporteSolicitud.Columna.texto("Almacén"),
                ReporteSolicitud.Columna.texto("Cantidad"), ReporteSolicitud.Columna.texto("Mínimo"),
                ReporteSolicitud.Columna.moneda("Precio compra"), ReporteSolicitud.Columna.moneda("Precio venta")), filas);
    }

    private ReporteSolicitud kardex(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        for (KardexMovimiento mov : kardexRepository.findAll(PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "createdAt")))) {
            filas.add(List.of(ReporteSolicitud.fecha(mov.getCreatedAt()), ReporteSolicitud.texto(mov.getProducto().getNombre()),
                    ReporteSolicitud.texto(mov.getAlmacen().getNombre()), String.valueOf(mov.getTipoMovimiento()),
                    mov.getCantidadMovida(), mov.getStockResultante(),
                    ReporteSolicitud.dinero(mov.getCostoUnitario() != null ? mov.getCostoUnitario() : mov.getProducto().getPrecioCompra()),
                    ReporteSolicitud.dinero(mov.getPrecioVenta() != null ? mov.getPrecioVenta() : mov.getProducto().getPrecioVentaBase())));
        }
        return new ReporteSolicitud("Kardex valorizado", "Kardex", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Fecha"), ReporteSolicitud.Columna.texto("Producto"),
                ReporteSolicitud.Columna.texto("Almacén"), ReporteSolicitud.Columna.texto("Movimiento"),
                ReporteSolicitud.Columna.texto("Cantidad"), ReporteSolicitud.Columna.texto("Saldo"),
                ReporteSolicitud.Columna.moneda("Costo"), ReporteSolicitud.Columna.moneda("Precio venta")), filas);
    }

    private ReporteSolicitud ventas(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        Rango rango = rango(notas);
        var desde = rango.desde() == null ? null : rango.desde().atStartOfDay();
        var hasta = rango.hasta() == null ? null : rango.hasta().plusDays(1).atStartOfDay().minusNanos(1_000);
        for (Venta venta : ventaRepository.buscar(
                sedeId(notas), null, null, null, null, desde, hasta,
                PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "createdAt")))) {
            filas.add(List.of(ReporteSolicitud.fecha(venta.getCreatedAt()), ReporteSolicitud.texto(venta.getSerieCorrelativo()),
                    venta.getCliente() == null ? "Público" : venta.getCliente().getNombre(),
                    String.valueOf(venta.getTipoComprobante()), String.valueOf(venta.getEstado()),
                    ReporteSolicitud.dinero(venta.getTotal())));
        }
        return new ReporteSolicitud("Ventas", "Ventas", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Fecha"), ReporteSolicitud.Columna.texto("Comprobante"),
                ReporteSolicitud.Columna.texto("Cliente"), ReporteSolicitud.Columna.texto("Tipo"),
                ReporteSolicitud.Columna.texto("Estado"), ReporteSolicitud.Columna.moneda("Total")), filas);
    }

    private ReporteSolicitud compras(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        Rango rango = rango(notas);
        for (Compra compra : compraRepository.search(
                null, sedeId(notas), null, rango.desde(), rango.hasta(),
                PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "createdAt")))) {
            filas.add(List.of(ReporteSolicitud.fecha(compra.getCreatedAt()), ReporteSolicitud.texto(compra.getNumeroOrdenCompra()),
                    compra.getProveedor() == null ? "" : compra.getProveedor().getNombreRazon(),
                    String.valueOf(compra.getEstadoCompra()), ReporteSolicitud.dinero(compra.getTotal())));
        }
        return new ReporteSolicitud("Compras", "Compras", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Fecha"), ReporteSolicitud.Columna.texto("Orden"),
                ReporteSolicitud.Columna.texto("Proveedor"), ReporteSolicitud.Columna.texto("Estado"),
                ReporteSolicitud.Columna.moneda("Total")), filas);
    }

    private ReporteSolicitud proveedores(String usuario, List<String> notas) {
        Rango rango = rango(notas);
        java.util.UUID sedeId = sedeId(notas);
        ProveedoresRankingDTO ranking = reporteService.rankingProveedores(
                rango.desde(), rango.hasta(), sedeId, CriterioRankingProveedor.FRECUENCIA, 100);
        List<List<Object>> filas = new ArrayList<>();
        for (ProveedorRankingDTO proveedor : ranking.items()) {
            filas.add(List.of(proveedor.posicion(), ReporteSolicitud.texto(proveedor.nombre()),
                    ReporteSolicitud.texto(proveedor.numeroDocumento()), proveedor.compras(), proveedor.recibidas(),
                    proveedor.pendientes(), proveedor.anuladas(),
                    ranking.montosVisibles() ? ReporteSolicitud.dinero(proveedor.montoRecibido()) : "",
                    ranking.montosVisibles() ? ReporteSolicitud.dinero(proveedor.ticketPromedio()) : "",
                    ReporteSolicitud.texto(proveedor.ultimaCompra()),
                    ReporteSolicitud.texto(proveedor.diasEntregaPromedio()),
                    ReporteSolicitud.texto(proveedor.diasEntregaMaximo())));
        }
        notas.add("Criterio: frecuencia de compras recibidas.");
        ReporteSolicitud.Columna montoRecibido = ranking.montosVisibles()
                ? ReporteSolicitud.Columna.moneda("Monto recibido")
                : ReporteSolicitud.Columna.texto("Monto recibido");
        ReporteSolicitud.Columna ticketPromedio = ranking.montosVisibles()
                ? ReporteSolicitud.Columna.moneda("Ticket promedio")
                : ReporteSolicitud.Columna.texto("Ticket promedio");
        return new ReporteSolicitud("Ranking de proveedores", "Proveedores", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Posición"), ReporteSolicitud.Columna.texto("Proveedor"),
                ReporteSolicitud.Columna.texto("RUC / documento"), ReporteSolicitud.Columna.texto("Compras"),
                ReporteSolicitud.Columna.texto("Recibidas"), ReporteSolicitud.Columna.texto("Pendientes"),
                ReporteSolicitud.Columna.texto("Anuladas"), montoRecibido,
                ticketPromedio, ReporteSolicitud.Columna.texto("Última compra"),
                ReporteSolicitud.Columna.texto("Entrega promedio (días)"),
                ReporteSolicitud.Columna.texto("Entrega máxima (días)")), filas);
    }

    private ReporteSolicitud gastos(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        Rango rango = rango(notas);
        LocalDate desde = rango.desde() == null ? LocalDate.now().minusYears(2) : rango.desde();
        LocalDate hasta = rango.hasta() == null ? LocalDate.now() : rango.hasta();
        for (GastoEmpresarial gasto : gastoRepository.buscar(
                sedeId(notas), desde, hasta, PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "fecha")))) {
            filas.add(List.of(gasto.getFecha() == null ? null : gasto.getFecha().atStartOfDay(), String.valueOf(gasto.getTipo()),
                    gasto.getSede() == null ? "Todas" : gasto.getSede().getNombre(),
                    ReporteSolicitud.texto(gasto.getDescripcion()), ReporteSolicitud.dinero(gasto.getMonto())));
        }
        return new ReporteSolicitud("Gastos empresariales", "Finanzas", usuario, notas, List.of(
                ReporteSolicitud.Columna.fecha("Fecha"), ReporteSolicitud.Columna.texto("Tipo"),
                ReporteSolicitud.Columna.texto("Sede"), ReporteSolicitud.Columna.texto("Detalle"),
                ReporteSolicitud.Columna.moneda("Monto")), filas);
    }

    private ReporteSolicitud nominas(String usuario, List<String> notas) {
        List<List<Object>> filas = new ArrayList<>();
        for (RrhhNomina nomina : nominaRepository.findAll(PageRequest.of(0, TOPE, Sort.by(Sort.Direction.DESC, "createdAt")))) {
            User persona = nomina.getUser();
            String nombre = persona == null ? "" : ((persona.getNombre() == null ? "" : persona.getNombre()) + " " + (persona.getApellido() == null ? "" : persona.getApellido())).trim();
            filas.add(List.of(ReporteSolicitud.texto(nomina.getPeriodo()), nombre, String.valueOf(nomina.getEstado()),
                    ReporteSolicitud.dinero(nomina.getTotalNeto())));
        }
        return new ReporteSolicitud("Nóminas", "RRHH", usuario, notas, List.of(
                ReporteSolicitud.Columna.texto("Periodo"), ReporteSolicitud.Columna.texto("Persona"),
                ReporteSolicitud.Columna.texto("Estado"), ReporteSolicitud.Columna.moneda("Neto")), filas);
    }

    private Rango rango(List<String> notas) {
        LocalDate desde = null;
        LocalDate hasta = null;
        for (String nota : notas) {
            for (String parte : nota.split(";")) {
                try {
                    if (parte.startsWith("desde=")) desde = LocalDate.parse(parte.substring(6));
                    if (parte.startsWith("hasta=")) hasta = LocalDate.parse(parte.substring(6));
                } catch (RuntimeException ignored) {
                    // Un texto que no es fecha se queda como nota del reporte.
                }
            }
        }
        return new Rango(desde, hasta);
    }

    private java.util.UUID sedeId(List<String> notas) {
        for (String nota : notas) {
            for (String parte : nota.split(";")) {
                if (parte.startsWith("sedeId=") && !parte.substring(7).isBlank()) {
                    try {
                        return java.util.UUID.fromString(parte.substring(7));
                    } catch (IllegalArgumentException e) {
                        throw new IllegalArgumentException("La sede del reporte no es válida", e);
                    }
                }
            }
        }
        return null;
    }

    private String valorFiltro(List<String> notas, String clave) {
        String prefijo = clave + "=";
        for (String nota : notas) {
            for (String parte : nota.split(";")) {
                if (parte.startsWith(prefijo)) return parte.substring(prefijo.length()).trim();
            }
        }
        return "";
    }

    private <T extends Enum<T>> T enumFiltro(Class<T> tipo, String valor) {
        return valor.isBlank() ? null : Enum.valueOf(tipo, valor);
    }

    private record Rango(LocalDate desde, LocalDate hasta) {
    }

    private PdfCorporativo.EmpresaPdf empresa() {
        ConfiguracionEmpresa empresa = empresaRepository.findById(ConfiguracionEmpresa.ID_UNICO).orElse(null);
        String nombre = empresa == null || empresa.getNombreComercial() == null ? "POLICALUM" : empresa.getNombreComercial();
        String razon = empresa == null || empresa.getRazonSocial() == null || empresa.getRazonSocial().isBlank() ? nombre : empresa.getRazonSocial();
        String ruc = empresa == null || empresa.getRuc() == null || empresa.getRuc().isBlank() ? "pendiente" : empresa.getRuc();
        String direccion = empresa == null || empresa.getDireccionFiscal() == null ? "" : empresa.getDireccionFiscal();
        return new PdfCorporativo.EmpresaPdf(nombre, razon, ruc, direccion, logo());
    }

    private byte[] logo() {
        for (String ruta : List.of("uploads/logo.png", "frontend/public/POLICALUM.png", "../frontend/public/POLICALUM.png")) {
            try {
                Path path = Path.of(ruta);
                if (Files.exists(path)) return Files.readAllBytes(path);
            } catch (Exception ignored) {
                // El PDF se emite igual sin imagen.
            }
        }
        return new byte[0];
    }

    private String usuarioActual() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) return "";
        return userRepository.findByEmailAndActivoTrue(auth.getName())
                .map(user -> ((user.getNombre() == null ? "" : user.getNombre()) + " " + (user.getApellido() == null ? "" : user.getApellido())).trim())
                .orElse(auth.getName());
    }
}
