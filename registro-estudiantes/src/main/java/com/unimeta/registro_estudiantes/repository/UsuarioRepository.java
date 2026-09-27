package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsername(String username);
    boolean existsByEstudiante_Id(Long estudianteId);
    List<Usuario> findByRolInOrderByIdDesc(List<com.unimeta.registro_estudiantes.model.Rol> roles);
}
