package com.unimeta.registro_estudiantes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class IngresoMesDTO {
    private String semana;
    private java.math.BigDecimal total;
}
