package com.fadeapp.service;

import com.fadeapp.model.Appointment;
import java.util.List;
import java.util.Optional;

public interface AppointmentService {

    // Crear una nueva cita
    Appointment createAppointment(Appointment appointment);

    // Obtener una cita por su ID
    Optional<Appointment> getAppointmentById(Long id);

    // Obtener todas las citas de un cliente
    List<Appointment> getAppointmentsByClient(Long clientId);

    // Obtener todas las citas de un barbero
    List<Appointment> getAppointmentsByBarber(Long barberId);

    // Obtener todas las citas de una barbería
    List<Appointment> getAppointmentsByBarbershop(Long barbershopId);

    // Actualizar el estado de una cita (ej: cancelada, completada, confirmada)
    Appointment updateStatus(Long appointmentId, String status);

    // Eliminar o cancelar una cita
    void deleteAppointment(Long appointmentId);
}
