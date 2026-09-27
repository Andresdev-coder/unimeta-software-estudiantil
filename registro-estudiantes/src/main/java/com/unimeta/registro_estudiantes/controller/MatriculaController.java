package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.MatriculaDTO;
import com.unimeta.registro_estudiantes.service.MatriculaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matriculas")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MatriculaController {

    private final MatriculaService matriculaService;

    @PostMapping
    public ResponseEntity<MatriculaDTO> crear(@Valid @RequestBody MatriculaDTO dto) {
        return ResponseEntity.ok(matriculaService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<MatriculaDTO>> listarTodas() {
        return ResponseEntity.ok(matriculaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MatriculaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(matriculaService.buscarPorId(id));
    }
}