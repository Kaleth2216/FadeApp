package com.fadeapp.controller;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/clients")
@CrossOrigin(origins = "http://localhost:8100") // Permite conexión con Ionic
public class ClientController {

    @Autowired
    private ClientService clientService;

    // 🔹 Registrar nuevo cliente
    @PostMapping("/register")
    public ResponseEntity<Client> register(@RequestBody Client client) {
        Client created = clientService.register(client);
        return ResponseEntity.ok(created);
    }

    // 🔹 Obtener todos los clientes
    @GetMapping
    public ResponseEntity<List<Client>> getAllClients() {
        return ResponseEntity.ok(clientService.getAllClients());
    }

    // 🔹 Obtener cliente por ID
    @GetMapping("/{id}")
    public ResponseEntity<Optional<Client>> getClientById(@PathVariable Long id) {
        return ResponseEntity.ok(clientService.getClientById(id));
    }

    // 🔹 Actualizar cliente
    @PutMapping("/{id}")
    public ResponseEntity<Client> updateClient(@PathVariable Long id, @RequestBody Client client) {
        Client updated = clientService.updateClient(id, client);
        return ResponseEntity.ok(updated);
    }

    // 🔹 Eliminar cliente
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteClient(@PathVariable Long id) {
        clientService.deleteClient(id);
        return ResponseEntity.ok("Cliente eliminado correctamente");
    }

    // 🔹 Buscar cliente por email
    @GetMapping("/by-email")
    public ResponseEntity<Optional<Client>> findByEmail(@RequestParam String email) {
        return ResponseEntity.ok(clientService.findByEmail(email));
    }

    // 🔹 Verificar si un correo ya está registrado
    @GetMapping("/exists")
    public ResponseEntity<Boolean> existsByEmail(@RequestParam String email) {
        return ResponseEntity.ok(clientService.existsByEmail(email));
    }

    // 🔹 Listar barberías disponibles por ciudad
    @GetMapping("/barbershops")
    public ResponseEntity<List<Barbershop>> getBarbershopsByCity(@RequestParam String city) {
        return ResponseEntity.ok(clientService.getBarbershopsByCity(city));
    }

    // 🔹 Actualizar ciudad del cliente
    @PutMapping("/{clientId}/update-city")
    public ResponseEntity<String> updateClientCity(@PathVariable Long clientId, @RequestParam String city) {
        clientService.updateClientCityInSession(clientId, city);
        return ResponseEntity.ok("Ciudad actualizada correctamente");
    }

    // 🔹 Listar barberos de una barbería
    @GetMapping("/{barbershopId}/barbers")
    public ResponseEntity<List<Barber>> getBarbersFromBarbershop(@PathVariable Long barbershopId) {
        List<Barber> barbers = clientService.getBarbersFromBarbershop(barbershopId);
        return ResponseEntity.ok(barbers);
    }
}
