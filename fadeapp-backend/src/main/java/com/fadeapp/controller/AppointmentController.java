package com.fadeapp.controller;

import com.fadeapp.model.Appointment;
import com.fadeapp.model.Client;
import com.fadeapp.repository.ClientRepository;
import com.fadeapp.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final ClientRepository clientRepository;

    public AppointmentController(AppointmentService appointmentService, ClientRepository clientRepository) {
        this.appointmentService = appointmentService;
        this.clientRepository = clientRepository;
    }

    // ✅ Crear nueva cita — detecta automáticamente el cliente autenticado
    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody Appointment appointment) {
        System.out.println("\n======================== 💈 [NUEVA SOLICITUD DE CITA] ========================");

        try {
            // Obtener correo del usuario autenticado
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = (auth != null) ? auth.getName() : null;
            System.out.println("🔐 Usuario autenticado: " + email);

            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(401).body("No se pudo obtener el cliente autenticado.");
            }

            // Buscar cliente por email
            Client client = clientRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado para el usuario autenticado"));

            // Asignar cliente automáticamente a la cita
            appointment.setClient(client);

            System.out.println("📦 Cita recibida y completada con cliente:");
            System.out.println("🕒 Fecha: " + appointment.getDate());
            System.out.println("👤 Cliente ID: " + client.getId());
            System.out.println("💈 Barbero ID: " + (appointment.getBarber() != null ? appointment.getBarber().getId() : "❌ NULL"));
            System.out.println("🏪 Barbería ID: " + (appointment.getBarbershop() != null ? appointment.getBarbershop().getId() : "❌ NULL"));
            System.out.println("💇 Servicio ID: " + (appointment.getService() != null ? appointment.getService().getId() : "❌ NULL"));

            Appointment created = appointmentService.createAppointment(appointment);
            System.out.println("✅ Cita creada correctamente con ID: " + created.getId());
            System.out.println("==========================================================================\n");

            return ResponseEntity.ok(created);

        } catch (RuntimeException e) {
            System.err.println("❌ ERROR al crear la cita:");
            e.printStackTrace();
            System.out.println("==========================================================================\n");
            return ResponseEntity.badRequest().body("Error al crear la cita: " + e.getMessage());
        }
    }

    // ✅ Obtener una cita por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getAppointmentById(@PathVariable Long id) {
        System.out.println("🔍 Buscando cita por ID: " + id);
        return appointmentService.getAppointmentById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ✅ Obtener todas las citas del cliente autenticado
    @GetMapping("/me")
    public ResponseEntity<?> getMyAppointments() {
        System.out.println("\n======================== 📅 [MIS CITAS - CLIENTE AUTENTICADO] ========================");

        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            String email = (auth != null) ? auth.getName() : null;
            System.out.println("🔐 Usuario autenticado: " + email);

            if (email == null || email.isEmpty()) {
                return ResponseEntity.status(401).body("No se pudo obtener el cliente autenticado.");
            }

            Client client = clientRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

            List<Appointment> appointments = appointmentService.getAppointmentsByClient(client.getId());

            System.out.println("✅ " + appointments.size() + " citas encontradas para el cliente ID " + client.getId());
            System.out.println("==========================================================================\n");

            return ResponseEntity.ok(appointments);

        } catch (RuntimeException e) {
            System.err.println("❌ ERROR al obtener citas del cliente:");
            e.printStackTrace();
            System.out.println("==========================================================================\n");
            return ResponseEntity.badRequest().body("Error al obtener citas: " + e.getMessage());
        }
    }

    // ✅ Obtener todas las citas de un cliente por ID (versión tradicional)
    @GetMapping("/client/{clientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByClient(@PathVariable Long clientId) {
        System.out.println("📅 Consultando citas del cliente ID: " + clientId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByClient(clientId));
    }

    // ✅ Obtener todas las citas de un barbero
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByBarber(@PathVariable Long barberId) {
        System.out.println("📅 Consultando citas del barbero ID: " + barberId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByBarber(barberId));
    }

    // ✅ Obtener todas las citas de una barbería
    @GetMapping("/barbershop/{barbershopId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByBarbershop(@PathVariable Long barbershopId) {
        System.out.println("📅 Consultando citas de la barbería ID: " + barbershopId);
        return ResponseEntity.ok(appointmentService.getAppointmentsByBarbershop(barbershopId));
    }

    // ✅ Actualizar estado de una cita
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestParam String status) {
        System.out.println("🛠 Actualizando estado de cita ID: " + id + " → " + status);
        try {
            Appointment updated = appointmentService.updateStatus(id, status);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error al actualizar el estado: " + e.getMessage());
        }
    }

    // ✅ Eliminar o cancelar una cita
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAppointment(@PathVariable Long id) {
        System.out.println("🗑 Eliminando cita ID: " + id);
        try {
            appointmentService.deleteAppointment(id);
            return ResponseEntity.ok("Cita eliminada correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error al eliminar la cita: " + e.getMessage());
        }
    }
}
