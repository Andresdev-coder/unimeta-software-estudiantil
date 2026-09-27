package com.unimeta.registro_estudiantes.dto;

import lombok.Getter;
import lombok.Setter;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class NotaDTO {
    private Long id;
    private Long estudianteId;
    private String estudiante;
    private Long materiaId;
    private String materia;
    private String profesor;
    private BigDecimal valor;
    private String descripcion;
    private LocalDateTime fecha;
}
