package com.fadeapp.service;

import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.model.EntityService;
import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import java.util.List;
import java.util.Optional;

/**
 * Servicio que maneja toda la lógica de negocio relacionada con las barberías:
 * registro, configuración, gestión de servicios, barberos y citas.
 */
public interface BarbershopService {

    // Registrar una nueva barbería
    Barbershop register(Barbershop barbershop);

    // Buscar barbería por correo
    Optional<Barbershop> findByEmail(String email);

    // Editar información de la barbería
    Barbershop updateBarbershop(Long id, Barbershop barbershop);

    // Establecer hora de apertura y cierre
    void setWorkingHours(Long barbershopId, String openingTime, String closingTime);

    // Agregar un nuevo servicio (EntityService)
    EntityService addService(Long barbershopId, EntityService service);

    // Editar un servicio existente
    EntityService updateService(Long serviceId, EntityService service);

    // Eliminar un servicio
    void deleteService(Long serviceId);

    // Agregar un barbero
    Barber addBarber(Long barbershopId, Barber barber);

    // Editar un barbero existente
    Barber updateBarber(Long barberId, Barber barber);

    // Activar o desactivar un barbero
    void toggleBarberStatus(Long barberId, boolean active);

    // Listar barberos activos de la barbería
    List<Barber> getActiveBarbers(Long barbershopId);

    // Mostrar horarios disponibles de los barberos
    List<Schedule> getAvailableSchedules(Long barbershopId);

    // Ver citas agendadas en la barbería
    List<Appointment> getAppointments(Long barbershopId);

    List<Barbershop> getAll();

    List<Barbershop> getByCity(String city);

    // Obtener una barbería por su ID
    Optional<Barbershop> getById(Long id);

    List<EntityService> getServicesByBarbershop(Long id);

    void deleteBarber(Long barberId);

}
