package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Matricula;
import com.unimeta.registro_estudiantes.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MatriculaRepository extends JpaRepository<Matricula, Long> {
    @Query("SELECT DISTINCT m.estudiante FROM Matricula m JOIN m.curso c JOIN c.materias materia " +
            "WHERE materia.id = :materiaId AND m.estado = 'ACTIVA' ORDER BY m.estudiante.apellidos")
    List<Estudiante> estudiantesEnMateria(@Param("materiaId") Long materiaId);

    @Query("SELECT DISTINCT materia.nombre FROM Matricula m JOIN m.curso c JOIN c.materias materia " +
            "WHERE m.estudiante.id = :estudianteId AND m.estado = 'ACTIVA' ORDER BY materia.nombre")
    List<String> materiasDelEstudiante(@Param("estudianteId") Long estudianteId);
}
