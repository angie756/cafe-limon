package com.cafelimon.controller;

import com.cafelimon.dto.product.ProductRequest;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.service.ProductService;
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

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTest {

    private MockMvc mockMvc;

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private ObjectMapper objectMapper;
    private ProductResponse productResponse;
    private ProductRequest productRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(productController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        productResponse = ProductResponse.builder()
                .id("prod-1")
                .name("Cafe Americano")
                .price(new BigDecimal("2500"))
                .available(true)
                .build();

        productRequest = new ProductRequest();
        productRequest.setName("Nuevo Cafe");
        productRequest.setPrice(new BigDecimal("3000"));
        productRequest.setCategoryId("cat-1");
        productRequest.setAvailable(true);
    }

    @Test
    void getAllProducts_ShouldReturnProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.getAllProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data[0].id").value("prod-1"))
                .andExpect(jsonPath("$.data[0].name").value("Cafe Americano"));

        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void getAllProducts_WhenNoProducts_ShouldReturnEmptyList() throws Exception {
        when(productService.getAllProducts()).thenReturn(Collections.emptyList());

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data").isEmpty());
    }

    @Test
    void getAvailableProducts_ShouldReturnAvailableProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.getAvailableProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(productService, times(1)).getAvailableProducts();
    }

    @Test
    void getProductsByCategory_ShouldReturnProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.getProductsByCategory("cat-1")).thenReturn(products);

        mockMvc.perform(get("/api/products/category/cat-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(productService, times(1)).getProductsByCategory("cat-1");
    }

    @Test
    void getAvailableProductsByCategory_ShouldReturnProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.getAvailableProductsByCategory("cat-1")).thenReturn(products);

        mockMvc.perform(get("/api/products/category/cat-1/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(productService, times(1)).getAvailableProductsByCategory("cat-1");
    }

    @Test
    void searchProducts_WithQuery_ShouldReturnProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.searchProducts("cafe")).thenReturn(products);

        mockMvc.perform(get("/api/products/search")
                        .param("query", "cafe")
                        .param("availableOnly", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(productService, times(1)).searchProducts("cafe");
    }

    @Test
    void searchProducts_WithAvailableOnly_ShouldReturnAvailableProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.searchAvailableProducts("cafe")).thenReturn(products);

        mockMvc.perform(get("/api/products/search")
                        .param("query", "cafe")
                        .param("availableOnly", "true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(productService, times(1)).searchAvailableProducts("cafe");
    }

    @Test
    void getTopProducts_ShouldReturnTopProducts() throws Exception {
        List<ProductResponse> products = Arrays.asList(productResponse);
        when(productService.getTopProducts()).thenReturn(products);

        mockMvc.perform(get("/api/products/top"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(productService, times(1)).getTopProducts();
    }

    @Test
    void getProductById_WhenExists_ShouldReturnProduct() throws Exception {
        when(productService.getProductById("prod-1")).thenReturn(productResponse);

        mockMvc.perform(get("/api/products/prod-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("prod-1"))
                .andExpect(jsonPath("$.data.name").value("Cafe Americano"));

        verify(productService, times(1)).getProductById("prod-1");
    }

    @Test
    void getProductById_WhenNotExists_ShouldReturnNotFound() throws Exception {
        when(productService.getProductById("invalid")).thenThrow(new ResourceNotFoundException("Producto no encontrado"));

        mockMvc.perform(get("/api/products/invalid"))
                .andExpect(status().isNotFound());

        verify(productService, times(1)).getProductById("invalid");
    }

    @Test
    void createProduct_WithValidData_ShouldCreateProduct() throws Exception {
        when(productService.createProduct(any(ProductRequest.class))).thenReturn(productResponse);

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Producto creado exitosamente"));

        verify(productService, times(1)).createProduct(any(ProductRequest.class));
    }

    @Test
    void updateProduct_WithValidData_ShouldUpdateProduct() throws Exception {
        when(productService.updateProduct(anyString(), any(ProductRequest.class))).thenReturn(productResponse);

        mockMvc.perform(put("/api/products/prod-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(productRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Producto actualizado exitosamente"));

        verify(productService, times(1)).updateProduct(anyString(), any(ProductRequest.class));
    }

    @Test
    void deleteProduct_ShouldDeleteProduct() throws Exception {
        doNothing().when(productService).deleteProduct("prod-1");

        mockMvc.perform(delete("/api/products/prod-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Producto eliminado exitosamente"));

        verify(productService, times(1)).deleteProduct("prod-1");
    }
}
