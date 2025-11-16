package com.cafelimon.repository;

import com.cafelimon.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Product
 */
@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByCategoryId(String categoryId);

    List<Product> findByAvailableTrue();

    List<Product> findByCategoryIdAndAvailableTrue(String categoryId);

    @Query("SELECT p FROM Product p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByName(@Param("query") String query);

    @Query("SELECT p FROM Product p WHERE p.available = true " +
           "AND LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Product> searchByNameAndAvailable(@Param("query") String query);

    @Query("SELECT p FROM Product p ORDER BY p.orderCount DESC")
    List<Product> findTopProducts();

    @Query("SELECT p FROM Product p WHERE p.category.id = :categoryId ORDER BY p.name")
    List<Product> findByCategoryIdOrderByName(@Param("categoryId") String categoryId);
}
