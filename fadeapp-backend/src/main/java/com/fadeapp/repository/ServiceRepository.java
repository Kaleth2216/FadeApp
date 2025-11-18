package com.fadeapp.repository;

import com.fadeapp.model.EntityService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<EntityService, Long> {

    @Query("SELECT DISTINCT s FROM EntityService s WHERE s.barbershop.id = :barbershopId")
    List<EntityService> findByBarbershopId(@Param("barbershopId") Long barbershopId);
}


