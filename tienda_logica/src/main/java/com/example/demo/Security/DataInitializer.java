package com.example.demo.Security;

import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        usuarioRepository.findByUsername("admin").ifPresentOrElse(usuario -> {
            boolean changed = false;

            if (usuario.getRole() == null || usuario.getRole().isBlank()) {
                usuario.setRole("ADMIN");
                changed = true;
            }

            String password = usuario.getPassword() == null ? "" : usuario.getPassword();
            if (!isBCryptHash(password)) {
                usuario.setPassword(passwordEncoder.encode(password.isBlank() ? "1234556" : password));
                changed = true;
            }

            if (changed) {
                usuarioRepository.save(usuario);
            }
        }, () -> {
            Usuario admin = new Usuario();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("1234556"));
            admin.setRole("ADMIN");
            usuarioRepository.save(admin);
        });
    }

    private boolean isBCryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }
}
