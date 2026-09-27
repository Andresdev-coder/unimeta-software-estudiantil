package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Estudiante;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

// import com.unimeta.registro_estudiantes.model.Matricula;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface EstudianteRepository extends JpaRepository<Estudiante, Long> {

    Optional<Estudiante> findByDocumento(String documento);

    @Query("SELECT DISTINCT e FROM Estudiante e " +
           "LEFT JOIN Matricula m ON m.estudiante = e " +
           "LEFT JOIN m.curso c " +
           "WHERE LOWER(e.nombres) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(e.apellidos) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(e.documento) LIKE LOWER(CONCAT('%', :texto, '%')) " +
           "OR LOWER(c.nombre) LIKE LOWER(CONCAT('%', :texto, '%'))")
    List<Estudiante> buscar(@Param("texto") String texto);

    List<Estudiante> findByNombresContainingIgnoreCaseOrApellidosContainingIgnoreCase(
            String nombres, String apellidos);
}