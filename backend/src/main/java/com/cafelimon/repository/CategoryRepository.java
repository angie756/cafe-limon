package com.cafelimon.repository;

import com.cafelimon.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Category
 */
@Repository
public interface CategoryRepository extends JpaRepository<Category, String> {

    List<Category> findByActiveTrue();

    List<Category> findByActiveTrueOrderByOrderIndexAsc();

    Optional<Category> findByName(String name);

    Boolean existsByName(String name);
}
