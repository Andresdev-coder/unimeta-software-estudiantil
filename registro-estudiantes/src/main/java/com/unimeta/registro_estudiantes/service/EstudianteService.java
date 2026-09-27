package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.EstudianteDTO;
import com.unimeta.registro_estudiantes.model.Estudiante;
import com.unimeta.registro_estudiantes.repository.EstudianteRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EstudianteService {

    private final EstudianteRepository estudianteRepository;

    public EstudianteDTO registrar(EstudianteDTO dto) {
        Estudiante guardado = estudianteRepository.save(toEntity(dto));
        return toDTO(guardado);
    }

    public List<EstudianteDTO> listarTodos() {
        return estudianteRepository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<EstudianteDTO> buscar(String texto) {
        return estudianteRepository.buscar(texto)
            .stream()
            .map(this::toDTO)
            .collect(Collectors.toList());
    }

    public EstudianteDTO buscarPorId(Long id) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
        return toDTO(estudiante);
    }

    public EstudianteDTO actualizar(Long id, EstudianteDTO dto) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));

        estudiante.setNombres(dto.getNombres());
        estudiante.setApellidos(dto.getApellidos());
        estudiante.setDocumento(dto.getDocumento());
        estudiante.setFechaNacimiento(dto.getFechaNacimiento());
        estudiante.setCorreo(dto.getCorreo());
        estudiante.setTelefono(dto.getTelefono());
        if (dto.getFotoUrl() != null) {
            estudiante.setFotoUrl(dto.getFotoUrl());
        }

        return toDTO(estudianteRepository.save(estudiante));
    }

        public EstudianteDTO actualizarFoto(Long id, String fotoUrl) {
        Estudiante estudiante = estudianteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Estudiante no encontrado con id: " + id));
        estudiante.setFotoUrl(fotoUrl);
        return toDTO(estudianteRepository.save(estudiante));
    }

    public void eliminar(Long id) {
        estudianteRepository.deleteById(id);
    }

    private Estudiante toEntity(EstudianteDTO dto) {
        Estudiante estudiante = new Estudiante();
        estudiante.setNombres(dto.getNombres());
        estudiante.setApellidos(dto.getApellidos());
        estudiante.setDocumento(dto.getDocumento());
        estudiante.setFechaNacimiento(dto.getFechaNacimiento());
        estudiante.setCorreo(dto.getCorreo());
        estudiante.setTelefono(dto.getTelefono());
        estudiante.setFotoUrl(dto.getFotoUrl());
        return estudiante;
    }

    private EstudianteDTO toDTO(Estudiante estudiante) {
        EstudianteDTO dto = new EstudianteDTO();
        dto.setId(estudiante.getId());
        dto.setNombres(estudiante.getNombres());
        dto.setApellidos(estudiante.getApellidos());
        dto.setDocumento(estudiante.getDocumento());
        dto.setFechaNacimiento(estudiante.getFechaNacimiento());
        dto.setCorreo(estudiante.getCorreo());
        dto.setTelefono(estudiante.getTelefono());
        dto.setFotoUrl(estudiante.getFotoUrl());
        return dto;
    }
}