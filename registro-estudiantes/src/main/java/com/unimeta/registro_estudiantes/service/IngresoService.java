package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.IngresoDTO;
import com.unimeta.registro_estudiantes.model.Ingreso;
import com.unimeta.registro_estudiantes.model.Matricula;
import com.unimeta.registro_estudiantes.repository.IngresoRepository;
import com.unimeta.registro_estudiantes.repository.MatriculaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class IngresoService {

    private final IngresoRepository ingresoRepository;

    private final MatriculaRepository matriculaRepository;

    public IngresoDTO registrar(IngresoDTO dto) {
        Matricula matricula = matriculaRepository.findById(dto.getMatriculaId())
                .orElseThrow(() -> new RuntimeException("Matrícula no encontrada con id: " + dto.getMatriculaId()));

        Ingreso ingreso = new Ingreso();
        ingreso.setMatricula(matricula);
        ingreso.setMonto(dto.getMonto());
        ingreso.setFecha(dto.getFecha() != null ? dto.getFecha() : LocalDate.now());
        ingreso.setEstado(dto.getEstado() != null ? dto.getEstado() : "PENDIENTE");

        return toDTO(ingresoRepository.save(ingreso));
    }

    public IngresoDTO actualizarEstado(Long id, String nuevoEstado) {
        Ingreso ingreso = ingresoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ingreso no encontrado con id: " + id));
        ingreso.setEstado(nuevoEstado);
        return toDTO(ingresoRepository.save(ingreso));
    }

    public List<IngresoDTO> historialPorEstudiante(Long estudianteId, LocalDate desde, LocalDate hasta) {
        List<Ingreso> ingresos;
        if (desde != null && hasta != null) {
            ingresos = ingresoRepository.findByMatricula_Estudiante_IdAndFechaBetween(estudianteId, desde, hasta);
        } else {
            ingresos = ingresoRepository.findByMatricula_Estudiante_Id(estudianteId);
        }
        return ingresos.stream().map(this::toDTO).collect(Collectors.toList());
    }

    private IngresoDTO toDTO(Ingreso ingreso) {
        IngresoDTO dto = new IngresoDTO();
        dto.setId(ingreso.getId());
        dto.setMatriculaId(ingreso.getMatricula().getId());
        dto.setMonto(ingreso.getMonto());
        dto.setFecha(ingreso.getFecha());
        dto.setEstado(ingreso.getEstado());
        return dto;
    }
}