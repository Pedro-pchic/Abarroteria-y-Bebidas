package com.example.demo.Controller;

import com.example.demo.DTO.ProductoDTO;
import com.example.demo.Service.ProductoService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    private final ProductoService service;

    public ProductoController(ProductoService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProductoDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public ProductoDTO guardar(@RequestBody ProductoDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public ProductoDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

