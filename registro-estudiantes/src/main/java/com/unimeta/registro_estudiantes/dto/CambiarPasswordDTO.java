package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambiarPasswordDTO {
    @NotBlank
    private String passwordActual;

    @NotBlank
    @Size(min = 8, max = 100)
    private String passwordNueva;
}
