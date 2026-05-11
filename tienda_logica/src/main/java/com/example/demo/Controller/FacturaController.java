package com.example.demo.Controller;
import com.example.demo.DTO.FacturaDTO;
import com.example.demo.Service.FacturaService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/facturas")
public class FacturaController {

    private final FacturaService service;

    public FacturaController(FacturaService service) {
        this.service = service;
    }

    @GetMapping
    public List<FacturaDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public FacturaDTO guardar(@RequestBody FacturaDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public FacturaDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

