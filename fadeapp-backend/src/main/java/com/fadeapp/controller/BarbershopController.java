package com.fadeapp.controller;

import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.model.EntityService;
import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import com.fadeapp.service.BarbershopService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/barbershops")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class BarbershopController {

    private final BarbershopService barbershopService;

    // 🔹 Registrar una nueva barbería
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Barbershop barbershop) {
        try {
            Barbershop created = barbershopService.register(barbershop);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Actualizar información general
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBarbershop(@PathVariable Long id, @RequestBody Barbershop barbershop) {
        try {
            Barbershop updated = barbershopService.updateBarbershop(id, barbershop);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Establecer horarios de apertura/cierre
    @PutMapping("/{id}/hours")
    public ResponseEntity<?> setWorkingHours(
            @PathVariable Long id,
            @RequestParam String openingTime,
            @RequestParam String closingTime
    ) {
        try {
            barbershopService.setWorkingHours(id, openingTime, closingTime);
            return ResponseEntity.ok("Horarios actualizados correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Agregar nuevo servicio
    @PostMapping("/{id}/services")
    public ResponseEntity<?> addService(@PathVariable Long id, @RequestBody EntityService service) {
        try {
            EntityService created = barbershopService.addService(id, service);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Editar servicio existente
    @PutMapping("/services/{serviceId}")
    public ResponseEntity<?> updateService(@PathVariable Long serviceId, @RequestBody EntityService service) {
        try {
            EntityService updated = barbershopService.updateService(serviceId, service);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Eliminar servicio
    @DeleteMapping("/services/{serviceId}")
    public ResponseEntity<?> deleteService(@PathVariable Long serviceId) {
        try {
            barbershopService.deleteService(serviceId);
            return ResponseEntity.ok("Servicio eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Agregar nuevo barbero
    @PostMapping("/{id}/barbers")
    public ResponseEntity<?> addBarber(@PathVariable Long id, @RequestBody Barber barber) {
        try {
            Barber created = barbershopService.addBarber(id, barber);
            return ResponseEntity.ok(created);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Editar barbero existente
    @PutMapping("/barbers/{barberId}")
    public ResponseEntity<?> updateBarber(@PathVariable Long barberId, @RequestBody Barber barber) {
        try {
            Barber updated = barbershopService.updateBarber(barberId, barber);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Eliminar barbero
    @DeleteMapping("/barbers/{barberId}")
    public ResponseEntity<?> deleteBarber(@PathVariable Long barberId) {
        try {
            barbershopService.deleteBarber(barberId);
            return ResponseEntity.ok("Barbero eliminado correctamente");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Activar / desactivar barbero
    @PutMapping("/barbers/{barberId}/status")
    public ResponseEntity<?> toggleBarberStatus(@PathVariable Long barberId, @RequestParam boolean active) {
        try {
            barbershopService.toggleBarberStatus(barberId, active);
            return ResponseEntity.ok("Estado del barbero actualizado");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Obtener barberos activos
    @GetMapping("/{id}/barbers/active")
    public ResponseEntity<List<Barber>> getActiveBarbers(@PathVariable Long id) {
        return ResponseEntity.ok(barbershopService.getActiveBarbers(id));
    }

    // 🔹 Obtener horarios disponibles de todos los barberos
    @GetMapping("/{id}/schedules")
    public ResponseEntity<List<Schedule>> getAvailableSchedules(@PathVariable Long id) {
        return ResponseEntity.ok(barbershopService.getAvailableSchedules(id));
    }

    // 🔹 Obtener todas las citas de la barbería
    @GetMapping("/{id}/appointments")
    public ResponseEntity<List<Appointment>> getAppointments(@PathVariable Long id) {
        return ResponseEntity.ok(barbershopService.getAppointments(id));
    }

    // 🔹 Obtener todas las barberías o filtrar por ciudad
    @GetMapping
    public ResponseEntity<List<Barbershop>> getAllBarbershops(@RequestParam(required = false) String city) {
        List<Barbershop> list = (city != null && !city.isEmpty())
                ? barbershopService.getByCity(city)
                : barbershopService.getAll();
        return ResponseEntity.ok(list);
    }

    // 🔹 Obtener una barbería por su ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getBarbershopById(@PathVariable Long id) {
        try {
            return barbershopService.getById(id)
                    .map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 🔹 Obtener todos los servicios de una barbería
    @GetMapping("/{id}/services/all")
    public ResponseEntity<List<EntityService>> getServicesByBarbershop(@PathVariable Long id) {
        try {
            List<EntityService> services = barbershopService.getServicesByBarbershop(id);
            return ResponseEntity.ok(services);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
