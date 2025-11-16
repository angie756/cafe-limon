package com.cafelimon.dto.category;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para creación y actualización de categorías
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategoryRequest {

    @NotBlank(message = "El nombre es requerido")
    private String name;

    private String description;

    private String icon;

    @Min(value = 0, message = "El índice de orden debe ser mayor o igual a 0")
    private Integer orderIndex = 0;

    private Boolean active = true;
}
