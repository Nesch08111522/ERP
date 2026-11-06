package com.policalum.erp.infrastructure.config;

import jakarta.persistence.EntityManagerFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.orm.jpa.EntityManagerFactoryUtils;
import org.springframework.orm.jpa.EntityManagerHolder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.support.TransactionSynchronizationManager;

/**
 * El aviso en vivo deja el pedido abierto muchos minutos. Si la sesión de base
 * sigue abierta, se queda con una conexión y Guardar termina sin cupo.
 */
@Component
@RequiredArgsConstructor
public class SoltarConexion {

    private final EntityManagerFactory fabrica;

    public void ahora() {
        if (!TransactionSynchronizationManager.hasResource(fabrica)) return;
        Object recurso = TransactionSynchronizationManager.unbindResource(fabrica);
        if (recurso instanceof EntityManagerHolder titular && titular.getEntityManager() != null) {
            EntityManagerFactoryUtils.closeEntityManager(titular.getEntityManager());
        }
    }
}
