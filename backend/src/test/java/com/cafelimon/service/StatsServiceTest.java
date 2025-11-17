package com.cafelimon.service;

import com.cafelimon.dto.stats.StatsResponse;
import com.cafelimon.dto.stats.TopProductDTO;
import com.cafelimon.model.Order;
import com.cafelimon.model.OrderStatus;
import com.cafelimon.repository.OrderItemRepository;
import com.cafelimon.repository.OrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StatsServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @InjectMocks
    private StatsService statsService;

    private LocalDateTime startDate;
    private LocalDateTime endDate;

    @BeforeEach
    void setUp() {
        startDate = LocalDateTime.now().minusDays(7);
        endDate = LocalDateTime.now();
    }

    @Test
    void getStats_WithOrders_ShouldReturnStats() {
        List<Order> orders = Arrays.asList(new Order(), new Order(), new Order());

        when(orderRepository.findByDateRange(startDate, endDate)).thenReturn(orders);
        when(orderRepository.countByStatus(OrderStatus.PENDING)).thenReturn(5L);
        when(orderRepository.countByStatus(OrderStatus.EN_PREPARACION)).thenReturn(3L);
        when(orderRepository.countByStatus(OrderStatus.LISTO)).thenReturn(2L);
        when(orderRepository.getTotalRevenueByDateRange(startDate, endDate)).thenReturn(15000.0);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(12.5);

        Object[] topProduct1 = {"prod-1", "Cafe Americano", 100L};
        Object[] topProduct2 = {"prod-2", "Latte", 80L};
        when(orderItemRepository.getTopSellingProducts(startDate, endDate))
                .thenReturn(Arrays.asList(topProduct1, topProduct2));

        StatsResponse result = statsService.getStats(startDate, endDate);

        assertThat(result).isNotNull();
        assertThat(result.getTotalOrders()).isEqualTo(3L);
        assertThat(result.getPendingOrders()).isEqualTo(5L);
        assertThat(result.getPreparingOrders()).isEqualTo(3L);
        assertThat(result.getReadyOrders()).isEqualTo(2L);
        assertThat(result.getTotalRevenue()).isEqualByComparingTo(new BigDecimal("15000.0"));
        assertThat(result.getAveragePreparationTime()).isEqualTo(12.5);
        assertThat(result.getTopProducts()).hasSize(2);

        verify(orderRepository, times(1)).findByDateRange(startDate, endDate);
        verify(orderRepository, times(1)).countByStatus(OrderStatus.PENDING);
        verify(orderRepository, times(1)).countByStatus(OrderStatus.EN_PREPARACION);
        verify(orderRepository, times(1)).countByStatus(OrderStatus.LISTO);
        verify(orderRepository, times(1)).getTotalRevenueByDateRange(startDate, endDate);
        verify(orderRepository, times(1)).getAveragePreparationTimeInMinutes();
    }

    @Test
    void getStats_WithNoRevenue_ShouldReturnZeroRevenue() {
        when(orderRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(orderRepository.getTotalRevenueByDateRange(any(), any())).thenReturn(null);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(null);
        when(orderItemRepository.getTopSellingProducts(any(), any())).thenReturn(Collections.emptyList());

        StatsResponse result = statsService.getStats(startDate, endDate);

        assertThat(result).isNotNull();
        assertThat(result.getTotalRevenue()).isEqualByComparingTo(BigDecimal.ZERO);
        assertThat(result.getAveragePreparationTime()).isEqualTo(0.0);
    }

    @Test
    void getStats_WithNoPreparationTime_ShouldReturnZeroTime() {
        when(orderRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(orderRepository.getTotalRevenueByDateRange(any(), any())).thenReturn(0.0);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(null);
        when(orderItemRepository.getTopSellingProducts(any(), any())).thenReturn(Collections.emptyList());

        StatsResponse result = statsService.getStats(startDate, endDate);

        assertThat(result).isNotNull();
        assertThat(result.getAveragePreparationTime()).isEqualTo(0.0);
    }

    @Test
    void getTopSellingProducts_WithProducts_ShouldReturnTopProducts() {
        Object[] topProduct1 = {"prod-1", "Cafe Americano", 100L};
        Object[] topProduct2 = {"prod-2", "Latte", 80L};
        Object[] topProduct3 = {"prod-3", "Cappuccino", 60L};

        when(orderItemRepository.getTopSellingProducts(startDate, endDate))
                .thenReturn(Arrays.asList(topProduct1, topProduct2, topProduct3));

        List<TopProductDTO> result = statsService.getTopSellingProducts(startDate, endDate);

        assertThat(result).hasSize(3);
        assertThat(result.get(0).getProductId()).isEqualTo("prod-1");
        assertThat(result.get(0).getProductName()).isEqualTo("Cafe Americano");
        assertThat(result.get(0).getTotalQuantity()).isEqualTo(100L);
        assertThat(result.get(1).getProductId()).isEqualTo("prod-2");
        assertThat(result.get(2).getProductId()).isEqualTo("prod-3");

        verify(orderItemRepository, times(1)).getTopSellingProducts(startDate, endDate);
    }

    @Test
    void getTopSellingProducts_WithNoProducts_ShouldReturnEmptyList() {
        when(orderItemRepository.getTopSellingProducts(startDate, endDate))
                .thenReturn(Collections.emptyList());

        List<TopProductDTO> result = statsService.getTopSellingProducts(startDate, endDate);

        assertThat(result).isEmpty();
        verify(orderItemRepository, times(1)).getTopSellingProducts(startDate, endDate);
    }

    @Test
    void getTodayStats_ShouldCallGetStatsWithTodayRange() {
        when(orderRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(orderRepository.getTotalRevenueByDateRange(any(), any())).thenReturn(0.0);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(0.0);
        when(orderItemRepository.getTopSellingProducts(any(), any())).thenReturn(Collections.emptyList());

        StatsResponse result = statsService.getTodayStats();

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).findByDateRange(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    void getWeekStats_ShouldCallGetStatsWithWeekRange() {
        when(orderRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(orderRepository.getTotalRevenueByDateRange(any(), any())).thenReturn(0.0);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(0.0);
        when(orderItemRepository.getTopSellingProducts(any(), any())).thenReturn(Collections.emptyList());

        StatsResponse result = statsService.getWeekStats();

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).findByDateRange(any(LocalDateTime.class), any(LocalDateTime.class));
    }

    @Test
    void getMonthStats_ShouldCallGetStatsWithMonthRange() {
        when(orderRepository.findByDateRange(any(), any())).thenReturn(Collections.emptyList());
        when(orderRepository.countByStatus(any())).thenReturn(0L);
        when(orderRepository.getTotalRevenueByDateRange(any(), any())).thenReturn(0.0);
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(0.0);
        when(orderItemRepository.getTopSellingProducts(any(), any())).thenReturn(Collections.emptyList());

        StatsResponse result = statsService.getMonthStats();

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).findByDateRange(any(LocalDateTime.class), any(LocalDateTime.class));
    }
}
