package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class EstudianteDTO {

    private Long id;

    @NotBlank(message = "El nombre es obligatorio")
    private String nombres;

    @NotBlank(message = "El apellido es obligatorio")
    private String apellidos;

    @NotBlank(message = "El documento es obligatorio")
    private String documento;

    private LocalDate fechaNacimiento;

    @Email(message = "Correo inválido")
    private String correo;

    private String telefono;

    private String fotoUrl;
}