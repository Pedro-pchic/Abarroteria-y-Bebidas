package com.example.demo.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetalleVentaDTO {

    private Long productoId;
    private Integer cantidad;
    private Double precio;
}
