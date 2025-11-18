package com.fadeapp.serviceImpl;

import com.fadeapp.model.Client;
import com.fadeapp.model.Barbershop;
import com.fadeapp.model.Barber;
import com.fadeapp.repository.ClientRepository;
import com.fadeapp.repository.BarbershopRepository;
import com.fadeapp.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ClientServiceImpl implements ClientService {

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private BarbershopRepository barbershopRepository;

    @Override
    public Client register(Client client) {
        if (clientRepository.existsByEmail(client.getEmail())) {
            throw new RuntimeException("El correo ya está registrado");
        }
        return clientRepository.save(client);
    }

    @Override
    public Optional<Client> findByEmail(String email) {
        return clientRepository.findByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return clientRepository.existsByEmail(email);
    }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Optional<Client> getClientById(Long id) {
        return clientRepository.findById(id);
    }

    @Override
    public Client updateClient(Long id, Client clientDetails) {
        Client existingClient = clientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));

        existingClient.setFirstName(clientDetails.getFirstName());
        existingClient.setLastName(clientDetails.getLastName());
        existingClient.setEmail(clientDetails.getEmail());
        existingClient.setPhone(clientDetails.getPhone());
        existingClient.setCity(clientDetails.getCity());

        return clientRepository.save(existingClient);
    }

    @Override
    public void deleteClient(Long id) {
        if (!clientRepository.existsById(id)) {
            throw new RuntimeException("Cliente no encontrado");
        }
        clientRepository.deleteById(id);
    }

    @Override
    public void updateClientCityInSession(Long clientId, String newCity) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new RuntimeException("Cliente no encontrado"));
        client.setCity(newCity);
        clientRepository.save(client); // ahora sí persiste en la BD
    }

    @Override
    public List<Barbershop> getBarbershopsByCity(String city) {
        return barbershopRepository.findByCity(city);
    }

    @Override
    public List<Barber> getBarbersFromBarbershop(Long barbershopId) {
        Barbershop barbershop = barbershopRepository.findById(barbershopId)
                .orElseThrow(() -> new RuntimeException("Barbería no encontrada"));
        return barbershop.getBarbers();
    }


}
