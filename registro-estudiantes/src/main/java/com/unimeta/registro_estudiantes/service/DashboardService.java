package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.DashboardDTO;
import com.unimeta.registro_estudiantes.dto.IngresoMesDTO;
import com.unimeta.registro_estudiantes.repository.CursoRepository;
import com.unimeta.registro_estudiantes.repository.EstudianteRepository;
import com.unimeta.registro_estudiantes.repository.IngresoRepository;
import com.unimeta.registro_estudiantes.repository.MateriaRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final EstudianteRepository estudianteRepository;

    private final CursoRepository cursoRepository;

    private final MateriaRepository materiaRepository;

    private final IngresoRepository ingresoRepository;

    public DashboardDTO obtenerResumen() {
        DashboardDTO dto = new DashboardDTO();

        dto.setTotalEstudiantes(estudianteRepository.count());
        dto.setTotalCursos(cursoRepository.count());
        dto.setTotalMaterias(materiaRepository.count());
        dto.setIngresosPagados(ingresoRepository.sumaIngresosPagados());
        dto.setIngresosPendientes(ingresoRepository.sumaIngresosPendientes());

        List<IngresoMesDTO> ingresosPorSemana = ingresoRepository.ingresosPagadosPorSemana()
                .stream()
                .map(fila -> new IngresoMesDTO((String) fila[0], (BigDecimal) fila[1]))
                .collect(Collectors.toList());
        dto.setIngresosPorSemana(ingresosPorSemana);

        return dto;
    }
}
