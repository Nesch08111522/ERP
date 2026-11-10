package com.policalum.erp.infrastructure.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.policalum.erp.application.dto.response.CmsPublicoDTO;
import com.policalum.erp.application.service.serviceImpl.CmsMedioService;
import com.policalum.erp.application.service.serviceImpl.CmsPublicador;
import com.policalum.erp.application.service.serviceImpl.CmsService;
import com.policalum.erp.application.service.serviceImpl.PortafolioService;
import com.policalum.erp.domain.enums.RolNombre;
import com.policalum.erp.domain.model.Rol;
import com.policalum.erp.domain.model.User;
import com.policalum.erp.infrastructure.repository.UserRepository;
import com.policalum.erp.infrastructure.security.JwtAuthenticationEntryPoint;
import com.policalum.erp.infrastructure.security.JwtAuthenticationFilter;
import com.policalum.erp.infrastructure.security.RolePermissionGuard;
import com.policalum.erp.infrastructure.security.SecurityConfig;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

@WebMvcTest(CmsController.class)
@AutoConfigureMockMvc(addFilters = false)
@Import({SecurityConfig.class, RolePermissionGuard.class})
class CmsPermissionControllerTest {

    @Autowired
    MockMvc mvc;

    @MockitoBean
    CmsService cms;

    @MockitoBean
    CmsMedioService medios;

    @MockitoBean
    CmsPublicador publicador;

    @MockitoBean
    PortafolioService portafolio;

    @MockitoBean
    UserRepository userRepository;

    @MockitoBean
    JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockitoBean
    JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Test
    @WithMockUser(username = "operador@policalum.com", roles = "MULTIFUNCIONAL")
    void configuracionRequierePermisoPeroLaLecturaPublicaSigueAbierta() throws Exception {
        User operador = User.builder()
                .rol(Rol.builder()
                        .nombre(RolNombre.ROLE_MULTIFUNCIONAL)
                        .permisosJson(Map.of("sitio_web", Map.of(
                                "leer", true,
                                "configurar", false)))
                        .build())
                .build();
        when(userRepository.findPerfilByEmail("operador@policalum.com")).thenReturn(Optional.of(operador));
        when(cms.publico()).thenReturn(new CmsPublicoDTO("#111111", "#FFFFFF", 16, "claro", "", false,
                null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null));

        mvc.perform(put("/api/v1/cms/settings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "primaryColor": "#111111",
                                  "secondaryColor": "#FFFFFF",
                                  "baseFontSize": 16,
                                  "themeMode": "claro"
                                }
                                """))
                .andExpect(status().isForbidden());

        mvc.perform(get("/api/v1/public/cms"))
                .andExpect(status().isOk());

        verify(cms, never()).guardarAjustes(any());
    }
}
