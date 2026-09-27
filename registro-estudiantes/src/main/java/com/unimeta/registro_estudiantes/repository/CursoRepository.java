package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CursoRepository extends JpaRepository<Curso, Long> {
}