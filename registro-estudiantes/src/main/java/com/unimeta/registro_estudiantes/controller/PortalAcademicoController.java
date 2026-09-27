package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.*;
import com.unimeta.registro_estudiantes.model.Estudiante;
import com.unimeta.registro_estudiantes.service.PortalAcademicoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class PortalAcademicoController {
    private final PortalAcademicoService service;

    @GetMapping("/api/estudiante/mi-resumen")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public PortalEstudianteDTO resumen(Principal principal) {
        return service.resumenEstudiante(principal.getName());
    }

    @GetMapping("/api/profesor/materias")
    @PreAuthorize("hasRole('PROFESOR')")
    public List<MateriaDTO> materias(Principal principal) {
        return service.materiasProfesor(principal.getName());
    }

    @GetMapping("/api/profesor/notas")
    @PreAuthorize("hasRole('PROFESOR')")
    public List<NotaDTO> notas(Principal principal) {
        return service.notasProfesor(principal.getName());
    }

    @GetMapping("/api/profesor/materias/{materiaId}/estudiantes")
    @PreAuthorize("hasRole('PROFESOR')")
    public List<EstudianteDTO> estudiantes(@PathVariable Long materiaId, Principal principal) {
        return service.estudiantesParaMateria(principal.getName(), materiaId).stream().map(e -> {
            EstudianteDTO dto = new EstudianteDTO();
            dto.setId(e.getId());
            dto.setNombres(e.getNombres());
            dto.setApellidos(e.getApellidos());
            return dto;
        }).toList();
    }

    @PostMapping("/api/profesor/notas")
    @PreAuthorize("hasRole('PROFESOR')")
    public NotaDTO crearNota(@Valid @RequestBody NotaCrearDTO dto, Principal principal) {
        return service.crearNota(principal.getName(), dto);
    }
}
