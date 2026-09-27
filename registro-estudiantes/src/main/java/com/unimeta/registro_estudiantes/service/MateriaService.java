package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.MateriaDTO;
import com.unimeta.registro_estudiantes.model.Materia;
import com.unimeta.registro_estudiantes.repository.MateriaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MateriaService {

    private final MateriaRepository materiaRepository;

    public MateriaDTO crear(MateriaDTO dto) {
        Materia materia = new Materia();
        materia.setNombre(dto.getNombre());
        materia.setCreditos(dto.getCreditos());
        return toDTO(materiaRepository.save(materia));
    }

    public List<MateriaDTO> listarTodas() {
        return materiaRepository.findAll()
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    public MateriaDTO buscarPorId(Long id) {
        Materia materia = materiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Materia no encontrada con id: " + id));
        return toDTO(materia);
    }

    public MateriaDTO toDTO(Materia materia) {
        MateriaDTO dto = new MateriaDTO();
        dto.setId(materia.getId());
        dto.setNombre(materia.getNombre());
        dto.setCreditos(materia.getCreditos());
        return dto;
    }
}