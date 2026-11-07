package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Curso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Collection;
import java.util.List;

public interface CursoRepository extends JpaRepository<Curso, Long> {
    @Query("SELECT DISTINCT c FROM Curso c JOIN c.materias m WHERE m.id IN :materiaIds ORDER BY c.nombre")
    List<Curso> cursosConMaterias(@Param("materiaIds") Collection<Long> materiaIds);
}
