package com.cafelimon.dto.order;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO para solicitud de creación de orden
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateOrderRequest {

    @NotBlank(message = "El ID de la mesa es requerido")
    private String tableId;

    @Size(max = 100, message = "El nombre del cliente no puede exceder 100 caracteres")
    private String customerName;

    @NotEmpty(message = "La orden debe contener al menos un item")
    @Valid
    private List<OrderItemRequest> items;

    private String notes;
}
