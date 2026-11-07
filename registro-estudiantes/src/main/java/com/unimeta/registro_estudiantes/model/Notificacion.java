package com.unimeta.registro_estudiantes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Entity
@Table(name = "notificaciones")
@Getter @Setter @NoArgsConstructor
public class Notificacion {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne(optional = false) @JoinColumn(name = "curso_id")
    private Curso curso;
    @ManyToOne(optional = false) @JoinColumn(name = "profesor_id")
    private Usuario profesor;
    @Column(nullable = false, length = 120)
    private String titulo;
    @Column(nullable = false, length = 1000)
    private String mensaje;
    private LocalDateTime fechaEvento;
    @Column(nullable = false)
    private LocalDateTime fechaCreacion = LocalDateTime.now();
}
