package com.cafelimon.controller;

import com.cafelimon.dto.category.CategoryRequest;
import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.service.CategoryService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class CategoryControllerTest {

    private MockMvc mockMvc;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private CategoryController categoryController;

    private ObjectMapper objectMapper;
    private CategoryResponse categoryResponse;
    private CategoryRequest categoryRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(categoryController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        categoryResponse = CategoryResponse.builder()
                .id("cat-1")
                .name("Bebidas Calientes")
                .active(true)
                .build();

        categoryRequest = new CategoryRequest();
        categoryRequest.setName("Nueva Categoria");
        categoryRequest.setActive(true);
    }

    @Test
    void getAllCategories_ShouldReturnCategories() throws Exception {
        List<CategoryResponse> categories = Arrays.asList(categoryResponse);
        when(categoryService.getAllCategories()).thenReturn(categories);

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(categoryService, times(1)).getAllCategories();
    }

    @Test
    void getActiveCategories_ShouldReturnActiveCategories() throws Exception {
        List<CategoryResponse> categories = Arrays.asList(categoryResponse);
        when(categoryService.getActiveCategories()).thenReturn(categories);

        mockMvc.perform(get("/api/categories/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(categoryService, times(1)).getActiveCategories();
    }

    @Test
    void getCategoryById_ShouldReturnCategory() throws Exception {
        when(categoryService.getCategoryById("cat-1")).thenReturn(categoryResponse);

        mockMvc.perform(get("/api/categories/cat-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("cat-1"));

        verify(categoryService, times(1)).getCategoryById("cat-1");
    }

    @Test
    void getCategoryById_WhenNotFound_ShouldReturnNotFound() throws Exception {
        when(categoryService.getCategoryById("invalid")).thenThrow(new ResourceNotFoundException("Categoria no encontrada"));

        mockMvc.perform(get("/api/categories/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createCategory_ShouldCreateCategory() throws Exception {
        when(categoryService.createCategory(any(CategoryRequest.class))).thenReturn(categoryResponse);

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));

        verify(categoryService, times(1)).createCategory(any(CategoryRequest.class));
    }

    @Test
    void updateCategory_ShouldUpdateCategory() throws Exception {
        when(categoryService.updateCategory(anyString(), any(CategoryRequest.class))).thenReturn(categoryResponse);

        mockMvc.perform(put("/api/categories/cat-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(categoryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(categoryService, times(1)).updateCategory(anyString(), any(CategoryRequest.class));
    }

    @Test
    void deleteCategory_ShouldDeleteCategory() throws Exception {
        doNothing().when(categoryService).deleteCategory("cat-1");

        mockMvc.perform(delete("/api/categories/cat-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(categoryService, times(1)).deleteCategory("cat-1");
    }
}
