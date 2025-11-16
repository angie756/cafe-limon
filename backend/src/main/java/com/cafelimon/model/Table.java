package com.cafelimon.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;
import lombok.*;

/**
 * Entidad Table - Mesas del café
 */
@Entity
@jakarta.persistence.Table(name = "tables")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Table extends BaseEntity {

    @NotBlank(message = "El número de mesa es requerido")
    @Column(nullable = false, unique = true)
    private String number;

    @Positive(message = "La capacidad debe ser mayor a 0")
    @Column(nullable = false)
    private Integer capacity;

    @Column(name = "qr_code", length = 1000)
    private String qrCode;  // Código QR generado (Base64 o URL)

    @Column(length = 100)
    private String location;  // Ubicación en el café (ej: "Ventana", "Terraza")

    @Column(nullable = false)
    @Builder.Default
    private Boolean active = true;
}
