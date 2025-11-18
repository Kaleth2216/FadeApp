package com.fadeapp.security;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barber;
import com.fadeapp.model.Barbershop;
import com.fadeapp.repository.ClientRepository;
import com.fadeapp.repository.BarberRepository;
import com.fadeapp.repository.BarbershopRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private BarberRepository barberRepository;

    @Autowired
    private BarbershopRepository barbershopRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // Buscar cliente
        Client client = clientRepository.findByEmail(email).orElse(null);
        if (client != null) {
            if (!client.isStatus()) {
                throw new UsernameNotFoundException("El cliente está inactivo");
            }
            return new User(
                    client.getEmail(),
                    client.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_CLIENT"))
            );
        }

        // Buscar barbero
        Barber barber = barberRepository.findByEmail(email).orElse(null);
        if (barber != null) {
            if (!barber.isStatus()) {
                throw new UsernameNotFoundException("El barbero está inactivo");
            }
            return new User(
                    barber.getEmail(),
                    barber.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_BARBER"))
            );
        }

        // Buscar barbería
        Barbershop barbershop = barbershopRepository.findByEmail(email).orElse(null);
        if (barbershop != null) {
            if (!barbershop.isStatus()) {
                throw new UsernameNotFoundException("La barbería está inactiva");
            }
            return new User(
                    barbershop.getEmail(),
                    barbershop.getPassword(),
                    Collections.singleton(new SimpleGrantedAuthority("ROLE_BARBERSHOP"))
            );
        }

        throw new UsernameNotFoundException("Usuario no encontrado con el email: " + email);
    }
}
