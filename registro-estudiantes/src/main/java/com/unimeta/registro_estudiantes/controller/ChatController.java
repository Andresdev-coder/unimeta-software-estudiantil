package com.unimeta.registro_estudiantes.controller;

import com.unimeta.registro_estudiantes.dto.MensajeChatDTO;
import com.unimeta.registro_estudiantes.service.ChatService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ESTUDIANTE')")
public class ChatController {
    private final ChatService service;

    @GetMapping
    public List<MensajeChatDTO> listar() { return service.listar(); }

    @PostMapping
    public MensajeChatDTO enviar(@Valid @RequestBody MensajeChatDTO dto, Principal principal) {
        return service.enviar(principal.getName(), dto);
    }
}
