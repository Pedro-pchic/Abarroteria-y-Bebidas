package com.example.demo.Controller;

import com.example.demo.DTO.ProveedorDTO;
import com.example.demo.Service.ProveedorService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
public class ProveedorController {

    private final ProveedorService service;

    public ProveedorController(ProveedorService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProveedorDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public ProveedorDTO guardar(@RequestBody ProveedorDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public ProveedorDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

