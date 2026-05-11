package com.example.demo.DTO;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FacturaDTO {

    private Long id;
    private String numero;
    private Date fecha;
    private Long ventaId;
}
