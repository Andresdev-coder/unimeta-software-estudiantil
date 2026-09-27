package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.CursoDTO;
import com.unimeta.registro_estudiantes.service.CursoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;

@RestController
@RequestMapping("/api/cursos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @PostMapping
    public ResponseEntity<CursoDTO> crear(@Valid @RequestBody CursoDTO dto) {
        return ResponseEntity.ok(cursoService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<CursoDTO>> listarTodos() {
        return ResponseEntity.ok(cursoService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CursoDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.buscarPorId(id));
    }

    @PostMapping("/{id}/materias/{materiaId}")
    public ResponseEntity<CursoDTO> asociarMateria(@PathVariable Long id, @PathVariable Long materiaId) {
        return ResponseEntity.ok(cursoService.asociarMateria(id, materiaId));
    }
}