package com.unimeta.registro_estudiantes.config;

import com.unimeta.registro_estudiantes.model.Rol;
import com.unimeta.registro_estudiantes.model.Usuario;
import com.unimeta.registro_estudiantes.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.initial-password}")
    private String adminInitialPassword;

    @Override
    public void run(String... args) {
        if (usuarioRepository.findByUsername("admin").isEmpty()) {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode(adminInitialPassword));
            admin.setRol(Rol.ADMIN);
            usuarioRepository.save(admin);
        }
    }
}
