package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.CursoDTO;
import com.unimeta.registro_estudiantes.model.Curso;
import com.unimeta.registro_estudiantes.model.Materia;
import com.unimeta.registro_estudiantes.repository.CursoRepository;
import com.unimeta.registro_estudiantes.repository.MateriaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CursoService {

    private final CursoRepository cursoRepository;

    private final MateriaRepository materiaRepository;

    private final MateriaService materiaService;

    public CursoDTO crear(CursoDTO dto) {
        Curso curso = new Curso();
        curso.setNombre(dto.getNombre());
        return toDTO(cursoRepository.save(curso));
    }

    public List<CursoDTO> listarTodos() {
        return cursoRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public CursoDTO buscarPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + id));
        return toDTO(curso);
    }

    public CursoDTO asociarMateria(Long cursoId, Long materiaId) {
        Curso curso = cursoRepository.findById(cursoId)
                .orElseThrow(() -> new RuntimeException("Curso no encontrado con id: " + cursoId));
        Materia materia = materiaRepository.findById(materiaId)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada con id: " + materiaId));

        curso.getMaterias().add(materia);
        return toDTO(cursoRepository.save(curso));
    }

    private CursoDTO toDTO(Curso curso) {
        CursoDTO dto = new CursoDTO();
        dto.setId(curso.getId());
        dto.setNombre(curso.getNombre());
        dto.setMaterias(
            curso.getMaterias().stream().map(materiaService::toDTO).collect(Collectors.toList())
        );
        return dto;
    }
}