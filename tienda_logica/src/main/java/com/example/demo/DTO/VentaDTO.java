package com.example.demo.DTO;

import lombok.*;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VentaDTO {

    private Long id;
    private Date fecha;
    private Double total;

    private Long clienteId;
    private Long usuarioId;

    private List<DetalleVentaDTO> detalles;
}

