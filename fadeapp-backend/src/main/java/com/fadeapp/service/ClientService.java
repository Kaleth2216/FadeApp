package com.fadeapp.service;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;

import java.util.List;
import java.util.Optional;

public interface ClientService {

    // Registrar un nuevo cliente
    Client register(Client client);

    // Buscar cliente por correo electrónico
    Optional<Client> findByEmail(String email);

    // Verificar si un correo ya está registrado
    boolean existsByEmail(String email);

    // Obtener todos los clientes registrados
    List<Client> getAllClients();

    // Obtener un cliente por su ID
    Optional<Client> getClientById(Long id);

    // Actualizar datos personales del cliente
    Client updateClient(Long id, Client client);

    // Eliminar un cliente
    void deleteClient(Long id);

    // Cambiar la ciudad (solo en memoria o sesión)
    void updateClientCityInSession(Long clientId, String newCity);

    // Listar barberías disponibles en una ciudad
    List<Barbershop> getBarbershopsByCity(String city);

    // Listar barberos de una barbería
    List<Barber> getBarbersFromBarbershop(Long barbershopId);


}
