package com.fadeapp.service;

import com.fadeapp.model.Schedule;
import java.util.List;
import java.util.Optional;

public interface ScheduleService {

    // Crear un nuevo horario para un barbero
    Schedule createSchedule(Schedule schedule);

    // Obtener todos los horarios de un barbero
    List<Schedule> getSchedulesByBarber(Long barberId);

    // Obtener un horario por su ID
    Optional<Schedule> getScheduleById(Long id);

    // Actualizar la información de un horario (día, hora, disponibilidad)
    Schedule updateSchedule(Long id, Schedule scheduleDetails);

    // Cambiar disponibilidad de un horario (bloquear o desbloquear)
    Schedule toggleAvailability(Long id, boolean available);

    // Eliminar un horario si no tiene citas activas
    void deleteSchedule(Long id);
}
