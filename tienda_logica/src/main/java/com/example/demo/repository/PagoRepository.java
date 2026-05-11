package com.example.demo.repository;

import com.example.demo.entity.Pago;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PagoRepository extends JpaRepository<Pago, Long> {

    Optional<Pago> findByVentaId(Long ventaId); // útil porque es 1 a 1
}