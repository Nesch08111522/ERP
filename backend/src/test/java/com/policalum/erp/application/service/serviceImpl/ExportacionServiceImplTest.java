package com.policalum.erp.application.service.serviceImpl;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.policalum.erp.application.dto.response.ProveedorRankingDTO;
import com.policalum.erp.application.dto.response.ProveedoresRankingDTO;
import com.policalum.erp.application.dto.response.ArqueoTurnoDTO;
import com.policalum.erp.application.dto.response.ArqueosReporteDTO;
import com.policalum.erp.application.dto.response.RentabilidadItemDTO;
import com.policalum.erp.application.dto.response.RentabilidadReporteDTO;
import com.policalum.erp.application.service.ReporteService;
import com.policalum.erp.domain.enums.CanalVenta;
import com.policalum.erp.domain.enums.CriterioRankingProveedor;
import com.policalum.erp.domain.enums.EstadoCompra;
import com.policalum.erp.domain.enums.EstadoTurno;
import com.policalum.erp.domain.enums.ResultadoArqueo;
import com.policalum.erp.domain.enums.TipoGastoEmpresarial;
import com.policalum.erp.domain.model.Compra;
import com.policalum.erp.domain.model.GastoEmpresarial;
import com.policalum.erp.infrastructure.repository.ConfiguracionEmpresaRepository;
import com.policalum.erp.infrastructure.repository.CompraRepository;
import com.policalum.erp.infrastructure.repository.GastoEmpresarialRepository;
import com.policalum.erp.infrastructure.repository.VentaRepository;
import java.io.ByteArrayInputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.Executor;
import org.apache.poi.ss.usermodel.WorkbookFactory;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.any;

class ExportacionServiceImplTest {

