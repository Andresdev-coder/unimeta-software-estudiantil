package com.unimeta.registro_estudiantes.dto;

import com.unimeta.registro_estudiantes.model.Rol;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.util.List;

@Getter
@Setter
public class UsuarioCrearDTO {
    @NotBlank private String username;
    @NotBlank @Size(min = 8, max = 100) private String password;
    @NotBlank private String nombreCompleto;
    @NotNull private Rol rol;
    private Long estudianteId;
    private List<Long> materiasIds;
}
