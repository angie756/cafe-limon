package com.cafelimon.dto.stats;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para estadísticas del sistema
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {

    private Long totalOrders;
    private Long pendingOrders;
    private Long preparingOrders;
    private Long readyOrders;
    private BigDecimal totalRevenue;
    private Double averagePreparationTime;
    private List<TopProductDTO> topProducts;
}
