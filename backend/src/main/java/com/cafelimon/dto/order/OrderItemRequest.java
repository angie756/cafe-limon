package com.cafelimon.dto.order;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para items de orden en solicitudes
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemRequest {

    @NotBlank(message = "El ID del producto es requerido")
    private String productId;

    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer quantity;

    private String notes;
}
