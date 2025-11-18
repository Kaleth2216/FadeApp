package com.fadeapp.repository;

import com.fadeapp.model.Barbershop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BarbershopRepository extends JpaRepository<Barbershop, Long> {

    // 🔹 Buscar barbería por correo (autenticación y validación)
    Optional<Barbershop> findByEmail(String email);

    // 🔹 Verificar si un correo ya está registrado
    boolean existsByEmail(String email);

    // 🔹 Buscar barberías por ciudad (para mostrar en el mapa o lista)
    List<Barbershop> findByCity(String city);

    // 🔹 Buscar barberías activas
    List<Barbershop> findByStatusTrue();

    // 🔹 Buscar barberías activas por ciudad
    List<Barbershop> findByCityAndStatusTrue(String city);

    // 🔹 Buscar barberías por nombre (búsqueda parcial, opcional)
    List<Barbershop> findByNameContainingIgnoreCase(String name);

    List<Barbershop> findByCityContainingIgnoreCase(String city);
}
