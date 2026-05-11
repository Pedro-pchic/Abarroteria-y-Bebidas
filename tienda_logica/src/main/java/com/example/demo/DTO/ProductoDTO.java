package com.example.demo.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ProductoDTO {

    private Long id;
    private String nombre;
    private Double precio;
    private Integer stock;

    private Long proveedorId; // 🔥 SOLO el ID
}
