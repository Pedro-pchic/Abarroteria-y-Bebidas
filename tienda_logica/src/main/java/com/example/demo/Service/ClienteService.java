package com.example.demo.Service;

import com.example.demo.DTO.ClienteDTO;
import com.example.demo.entity.Cliente;
import com.example.demo.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClienteService {

    private final ClienteRepository repository;

    public ClienteService(ClienteRepository repository) {
        this.repository = repository;
    }

    public List<ClienteDTO> listar() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public ClienteDTO guardar(ClienteDTO dto) {
        Cliente cliente = toEntity(dto);
        Cliente guardado = repository.save(cliente);
        return toDTO(guardado);
    }

    public ClienteDTO buscar(Long id) {
        Cliente cliente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        return toDTO(cliente);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔄 conversiones
    private ClienteDTO toDTO(Cliente c) {
        ClienteDTO dto = new ClienteDTO();
        dto.setId(c.getId());
        dto.setNombre(c.getNombre());
        dto.setDireccion(c.getDireccion());
        dto.setTelefono(c.getTelefono());
        return dto;
    }

    private Cliente toEntity(ClienteDTO dto) {
        Cliente c = new Cliente();
        c.setId(dto.getId());
        c.setNombre(dto.getNombre());
        c.setDireccion(dto.getDireccion());
        c.setTelefono(dto.getTelefono());
        return c;
    }
}
