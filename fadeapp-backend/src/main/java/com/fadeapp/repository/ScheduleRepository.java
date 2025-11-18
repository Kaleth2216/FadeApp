package com.fadeapp.repository;

import com.fadeapp.model.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long> {

    // 🔹 Obtener todos los horarios de un barbero
    List<Schedule> findByBarberId(Long barberId);

    // 🔹 Obtener horarios de un barbero en un día específico
    List<Schedule> findByBarberIdAndDay(Long barberId, String day);

    // 🔹 Obtener horarios disponibles de un barbero
    List<Schedule> findByBarberIdAndAvailableTrue(Long barberId);

    // 🔹 Obtener horarios no disponibles de un barbero
    List<Schedule> findByBarberIdAndAvailableFalse(Long barberId);
}
