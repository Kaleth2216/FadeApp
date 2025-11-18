package com.fadeapp.controller;

import com.fadeapp.model.Barber;
import com.fadeapp.model.Appointment;
import com.fadeapp.model.Schedule;
import com.fadeapp.service.BarberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/barbers")
@CrossOrigin(origins = "http://localhost:8100")
@RequiredArgsConstructor
public class BarberController {

    private final BarberService barberService;

    // 🔹 Registrar un nuevo barbero
    @PostMapping("/register")
    public ResponseEntity<?> registerBarber(@RequestBody Barber barber) {
        try {
            Barber created = barberService.register(barber);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Buscar barbero por correo electrónico
    @GetMapping("/email/{email}")
    public ResponseEntity<?> findByEmail(@PathVariable String email) {
        Optional<Barber> barber = barberService.findByEmail(email);
        return barber.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Actualizar información personal del barbero
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBarber(@PathVariable Long id, @RequestBody Barber barber) {
        try {
            Barber updated = barberService.updateBarber(id, barber);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Obtener horarios actuales del barbero
    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<Schedule>> getSchedules(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getSchedules(id));
    }

    // 🔹 Bloquear una hora específica
    @PutMapping("/{barberId}/block/{scheduleId}")
    public ResponseEntity<?> blockSchedule(@PathVariable Long barberId, @PathVariable Long scheduleId) {
        try {
            Schedule blocked = barberService.blockSchedule(barberId, scheduleId);
            return ResponseEntity.ok(blocked);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Desbloquear una hora específica
    @PutMapping("/{barberId}/unblock/{scheduleId}")
    public ResponseEntity<?> unblockSchedule(@PathVariable Long barberId, @PathVariable Long scheduleId) {
        try {
            Schedule unblocked = barberService.unblockSchedule(barberId, scheduleId);
            return ResponseEntity.ok(unblocked);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Bloquear un día completo
    @PutMapping("/{barberId}/block-day")
    public ResponseEntity<?> blockDay(@PathVariable Long barberId, @RequestParam String day) {
        try {
            barberService.blockDay(barberId, day);
            return ResponseEntity.ok("Día bloqueado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Obtener las citas del barbero
    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(barberService.getAppointments(id));
    }
}
