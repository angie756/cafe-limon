package com.cafelimon.controller;

import com.cafelimon.dto.ApiResponse;
import com.cafelimon.dto.stats.StatsResponse;
import com.cafelimon.dto.stats.TopProductDTO;
import com.cafelimon.service.StatsService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller para estadísticas
 */
@RestController
@RequestMapping("/api/stats")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Estadísticas", description = "Endpoints para obtener estadísticas y reportes")
@CrossOrigin(origins = "*", maxAge = 3600)
@SecurityRequirement(name = "bearer-key")
public class StatsController {

    private final StatsService statsService;

    @GetMapping
    @Operation(summary = "Obtener estadísticas por rango de fechas", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<StatsResponse>> getStats(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("GET /api/stats?startDate={}&endDate={}", startDate, endDate);
        StatsResponse stats = statsService.getStats(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/today")
    @Operation(summary = "Obtener estadísticas del día actual", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<StatsResponse>> getTodayStats() {
        log.info("GET /api/stats/today");
        StatsResponse stats = statsService.getTodayStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/week")
    @Operation(summary = "Obtener estadísticas de la última semana", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<StatsResponse>> getWeekStats() {
        log.info("GET /api/stats/week");
        StatsResponse stats = statsService.getWeekStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/month")
    @Operation(summary = "Obtener estadísticas del último mes", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<StatsResponse>> getMonthStats() {
        log.info("GET /api/stats/month");
        StatsResponse stats = statsService.getMonthStats();
        return ResponseEntity.ok(ApiResponse.success(stats));
    }

    @GetMapping("/top-products")
    @Operation(summary = "Obtener productos más vendidos", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<List<TopProductDTO>>> getTopProducts(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("GET /api/stats/top-products?startDate={}&endDate={}", startDate, endDate);
        List<TopProductDTO> topProducts = statsService.getTopSellingProducts(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(topProducts));
    }
}
