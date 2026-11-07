package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.NotificacionDTO;
import com.unimeta.registro_estudiantes.dto.CursoNotificacionDTO;
import com.unimeta.registro_estudiantes.service.NotificacionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class NotificacionController {
    private final NotificacionService service;

    @GetMapping("/api/profesor/notificaciones")
    @PreAuthorize("hasRole('PROFESOR')")
    public List<NotificacionDTO> paraProfesor(Principal principal) {
        return service.paraProfesor(principal.getName());
    }

    @GetMapping("/api/profesor/notificaciones/cursos")
    @PreAuthorize("hasRole('PROFESOR')")
    public List<CursoNotificacionDTO> cursos(Principal principal) {
        return service.cursosProfesor(principal.getName());
    }

    @PostMapping("/api/profesor/notificaciones")
    @PreAuthorize("hasRole('PROFESOR')")
    public NotificacionDTO crear(@Valid @RequestBody NotificacionDTO.Crear dto, Principal principal) {
        return service.crear(principal.getName(), dto);
    }

    @GetMapping("/api/estudiante/notificaciones")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public List<NotificacionDTO> paraEstudiante(Principal principal) {
        return service.paraEstudiante(principal.getName());
    }
}
