package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Matricula;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
}