package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class IngresoDTO {
    private Long id;

    @NotNull(message = "El id de la matrícula es obligatorio")
    private Long matriculaId;

    @NotNull(message = "El monto es obligatorio")
    private BigDecimal monto;

    private LocalDate fecha;

    private String estado; // PAGADO, PENDIENTE
}