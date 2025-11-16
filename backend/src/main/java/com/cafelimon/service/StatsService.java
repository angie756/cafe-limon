package com.cafelimon.service;

import com.cafelimon.dto.stats.StatsResponse;
import com.cafelimon.dto.stats.TopProductDTO;
import com.cafelimon.model.OrderStatus;
import com.cafelimon.repository.OrderItemRepository;
import com.cafelimon.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para estadísticas y reportes
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional(readOnly = true)
public class StatsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public StatsResponse getStats(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Obteniendo estadísticas desde {} hasta {}", startDate, endDate);

        Long totalOrders = orderRepository.findByDateRange(startDate, endDate).stream().count();
        Long pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING);
        Long preparingOrders = orderRepository.countByStatus(OrderStatus.EN_PREPARACION);
        Long readyOrders = orderRepository.countByStatus(OrderStatus.LISTO);

        Double totalRevenue = orderRepository.getTotalRevenueByDateRange(startDate, endDate);
        BigDecimal revenue = totalRevenue != null ? BigDecimal.valueOf(totalRevenue) : BigDecimal.ZERO;

        Double avgPreparationTime = orderRepository.getAveragePreparationTimeInMinutes();
        Double preparationTime = avgPreparationTime != null ? avgPreparationTime : 0.0;

        List<TopProductDTO> topProducts = getTopSellingProducts(startDate, endDate);

        return StatsResponse.builder()
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .preparingOrders(preparingOrders)
                .readyOrders(readyOrders)
                .totalRevenue(revenue)
                .averagePreparationTime(preparationTime)
                .topProducts(topProducts)
                .build();
    }

    public List<TopProductDTO> getTopSellingProducts(LocalDateTime startDate, LocalDateTime endDate) {
        log.info("Obteniendo productos más vendidos desde {} hasta {}", startDate, endDate);

        return orderItemRepository.getTopSellingProducts(startDate, endDate).stream()
                .map(result -> TopProductDTO.builder()
                        .productId((String) result[0])
                        .productName((String) result[1])
                        .totalQuantity((Long) result[2])
                        .build())
                .collect(Collectors.toList());
    }

    public StatsResponse getTodayStats() {
        LocalDateTime startOfDay = LocalDateTime.now().withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfDay = LocalDateTime.now().withHour(23).withMinute(59).withSecond(59);
        return getStats(startOfDay, endOfDay);
    }

    public StatsResponse getWeekStats() {
        LocalDateTime startOfWeek = LocalDateTime.now().minusDays(7);
        LocalDateTime now = LocalDateTime.now();
        return getStats(startOfWeek, now);
    }

    public StatsResponse getMonthStats() {
        LocalDateTime startOfMonth = LocalDateTime.now().minusDays(30);
        LocalDateTime now = LocalDateTime.now();
        return getStats(startOfMonth, now);
    }
}
