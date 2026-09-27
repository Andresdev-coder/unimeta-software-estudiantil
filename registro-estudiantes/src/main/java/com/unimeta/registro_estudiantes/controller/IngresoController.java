package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.IngresoDTO;
import com.unimeta.registro_estudiantes.service.IngresoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import  java.util.Map;;

@RestController
@RequestMapping("/api/ingresos")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class IngresoController {

    private final IngresoService ingresoService;

    @PostMapping
    public ResponseEntity<IngresoDTO> registrar(@Valid @RequestBody IngresoDTO dto) {
        return ResponseEntity.ok(ingresoService.registrar(dto));
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<IngresoDTO> actualizarEstado(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(ingresoService.actualizarEstado(id, body.get("estado")));
    }

    @GetMapping("/estudiante/{estudianteId}")
    public ResponseEntity<List<IngresoDTO>> historialPorEstudiante(
            @PathVariable Long estudianteId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return ResponseEntity.ok(ingresoService.historialPorEstudiante(estudianteId, desde, hasta));
    }
}