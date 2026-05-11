package com.example.demo.Service;
import com.example.demo.DTO.CompraDTO;
import com.example.demo.entity.Compra;
import com.example.demo.entity.Proveedor;
import com.example.demo.repository.CompraRepository;
import com.example.demo.repository.ProveedorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CompraService {

    private final CompraRepository repository;
    private final ProveedorRepository proveedorRepository;

    public CompraService(CompraRepository repository, ProveedorRepository proveedorRepository) {
        this.repository = repository;
        this.proveedorRepository = proveedorRepository;
    }

    // LISTAR
    public List<CompraDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GUARDAR
    public CompraDTO guardar(CompraDTO dto) {
        Compra compra = toEntity(dto);
        return toDTO(repository.save(compra));
    }

    // BUSCAR
    public CompraDTO buscar(Long id) {
        Compra compra = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Compra no encontrada"));
        return toDTO(compra);
    }

    // ELIMINAR
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔁 CONVERSIÓN ENTITY → DTO
    private CompraDTO toDTO(Compra c) {
        return new CompraDTO(
                c.getId(),
                c.getFecha(),
                c.getTotal(),
                c.getProveedor() != null ? c.getProveedor().getId() : null
        );
    }

    // 🔁 CONVERSIÓN DTO → ENTITY
    private Compra toEntity(CompraDTO dto) {
        Compra c = new Compra();
        c.setId(dto.getId());
        c.setFecha(dto.getFecha());
        c.setTotal(dto.getTotal());

        if (dto.getProveedorId() != null) {
            Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
            c.setProveedor(proveedor);
        }

        return c;
    }
}

