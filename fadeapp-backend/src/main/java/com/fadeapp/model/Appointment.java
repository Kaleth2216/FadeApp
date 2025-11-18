package com.fadeapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime date;

    // 🔹 Evita recursión con Client
    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    @JsonBackReference("client-appointments")
    private Client client;

    // 🔹 Evita recursión con Barbershop
    @ManyToOne
    @JoinColumn(name = "barbershop_id")
    @JsonBackReference("barbershop-appointments")
    private Barbershop barbershop;

    // 🔹 Relación directa sin recursión
    @ManyToOne
    @JoinColumn(name = "service_id", nullable = false)
    private EntityService service;

    // 🔹 Evita recursión con Barber
    @ManyToOne
    @JoinColumn(name = "barber_id", nullable = false)
    @JsonBackReference("barber-appointments")
    private Barber barber;

    private String status = "PENDING";
}
