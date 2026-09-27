package com.unimeta.registro_estudiantes.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import java.util.List;

@Getter
@AllArgsConstructor
public class PortalEstudianteDTO {
    private String nombre;
    private List<String> materias;
    private List<NotaDTO> notas;
}
