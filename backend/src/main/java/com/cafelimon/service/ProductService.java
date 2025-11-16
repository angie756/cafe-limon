package com.cafelimon.service;

import com.cafelimon.dto.product.ProductRequest;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Category;
import com.cafelimon.model.Product;
import com.cafelimon.repository.CategoryRepository;
import com.cafelimon.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de productos
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryService categoryService;

    public List<ProductResponse> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAvailableProducts() {
        return productRepository.findByAvailableTrue().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getProductsByCategory(String categoryId) {
        return productRepository.findByCategoryId(categoryId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getAvailableProductsByCategory(String categoryId) {
        return productRepository.findByCategoryIdAndAvailableTrue(categoryId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchProducts(String query) {
        return productRepository.searchByName(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> searchAvailableProducts(String query) {
        return productRepository.searchByNameAndAvailable(query).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<ProductResponse> getTopProducts() {
        return productRepository.findTopProducts().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public ProductResponse getProductById(String id) {
        Product product = findProductById(id);
        return toResponse(product);
    }

    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creando nuevo producto: {}", request.getName());

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + request.getCategoryId()));

        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(category)
                .imageUrl(request.getImageUrl())
                .preparationTime(request.getPreparationTime())
                .available(request.getAvailable())
                .orderCount(0L)
                .build();

        product = productRepository.save(product);
        log.info("Producto creado con ID: {}", product.getId());

        return toResponse(product);
    }

    public ProductResponse updateProduct(String id, ProductRequest request) {
        log.info("Actualizando producto con ID: {}", id);

        Product product = findProductById(id);

        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada con ID: " + request.getCategoryId()));

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setCategory(category);
        product.setImageUrl(request.getImageUrl());
        product.setPreparationTime(request.getPreparationTime());
        product.setAvailable(request.getAvailable());

        product = productRepository.save(product);
        log.info("Producto actualizado: {}", product.getId());

        return toResponse(product);
    }

    public void deleteProduct(String id) {
        log.info("Eliminando producto con ID: {}", id);
        Product product = findProductById(id);
        productRepository.delete(product);
        log.info("Producto eliminado: {}", id);
    }

    public void incrementOrderCount(String productId) {
        Product product = findProductById(productId);
        Long currentCount = product.getOrderCount();
        product.setOrderCount((currentCount == null ? 0 : currentCount) + 1);
        productRepository.save(product);
    }

    private Product findProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + id));
    }

    private ProductResponse toResponse(Product product) {
        return ProductResponse.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(categoryService.getCategoryById(product.getCategory().getId()))
                .imageUrl(product.getImageUrl())
                .preparationTime(product.getPreparationTime())
                .available(product.getAvailable())
                .orderCount(product.getOrderCount())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
