package com.cafelimon.dto.table;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para creación y actualización de mesas
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableRequest {

    @NotBlank(message = "El número de mesa es requerido")
    private String number;

    @Min(value = 1, message = "La capacidad debe ser al menos 1")
    private Integer capacity;

    private String location;

    private Boolean active = true;
}
