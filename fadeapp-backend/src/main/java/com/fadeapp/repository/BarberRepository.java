package com.fadeapp.repository;

import com.fadeapp.model.Barber;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BarberRepository extends JpaRepository<Barber, Long> {

    // Buscar barbero por correo electrónico
    Optional<Barber> findByEmail(String email);

    // Verificar si un correo ya está registrado
    boolean existsByEmail(String email);

    // Obtener todos los barberos de una barbería específica
    List<Barber> findByBarbershopId(Long barbershopId);
}