package com.cafelimon.dto.table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para respuesta de mesa
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TableResponse {

    private String id;
    private String number;
    private Integer capacity;
    private String qrCode;
    private String location;
    private Boolean active;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
