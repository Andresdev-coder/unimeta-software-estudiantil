package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.MateriaDTO;
import com.unimeta.registro_estudiantes.service.MateriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/materias")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class MateriaController {

    private final MateriaService materiaService;

    @PostMapping
    public ResponseEntity<MateriaDTO> crear(@Valid @RequestBody MateriaDTO dto) {
        return ResponseEntity.ok(materiaService.crear(dto));
    }

    @GetMapping
    public ResponseEntity<List<MateriaDTO>> listarTodas() {
        return ResponseEntity.ok(materiaService.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MateriaDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(materiaService.buscarPorId(id));
    }
}