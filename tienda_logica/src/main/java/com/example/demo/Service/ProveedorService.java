package com.example.demo.Service;

import com.example.demo.DTO.ProveedorDTO;
import com.example.demo.entity.Proveedor;
import com.example.demo.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProveedorService {

    private final ProveedorRepository repository;

    public ProveedorService(ProveedorRepository repository) {
        this.repository = repository;
    }

    // LISTAR
    public List<ProveedorDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GUARDAR
    public ProveedorDTO guardar(ProveedorDTO dto) {
        Proveedor proveedor = toEntity(dto);
        return toDTO(repository.save(proveedor));
    }

    // BUSCAR
    public ProveedorDTO buscar(Long id) {
        Proveedor proveedor = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
        return toDTO(proveedor);
    }

    // ELIMINAR
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔁 CONVERSIONES
    private ProveedorDTO toDTO(Proveedor p) {
        return new ProveedorDTO(
                p.getId(),
                p.getNombre(),
                p.getTelefono()
        );
    }

    private Proveedor toEntity(ProveedorDTO dto) {
        return new Proveedor(dto.getId(), dto.getNombre(), dto.getTelefono(), null // productos no se manejan aquí
        );
    }
}
