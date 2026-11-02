package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.LoginRequestDTO;
import com.unimeta.registro_estudiantes.dto.LoginResponseDTO;
import com.unimeta.registro_estudiantes.dto.CambiarPasswordDTO;
import com.unimeta.registro_estudiantes.model.Usuario;
import com.unimeta.registro_estudiantes.repository.UsuarioRepository;
import com.unimeta.registro_estudiantes.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.security.access.prepost.PreAuthorize;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;

    private final UsuarioRepository usuarioRepository;

    private final JwtUtil jwtUtil;

    private final PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@Valid @RequestBody LoginRequestDTO dto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.getUsername(), dto.getPassword())
        );

        var usuario = usuarioRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        String token = jwtUtil.generarToken(usuario.getUsername(), usuario.getRol().name());

        return ResponseEntity.ok(new LoginResponseDTO(token, usuario.getUsername(), usuario.getRol().name()));
    }

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> cambiarPassword(@Valid @RequestBody CambiarPasswordDTO dto, Principal principal) {
        Usuario usuario = usuarioRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new BadCredentialsException("Usuario no encontrado"));

        if (!passwordEncoder.matches(dto.getPasswordActual(), usuario.getPassword())) {
            throw new BadCredentialsException("La contraseña actual es incorrecta");
        }

        usuario.setPassword(passwordEncoder.encode(dto.getPasswordNueva()));
        usuarioRepository.save(usuario);
        return ResponseEntity.noContent().build();
    }
}
