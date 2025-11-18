package com.fadeapp.repository;

import com.fadeapp.model.Client;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClientRepository extends JpaRepository<Client, Long> {

    // 🔹 Buscar cliente por correo electrónico (para login o validaciones)
    Optional<Client> findByEmail(String email);

    // 🔹 Verificar si un correo ya está registrado
    boolean existsByEmail(String email);

    // 🔹 Buscar clientes por ciudad (puede haber varios)
    List<Client> findByCity(String city);

    // 🔹 Buscar clientes activos
    List<Client> findByStatusTrue();

    // 🔹 Buscar clientes activos en una ciudad específica
    List<Client> findByCityAndStatusTrue(String city);
}
