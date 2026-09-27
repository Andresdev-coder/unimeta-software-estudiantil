package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.NotaCrearDTO;
import com.unimeta.registro_estudiantes.dto.NotaDTO;
import com.unimeta.registro_estudiantes.dto.PortalEstudianteDTO;
import com.unimeta.registro_estudiantes.dto.MateriaDTO;
import com.unimeta.registro_estudiantes.model.*;
import com.unimeta.registro_estudiantes.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PortalAcademicoService {
    private final UsuarioRepository usuarioRepository;
    private final NotaRepository notaRepository;
    private final MateriaRepository materiaRepository;
    private final MatriculaRepository matriculaRepository;

    @Transactional(readOnly = true)
    public PortalEstudianteDTO resumenEstudiante(String username) {
        Usuario usuario = usuario(username);
        if (usuario.getEstudiante() == null) throw new IllegalArgumentException("La cuenta no está vinculada a un estudiante");
        Estudiante estudiante = usuario.getEstudiante();
        List<NotaDTO> notas = notaRepository.findByEstudiante_IdOrderByFechaDesc(estudiante.getId())
                .stream().map(this::toDTO).toList();
        return new PortalEstudianteDTO(estudiante.getNombres() + " " + estudiante.getApellidos(),
                matriculaRepository.materiasDelEstudiante(estudiante.getId()), notas);
    }

    @Transactional(readOnly = true)
    public List<Estudiante> estudiantesParaMateria(String username, Long materiaId) {
        Usuario profesor = profesor(username);
        if (profesor.getMateriasAsignadas().stream().noneMatch(m -> m.getId().equals(materiaId))) {
            throw new IllegalArgumentException("No tienes asignada esa materia");
        }
        return matriculaRepository.estudiantesEnMateria(materiaId);
    }

    @Transactional(readOnly = true)
    public List<NotaDTO> notasProfesor(String username) {
        profesor(username);
        return notaRepository.findByProfesor_UsernameOrderByFechaDesc(username).stream().map(this::toDTO).toList();
    }

    @Transactional(readOnly = true)
    public List<MateriaDTO> materiasProfesor(String username) {
        return profesor(username).getMateriasAsignadas().stream().map(materia -> {
            MateriaDTO dto = new MateriaDTO();
            dto.setId(materia.getId());
            dto.setNombre(materia.getNombre());
            dto.setCreditos(materia.getCreditos());
            return dto;
        }).toList();
    }

    @Transactional
    public NotaDTO crearNota(String username, NotaCrearDTO dto) {
        Usuario profesor = profesor(username);
        Materia materia = materiaRepository.findById(dto.getMateriaId())
                .orElseThrow(() -> new IllegalArgumentException("Materia no encontrada"));
        if (profesor.getMateriasAsignadas().stream().noneMatch(m -> m.getId().equals(materia.getId()))) {
            throw new IllegalArgumentException("No tienes asignada esa materia");
        }
        Estudiante estudiante = matriculaRepository.estudiantesEnMateria(materia.getId()).stream()
                .filter(e -> e.getId().equals(dto.getEstudianteId())).findFirst()
                .orElseThrow(() -> new IllegalArgumentException("El estudiante no está matriculado en esta materia"));
        Nota nota = new Nota();
        nota.setEstudiante(estudiante);
        nota.setMateria(materia);
        nota.setProfesor(profesor);
        nota.setValor(dto.getValor());
        nota.setDescripcion(dto.getDescripcion().trim());
        nota.setFecha(LocalDateTime.now());
        return toDTO(notaRepository.save(nota));
    }

    private Usuario usuario(String username) {
        return usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
    }

    private Usuario profesor(String username) {
        Usuario usuario = usuario(username);
        if (usuario.getRol() != Rol.PROFESOR) throw new IllegalArgumentException("Se requiere perfil de profesor");
        return usuario;
    }

    private NotaDTO toDTO(Nota nota) {
        NotaDTO dto = new NotaDTO();
        dto.setId(nota.getId());
        dto.setEstudianteId(nota.getEstudiante().getId());
        dto.setEstudiante(nota.getEstudiante().getNombres() + " " + nota.getEstudiante().getApellidos());
        dto.setMateriaId(nota.getMateria().getId());
        dto.setMateria(nota.getMateria().getNombre());
        dto.setProfesor(nota.getProfesor().getNombreCompleto());
        dto.setValor(nota.getValor());
        dto.setDescripcion(nota.getDescripcion());
        dto.setFecha(nota.getFecha());
        return dto;
    }
}
