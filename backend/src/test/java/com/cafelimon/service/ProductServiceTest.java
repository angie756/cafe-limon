package com.cafelimon.service;

import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.dto.product.ProductRequest;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Category;
import com.cafelimon.model.Product;
import com.cafelimon.repository.CategoryRepository;
import com.cafelimon.repository.ProductRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private CategoryService categoryService;

    @InjectMocks
    private ProductService productService;

    private Product product1;
    private Product product2;
    private Category category;
    private CategoryResponse categoryResponse;

    @BeforeEach
    void setUp() {
        category = Category.builder()
                .name("Bebidas Calientes")
                .icon("☕")
                .build();
        ReflectionTestUtils.setField(category, "id", "cat-1");

        categoryResponse = CategoryResponse.builder()
                .id("cat-1")
                .name("Bebidas Calientes")
                .icon("☕")
                .build();

        product1 = Product.builder()
                .name("Café Americano")
                .description("Café negro tradicional")
                .price(new BigDecimal("2500"))
                .category(category)
                .available(true)
                .orderCount(10L)
                .preparationTime(5)
                .build();
        ReflectionTestUtils.setField(product1, "id", "prod-1");

        product2 = Product.builder()
                .name("Café Latte")
                .description("Café con leche")
                .price(new BigDecimal("3500"))
                .category(category)
                .available(false)
                .orderCount(20L)
                .preparationTime(7)
                .build();
        ReflectionTestUtils.setField(product2, "id", "prod-2");
    }

    @Test
    void getAllProducts_ShouldReturnAllProducts() {
        when(productRepository.findAll()).thenReturn(Arrays.asList(product1, product2));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.getAllProducts();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getName()).isEqualTo("Café Americano");
        assertThat(result.get(1).getName()).isEqualTo("Café Latte");
        verify(productRepository, times(1)).findAll();
    }

    @Test
    void getAvailableProducts_ShouldReturnOnlyAvailableProducts() {
        when(productRepository.findByAvailableTrue()).thenReturn(Arrays.asList(product1));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.getAvailableProducts();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAvailable()).isTrue();
        verify(productRepository, times(1)).findByAvailableTrue();
    }

    @Test
    void getProductsByCategory_ShouldReturnProductsInCategory() {
        when(productRepository.findByCategoryId("cat-1")).thenReturn(Arrays.asList(product1, product2));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.getProductsByCategory("cat-1");

        assertThat(result).hasSize(2);
        verify(productRepository, times(1)).findByCategoryId("cat-1");
    }

    @Test
    void getAvailableProductsByCategory_ShouldReturnOnlyAvailableProductsInCategory() {
        when(productRepository.findByCategoryIdAndAvailableTrue("cat-1")).thenReturn(Arrays.asList(product1));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.getAvailableProductsByCategory("cat-1");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAvailable()).isTrue();
        verify(productRepository, times(1)).findByCategoryIdAndAvailableTrue("cat-1");
    }

    @Test
    void searchProducts_ShouldReturnMatchingProducts() {
        when(productRepository.searchByName("Café")).thenReturn(Arrays.asList(product1, product2));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.searchProducts("Café");

        assertThat(result).hasSize(2);
        verify(productRepository, times(1)).searchByName("Café");
    }

    @Test
    void searchAvailableProducts_ShouldReturnOnlyAvailableMatchingProducts() {
        when(productRepository.searchByNameAndAvailable("Café")).thenReturn(Arrays.asList(product1));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.searchAvailableProducts("Café");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAvailable()).isTrue();
        verify(productRepository, times(1)).searchByNameAndAvailable("Café");
    }

    @Test
    void getTopProducts_ShouldReturnMostOrderedProducts() {
        when(productRepository.findTopProducts()).thenReturn(Arrays.asList(product2, product1));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        List<ProductResponse> result = productService.getTopProducts();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getOrderCount()).isEqualTo(20L);
        verify(productRepository, times(1)).findTopProducts();
    }

    @Test
    void getProductById_WhenProductExists_ShouldReturnProduct() {
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product1));
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        ProductResponse result = productService.getProductById("prod-1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("prod-1");
        assertThat(result.getName()).isEqualTo("Café Americano");
        verify(productRepository, times(1)).findById("prod-1");
    }

    @Test
    void getProductById_WhenProductNotFound_ShouldThrowException() {
        when(productRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getProductById("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Producto no encontrado con ID: invalid-id");
    }

    @Test
    void createProduct_WithValidData_ShouldCreateProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("Nuevo Café");
        request.setDescription("Descripción");
        request.setPrice(new BigDecimal("4000"));
        request.setCategoryId("cat-1");
        request.setAvailable(true);
        request.setPreparationTime(10);

        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        ProductResponse result = productService.createProduct(request);

        assertThat(result).isNotNull();
        verify(categoryRepository, times(1)).findById("cat-1");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void createProduct_WithInvalidCategory_ShouldThrowException() {
        ProductRequest request = new ProductRequest();
        request.setName("Nuevo Café");
        request.setCategoryId("invalid-cat");
        request.setPrice(new BigDecimal("4000"));
        request.setAvailable(true);

        when(categoryRepository.findById("invalid-cat")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.createProduct(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Categoría no encontrada con ID: invalid-cat");
    }

    @Test
    void updateProduct_WithValidData_ShouldUpdateProduct() {
        ProductRequest request = new ProductRequest();
        request.setName("Café Americano Actualizado");
        request.setDescription("Nueva descripción");
        request.setPrice(new BigDecimal("3000"));
        request.setCategoryId("cat-1");
        request.setAvailable(false);
        request.setPreparationTime(8);

        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product1));
        when(categoryRepository.findById("cat-1")).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(product1);
        when(categoryService.getCategoryById(anyString())).thenReturn(categoryResponse);

        ProductResponse result = productService.updateProduct("prod-1", request);

        assertThat(result).isNotNull();
        verify(productRepository, times(1)).findById("prod-1");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void updateProduct_WhenProductNotFound_ShouldThrowException() {
        ProductRequest request = new ProductRequest();
        request.setName("Test");
        request.setCategoryId("cat-1");
        request.setPrice(new BigDecimal("3000"));
        request.setAvailable(true);

        when(productRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.updateProduct("invalid-id", request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Producto no encontrado con ID: invalid-id");
    }

    @Test
    void deleteProduct_WhenProductExists_ShouldDeleteProduct() {
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product1));

        productService.deleteProduct("prod-1");

        verify(productRepository, times(1)).findById("prod-1");
        verify(productRepository, times(1)).delete(product1);
    }

    @Test
    void deleteProduct_WhenProductNotFound_ShouldThrowException() {
        when(productRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.deleteProduct("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Producto no encontrado con ID: invalid-id");
    }

    @Test
    void incrementOrderCount_ShouldIncrementCount() {
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenReturn(product1);

        productService.incrementOrderCount("prod-1");

        verify(productRepository, times(1)).findById("prod-1");
        verify(productRepository, times(1)).save(any(Product.class));
    }

    @Test
    void incrementOrderCount_WhenCountIsNull_ShouldSetToOne() {
        product1.setOrderCount(null);
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product1));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> {
            Product savedProduct = invocation.getArgument(0);
            assertThat(savedProduct.getOrderCount()).isEqualTo(1L);
            return savedProduct;
        });

        productService.incrementOrderCount("prod-1");

        verify(productRepository, times(1)).save(any(Product.class));
    }
}
