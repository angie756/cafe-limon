package com.cafelimon.dto.product;

import com.cafelimon.dto.category.CategoryResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para respuesta de producto
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {

    private String id;
    private String name;
    private String description;
    private BigDecimal price;
    private CategoryResponse category;
    private String imageUrl;
    private Integer preparationTime;
    private Boolean available;
    private Long orderCount;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
