package com.cafelimon.service;

import com.cafelimon.dto.category.CategoryRequest;
import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Category;
import com.cafelimon.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de categorías
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<CategoryResponse> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CategoryResponse> getActiveCategories() {
        return categoryRepository.findByActiveTrueOrderByOrderIndexAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CategoryResponse getCategoryById(String id) {
        Category category = findCategoryById(id);
        return toResponse(category);
    }

    public CategoryResponse createCategory(CategoryRequest request) {
        log.info("Creando nueva categoría: {}", request.getName());

        if (categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + request.getName());
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .icon(request.getIcon())
                .orderIndex(request.getOrderIndex())
                .active(request.getActive())
                .build();

        category = categoryRepository.save(category);
        log.info("Categoría creada con ID: {}", category.getId());

        return toResponse(category);
    }

    public CategoryResponse updateCategory(String id, CategoryRequest request) {
        log.info("Actualizando categoría con ID: {}", id);

        Category category = findCategoryById(id);

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByName(request.getName())) {
            throw new IllegalArgumentException("Ya existe una categoría con el nombre: " + request.getName());
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setIcon(request.getIcon());
        category.setOrderIndex(request.getOrderIndex());
        category.setActive(request.getActive());

        category = categoryRepository.save(category);
        log.info("Categoría actualizada: {}", category.getId());

        return toResponse(category);
    }

    public void deleteCategory(String id) {
        log.info("Eliminando categoría con ID: {}", id);
        Category category = findCategoryById(id);
        categoryRepository.delete(category);
        log.info("Categoría eliminada: {}", id);
    }

    private Category findCategoryById(String id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + id));
    }

    private CategoryResponse toResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .icon(category.getIcon())
                .orderIndex(category.getOrderIndex())
                .active(category.getActive())
                .createdAt(category.getCreatedAt())
                .updatedAt(category.getUpdatedAt())
                .build();
    }
}
