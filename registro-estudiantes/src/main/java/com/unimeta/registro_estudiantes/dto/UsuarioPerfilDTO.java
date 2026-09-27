package com.unimeta.registro_estudiantes.dto;

import com.unimeta.registro_estudiantes.model.Rol;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class UsuarioPerfilDTO {
    private Long id;
    private String username;
    private String nombreCompleto;
    private Rol rol;
    private Long estudianteId;
}
