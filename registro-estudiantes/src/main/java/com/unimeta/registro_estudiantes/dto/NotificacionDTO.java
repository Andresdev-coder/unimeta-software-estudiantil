package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record NotificacionDTO(Long id, Long cursoId, String curso, String profesor, String titulo,
        String mensaje, LocalDateTime fechaEvento, LocalDateTime fechaCreacion) {
    public record Crear(@jakarta.validation.constraints.NotNull Long cursoId,
            @NotBlank @Size(max=120) String titulo,
            @NotBlank @Size(max=1000) String mensaje,
            LocalDateTime fechaEvento) {}
}
