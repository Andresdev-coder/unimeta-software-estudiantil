package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.MatriculaDTO;
import com.unimeta.registro_estudiantes.model.Curso;
import com.unimeta.registro_estudiantes.model.Estudiante;
import com.unimeta.registro_estudiantes.model.Matricula;
import com.unimeta.registro_estudiantes.repository.CursoRepository;
import com.unimeta.registro_estudiantes.repository.EstudianteRepository;
import com.unimeta.registro_estudiantes.repository.MatriculaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatriculaService {

    private final MatriculaRepository matriculaRepository;

    private final EstudianteRepository estudianteRepository;

    private final CursoRepository cursoRepository;

    public MatriculaDTO crear(MatriculaDTO dto) {
        Estudiante estudiante = estudianteRepository.findById(dto.getEstudianteId())
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + dto.getEstudianteId()));
        Curso curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + dto.getCursoId()));

        Matricula matricula = new Matricula();
        matricula.setEstudiante(estudiante);
        matricula.setCurso(curso);
        matricula.setFechaMatricula(dto.getFechaMatricula() != null ? dto.getFechaMatricula() : LocalDate.now());
        matricula.setEstado("ACTIVA");

        return toDTO(matriculaRepository.save(matricula));
    }

    public List<MatriculaDTO> listarTodas() {
        return matriculaRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MatriculaDTO buscarPorId(Long id) {
        Matricula matricula = matriculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Matrícula no encontrada con id: " + id));
        return toDTO(matricula);
    }

    public MatriculaDTO toDTO(Matricula matricula) {
        MatriculaDTO dto = new MatriculaDTO();
        dto.setId(matricula.getId());
        dto.setEstudianteId(matricula.getEstudiante().getId());
        dto.setCursoId(matricula.getCurso().getId());
        dto.setFechaMatricula(matricula.getFechaMatricula());
        dto.setEstado(matricula.getEstado());
        dto.setNombreEstudiante(matricula.getEstudiante().getNombres() + " " + matricula.getEstudiante().getApellidos());
        dto.setNombreCurso(matricula.getCurso().getNombre());
        return dto;
    }
}