package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.UsuarioCrearDTO;
import com.unimeta.registro_estudiantes.dto.UsuarioPerfilDTO;
import com.unimeta.registro_estudiantes.model.Rol;
import com.unimeta.registro_estudiantes.model.Usuario;
import com.unimeta.registro_estudiantes.repository.EstudianteRepository;
import com.unimeta.registro_estudiantes.repository.MateriaRepository;
import com.unimeta.registro_estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministracionUsuariosService {
    private final UsuarioRepository usuarioRepository;
    private final EstudianteRepository estudianteRepository;
    private final MateriaRepository materiaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UsuarioPerfilDTO crear(UsuarioCrearDTO dto) {
        if (dto.getRol() != Rol.PROFESOR && dto.getRol() != Rol.ESTUDIANTE) {
            throw new IllegalArgumentException("Solo se pueden crear perfiles de profesor o estudiante");
        }
        String username = dto.getUsername().trim();
        if (usuarioRepository.findByUsername(username).isPresent()) {
            throw new IllegalArgumentException("Ese nombre de usuario ya está ocupado");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);
        usuario.setPassword(passwordEncoder.encode(dto.getPassword()));
        usuario.setRol(dto.getRol());
        usuario.setNombreCompleto(dto.getNombreCompleto().trim());

        if (dto.getRol() == Rol.ESTUDIANTE) {
            if (dto.getEstudianteId() == null) {
                throw new IllegalArgumentException("Selecciona el registro del estudiante");
            }
            if (usuarioRepository.existsByEstudiante_Id(dto.getEstudianteId())) {
                throw new IllegalArgumentException("Ese estudiante ya tiene una cuenta vinculada");
            }
            usuario.setEstudiante(estudianteRepository.findById(dto.getEstudianteId())
                    .orElseThrow(() -> new IllegalArgumentException("Estudiante no encontrado")));
        } else {
            List<Long> ids = dto.getMateriasIds() == null ? List.of() : dto.getMateriasIds();
            usuario.setMateriasAsignadas(new java.util.HashSet<>(materiaRepository.findAllById(ids)));
            if (usuario.getMateriasAsignadas().size() != ids.stream().distinct().count()) {
                throw new IllegalArgumentException("Una o más materias no existen");
            }
        }
        return perfil(usuarioRepository.save(usuario));
    }

    public List<UsuarioPerfilDTO> listarPerfiles() {
        return usuarioRepository.findByRolInOrderByIdDesc(List.of(Rol.PROFESOR, Rol.ESTUDIANTE))
                .stream().map(this::perfil).toList();
    }

    private UsuarioPerfilDTO perfil(Usuario usuario) {
        return new UsuarioPerfilDTO(usuario.getId(), usuario.getUsername(), usuario.getNombreCompleto(),
                usuario.getRol(), usuario.getEstudiante() == null ? null : usuario.getEstudiante().getId());
    }
}
