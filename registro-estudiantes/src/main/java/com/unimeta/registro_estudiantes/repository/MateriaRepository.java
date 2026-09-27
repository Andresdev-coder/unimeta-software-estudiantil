package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Materia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MateriaRepository extends JpaRepository<Materia, Long> {
}