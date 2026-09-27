package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class CursoDTO {
    private Long id;

    @NotBlank(message = "El nombre del curso es obligatorio")
    private String nombre;

    private List<MateriaDTO> materias;
}