package com.unimeta.registro_estudiantes.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    @Column(unique = true)
    private String username;

    @NotBlank
    private String password;

    @Enumerated(EnumType.STRING)
    private Rol rol;

    private String nombreCompleto;

    @OneToOne
    @JoinColumn(name = "estudiante_id", unique = true)
    private Estudiante estudiante;

    @ManyToMany
    @JoinTable(
            name = "profesor_materia",
            joinColumns = @JoinColumn(name = "usuario_id"),
            inverseJoinColumns = @JoinColumn(name = "materia_id"))
    private java.util.Set<Materia> materiasAsignadas = new java.util.HashSet<>();
}
