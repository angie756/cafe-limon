package com.cafelimon.dto.category;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de categoría
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryResponse {

    private String id;
    private String name;
    private String description;
    private String icon;
    private Integer orderIndex;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
