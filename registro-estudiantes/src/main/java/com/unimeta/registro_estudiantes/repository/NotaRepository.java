package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Nota;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotaRepository extends JpaRepository<Nota, Long> {
    List<Nota> findByEstudiante_IdOrderByFechaDesc(Long estudianteId);
    List<Nota> findByProfesor_UsernameOrderByFechaDesc(String username);
}
