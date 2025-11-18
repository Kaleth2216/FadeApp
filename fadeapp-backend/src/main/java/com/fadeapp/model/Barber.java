package com.fadeapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Barber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔹 Solo el nombre será obligatorio
    @NotBlank(message = "El nombre no debe estar vacío")
    private String name;

    @Email
    private String email; // opcional

    private String password; // opcional

    private String imageUrl;

    private String specialty; // opcional

    private boolean status = true;

    private String role = "BARBER";

    // 🔹 Relación con la barbería (evita recursión infinita)
    @ManyToOne
    @JoinColumn(name = "barbershop_id")
    @JsonBackReference("barbershop-barbers")
    private Barbershop barbershop;

    // 🔹 Relación con los horarios del barbero
    @OneToMany(mappedBy = "barber", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("barber-schedules")
    private List<Schedule> schedules;

    // 🔹 Relación con las citas del barbero (evita recursión)
    @OneToMany(mappedBy = "barber", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("barber-appointments")
    private List<Appointment> appointments;
}
