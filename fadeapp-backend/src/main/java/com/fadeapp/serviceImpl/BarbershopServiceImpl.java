package com.fadeapp.serviceImpl;

import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.model.EntityService;
import com.fadeapp.model.Schedule;
import com.fadeapp.model.Appointment;
import com.fadeapp.repository.BarbershopRepository;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.repository.ServiceRepository;
import com.fadeapp.repository.AppointmentRepository;
import com.fadeapp.service.BarbershopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class BarbershopServiceImpl implements BarbershopService {

    @Autowired
    private BarbershopRepository barbershopRepository;

    @Autowired
    private BarberRepository barberRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    // Registrar una nueva barbería
    @Override
    public Barbershop register(Barbershop barbershop) {
        if (barbershopRepository.existsByEmail(barbershop.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        barbershop.setStatus(true);
        barbershop.setRole("BARBERSHOP");
        return barbershopRepository.save(barbershop);
    }

    // Buscar barbería por correo electrónico
    @Override
    public Optional<Barbershop> findByEmail(String email) {
        return barbershopRepository.findByEmail(email);
    }

    // Actualizar información general de la barbería
    @Override
    public Barbershop updateBarbershop(Long id, Barbershop barbershopDetails) {
        Barbershop existing = barbershopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));

        existing.setName(barbershopDetails.getName());
        existing.setCity(barbershopDetails.getCity());
        existing.setAddress(barbershopDetails.getAddress());
        existing.setImageUrl(barbershopDetails.getImageUrl());

        return barbershopRepository.save(existing);
    }

    // Establecer hora de apertura y cierre
    @Override
    public void setWorkingHours(Long barbershopId, String openingTime, String closingTime) {
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));

        LocalTime open = LocalTime.parse(openingTime);
        LocalTime close = LocalTime.parse(closingTime);

        barbershop.setOpeningTime(open);
        barbershop.setClosingTime(close);
        barbershopRepository.save(barbershop);
    }

    // Agregar un nuevo servicio
    @Override
    public EntityService addService(Long barbershopId, EntityService service) {
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));

        service.setBarbershop(barbershop);
        return serviceRepository.save(service);
    }

    // Editar un servicio existente
    @Override
    public EntityService updateService(Long serviceId, EntityService serviceDetails) {
        EntityService existing = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new RuntimeException("Servicio no encontrado"));

        existing.setName(serviceDetails.getName());
        existing.setPrice(serviceDetails.getPrice());
        existing.setDuration(serviceDetails.getDuration());

        return serviceRepository.save(existing);
    }

    // Eliminar un servicio
    @Override
    public void deleteService(Long serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            throw new RuntimeException("Servicio no encontrado");
        }
        serviceRepository.deleteById(serviceId);
    }

    // Agregar un nuevo barbero
    @Override
    public Barber addBarber(Long barbershopId, Barber barber) {
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));

        barber.setBarbershop(barbershop);
        barber.setStatus(true);

        // 🔹 Evitar errores de columnas NOT NULL
        if (barber.getEmail() == null || barber.getEmail().isEmpty()) {
            barber.setEmail(barber.getName().replaceAll(" ", "").toLowerCase() + "@barbershop.local");
        }
        if (barber.getPassword() == null || barber.getPassword().isEmpty()) {
            barber.setPassword("default123");
        }
        if (barber.getSpecialty() == null || barber.getSpecialty().isEmpty()) {
            barber.setSpecialty("General");
        }

        return barberRepository.save(barber);
    }


    // Editar un barbero existente
    @Override
    public Barber updateBarber(Long barberId, Barber barberDetails) {
        Barber existing = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        existing.setName(barberDetails.getName());
        existing.setSpecialty(barberDetails.getSpecialty());
        existing.setImageUrl(barberDetails.getImageUrl());

        return barberRepository.save(existing);
    }

    // Activar o desactivar un barbero
    @Override
    public void toggleBarberStatus(Long barberId, boolean active) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));
        barber.setStatus(active);
        barberRepository.save(barber);
    }

    // Listar barberos activos de una barbería
    @Override
    public List<Barber> getActiveBarbers(Long barbershopId) {
        return barberRepository.findByBarbershopId(barbershopId)
                .stream()
                .filter(Barber::isStatus)
                .collect(Collectors.toList());
    }

    // Obtener horarios disponibles de los barberos
    @Override
    public List<Schedule> getAvailableSchedules(Long barbershopId) {
        List<Barber> barbers = barberRepository.findByBarbershopId(barbershopId);
        return barbers.stream()
                .flatMap(barber -> barber.getSchedules().stream())
                .filter(Schedule::isAvailable)
                .collect(Collectors.toList());
    }

    // Obtener todas las citas de la barbería
    @Override
    public List<Appointment> getAppointments(Long barbershopId) {
        return appointmentRepository.findByBarbershopId(barbershopId);
    }

    // Obtener todas las barberías
    @Override
    public List<Barbershop> getAll() {
        return barbershopRepository.findAll();
    }

    // Obtener barberías por ciudad
    @Override
    public List<Barbershop> getByCity(String city) {
        return barbershopRepository.findByCityContainingIgnoreCase(city);
    }

    // Obtener una barbería por su ID (con servicios y barberos cargados)
    @Override
    public Optional<Barbershop> getById(Long id) {
        Barbershop barbershop = barbershopRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));

        // 🔹 Cargar servicios y barberos desde sus repositorios, sin forzar el contexto JPA
        List<EntityService> services = serviceRepository.findByBarbershopId(barbershop.getId());
        List<Barber> barbers = barberRepository.findByBarbershopId(barbershop.getId());

        // 🔹 Establecerlos manualmente (solo en memoria, no persiste)
        barbershop.setServices(services);
        barbershop.setBarbers(barbers);

        return Optional.of(barbershop);
    }


    // ✅ Nuevo método corregido
    @Override
    public List<EntityService> getServicesByBarbershop(Long id) {
        return serviceRepository.findByBarbershopId(id);
    }

    @Override
    public void deleteBarber(Long barberId) {
        Barber barber = barberRepository.findById(barberId)
                .orElseThrow(() -> new RuntimeException("Barbero no encontrado"));

        // Verificamos si tiene citas asociadas antes de eliminar
        if (barber.getAppointments() != null && !barber.getAppointments().isEmpty()) {
            throw new RuntimeException("No se puede eliminar el barbero porque tiene citas asociadas.");
        }

        barberRepository.delete(barber);
    }


}
