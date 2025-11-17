package com.cafelimon.controller;

import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.dto.menu.MenuResponse;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.service.MenuService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class MenuControllerTest {

    private MockMvc mockMvc;

    @Mock
    private MenuService menuService;

    @InjectMocks
    private MenuController menuController;

    private MenuResponse menuResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(menuController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        CategoryResponse category = CategoryResponse.builder()
                .id("cat-1")
                .name("Bebidas Calientes")
                .active(true)
                .build();

        ProductResponse product = ProductResponse.builder()
                .id("prod-1")
                .name("Cafe Americano")
                .price(new BigDecimal("2500"))
                .available(true)
                .build();

        menuResponse = MenuResponse.builder()
                .categories(Arrays.asList(category))
                .products(Arrays.asList(product))
                .productsByCategory(new HashMap<>())
                .build();
    }

    @Test
    void getFullMenu_ShouldReturnMenu() throws Exception {
        when(menuService.getFullMenu()).thenReturn(menuResponse);

        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists())
                .andExpect(jsonPath("$.data.categories").isArray())
                .andExpect(jsonPath("$.data.products").isArray());

        verify(menuService, times(1)).getFullMenu();
    }

    @Test
    void getFullMenu_WhenEmpty_ShouldReturnEmptyMenu() throws Exception {
        MenuResponse emptyMenu = MenuResponse.builder()
                .categories(Collections.emptyList())
                .products(Collections.emptyList())
                .productsByCategory(new HashMap<>())
                .build();

        when(menuService.getFullMenu()).thenReturn(emptyMenu);

        mockMvc.perform(get("/api/menu"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.categories").isEmpty())
                .andExpect(jsonPath("$.data.products").isEmpty());
    }

    @Test
    void getMenuForTable_ShouldReturnMenuForSpecificTable() throws Exception {
        when(menuService.getMenuForTable("table-1")).thenReturn(menuResponse);

        mockMvc.perform(get("/api/menu/table/table-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").exists());

        verify(menuService, times(1)).getMenuForTable("table-1");
    }

    @Test
    void getMenuForTable_WithDifferentTables_ShouldCallServiceCorrectly() throws Exception {
        when(menuService.getMenuForTable(anyString())).thenReturn(menuResponse);

        mockMvc.perform(get("/api/menu/table/table-5"))
                .andExpect(status().isOk());

        verify(menuService, times(1)).getMenuForTable("table-5");
    }
}
