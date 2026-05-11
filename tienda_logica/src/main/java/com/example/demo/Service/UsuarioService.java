package com.example.demo.Service;

import com.example.demo.DTO.UsuarioCreateDTO;
import com.example.demo.DTO.UsuarioDTO;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;

    public UsuarioService(UsuarioRepository repository) {
        this.repository = repository;
    }

    public List<UsuarioDTO> listar() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public UsuarioDTO guardar(UsuarioCreateDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());

        // 🔥 IMPORTANTE: en producción esto debe ir encriptado
        usuario.setPassword(dto.getPassword());

        Usuario guardado = repository.save(usuario);
        return toDTO(guardado);
    }

    public UsuarioDTO buscar(Long id) {
        Usuario usuario = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return toDTO(usuario);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔄 ENTITY → DTO
    private UsuarioDTO toDTO(Usuario u) {
        return new UsuarioDTO(
                u.getId(),
                u.getUsername()
        );
    }
}
