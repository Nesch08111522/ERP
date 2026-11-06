package com.policalum.erp.application.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import com.policalum.erp.application.dto.response.DatoEmpresaSitioDTO;
import com.policalum.erp.application.dto.response.PropuestaEmpresaDTO;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.Test;

class EmpresaSitioVinculoTest {

    private static final DatoEmpresaSitioDTO VIEJO = new DatoEmpresaSitioDTO(
            "POLICALUM", "Policalum SAC", "20123456789", "999888777", "ventas@policalum.com", "Albert Einstein 244", "130101");
    private static final DatoEmpresaSitioDTO NUEVO = new DatoEmpresaSitioDTO(
            "POLICALUM NORTE", "Policalum SAC", "20123456789", "999000111", "ventas@policalum.com", "Albert Einstein 244", "130101");

    @Test
    void ofreceSoloElDatoQueCambioEnElErp() {
        List<PropuestaEmpresaDTO> propuestas = EmpresaSitioVinculo.propuestas(VIEJO, NUEVO, VIEJO);

        assertEquals(List.of("nombreComercial", "telefono"), propuestas.stream().map(PropuestaEmpresaDTO::campo).toList());
        assertEquals("POLICALUM", propuestas.get(0).actual());
        assertEquals("POLICALUM NORTE", propuestas.get(0).nuevo());
        assertEquals("999888777", propuestas.get(1).actual());
        assertEquals("999000111", propuestas.get(1).nuevo());
    }

    @Test
    void laPrimeraCopiaTomaTodoElErp() {
        DatoEmpresaSitioDTO origen = EmpresaSitioVinculo.origenAlGuardar(null, NUEVO, VIEJO, Set.of(), false);

        assertEquals(NUEVO, origen);
    }

    @Test
    void aceptarActualizaElOrigenYDejarloTambien() {
        DatoEmpresaSitioDTO sitio = new DatoEmpresaSitioDTO(
                "POLICALUM NORTE", "Policalum SAC", "20123456789", "999888777", "ventas@policalum.com", "Albert Einstein 244", "130101");

        DatoEmpresaSitioDTO origen = EmpresaSitioVinculo.origenAlGuardar(VIEJO, NUEVO, sitio, Set.of("telefono"), true);

        assertEquals("POLICALUM NORTE", origen.nombreComercial());
        assertEquals("999000111", origen.telefono());
    }

    @Test
    void sinDecisionElAvisoSiguePendiente() {
        DatoEmpresaSitioDTO origen = EmpresaSitioVinculo.origenAlGuardar(VIEJO, NUEVO, VIEJO, Set.of(), true);

        assertEquals("POLICALUM", origen.nombreComercial());
        assertEquals("999888777", origen.telefono());
        assertTrue(EmpresaSitioVinculo.propuestas(origen, NUEVO, VIEJO).size() == 2);
    }
}
