package com.fadeapp.serviceImpl;

import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import com.fadeapp.model.Barber;
import com.fadeapp.repository.ScheduleRepository;
import com.fadeapp.repository.AppointmentRepository;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ScheduleServiceImpl implements ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private BarberRepository barberRepository;

    /**
     * Crear un nuevo horario para un barbero.
     * Valida que no haya superposición con horarios existentes del mismo barbero.
     */
    @Override
    public Schedule createSchedule(Schedule schedule) {
        if (schedule.getBarber() == null || schedule.getBarber().getId() == null) {
            throw new RuntimeException("Debe especificarse un barbero válido para el horario");
        }

        Long barberId = schedule.getBarber().getId();
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        // Validar superposición de horarios
        List<Schedule> existingSchedules = scheduleRepository.findByBarberId(barberId);
        for (Schedule s : existingSchedules) {
            if (s.getDay().equalsIgnoreCase(schedule.getDay())) {
                boolean overlap = !(schedule.getEndTime().isBefore(s.getStartTime()) ||
                        schedule.getStartTime().isAfter(s.getEndTime()));
                if (overlap) {
                    throw new RuntimeException("El horario se superpone con otro existente");
                }
            }
        }

        schedule.setBarber(barber);
        schedule.setAvailable(true);
        return scheduleRepository.save(schedule);
    }

    /**
     * Obtener todos los horarios de un barbero.
     */
    @Override
    public List<Schedule> getSchedulesByBarber(Long barberId) {
        if (!barberRepository.existsById(barberId)) {
            throw new RuntimeException("Barbero no encontrado");
        }
        return scheduleRepository.findByBarberId(barberId);
    }

    /**
     * Obtener un horario por su ID.
     */
    @Override
    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    /**
     * Actualizar la información de un horario.
     */
    @Override
    public Schedule updateSchedule(Long id, Schedule scheduleDetails) {
        Schedule existing = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        existing.setDay(scheduleDetails.getDay());
        existing.setStartTime(scheduleDetails.getStartTime());
        existing.setEndTime(scheduleDetails.getEndTime());
        existing.setAvailable(scheduleDetails.isAvailable());

        return scheduleRepository.save(existing);
    }

    /**
     * Cambiar la disponibilidad (bloquear o desbloquear) de un horario.
     */
    @Override
    public Schedule toggleAvailability(Long id, boolean available) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        schedule.setAvailable(available);
        return scheduleRepository.save(schedule);
    }

    /**
     * Eliminar un horario solo si no tiene citas activas (PENDING o CONFIRMED).
     */
    @Override
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        List<Appointment> appointments = appointmentRepository.findByBarberId(schedule.getBarber().getId());
        boolean hasActiveAppointments = appointments.stream()
                .anyMatch(a -> {
                    String status = a.getStatus();
                    return status != null && (
                            status.equalsIgnoreCase("PENDING") ||
                                    status.equalsIgnoreCase("CONFIRMED")
                    );
                });

        if (hasActiveAppointments) {
            throw new RuntimeException("No se puede eliminar un horario con citas activas");
        }

        scheduleRepository.delete(schedule);
    }
}
