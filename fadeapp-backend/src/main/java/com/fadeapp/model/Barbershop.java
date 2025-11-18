package com.fadeapp.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // ⚙️ Evita errores al serializar LAZY
public class Barbershop {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    @NotBlank
    private String city;

    @Email
    @NotBlank
    private String email;

    @NotBlank
    private String password;

    private LocalTime openingTime;
    private LocalTime closingTime;

    private String imageUrl;

    // Estado de la barbería (activa/inactiva)
    private boolean status = true;

    // Rol para autenticación
    private String role = "BARBERSHOP";

    // 🔹 Relación con barberos (evita recursión infinita)
    @OneToMany(mappedBy = "barbershop", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference("barbershop-barbers")
    private List<Barber> barbers;

    // 🔹 Relación con citas (también evita recursión)
    @OneToMany(mappedBy = "barbershop", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("barbershop-appointments")
    private List<Appointment> appointments;

    // 🔹 Relación con servicios (corrigido para evitar duplicados y recursión)
    @OneToMany(mappedBy = "barbershop", fetch = FetchType.LAZY)
    @JsonManagedReference("barbershop-services")
    private List<EntityService> services;

}
