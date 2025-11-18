package com.fadeapp.controller;

import com.fadeapp.model.Schedule;
import com.fadeapp.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/schedules")
@CrossOrigin(origins = "http://localhost:8100") // Conexión con Ionic
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // 🔹 Crear un nuevo horario
    @PostMapping
    public ResponseEntity<?> createSchedule(@RequestBody Schedule schedule) {
        try {
            Schedule created = scheduleService.createSchedule(schedule);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔹 Obtener todos los horarios de un barbero
    @GetMapping("/barber/{barberId}")
    public ResponseEntity<?> getSchedulesByBarber(@PathVariable Long barberId) {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesByBarber(barberId);
            return ResponseEntity.ok(schedules);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔹 Obtener un horario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getScheduleById(@PathVariable Long id) {
        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        return schedule.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔹 Actualizar información de un horario (día, hora, disponibilidad)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSchedule(@PathVariable Long id, @RequestBody Schedule scheduleDetails) {
        try {
            Schedule updated = scheduleService.updateSchedule(id, scheduleDetails);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔹 Cambiar disponibilidad (bloquear o desbloquear)
    @PatchMapping("/{id}/availability")
    public ResponseEntity<?> toggleAvailability(@PathVariable Long id, @RequestParam boolean available) {
        try {
            Schedule updated = scheduleService.toggleAvailability(id, available);
            String status = available ? "desbloqueado" : "bloqueado";
            return ResponseEntity.ok("Horario " + status + " correctamente: " + updated.getDay());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }

    // 🔹 Eliminar un horario si no tiene citas activas
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSchedule(@PathVariable Long id) {
        try {
            scheduleService.deleteSchedule(id);
            return ResponseEntity.ok("Horario eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}
