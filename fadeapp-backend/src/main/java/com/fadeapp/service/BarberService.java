package com.fadeapp.service;

import com.fadeapp.model.Barber;
import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import java.util.List;
import java.util.Optional;

public interface BarberService {

    // Registrar un nuevo barbero
    Barber register(Barber barber);

    // Buscar barbero por correo electrónico
    Optional<Barber> findByEmail(String email);

    // Actualizar información personal del barbero
    Barber updateBarber(Long barberId, Barber barber);

    // Bloquear una hora específica (marcar como no disponible)
    Schedule blockSchedule(Long barberId, Long scheduleId);

    // Desbloquear una hora específica (volver a disponible)
    Schedule unblockSchedule(Long barberId, Long scheduleId);

    // Bloquear un día completo (todas las horas de ese día)
    void blockDay(Long barberId, String day);

    // Obtener los horarios actuales del barbero
    List<Schedule> getSchedules(Long barberId);

    // Obtener las citas asignadas al barbero
    List<Appointment> getAppointments(Long barberId);
}