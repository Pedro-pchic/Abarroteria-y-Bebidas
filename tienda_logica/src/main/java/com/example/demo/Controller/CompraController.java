package com.example.demo.Controller;

import com.example.demo.DTO.CompraDTO;
import com.example.demo.Service.CompraService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/compras")
public class CompraController {

    private final CompraService service;

    public CompraController(CompraService service) {
        this.service = service;
    }

    @GetMapping
    public List<CompraDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public CompraDTO guardar(@RequestBody CompraDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public CompraDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
