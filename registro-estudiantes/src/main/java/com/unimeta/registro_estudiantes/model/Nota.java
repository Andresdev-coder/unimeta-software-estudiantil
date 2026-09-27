package com.unimeta.registro_estudiantes.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "notas")
@Getter
@Setter
@NoArgsConstructor
public class Nota {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    @JoinColumn(name = "estudiante_id")
    private Estudiante estudiante;

    @ManyToOne(optional = false)
    @JoinColumn(name = "materia_id")
    private Materia materia;

    @ManyToOne(optional = false)
    @JoinColumn(name = "profesor_id")
    private Usuario profesor;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal valor;

    @Column(nullable = false)
    private String descripcion;

    @Column(nullable = false)
    private LocalDateTime fecha = LocalDateTime.now();
}
