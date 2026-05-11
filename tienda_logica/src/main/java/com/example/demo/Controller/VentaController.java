package com.example.demo.Controller;

import com.example.demo.DTO.VentaDTO;
import com.example.demo.Service.VentaService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/ventas")
public class VentaController {

    private final VentaService service;

    public VentaController(VentaService service) {
        this.service = service;
    }

    @GetMapping
    public List<VentaDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public VentaDTO guardar(@RequestBody VentaDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public VentaDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
