package com.cafelimon.dto.menu;

import com.cafelimon.dto.category.CategoryResponse;
import com.cafelimon.dto.product.ProductResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

/**
 * DTO para respuesta del menú completo
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MenuResponse {

    private List<CategoryResponse> categories;
    private Map<String, List<ProductResponse>> productsByCategory;
    private List<ProductResponse> products; // Lista plana de todos los productos
}
