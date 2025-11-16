package com.cafelimon.service;

import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.dto.menu.MenuResponse;
import com.cafelimon.dto.product.ProductResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Servicio para gestión del menú
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class MenuService {

    private final CategoryService categoryService;
    private final ProductService productService;

    /**
     * Obtiene el menú completo con categorías y productos activos
     */
    public MenuResponse getFullMenu() {
        log.info("Obteniendo menú completo");

        List<CategoryResponse> categories = categoryService.getActiveCategories();
        Map<String, List<ProductResponse>> productsByCategory = new LinkedHashMap<>();
        List<ProductResponse> allProducts = new java.util.ArrayList<>();

        for (CategoryResponse category : categories) {
            List<ProductResponse> products = productService.getAvailableProductsByCategory(category.getId());
            if (!products.isEmpty()) {
                productsByCategory.put(category.getId(), products);
                allProducts.addAll(products);
            }
        }

        return MenuResponse.builder()
                .categories(categories)
                .productsByCategory(productsByCategory)
                .products(allProducts)
                .build();
    }

    /**
     * Obtiene el menú para una mesa específica
     */
    public MenuResponse getMenuForTable(String tableId) {
        log.info("Obteniendo menú para mesa: {}", tableId);
        // Por ahora retornamos el mismo menú para todas las mesas
        // En el futuro se podría personalizar según la mesa
        return getFullMenu();
    }
}
