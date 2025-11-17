package com.cafelimon.controller;

import com.cafelimon.dto.stats.StatsResponse;
import com.cafelimon.dto.stats.TopProductDTO;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.service.StatsService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class StatsControllerTest {

    private MockMvc mockMvc;

    @Mock
    private StatsService statsService;

    @InjectMocks
    private StatsController statsController;

    private StatsResponse statsResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(statsController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();

        statsResponse = StatsResponse.builder()
                .totalOrders(100L)
                .totalRevenue(new BigDecimal("500000"))
                .averagePreparationTime(15.5)
                .build();
    }

    @Test
    void getTodayStats_ShouldReturnStats() throws Exception {
        when(statsService.getTodayStats()).thenReturn(statsResponse);

        mockMvc.perform(get("/api/stats/today"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.totalOrders").value(100));

        verify(statsService, times(1)).getTodayStats();
    }

    @Test
    void getWeekStats_ShouldReturnStats() throws Exception {
        when(statsService.getWeekStats()).thenReturn(statsResponse);

        mockMvc.perform(get("/api/stats/week"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(statsService, times(1)).getWeekStats();
    }

    @Test
    void getMonthStats_ShouldReturnStats() throws Exception {
        when(statsService.getMonthStats()).thenReturn(statsResponse);

        mockMvc.perform(get("/api/stats/month"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(statsService, times(1)).getMonthStats();
    }

    @Test
    void getTopProducts_ShouldReturnTopProducts() throws Exception {
        TopProductDTO topProduct = TopProductDTO.builder()
                .productId("prod-1")
                .productName("Cafe Americano")
                .totalQuantity(50L)
                .build();

        List<TopProductDTO> topProducts = Arrays.asList(topProduct);
        when(statsService.getTopSellingProducts(any(), any())).thenReturn(topProducts);

        mockMvc.perform(get("/api/stats/top-products")
                        .param("startDate", "2025-01-01T00:00:00")
                        .param("endDate", "2025-12-31T23:59:59"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(statsService, times(1)).getTopSellingProducts(any(), any());
    }
}
