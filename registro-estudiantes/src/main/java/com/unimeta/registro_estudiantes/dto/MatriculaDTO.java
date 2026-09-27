package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class MatriculaDTO {
    private Long id;

    @NotNull(message = "El id del estudiante es obligatorio")
    private Long estudianteId;

    @NotNull(message = "El id del curso es obligatorio")
    private Long cursoId;

    private LocalDate fechaMatricula;

    private String estado;

    // campos de solo lectura, para mostrar info legible
    private String nombreEstudiante;
    private String nombreCurso;
}