    @Test
    void proveedoresExportaRankingConFiltrosDeSedeYFecha() throws Exception {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, null, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        UUID sedeId = UUID.randomUUID();
        when(reportes.rankingProveedores(LocalDate.parse("2026-10-01"), LocalDate.parse("2026-10-31"),
                sedeId, CriterioRankingProveedor.FRECUENCIA, 100))
                .thenReturn(new ProveedoresRankingDTO(LocalDate.parse("2026-10-01"), LocalDate.parse("2026-10-31"),
                        sedeId, CriterioRankingProveedor.FRECUENCIA, 100, 0, true,
                        List.of(new ProveedorRankingDTO(1, UUID.randomUUID(), "Proveedor del ranking", "20123456789",
                                3, 2, 1, 0, null, null, LocalDate.parse("2026-10-20"), null, null)),
                        List.of()));

        byte[] archivo = servicio.materializar("proveedores", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=" + sedeId, "admin");

        verify(reportes).rankingProveedores(LocalDate.parse("2026-10-01"), LocalDate.parse("2026-10-31"),
                sedeId, CriterioRankingProveedor.FRECUENCIA, 100);
        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(archivo))) {
            StringBuilder texto = new StringBuilder();
            for (var row : workbook.getSheet("Datos")) {
                for (var cell : row) texto.append(' ').append(cell.toString());
            }
            assertTrue(texto.toString().contains("Proveedor del ranking"));
        }
    }

    @Test
    void gastosExportaRespetandoFiltrosDeSedeYFecha() throws Exception {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        GastoEmpresarialRepository gastoRepository = mock(GastoEmpresarialRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, null, gastoRepository, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        UUID sedeId = UUID.randomUUID();
        LocalDate desde = LocalDate.parse("2026-10-01");
        LocalDate hasta = LocalDate.parse("2026-10-31");
        GastoEmpresarial gasto = GastoEmpresarial.builder()
                .fecha(LocalDate.parse("2026-10-15"))
                .tipo(TipoGastoEmpresarial.OTRO)
                .monto(new BigDecimal("125.50"))
                .descripcion("Mantenimiento")
                .build();
        when(gastoRepository.buscar(eq(sedeId), eq(desde), eq(hasta), any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(gasto), PageRequest.of(0, 2000), 1));

        byte[] archivo = servicio.materializar("gastos", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=" + sedeId, "admin");

        verify(gastoRepository).buscar(eq(sedeId), eq(desde), eq(hasta), any(Pageable.class));
        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(archivo))) {
            StringBuilder texto = new StringBuilder();
            for (var row : workbook.getSheet("Datos")) {
                for (var cell : row) texto.append(' ').append(cell.toString());
            }
            assertTrue(texto.toString().contains("Mantenimiento"));
        }
    }

    @Test
    void ventasAplicaFiltrosAntesDeLimitarLosRegistrosExportados() {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        VentaRepository ventaRepository = mock(VentaRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, ventaRepository, null, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        UUID sedeId = UUID.randomUUID();
        LocalDateTime desde = LocalDate.parse("2026-10-01").atStartOfDay();
        LocalDateTime hasta = LocalDate.parse("2026-10-31").plusDays(1).atStartOfDay().minusNanos(1_000);
        when(ventaRepository.buscar(eq(sedeId), eq(null), eq(null), eq(null), eq(null), eq(desde), eq(hasta), any(Pageable.class)))
                .thenReturn(Page.empty());

        servicio.materializar("ventas", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=" + sedeId, "admin");

        verify(ventaRepository).buscar(eq(sedeId), eq(null), eq(null), eq(null), eq(null), eq(desde), eq(hasta), any(Pageable.class));
    }

    @Test
    void comprasAplicaFiltrosDeSedeYFechaEnLaConsulta() {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        CompraRepository compraRepository = mock(CompraRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, compraRepository, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        UUID sedeId = UUID.randomUUID();
        LocalDate desde = LocalDate.parse("2026-10-01");
        LocalDate hasta = LocalDate.parse("2026-10-31");
        when(compraRepository.search(eq(null), eq(sedeId), eq((EstadoCompra) null), eq(desde), eq(hasta), any(Pageable.class)))
                .thenReturn(Page.empty());

        servicio.materializar("compras", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=" + sedeId, "admin");

        verify(compraRepository).search(eq(null), eq(sedeId), eq((EstadoCompra) null), eq(desde), eq(hasta), any(Pageable.class));
    }

    @Test
    void reporteVentasExportaLaVistaConElFiltroDeCanal() {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, null, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        LocalDate desde = LocalDate.parse("2026-10-01");
        LocalDate hasta = LocalDate.parse("2026-10-31");
        when(reportes.ventas(any(), any(Pageable.class))).thenReturn(Page.empty());

        servicio.materializar("reporte_ventas", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=;canal=ONLINE", "admin");

        var filtro = org.mockito.ArgumentCaptor.forClass(
                com.policalum.erp.application.dto.request.FiltroVentasReporteDTO.class);
        verify(reportes).ventas(filtro.capture(), any(Pageable.class));
        assertTrue(filtro.getValue().desde().equals(desde));
        assertTrue(filtro.getValue().hasta().equals(hasta));
        assertTrue(filtro.getValue().canal() == CanalVenta.ONLINE);
    }

    @Test
    void reporteRentabilidadExportaLosDatosRealesDelServicio() throws Exception {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, null, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        RentabilidadItemDTO item = new RentabilidadItemDTO(
                RentabilidadItemDTO.PRODUCTO, UUID.randomUUID(), "Plancha blanca", "PL-001", "Planchas", "UNID",
                3, new BigDecimal("3.00"), BigDecimal.ZERO, new BigDecimal("3.00"),
                new BigDecimal("300.00"), BigDecimal.ZERO, new BigDecimal("300.00"),
                new BigDecimal("100.00"), new BigDecimal("150.00"), new BigDecimal("450.00"),
                new BigDecimal("-150.00"), new BigDecimal("-50.00"));
        when(reportes.rentabilidad(any(), any(), any(), any())).thenReturn(new RentabilidadReporteDTO(
                LocalDate.parse("2026-10-01"), LocalDate.parse("2026-10-31"), null, null,
                new BigDecimal("300.00"), new BigDecimal("450.00"), new BigDecimal("-150.00"),
                new BigDecimal("-50.00"), true, List.of(item), List.of()));

        byte[] archivo = servicio.materializar("reporte_rentabilidad", "xlsx",
                "desde=2026-10-01;hasta=2026-10-31;sedeId=", "admin");

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(archivo))) {
            StringBuilder texto = new StringBuilder();
            for (var row : workbook.getSheet("Datos")) {
                for (var cell : row) texto.append(' ').append(cell.toString());
            }
            assertTrue(workbook.getSheet("Datos").getRow(0).getLastCellNum()
                    == workbook.getSheet("Datos").getRow(1).getLastCellNum());
            assertTrue(texto.toString().contains("Plancha blanca"));
        }
        verify(reportes).rentabilidad(eq(LocalDate.parse("2026-10-01")), eq(LocalDate.parse("2026-10-31")), eq(null), eq(null));
    }

    @Test
    void reporteArqueosExportaTurnosAbiertosSinFallarPorCierreNulo() throws Exception {
        ReporteService reportes = mock(ReporteService.class);
        ConfiguracionEmpresaRepository empresaRepository = mock(ConfiguracionEmpresaRepository.class);
        ExportacionServiceImpl servicio = new ExportacionServiceImpl(
                null, null, null, null, null, null, null, null, empresaRepository, null,
                reportes, mock(Executor.class), null);
        ArqueoTurnoDTO turno = new ArqueoTurnoDTO(
                UUID.randomUUID(), "Sede principal", "Cajero", LocalDateTime.now(), null, EstadoTurno.ABIERTO,
                BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, BigDecimal.ZERO, null,
                null, ResultadoArqueo.ABIERTO, BigDecimal.ZERO);
        when(reportes.arqueos(any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(new ArqueosReporteDTO(null, null, null, null, null, List.of(turno), 0, 2000, 1, 1));

        byte[] archivo = servicio.materializar("reporte_arqueos", "xlsx", "", "admin");

        try (var workbook = WorkbookFactory.create(new ByteArrayInputStream(archivo))) {
            var fila = workbook.getSheet("Datos").getRow(1);
            assertTrue(fila.getLastCellNum() == 14);
            assertTrue(fila.getCell(1).toString().isBlank());
        }
    }
}
