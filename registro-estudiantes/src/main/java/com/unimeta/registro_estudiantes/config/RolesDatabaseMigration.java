package com.unimeta.registro_estudiantes.config;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import java.util.List;

@Configuration
public class RolesDatabaseMigration {
    @Bean
    ApplicationRunner actualizarRestriccionDeRoles(JdbcTemplate jdbcTemplate) {
        return args -> {
            List<String> restricciones = jdbcTemplate.queryForList(
                    "SELECT pg_get_constraintdef(oid) FROM pg_constraint " +
                            "WHERE conname = 'usuarios_rol_check' " +
                            "AND conrelid = 'usuarios'::regclass",
                    String.class);

            if (!restricciones.isEmpty()) {
                String definicion = restricciones.get(0);
                if (!definicion.contains("PROFESOR") || !definicion.contains("ESTUDIANTE")) {
                    jdbcTemplate.execute("ALTER TABLE usuarios DROP CONSTRAINT usuarios_rol_check");
                    jdbcTemplate.execute("ALTER TABLE usuarios ADD CONSTRAINT usuarios_rol_check " +
                            "CHECK (rol IN ('ADMIN', 'COORDINADOR', 'PROFESOR', 'ESTUDIANTE'))");
                }
            }
        };
    }
}
