package com.unimeta.registro_estudiantes.service;

import com.unimeta.registro_estudiantes.dto.MensajeChatDTO;
import com.unimeta.registro_estudiantes.model.MensajeChat;
import com.unimeta.registro_estudiantes.model.Usuario;
import com.unimeta.registro_estudiantes.repository.MensajeChatRepository;
import com.unimeta.registro_estudiantes.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {
    private final MensajeChatRepository mensajeRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional(readOnly = true)
    public List<MensajeChatDTO> listar() {
        return mensajeRepository.findTop100ByOrderByFechaAsc().stream().map(this::toDTO).toList();
    }

    @Transactional
    public MensajeChatDTO enviar(String username, MensajeChatDTO dto) {
        Usuario usuario = usuarioRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));
        MensajeChat mensaje = new MensajeChat();
        mensaje.setUsuario(usuario);
        mensaje.setMensaje(dto.getMensaje().trim());
        mensaje.setFecha(LocalDateTime.now());
        return toDTO(mensajeRepository.save(mensaje));
    }

    private MensajeChatDTO toDTO(MensajeChat mensaje) {
        MensajeChatDTO dto = new MensajeChatDTO();
        dto.setId(mensaje.getId());
        dto.setAutor(mensaje.getUsuario().getNombreCompleto());
        dto.setMensaje(mensaje.getMensaje());
        dto.setFecha(mensaje.getFecha());
        return dto;
    }
}
