package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.NotificacionDTO;
import com.unimeta.registro_estudiantes.dto.CursoNotificacionDTO;
import com.unimeta.registro_estudiantes.model.*;
import com.unimeta.registro_estudiantes.repository.CursoRepository;
import com.unimeta.registro_estudiantes.repository.NotificacionRepository;
import com.unimeta.registro_estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacionService {
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final NotificacionRepository notificacionRepository;

    @Transactional(readOnly = true)
    public List<NotificacionDTO> paraProfesor(String username) {
        profesor(username);
        return notificacionRepository.findByProfesor_UsernameOrderByFechaCreacionDesc(username)
                .stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<CursoNotificacionDTO> cursosProfesor(String username) {
        Usuario profesor = profesor(username);
        if (profesor.getMateriasAsignadas().isEmpty()) return List.of();
        return cursoRepository.cursosConMaterias(profesor.getMateriasAsignadas().stream()
                        .map(Materia::getId).toList()).stream()
                .map(c -> new CursoNotificacionDTO(c.getId(), c.getNombre()))
                .toList();
    }

    @Transactional
    public NotificacionDTO crear(String username, NotificacionDTO.Crear dto) {
        Usuario profesor = profesor(username);
        Curso curso = cursoRepository.findById(dto.cursoId())
                .orElseThrow(() -> new IllegalArgumentException("Curso no encontrado"));
        boolean tieneMateriaAsignada = curso.getMaterias().stream().anyMatch(cursoMateria ->
                profesor.getMateriasAsignadas().stream().anyMatch(m -> m.getId().equals(cursoMateria.getId())));
        if (!tieneMateriaAsignada) {
            throw new IllegalArgumentException("No tienes materias asignadas en ese curso");
        }
        Notificacion notificacion = new Notificacion();
        notificacion.setProfesor(profesor);
        notificacion.setCurso(curso);
        notificacion.setTitulo(dto.titulo().trim());
        notificacion.setMensaje(dto.mensaje().trim());
        notificacion.setFechaEvento(dto.fechaEvento());
        notificacion.setFechaCreacion(LocalDateTime.now());
        return toDTO(notificacionRepository.save(notificacion));
    }

    @Transactional(readOnly = true)
    public List<NotificacionDTO> paraEstudiante(String username) {
        Usuario estudiante = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (estudiante.getRol() != Rol.ESTUDIANTE || estudiante.getEstudiante() == null) {
            throw new IllegalArgumentException("Se requiere perfil de estudiante");
        }
        return notificacionRepository.paraEstudiante(estudiante.getEstudiante().getId())
                .stream().map(this::toDTO).toList();
    }

    private Usuario profesor(String username) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        if (usuario.getRol() != Rol.PROFESOR) throw new IllegalArgumentException("Se requiere perfil de profesor");
        return usuario;
    }

    private NotificacionDTO toDTO(Notificacion n) {
        return new NotificacionDTO(n.getId(), n.getCurso().getId(), n.getCurso().getNombre(),
                n.getProfesor().getNombreCompleto(), n.getTitulo(), n.getMensaje(),
                n.getFechaEvento(), n.getFechaCreacion());
    }
}
