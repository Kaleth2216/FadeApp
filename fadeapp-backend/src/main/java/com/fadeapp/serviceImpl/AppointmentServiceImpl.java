package com.fadeapp.serviceImpl;

import com.fadeapp.model.Appointment;
import com.fadeapp.model.Barber;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Client;
import com.fadeapp.model.EntityService;
import com.fadeapp.repository.AppointmentRepository;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.repository.BarbershopRepository;
import com.fadeapp.repository.ClientRepository;
import com.fadeapp.repository.ServiceRepository;
import com.fadeapp.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final ClientRepository clientRepository;
    private final BarberRepository barberRepository;
    private final BarbershopRepository barbershopRepository;
    private final ServiceRepository serviceRepository;

    // ✅ Crear una nueva cita con logs detallados
    @Override
    public Appointment createAppointment(Appointment appointment) {

        System.out.println("========== 🧾 [LOG - CREAR CITA] ==========");
        System.out.println("📅 Fecha recibida: " + appointment.getDate());
        System.out.println("👤 Cliente recibido: " + appointment.getClient());
        System.out.println("💈 Barbero recibido: " + appointment.getBarber());
        System.out.println("🏪 Barbería recibida: " + appointment.getBarbershop());
        System.out.println("💇 Servicio recibido: " + appointment.getService());
        System.out.println("==========================================");

        // 🔹 Validar si el cliente llegó nulo
        if (appointment.getClient() == null) {
            throw new RuntimeException("El cliente no fue enviado en la solicitud (client es null)");
        }

        Long clientId = appointment.getClient().getId();
        Long barberId = (appointment.getBarber() != null) ? appointment.getBarber().getId() : null;
        Long barbershopId = (appointment.getBarbershop() != null) ? appointment.getBarbershop().getId() : null;
        Long serviceId = (appointment.getService() != null) ? appointment.getService().getId() : null;

        System.out.println("📍 IDs detectados -> Cliente: " + clientId + " | Barbero: " + barberId + " | Barbería: " + barbershopId + " | Servicio: " + serviceId);

        // 🔹 Validar existencia de datos obligatorios
        if (clientId == null || barberId == null || barbershopId == null || serviceId == null) {
            throw new RuntimeException("Verifica los IDs enviados — uno o más son nulos");
        }

        // 🔹 Validar existencia de entidades relacionadas
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));
        EntityService service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        // 🔹 Validar si el barbero ya tiene una cita en ese horario
        boolean conflict = appointmentRepository.existsByBarberIdAndDate(barberId, appointment.getDate());
        if (conflict) {
            throw new RuntimeException("El barbero ya tiene una cita en ese horario");
        }

        // 🔹 Validar horario dentro del rango de apertura/cierre
        if (barbershop.getOpeningTime() != null && barbershop.getClosingTime() != null) {
            LocalTime appointmentTime = appointment.getDate().toLocalTime();

            if (appointmentTime.isBefore(barbershop.getOpeningTime()) ||
                    appointmentTime.isAfter(barbershop.getClosingTime())) {
                throw new RuntimeException("El horario está fuera del horario de atención de la barbería");
            }
        }

        // 🔹 Asignar entidades y estado inicial
        appointment.setClient(client);
        appointment.setBarber(barber);
        appointment.setBarbershop(barbershop);
        appointment.setService(service);
        appointment.setStatus("PENDING");

        System.out.println("✅ Datos validados correctamente. Guardando cita en base de datos...");

        Appointment saved = appointmentRepository.save(appointment);
        System.out.println("💾 Cita guardada con ID: " + saved.getId());
        System.out.println("==========================================\n");

        return saved;
    }

    // Obtener una cita por su ID
    @Override
    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    // Obtener todas las citas de un cliente
    @Override
    public List<Appointment> getAppointmentsByClient(Long clientId) {
        return appointmentRepository.findByClientId(clientId);
    }

    // Obtener todas las citas de un barbero
    @Override
    public List<Appointment> getAppointmentsByBarber(Long barberId) {
        return appointmentRepository.findByBarberId(barberId);
    }

    // Obtener todas las citas de una barbería
    @Override
    public List<Appointment> getAppointmentsByBarbershop(Long barbershopId) {
        return appointmentRepository.findByBarbershopId(barbershopId);
    }

    // Actualizar el estado de una cita
    @Override
    public Appointment updateStatus(Long appointmentId, String status) {
        Appointment existing = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        existing.setStatus(status.toUpperCase());
        return appointmentRepository.save(existing);
    }

    // Eliminar o cancelar una cita
    @Override
    public void deleteAppointment(Long appointmentId) {
        Appointment existing = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Cita no encontrada"));

        if ("COMPLETED".equals(existing.getStatus())) {
            throw new RuntimeException("No se puede eliminar una cita completada");
        }

        appointmentRepository.delete(existing);
    }
}
