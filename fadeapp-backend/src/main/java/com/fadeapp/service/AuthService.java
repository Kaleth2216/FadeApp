package com.fadeapp.service;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.dto.LoginRequest;
import com.fadeapp.dto.LoginResponse;

public interface AuthService {

    // Registrar un nuevo cliente
    Client registerClient(Client client);

    // Registrar una nueva barbería
    Barbershop registerBarbershop(Barbershop barbershop);

    // Registrar un nuevo barbero
    Barber registerBarber(Barber barber);

    // Iniciar sesión y generar token JWT
    LoginResponse login(LoginRequest request);

    // Validar si un token JWT es válido
    boolean validateToken(String token);
}
