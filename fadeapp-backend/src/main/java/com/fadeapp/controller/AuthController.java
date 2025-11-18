package com.fadeapp.controller;

import com.fadeapp.dto.LoginRequest;
import com.fadeapp.dto.LoginResponse;
import com.fadeapp.model.Client;
import com.fadeapp.model.Barber;
import com.fadeapp.model.Barbershop;
import com.fadeapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private AuthService authService;

    // Registro de cliente
    @PostMapping("/register/client")
    public ResponseEntity<Client> registerClient(@RequestBody Client client) {
        Client createdClient = authService.registerClient(client);
        return ResponseEntity.ok(createdClient);
    }

    // Registro de barbero
    @PostMapping("/register/barber")
    public ResponseEntity<Barber> registerBarber(@RequestBody Barber barber) {
        Barber createdBarber = authService.registerBarber(barber);
        return ResponseEntity.ok(createdBarber);
    }

    // Registro de barbería
    @PostMapping("/register/barbershop")
    public ResponseEntity<Barbershop> registerBarbershop(@RequestBody Barbershop barbershop) {
        Barbershop createdBarbershop = authService.registerBarbershop(barbershop);
        return ResponseEntity.ok(createdBarbershop);
    }

    // Inicio de sesión (válido para todos los roles)
    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    // Validar token JWT
    @GetMapping("/validate")
    public ResponseEntity<Boolean> validateToken(@RequestParam String token) {
        boolean isValid = authService.validateToken(token);
        return ResponseEntity.ok(isValid);
    }
}
