package com.example.demo.Service;

import com.example.demo.DTO.UsuarioCreateDTO;
import com.example.demo.DTO.UsuarioDTO;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(UsuarioRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<UsuarioDTO> listar() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public UsuarioDTO guardar(UsuarioCreateDTO dto) {
        String username = dto.getUsername() == null ? "" : dto.getUsername().trim();
        String password = dto.getPassword() == null ? "" : dto.getPassword();

        if (username.isBlank()) {
            throw new RuntimeException("El usuario es obligatorio");
        }

        if (password.isBlank() || password.length() < 4) {
            throw new RuntimeException("La contraseña debe tener al menos 4 caracteres");
        }

        if (repository.existsByUsername(username)) {
            throw new RuntimeException("El usuario ya existe");
        }

        Usuario usuario = new Usuario();
        usuario.setUsername(username);

        usuario.setPassword(passwordEncoder.encode(password));
        usuario.setRole("VENTAS");

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
