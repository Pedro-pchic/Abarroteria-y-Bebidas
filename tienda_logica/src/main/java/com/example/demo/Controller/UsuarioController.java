package com.example.demo.Controller;

import com.example.demo.DTO.UsuarioCreateDTO;
import com.example.demo.DTO.UsuarioDTO;
import com.example.demo.Service.UsuarioService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService service;

    public UsuarioController(UsuarioService service) {
        this.service = service;
    }

    @GetMapping
    public List<UsuarioDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public UsuarioDTO guardar(@RequestBody UsuarioCreateDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public UsuarioDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
