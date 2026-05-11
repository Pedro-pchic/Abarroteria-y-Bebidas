package com.example.demo.Controller;

import com.example.demo.DTO.ClienteDTO;

import com.example.demo.Service.ClienteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/clientes")
public class ClienteController {

    private final ClienteService service;

    public ClienteController(ClienteService service) {
        this.service = service;
    }

    @GetMapping
    public List<ClienteDTO> listar() {
        return service.listar();
    }

    @PostMapping
    public ClienteDTO guardar(@RequestBody ClienteDTO clienteDTO) {
        return service.guardar(clienteDTO);
    }
    @PutMapping("/{id}")
    public ClienteDTO actualizar(@PathVariable Long id, @RequestBody ClienteDTO clienteDTO) {
        return service.guardar(clienteDTO);
    }

    @GetMapping("/{id}")
    public ClienteDTO obtener(@PathVariable Long id) {
        return service.buscar(id);
    }

    @DeleteMapping("/{id}")
    public void eliminar(@PathVariable Long id) {
        service.eliminar(id);
    }
}

