package com.unimeta.registro_estudiantes.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class MensajeChatDTO {
    private Long id;
    private String autor;
    @NotBlank @Size(max = 1000) private String mensaje;
    private LocalDateTime fecha;
}
