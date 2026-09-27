package com.unimeta.registro_estudiantes.repository;

import com.unimeta.registro_estudiantes.model.MensajeChat;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface MensajeChatRepository extends JpaRepository<MensajeChat, Long> {
    List<MensajeChat> findTop100ByOrderByFechaAsc();
}
