package com.fadeapp.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Schedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Día del turno (ejemplo: "Lunes", "Martes", o fecha específica)
     */
    @NotBlank(message = "El día no puede estar vacío")
    private String day;

    /**
     * Hora de inicio del turno
     */
    @NotNull(message = "La hora de inicio es obligatoria")
    private LocalTime startTime;

    /**
     * Hora de finalización del turno
     */
    @NotNull(message = "La hora de finalización es obligatoria")
    private LocalTime endTime;

    /**
     * Indica si el horario está disponible (true = libre, false = ocupado)
     */
    @Column(nullable = false)
    private boolean available = true;

    /**
     * Relación con el barbero correspondiente (evita recursión infinita)
     */
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "barber_id", nullable = false)
    @JsonBackReference("barber-schedules")
    private Barber barber;
}
