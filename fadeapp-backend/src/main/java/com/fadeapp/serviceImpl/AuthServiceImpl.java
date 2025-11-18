package com.fadeapp.serviceImpl;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.dto.LoginRequest;
import com.fadeapp.dto.LoginResponse;
import com.fadeapp.repository.ClientRepository;
import com.fadeapp.repository.BarbershopRepository;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.security.JwtUtils;
import com.fadeapp.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private BarbershopRepository barbershopRepository;

    @Autowired
    private BarberRepository barberRepository;

    @Autowired
    private JwtUtils jwtUtils;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Registrar un nuevo cliente
    @Override
    public Client registerClient(Client client) {
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        client.setPassword(passwordEncoder.encode(client.getPassword()));
        client.setRole("CLIENT");
        client.setStatus(true);
        return clientRepository.save(client);
    }

    // Registrar una nueva barbería
    @Override
    public Barbershop registerBarbershop(Barbershop barbershop) {
        if (barbershopRepository.existsByEmail(barbershop.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        barbershop.setPassword(passwordEncoder.encode(barbershop.getPassword()));
        barbershop.setRole("BARBERSHOP");
        barbershop.setStatus(true);
        return barbershopRepository.save(barbershop);
    }

    // Registrar un nuevo barbero
    @Override
    public Barber registerBarber(Barber barber) {
        if (barberRepository.existsByEmail(barber.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        barber.setPassword(passwordEncoder.encode(barber.getPassword()));
        barber.setRole("BARBER");
        barber.setStatus(true);
        return barberRepository.save(barber);
    }

    // Iniciar sesión y generar token JWT
    @Override
    public LoginResponse login(LoginRequest request) {
        String email = request.getEmail();
        String password = request.getPassword();

        // Buscar en Client
        Client client = clientRepository.findByEmail(email).orElse(null);
        if (client != null && passwordEncoder.matches(password, client.getPassword())) {
            if (!client.isStatus()) throw new RuntimeException("Usuario inactivo");
            String token = jwtUtils.generateToken(email, "CLIENT");
            return new LoginResponse(token, "CLIENT", client.getId());
        }

        // Buscar en Barbershop
        Barbershop barbershop = barbershopRepository.findByEmail(email).orElse(null);
        if (barbershop != null && passwordEncoder.matches(password, barbershop.getPassword())) {
            if (!barbershop.isStatus()) throw new RuntimeException("Usuario inactivo");
            String token = jwtUtils.generateToken(email, "BARBERSHOP");
            return new LoginResponse(token, "BARBERSHOP", barbershop.getId());
        }

        // Buscar en Barber
        Barber barber = barberRepository.findByEmail(email).orElse(null);
        if (barber != null && passwordEncoder.matches(password, barber.getPassword())) {
            if (!barber.isStatus()) throw new RuntimeException("Usuario inactivo");
            String token = jwtUtils.generateToken(email, "BARBER");
            return new LoginResponse(token, "BARBER", barber.getId());
        }

        throw new RuntimeException("Credenciales inválidas");
    }

    // Validar si un token JWT es válido
    @Override
    public boolean validateToken(String token) {
        try {
            jwtUtils.extractEmail(token); // Si no lanza excepción, el token es válido
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
