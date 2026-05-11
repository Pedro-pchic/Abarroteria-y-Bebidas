package com.example.demo.Service;

import com.example.demo.DTO.FacturaDTO;
import com.example.demo.entity.Factura;
import com.example.demo.entity.Venta;
import com.example.demo.repository.FacturaRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class FacturaService {

    private final FacturaRepository repository;
    private final VentaRepository ventaRepository;

    public FacturaService(FacturaRepository repository, VentaRepository ventaRepository) {
        this.repository = repository;
        this.ventaRepository = ventaRepository;
    }

    // LISTAR
    public List<FacturaDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GUARDAR
    public FacturaDTO guardar(FacturaDTO dto) {

        //  Validación importante (1 factura por venta)
        if (repository.findByVentaId(dto.getVentaId()).isPresent()) {
            throw new RuntimeException("Esta venta ya tiene factura");
        }

        Factura factura = toEntity(dto);
        return toDTO(repository.save(factura));
    }

    // BUSCAR
    public FacturaDTO buscar(Long id) {
        Factura factura = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Factura no encontrada"));
        return toDTO(factura);
    }

    // ELIMINAR
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔁 ENTITY → DTO
    private FacturaDTO toDTO(Factura f) {
        return new FacturaDTO(
                f.getId(),
                f.getNumero(),
                f.getFecha(),
                f.getVenta() != null ? f.getVenta().getId() : null
        );
    }

    // 🔁 DTO → ENTITY
    private Factura toEntity(FacturaDTO dto) {
        Factura f = new Factura();
        f.setId(dto.getId());
        f.setNumero(dto.getNumero());
        f.setFecha(dto.getFecha());

        if (dto.getVentaId() != null) {
            Venta venta = ventaRepository.findById(dto.getVentaId())
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
            f.setVenta(venta);
        }

        return f;
    }
}

