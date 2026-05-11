package com.example.demo.Service;

import com.example.demo.DTO.DetalleVentaDTO;
import com.example.demo.DTO.VentaDTO;
import com.example.demo.entity.DetalleVenta;
import com.example.demo.entity.Venta;
import com.example.demo.repository.ClienteRepository;
import com.example.demo.repository.ProductoRepository;
import com.example.demo.repository.UsuarioRepository;
import com.example.demo.repository.VentaRepository;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class VentaService {

    private final VentaRepository ventaRepository;
    private final ClienteRepository clienteRepository;
    private final UsuarioRepository usuarioRepository;
    private final ProductoRepository productoRepository;

    public VentaService(VentaRepository ventaRepository,
                        ClienteRepository clienteRepository,
                        UsuarioRepository usuarioRepository,
                        ProductoRepository productoRepository) {
        this.ventaRepository = ventaRepository;
        this.clienteRepository = clienteRepository;
        this.usuarioRepository = usuarioRepository;
        this.productoRepository = productoRepository;
    }

    public List<VentaDTO> listar() {
        return ventaRepository.findAll().stream().map(this::toDTO).toList();
    }

    public VentaDTO guardar(VentaDTO dto) {
        Venta venta = toEntity(dto);
        return toDTO(ventaRepository.save(venta));
    }


    public VentaDTO buscar(Long id) {
        Venta venta = ventaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venta no encontrada"));
        return toDTO(venta);
    }

    public void eliminar(Long id) {
        ventaRepository.deleteById(id);
    }

    // 🔄 ENTITY → DTO
    private VentaDTO toDTO(Venta v) {
        VentaDTO dto = new VentaDTO();
        dto.setId(v.getId());
        dto.setFecha(v.getFecha());
        dto.setTotal(v.getTotal());

        if (v.getCliente() != null)
            dto.setClienteId(v.getCliente().getId());

        if (v.getUsuario() != null)
            dto.setUsuarioId(v.getUsuario().getId());

        if (v.getDetalles() != null) {
            dto.setDetalles(
                    v.getDetalles().stream().map(d -> new DetalleVentaDTO(
                            d.getProducto().getId(),
                            d.getCantidad(),
                            d.getPrecio()
                    )).toList()
            );
        }

        return dto;
    }

    private Venta toEntity(VentaDTO dto) {
        Venta v = new Venta();

        v.setFecha(new Date()); // 🔥 automática

        if (dto.getClienteId() != null) {
            v.setCliente(clienteRepository.findById(dto.getClienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado")));
        }

        if (dto.getUsuarioId() != null) {
            v.setUsuario(usuarioRepository.findById(dto.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado")));
        }

        if (dto.getDetalles() == null || dto.getDetalles().isEmpty()) {
            throw new RuntimeException("La venta debe tener al menos un detalle");
        }

        List<DetalleVenta> detalles = dto.getDetalles().stream().map(d -> {
            DetalleVenta det = new DetalleVenta();
            det.setCantidad(d.getCantidad());
            det.setPrecio(d.getPrecio());
            det.setVenta(v);

            det.setProducto(productoRepository.findById(d.getProductoId())
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado")));

            return det;
        }).toList();

        v.setDetalles(detalles);

        // 🔥 calcular total
        double total = detalles.stream()
                .mapToDouble(d -> d.getCantidad() * d.getPrecio())
                .sum();

        v.setTotal(total);

        return v;
    }

}
