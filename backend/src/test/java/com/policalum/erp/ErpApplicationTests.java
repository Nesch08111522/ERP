package com.policalum.erp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Prueba de humo del contexto completo.
 *
 * <p>Antes fallaba siempre: heredaba de {@code src/test/resources/application.properties} una
 * URL apuntando a {@code ERPpoli_it_unconfigured} con contraseña vacía, una barrera deliberada
 * para que las pruebas de integración que RECREAN el esquema sean opt-in (ver README y
 * {@code FlujoComercialIT}). Pero esta prueba no recrea nada: solo levanta el contexto, así que
 * estaba rota por configuración, no por un defecto real.
 *
 * <p>Aquí se conecta a la base de prueba continua del proyecto con tres garantías de que no la
 * modifica:
 * <ul>
 *   <li>{@code ddl-auto=validate} &rarr; Hibernate solo lee metadatos, no emite DDL.</li>
 *   <li>{@code app.seed.enabled=false} &r; DataLoader y CatalogoSeeder no se registran
 *       ({@code @ConditionalOnProperty}), así que no inserta ni actualiza filas.</li>
 *   <li>No hay transacciones de escritura en el test.</li>
 * </ul>
 *
 * <p>Con {@code validate} esta prueba pasa a ser un guard contra deriva de esquema: detectó
 * automáticamente el caso {@code servicio_colaboradores.tipo_colaborador}, que llevaba tiempo
 * declarado en la entidad y ausente en la base sin que nadie lo viera.
 *
 * <p>Se puede sobrescribir con {@code POLICALUM_TEST_DB_URL} para apuntarla a otra base.
 */
@SpringBootTest(properties = {
        "spring.datasource.url=${POLICALUM_TEST_DB_URL:jdbc:postgresql://127.0.0.1:5432/ERPpoli}",
        "spring.datasource.username=${POLICALUM_TEST_DB_USERNAME:postgres}",
        "spring.datasource.password=${POLICALUM_TEST_DB_PASSWORD:postgre}",
        "spring.jpa.hibernate.ddl-auto=validate",
        "spring.jpa.show-sql=false",
        "app.seed.enabled=false"
})
class ErpApplicationTests {

	@Test
	void contextLoads() {
	}

}
