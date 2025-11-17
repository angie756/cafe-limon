package com.cafelimon.service;

import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.dto.menu.MenuResponse;
import com.cafelimon.dto.product.ProductResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MenuServiceTest {

    @Mock
    private CategoryService categoryService;

    @Mock
    private ProductService productService;

    @InjectMocks
    private MenuService menuService;

    private CategoryResponse category1;
    private CategoryResponse category2;
    private ProductResponse product1;
    private ProductResponse product2;
    private ProductResponse product3;

    @BeforeEach
    void setUp() {
        category1 = CategoryResponse.builder()
                .id("cat-1")
                .name("Bebidas Calientes")
                .active(true)
                .build();

        category2 = CategoryResponse.builder()
                .id("cat-2")
                .name("Bebidas Frias")
                .active(true)
                .build();

        product1 = ProductResponse.builder()
                .id("prod-1")
                .name("Cafe Americano")
                .price(new BigDecimal("2500"))
                .available(true)
                .build();

        product2 = ProductResponse.builder()
                .id("prod-2")
                .name("Latte")
                .price(new BigDecimal("3500"))
                .available(true)
                .build();

        product3 = ProductResponse.builder()
                .id("prod-3")
                .name("Jugo de Naranja")
                .price(new BigDecimal("4000"))
                .available(true)
                .build();
    }

    @Test
    void getFullMenu_ShouldReturnMenuWithCategoriesAndProducts() {
        when(categoryService.getActiveCategories()).thenReturn(Arrays.asList(category1, category2));
        when(productService.getAvailableProductsByCategory("cat-1")).thenReturn(Arrays.asList(product1, product2));
        when(productService.getAvailableProductsByCategory("cat-2")).thenReturn(Arrays.asList(product3));

        MenuResponse result = menuService.getFullMenu();

        assertThat(result).isNotNull();
        assertThat(result.getCategories()).hasSize(2);
        assertThat(result.getProducts()).hasSize(3);
        assertThat(result.getProductsByCategory()).containsKeys("cat-1", "cat-2");
        assertThat(result.getProductsByCategory().get("cat-1")).hasSize(2);
        assertThat(result.getProductsByCategory().get("cat-2")).hasSize(1);

        verify(categoryService, times(1)).getActiveCategories();
        verify(productService, times(1)).getAvailableProductsByCategory("cat-1");
        verify(productService, times(1)).getAvailableProductsByCategory("cat-2");
    }

    @Test
    void getFullMenu_WhenNoCategoriesHaveProducts_ShouldReturnEmptyMenu() {
        when(categoryService.getActiveCategories()).thenReturn(Arrays.asList(category1, category2));
        when(productService.getAvailableProductsByCategory(anyString())).thenReturn(Collections.emptyList());

        MenuResponse result = menuService.getFullMenu();

        assertThat(result).isNotNull();
        assertThat(result.getCategories()).hasSize(2);
        assertThat(result.getProducts()).isEmpty();
        assertThat(result.getProductsByCategory()).isEmpty();
    }

    @Test
    void getFullMenu_WhenNoCategories_ShouldReturnEmptyMenu() {
        when(categoryService.getActiveCategories()).thenReturn(Collections.emptyList());

        MenuResponse result = menuService.getFullMenu();

        assertThat(result).isNotNull();
        assertThat(result.getCategories()).isEmpty();
        assertThat(result.getProducts()).isEmpty();
        assertThat(result.getProductsByCategory()).isEmpty();

        verify(productService, never()).getAvailableProductsByCategory(anyString());
    }

    @Test
    void getMenuForTable_ShouldReturnSameAsFullMenu() {
        when(categoryService.getActiveCategories()).thenReturn(Arrays.asList(category1));
        when(productService.getAvailableProductsByCategory("cat-1")).thenReturn(Arrays.asList(product1));

        MenuResponse result = menuService.getMenuForTable("table-1");

        assertThat(result).isNotNull();
        assertThat(result.getCategories()).hasSize(1);
        assertThat(result.getProducts()).hasSize(1);

        verify(categoryService, times(1)).getActiveCategories();
    }
}
