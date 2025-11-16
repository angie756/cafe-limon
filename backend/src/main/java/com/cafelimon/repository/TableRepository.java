package com.cafelimon.repository;

import com.cafelimon.model.Table;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Table
 */
@Repository
public interface TableRepository extends JpaRepository<Table, String> {

    List<Table> findByActiveTrue();

    Optional<Table> findByNumber(String number);

    Boolean existsByNumber(String number);

    List<Table> findByActiveTrueOrderByNumberAsc();
}
