package com.unimeta.registro_estudiantes.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
public class DashboardDTO {
    private long totalEstudiantes;
    private long totalCursos;
    private long totalMaterias;
    private BigDecimal ingresosPagados;
    private BigDecimal ingresosPendientes;
    private List<IngresoMesDTO> ingresosPorSemana;
}
