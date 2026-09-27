package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.UsuarioCrearDTO;
import com.unimeta.registro_estudiantes.dto.UsuarioPerfilDTO;
import com.unimeta.registro_estudiantes.service.AdministracionUsuariosService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/admin/perfiles")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdministracionUsuariosController {
    private final AdministracionUsuariosService service;

    @GetMapping
    public List<UsuarioPerfilDTO> listar() { return service.listarPerfiles(); }

    @PostMapping
    public ResponseEntity<UsuarioPerfilDTO> crear(@Valid @RequestBody UsuarioCrearDTO dto) {
        return ResponseEntity.ok(service.crear(dto));
    }
}
