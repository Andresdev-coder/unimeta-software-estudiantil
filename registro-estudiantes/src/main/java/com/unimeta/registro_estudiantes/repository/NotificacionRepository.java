package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByProfesor_UsernameOrderByFechaCreacionDesc(String username);
    @Query("SELECT n FROM Notificacion n, Matricula m WHERE m.curso.id = n.curso.id " +
           "AND m.estudiante.id = :estudianteId AND m.estado = 'ACTIVA' ORDER BY n.fechaCreacion DESC")
    List<Notificacion> paraEstudiante(@Param("estudianteId") Long estudianteId);
}
