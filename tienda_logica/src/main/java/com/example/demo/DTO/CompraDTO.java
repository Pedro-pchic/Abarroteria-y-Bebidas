package com.example.demo.DTO;

import lombok.*;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompraDTO {

    private Long id;
    private Date fecha;
    private Double total;
    private Long proveedorId;
}
