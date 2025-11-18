package com.fadeapp.serviceImpl;

import com.fadeapp.model.Barber;
import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.repository.ScheduleRepository;
import com.fadeapp.repository.AppointmentRepository;
import com.fadeapp.service.BarberService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class BarberServiceImpl implements BarberService {

    private final BarberRepository barberRepository;
    private final ScheduleRepository scheduleRepository;
    private final AppointmentRepository appointmentRepository;

    // 🔹 Registrar un nuevo barbero
    @Override
    public Barber register(Barber barber) {
        if (barberRepository.existsByEmail(barber.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        barber.setStatus(true); // se corrige: el campo en el modelo es 'status', no 'active'
        return barberRepository.save(barber);
    }

    // 🔹 Buscar barbero por correo electrónico
    @Override
    public Optional<Barber> findByEmail(String email) {
        return barberRepository.findByEmail(email);
    }

    // 🔹 Actualizar información personal del barbero
    @Override
    public Barber updateBarber(Long barberId, Barber barberDetails) {
        Barber existing = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        existing.setName(barberDetails.getName());
        existing.setSpecialty(barberDetails.getSpecialty());
        existing.setImageUrl(barberDetails.getImageUrl());

        return barberRepository.save(existing);
    }

    // 🔹 Bloquear una hora específica (marcar como no disponible)
    @Override
    public Schedule blockSchedule(Long barberId, Long scheduleId) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        if (!schedule.getBarber().getId().equals(barber.getId())) {
            throw new RuntimeException("El horario no pertenece a este barbero");
        }

        schedule.setAvailable(false);
        return scheduleRepository.save(schedule);
    }

    // 🔹 Desbloquear una hora específica (volver a disponible)
    @Override
    public Schedule unblockSchedule(Long barberId, Long scheduleId) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Horario no encontrado"));

        if (!schedule.getBarber().getId().equals(barber.getId())) {
            throw new RuntimeException("El horario no pertenece a este barbero");
        }

        schedule.setAvailable(true);
        return scheduleRepository.save(schedule);
    }

    // 🔹 Bloquear un día completo (todas las horas del día)
    @Override
    public void blockDay(Long barberId, String day) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        List<Schedule> schedules = scheduleRepository.findByBarberIdAndDay(barberId, day);
        if (schedules.isEmpty()) {
            throw new RuntimeException("No se encontraron horarios para ese día");
        }

        schedules.forEach(s -> s.setAvailable(false));
        scheduleRepository.saveAll(schedules);
    }

    // 🔹 Obtener los horarios actuales del barbero
    @Override
    public List<Schedule> getSchedules(Long barberId) {
        return scheduleRepository.findByBarberId(barberId);
    }

    // 🔹 Obtener las citas asignadas al barbero
    @Override
    public List<Appointment> getAppointments(Long barberId) {
        return appointmentRepository.findByBarberId(barberId);
    }
}
