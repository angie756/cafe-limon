package com.cafelimon.service;

import com.cafelimon.dto.category.CategoryRequest;
import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Category;
import com.cafelimon.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category category1;
    private Category category2;

    @BeforeEach
    void setUp() {
        category1 = Category.builder()
                .name("Bebidas Calientes")
                .description("Cafe, te, chocolate")
                .icon("☕")
                .orderIndex(1)
                .active(true)
                .build();
        ReflectionTestUtils.setField(category1, "id", "cat-1");

        category2 = Category.builder()
                .name("Bebidas Frias")
                .description("Jugos, batidos")
                .icon("🥤")
                .orderIndex(2)
                .active(false)
                .build();
        ReflectionTestUtils.setField(category2, "id", "cat-2");
    }

    @Test
    void getAllCategories_ShouldReturnAllCategories() {
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(category1, category2));

        List<CategoryResponse> result = categoryService.getAllCategories();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Bebidas Calientes");
        assertThat(result.get(1).getName()).isEqualTo("Bebidas Frias");
        verify(categoryRepository, times(1)).findAll();
    }

    @Test
    void getActiveCategories_ShouldReturnOnlyActiveCategories() {
        when(categoryRepository.findByActiveTrueOrderByOrderIndexAsc()).thenReturn(Arrays.asList(category1));

        List<CategoryResponse> result = categoryService.getActiveCategories();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getActive()).isTrue();
        verify(categoryRepository, times(1)).findByActiveTrueOrderByOrderIndexAsc();
    }

    @Test
    void getCategoryById_WhenCategoryExists_ShouldReturnCategory() {
        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category1));

        CategoryResponse result = categoryService.getCategoryById("cat-1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("cat-1");
        assertThat(result.getName()).isEqualTo("Bebidas Calientes");
        verify(categoryRepository, times(1)).findById("cat-1");
    }

    @Test
    void getCategoryById_WhenCategoryNotFound_ShouldThrowException() {
        when(categoryRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getCategoryById("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Categoría no encontrada con ID: invalid-id");
    }

    @Test
    void createCategory_WithValidData_ShouldCreateCategory() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Nueva Categoria");
        request.setDescription("Descripcion");
        request.setIcon("🍔");
        request.setOrderIndex(3);
        request.setActive(true);

        when(categoryRepository.existsByName("Nueva Categoria")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category1);

        CategoryResponse result = categoryService.createCategory(request);

        assertThat(result).isNotNull();
        verify(categoryRepository, times(1)).existsByName("Nueva Categoria");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void createCategory_WithExistingName_ShouldThrowException() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Bebidas Calientes");
        request.setDescription("Descripcion");
        request.setIcon("☕");
        request.setOrderIndex(1);
        request.setActive(true);

        when(categoryRepository.existsByName("Bebidas Calientes")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.createCategory(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe una categoría con el nombre: Bebidas Calientes");

        verify(categoryRepository, never()).save(any());
    }

    @Test
    void updateCategory_WithValidData_ShouldUpdateCategory() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Bebidas Calientes Actualizado");
        request.setDescription("Nueva descripcion");
        request.setIcon("☕");
        request.setOrderIndex(1);
        request.setActive(true);

        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category1));
        when(categoryRepository.existsByName("Bebidas Calientes Actualizado")).thenReturn(false);
        when(categoryRepository.save(any(Category.class))).thenReturn(category1);

        CategoryResponse result = categoryService.updateCategory("cat-1", request);

        assertThat(result).isNotNull();
        verify(categoryRepository, times(1)).findById("cat-1");
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void updateCategory_WithSameName_ShouldUpdateWithoutCheckingName() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Bebidas Calientes");
        request.setDescription("Nueva descripcion");
        request.setIcon("☕");
        request.setOrderIndex(1);
        request.setActive(true);

        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category1));
        when(categoryRepository.save(any(Category.class))).thenReturn(category1);

        CategoryResponse result = categoryService.updateCategory("cat-1", request);

        assertThat(result).isNotNull();
        verify(categoryRepository, times(1)).findById("cat-1");
        verify(categoryRepository, never()).existsByName(any());
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void updateCategory_WithExistingName_ShouldThrowException() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Bebidas Frias");
        request.setDescription("Nueva descripcion");
        request.setIcon("☕");
        request.setOrderIndex(1);
        request.setActive(true);

        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category1));
        when(categoryRepository.existsByName("Bebidas Frias")).thenReturn(true);

        assertThatThrownBy(() -> categoryService.updateCategory("cat-1", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe una categoría con el nombre: Bebidas Frias");

        verify(categoryRepository, never()).save(any());
    }

    @Test
    void updateCategory_WhenCategoryNotFound_ShouldThrowException() {
        CategoryRequest request = new CategoryRequest();
        request.setName("Test");
        request.setDescription("Desc");
        request.setIcon("🍔");
        request.setOrderIndex(1);
        request.setActive(true);

        when(categoryRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.updateCategory("invalid-id", request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Categoría no encontrada con ID: invalid-id");
    }

    @Test
    void deleteCategory_WhenCategoryExists_ShouldDeleteCategory() {
        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category1));

        categoryService.deleteCategory("cat-1");

        verify(categoryRepository, times(1)).findById("cat-1");
        verify(categoryRepository, times(1)).delete(category1);
    }

    @Test
    void deleteCategory_WhenCategoryNotFound_ShouldThrowException() {
        when(categoryRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.deleteCategory("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Categoría no encontrada con ID: invalid-id");
    }
}
