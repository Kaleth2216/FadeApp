package com.fadeapp.repository;

import com.fadeapp.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    // Verifica si un barbero ya tiene una cita en la misma fecha y hora
    boolean existsByBarberIdAndDate(Long barberId, LocalDateTime date);

    // Obtiene todas las citas de un cliente
    List<Appointment> findByClientId(Long clientId);

    // Obtiene todas las citas de un barbero
    List<Appointment> findByBarberId(Long barberId);

    // Obtiene todas las citas de una barbería
    List<Appointment> findByBarbershopId(Long barbershopId);
}
