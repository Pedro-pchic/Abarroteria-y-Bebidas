package com.example.demo.DTO;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PagoDTO {

    private Long id;
    private Double monto;
    private String metodo;
    private Long ventaId;
}
