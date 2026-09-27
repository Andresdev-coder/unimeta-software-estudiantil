package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MateriaDTO {
    private Long id;

    @NotBlank(message = "El nombre de la materia es obligatorio")
    private String nombre;

    private Integer creditos;
}