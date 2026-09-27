package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.Ingreso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface IngresoRepository extends JpaRepository<Ingreso, Long> {

    List<Ingreso> findByMatricula_Estudiante_Id(Long estudianteId);

    List<Ingreso> findByMatricula_Estudiante_IdAndFechaBetween(
            Long estudianteId, LocalDate desde, LocalDate hasta);
    
    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i WHERE i.estado = 'PAGADO'")
    BigDecimal sumaIngresosPagados();

    @Query("SELECT COALESCE(SUM(i.monto), 0) FROM Ingreso i WHERE i.estado = 'PENDIENTE'")
    BigDecimal sumaIngresosPendientes();

    @Query(value = "WITH semanas AS (" +
                    "  SELECT generate_series(" +
                    "    date_trunc('week', COALESCE((SELECT MIN(fecha) FROM ingresos WHERE estado = 'PAGADO'), CURRENT_DATE)), " +
                    "    date_trunc('week', CURRENT_DATE), INTERVAL '1 week'" +
                    "  ) AS inicio" +
                    ") " +
                    "SELECT TO_CHAR(s.inicio, 'DD/MM') AS semana, COALESCE(SUM(i.monto), 0) AS total " +
                    "FROM semanas s LEFT JOIN ingresos i " +
                    "  ON i.estado = 'PAGADO' AND i.fecha >= s.inicio AND i.fecha < s.inicio + INTERVAL '1 week' " +
                    "GROUP BY s.inicio ORDER BY s.inicio", nativeQuery = true)
    List<Object[]> ingresosPagadosPorSemana();
}
