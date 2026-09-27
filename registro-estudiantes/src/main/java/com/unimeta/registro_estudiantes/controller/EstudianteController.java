package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.EstudianteDTO;
import com.unimeta.registro_estudiantes.service.EstudianteService;
import com.unimeta.registro_estudiantes.service.FileStorageService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/estudiantes")
@CrossOrigin(origins = "*") // en producción, restringe esto a la URL real del frontend
@RequiredArgsConstructor
public class EstudianteController {

    private final EstudianteService estudianteService;

    private final FileStorageService fileStorageService;

    @PostMapping("/{id}/foto")
    public ResponseEntity<EstudianteDTO> subirFoto(@PathVariable Long id,
                                                     @RequestParam("file") MultipartFile file) {
        String rutaFoto = fileStorageService.guardarArchivo(file);
        return ResponseEntity.ok(estudianteService.actualizarFoto(id, rutaFoto));
    }

    @PostMapping
    public ResponseEntity<EstudianteDTO> registrar(@Valid @RequestBody EstudianteDTO dto) {
        return ResponseEntity.ok(estudianteService.registrar(dto));
    }

    @GetMapping
    public ResponseEntity<List<EstudianteDTO>> listarTodos() {
        return ResponseEntity.ok(estudianteService.listarTodos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudianteDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(estudianteService.buscarPorId(id));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<EstudianteDTO>> buscar(@RequestParam String texto) {
        return ResponseEntity.ok(estudianteService.buscar(texto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudianteDTO> actualizar(@PathVariable Long id, @Valid @RequestBody EstudianteDTO dto) {
        return ResponseEntity.ok(estudianteService.actualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        estudianteService.eliminar(id);
        return ResponseEntity.noContent().build();
    }
}