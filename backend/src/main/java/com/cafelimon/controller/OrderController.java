package com.cafelimon.controller;

import com.cafelimon.dto.ApiResponse;
import com.cafelimon.dto.order.CreateOrderRequest;
import com.cafelimon.dto.order.OrderResponse;
import com.cafelimon.dto.order.UpdateOrderStatusRequest;
import com.cafelimon.model.OrderStatus;
import com.cafelimon.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Controller para gestión de órdenes
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Órdenes", description = "Endpoints para gestión de órdenes")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {

    private final OrderService orderService;

    @GetMapping
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Obtener todas las órdenes", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getAllOrders() {
        log.info("GET /api/orders");
        List<OrderResponse> orders = orderService.getAllOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/active")
    @Operation(summary = "Obtener órdenes activas")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getActiveOrders() {
        log.info("GET /api/orders/active");
        List<OrderResponse> orders = orderService.getActiveOrders();
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/status/{status}")
    @Operation(summary = "Obtener órdenes por estado")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByStatus(
            @PathVariable OrderStatus status) {
        log.info("GET /api/orders/status/{}", status);
        List<OrderResponse> orders = orderService.getOrdersByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/table/{tableId}")
    @Operation(summary = "Obtener órdenes de una mesa")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByTable(
            @PathVariable String tableId) {
        log.info("GET /api/orders/table/{}", tableId);
        List<OrderResponse> orders = orderService.getOrdersByTable(tableId);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/date-range")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Obtener órdenes por rango de fechas", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getOrdersByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.info("GET /api/orders/date-range?startDate={}&endDate={}", startDate, endDate);
        List<OrderResponse> orders = orderService.getOrdersByDateRange(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/date-range/pageable")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Obtener órdenes paginadas por rango de fechas", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<Page<OrderResponse>>> getOrdersByDateRangePageable(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate,
            Pageable pageable) {
        log.info("GET /api/orders/date-range/pageable?startDate={}&endDate={}", startDate, endDate);
        Page<OrderResponse> orders = orderService.getOrdersByDateRangePageable(startDate, endDate, pageable);
        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener orden por ID")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable String id) {
        log.info("GET /api/orders/{}", id);
        OrderResponse order = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(order));
    }

    @PostMapping
    @Operation(summary = "Crear nueva orden")
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        log.info("POST /api/orders - Mesa: {}", request.getTableId());
        OrderResponse order = orderService.createOrder(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Orden creada exitosamente", order));
    }

    @PatchMapping("/{id}/status")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Actualizar estado de orden", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrderStatus(
            @PathVariable String id,
            @Valid @RequestBody UpdateOrderStatusRequest request) {
        log.info("PATCH /api/orders/{}/status - Nuevo estado: {}", id, request.getStatus());
        OrderResponse order = orderService.updateOrderStatus(id, request);
        return ResponseEntity.ok(ApiResponse.success("Estado de orden actualizado exitosamente", order));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Eliminar orden", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<Void>> deleteOrder(@PathVariable String id) {
        log.info("DELETE /api/orders/{}", id);
        orderService.deleteOrder(id);
        return ResponseEntity.ok(ApiResponse.success("Orden eliminada exitosamente", null));
    }
}
