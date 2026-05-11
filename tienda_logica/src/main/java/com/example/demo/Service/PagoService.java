package com.example.demo.Service;

import com.example.demo.DTO.PagoDTO;
import com.example.demo.entity.Pago;
import com.example.demo.entity.Venta;
import com.example.demo.repository.PagoRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoService {

    private final PagoRepository repository;
    private final VentaRepository ventaRepository;

    public PagoService(PagoRepository repository, VentaRepository ventaRepository) {
        this.repository = repository;
        this.ventaRepository = ventaRepository;
    }

    // LISTAR
    public List<PagoDTO> listar() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // GUARDAR
    public PagoDTO guardar(PagoDTO dto) {
        Pago pago = toEntity(dto);
        return toDTO(repository.save(pago));
    }

    // BUSCAR
    public PagoDTO buscar(Long id) {
        Pago pago = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pago no encontrado"));
        return toDTO(pago);
    }

    // ELIMINAR
    public void eliminar(Long id) {
        repository.deleteById(id);
    }

    // 🔁 ENTITY → DTO
    private PagoDTO toDTO(Pago p) {
        return new PagoDTO(
                p.getId(),
                p.getMonto(),
                p.getMetodo(),
                p.getVenta() != null ? p.getVenta().getId() : null
        );
    }

    // 🔁 DTO → ENTITY
    private Pago toEntity(PagoDTO dto) {
        Pago p = new Pago();
        p.setId(dto.getId());
        p.setMonto(dto.getMonto());
        p.setMetodo(dto.getMetodo());

        if (dto.getVentaId() != null) {
            Venta venta = ventaRepository.findById(dto.getVentaId())
                    .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
            p.setVenta(venta);
        }

        return p;
    }
}
