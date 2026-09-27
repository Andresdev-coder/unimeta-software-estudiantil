package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;

@Getter
@Setter
public class NotaCrearDTO {
    @NotNull private Long estudianteId;
    @NotNull private Long materiaId;
    @NotNull @DecimalMin("0") @DecimalMax("5") private BigDecimal valor;
    @NotBlank private String descripcion;
}
