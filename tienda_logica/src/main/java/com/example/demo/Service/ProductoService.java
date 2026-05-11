package com.example.demo.Service;

import com.example.demo.DTO.ProductoDTO;
import com.example.demo.entity.Producto;
import com.example.demo.entity.Proveedor;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.ProveedorRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoService {

    private final ProductoRepository repository;
    private final ProveedorRepository proveedorRepository;

    public ProductoService(ProductoRepository repository, ProveedorRepository proveedorRepository) {
        this.repository = repository;
        this.proveedorRepository = proveedorRepository;
    }

    public List<ProductoDTO> listar() {
        return repository.findAll().stream().map(this::toDTO).toList();
    }

    public ProductoDTO guardar(ProductoDTO dto) {
        Producto producto = toEntity(dto);
        Producto guardado = repository.save(producto);
        return toDTO(guardado);
    }

    public ProductoDTO buscar(Long id) {
        Producto producto = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        return toDTO(producto);
    }

    public void eliminar(Long id) {
        repository.deleteById(id);
    }


    private ProductoDTO toDTO(Producto p) {
        ProductoDTO dto = new ProductoDTO();
        dto.setId(p.getId());
        dto.setNombre(p.getNombre());
        dto.setPrecio(p.getPrecio());
        dto.setStock(p.getStock());

        if (p.getProveedor() != null) {
            dto.setProveedorId(p.getProveedor().getId());
        }

        return dto;
    }


    private Producto toEntity(ProductoDTO dto) {
        Producto p = new Producto();
        p.setId(dto.getId());
        p.setNombre(dto.getNombre());
        p.setPrecio(dto.getPrecio());
        p.setStock(dto.getStock());

        if (dto.getProveedorId() != null) {
            Proveedor proveedor = proveedorRepository.findById(dto.getProveedorId())
                    .orElseThrow(() -> new RuntimeException("Proveedor no encontrado"));
            p.setProveedor(proveedor);
        }

        return p;
    }
}
