package com.example.demo.Service;

import com.example.demo.JWT.JWTutil;
import com.example.demo.entity.Usuario;
import com.example.demo.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UsuarioRepository usuarioRepository;
    private final JWTutil jwtUtil;

    public AuthService(UsuarioRepository usuarioRepository, JWTutil jwtUtil) {
        this.usuarioRepository = usuarioRepository;
        this.jwtUtil = jwtUtil;
    }

    public String login(String username, String password) {
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

            // Las contraseñas actuales están guardadas en texto plano en MariaDB.
            // Mantener comparación directa solo temporalmente para pruebas.
            if (!usuario.getPassword().equals(receivedPassword)) {
                log.warn("Login rechazado: contraseña incorrecta username={}", normalizedUsername);
                throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Usuario o contraseña incorrectos");
            }

            log.info("Login correcto username={}", normalizedUsername);
            return jwtUtil.generarToken(normalizedUsername);
        } catch (ResponseStatusException ex) {
            throw ex;
        } catch (Exception ex) {
            log.error("Error inesperado autenticando username={}", normalizedUsername, ex);
            throw ex;
        }
    }
}
