package com.example.demo.Service;

import com.example.demo.DTO.AuthResponse;
import com.example.demo.JWT.JWTutil;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UsuarioRepository usuarioRepository;
    private final JWTutil jwtUtil;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UsuarioRepository usuarioRepository, JWTutil jwtUtil, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse login(String username, String password) {
        String normalizedUsername = username == null ? "" : username.trim();
        String receivedPassword = password == null ? "" : password;

        log.info("Intento de login recibido para username={}", normalizedUsername);
        log.debug("Password recibida para username={} (presente={}, longitud={})",
                normalizedUsername,
                !receivedPassword.isBlank(),
                receivedPassword.length());

        try {
            Usuario usuario = usuarioRepository.findByUsername(normalizedUsername)
                    .orElseThrow(() -> {
                        log.warn("Login rechazado: usuario no encontrado username={}", normalizedUsername);
                        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
            });

            log.info("Usuario encontrado para login username={}", normalizedUsername);

            if (!isValidPassword(receivedPassword, usuario)) {
                log.warn("Login rechazado: contraseña incorrecta username={}", normalizedUsername);
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
            }

            migratePlainTextPasswordIfNeeded(receivedPassword, usuario);

            log.info("Login correcto username={}", normalizedUsername);
            String role = normalizeRole(usuario.getRole());
            String token = jwtUtil.generarToken(normalizedUsername, role);
            return new AuthResponse(token, normalizedUsername, role);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Error inesperado autenticando username={}", normalizedUsername, ex);
            throw ex;
        }
    }

    private boolean isValidPassword(String receivedPassword, Usuario usuario) {
        String storedPassword = usuario.getPassword() == null ? "" : usuario.getPassword();
        if (isBCryptHash(storedPassword)) {
            return passwordEncoder.matches(receivedPassword, storedPassword);
        }
        return storedPassword.equals(receivedPassword);
    }

    private void migratePlainTextPasswordIfNeeded(String receivedPassword, Usuario usuario) {
        String storedPassword = usuario.getPassword() == null ? "" : usuario.getPassword();
        if (!isBCryptHash(storedPassword)) {
            usuario.setPassword(passwordEncoder.encode(receivedPassword));
            usuario.setRole(normalizeRole(usuario.getRole()));
            usuarioRepository.save(usuario);
            log.info("Password legado migrado a BCrypt para username={}", usuario.getUsername());
        }
    }

    private boolean isBCryptHash(String value) {
        return value.startsWith("$2a$") || value.startsWith("$2b$") || value.startsWith("$2y$");
    }

    private String normalizeRole(String role) {
        return role == null || role.isBlank() ? "VENTAS" : role.trim().toUpperCase();
    }
}
