package com.example.demo.Controller;

import com.example.demo.DTO.PagoDTO;
import com.example.demo.Service.PagoService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    private final PagoService service;

    public PagoController(PagoService service) {
        this.service = service;
    }

    @GetMapping
    public List<PagoDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public PagoDTO guardar(@RequestBody PagoDTO dto) {
        return service.guardar(dto);
    }

    @GetMapping("/{id}")
    public PagoDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}
