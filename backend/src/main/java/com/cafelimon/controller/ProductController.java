package com.cafelimon.controller;

import com.cafelimon.dto.ApiResponse;
import com.cafelimon.dto.product.ProductRequest;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión de productos
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Productos", description = "Endpoints para gestión de productos")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {

    private final ProductService productService;

    @GetMapping
    @Operation(summary = "Obtener todos los productos")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAllProducts() {
        log.info("GET /api/products");
        List<ProductResponse> products = productService.getAllProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/available")
    @Operation(summary = "Obtener productos disponibles")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAvailableProducts() {
        log.info("GET /api/products/available");
        List<ProductResponse> products = productService.getAvailableProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Obtener productos por categoría")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getProductsByCategory(
            @PathVariable String categoryId) {
        log.info("GET /api/products/category/{}", categoryId);
        List<ProductResponse> products = productService.getProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/category/{categoryId}/available")
    @Operation(summary = "Obtener productos disponibles por categoría")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getAvailableProductsByCategory(
            @PathVariable String categoryId) {
        log.info("GET /api/products/category/{}/available", categoryId);
        List<ProductResponse> products = productService.getAvailableProductsByCategory(categoryId);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/search")
    @Operation(summary = "Buscar productos por nombre")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> searchProducts(
            @RequestParam String query,
            @RequestParam(required = false, defaultValue = "false") boolean availableOnly) {
        log.info("GET /api/products/search?query={}&availableOnly={}", query, availableOnly);
        List<ProductResponse> products = availableOnly
                ? productService.searchAvailableProducts(query)
                : productService.searchProducts(query);
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/top")
    @Operation(summary = "Obtener productos más vendidos")
    public ResponseEntity<ApiResponse<List<ProductResponse>>> getTopProducts() {
        log.info("GET /api/products/top");
        List<ProductResponse> products = productService.getTopProducts();
        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto por ID")
    public ResponseEntity<ApiResponse<ProductResponse>> getProductById(@PathVariable String id) {
        log.info("GET /api/products/{}", id);
        ProductResponse product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success(product));
    }

    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Crear nuevo producto", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<ProductResponse>> createProduct(
            @Valid @RequestBody ProductRequest request) {
        log.info("POST /api/products - Nombre: {}", request.getName());
        ProductResponse product = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Producto creado exitosamente", product));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Actualizar producto", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<ProductResponse>> updateProduct(
            @PathVariable String id,
            @Valid @RequestBody ProductRequest request) {
        log.info("PUT /api/products/{}", id);
        ProductResponse product = productService.updateProduct(id, request);
        return ResponseEntity.ok(ApiResponse.success("Producto actualizado exitosamente", product));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Eliminar producto", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable String id) {
        log.info("DELETE /api/products/{}", id);
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Producto eliminado exitosamente", null));
    }
}
