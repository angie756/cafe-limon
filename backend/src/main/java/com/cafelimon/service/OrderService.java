package com.cafelimon.service;

import com.cafelimon.dto.order.CreateOrderRequest;
import com.cafelimon.dto.order.OrderItemResponse;
import com.cafelimon.dto.order.OrderResponse;
import com.cafelimon.dto.order.UpdateOrderStatusRequest;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.*;
import com.cafelimon.repository.OrderItemRepository;
import com.cafelimon.repository.OrderRepository;
import com.cafelimon.repository.ProductRepository;
import com.cafelimon.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de órdenes
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final TableRepository tableRepository;
    private final ProductRepository productRepository;
    private final ProductService productService;
    private final TableService tableService;
    private final WebSocketService webSocketService;

    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getActiveOrders() {
        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.PENDING,
                OrderStatus.EN_PREPARACION,
                OrderStatus.LISTO
        );
        return orderRepository.findActiveOrders(activeStatuses).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByTable(String tableId) {
        return orderRepository.findByTableId(tableId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<OrderResponse> getOrdersByDateRange(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.findByDateRange(startDate, endDate).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public Page<OrderResponse> getOrdersByDateRangePageable(LocalDateTime startDate, LocalDateTime endDate,
                                                             Pageable pageable) {
        return orderRepository.findByDateRangePageable(startDate, endDate, pageable)
                .map(this::toResponse);
    }

    public OrderResponse getOrderById(String id) {
        Order order = findOrderById(id);
        return toResponse(order);
    }

    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creando nueva orden para mesa: {}", request.getTableId());

        // Validar mesa
        Table table = tableRepository.findById(request.getTableId())
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con ID: " + request.getTableId()));

        // Crear orden
        Order order = Order.builder()
                .table(table)
                .customerName(request.getCustomerName())
                .status(OrderStatus.PENDING)
                .items(new ArrayList<>())
                .notes(request.getNotes())
                .build();

        // Crear items de la orden
        for (var itemRequest : request.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado con ID: " + itemRequest.getProductId()));

            if (!product.getAvailable()) {
                throw new IllegalArgumentException("Producto no disponible: " + product.getName());
            }

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .unitPrice(product.getPrice())
                    .notes(itemRequest.getNotes())
                    .build();

            orderItem.calculateSubtotal();
            order.getItems().add(orderItem);

            // Incrementar contador de pedidos del producto
            productService.incrementOrderCount(product.getId());
        }

        // Calcular total
        order.calculateTotal();

        order = orderRepository.save(order);
        log.info("Orden creada con ID: {} - Total: {}", order.getId(), order.getTotalAmount());

        OrderResponse orderResponse = toResponse(order);

        // Enviar notificaciones WebSocket
        webSocketService.notifyNewOrder(orderResponse);
        webSocketService.notifyKitchen(orderResponse);
        webSocketService.notifyOrderUpdateToTable(order.getTable().getId(), orderResponse);

        return orderResponse;
    }

    public OrderResponse updateOrderStatus(String id, UpdateOrderStatusRequest request) {
        log.info("Actualizando estado de orden {} a {}", id, request.getStatus());

        Order order = findOrderById(id);
        OrderStatus previousStatus = order.getStatus();
        order.setStatus(request.getStatus());

        // Actualizar timestamps según el estado
        switch (request.getStatus()) {
            case LISTO:
                if (order.getReadyAt() == null) {
                    order.setReadyAt(LocalDateTime.now());
                }
                break;
            case ENTREGADO:
                if (order.getDeliveredAt() == null) {
                    order.setDeliveredAt(LocalDateTime.now());
                }
                if (order.getReadyAt() == null) {
                    order.setReadyAt(LocalDateTime.now());
                }
                break;
            default:
                break;
        }

        order = orderRepository.save(order);
        log.info("Orden {} actualizada de {} a {}", id, previousStatus, request.getStatus());

        OrderResponse orderResponse = toResponse(order);

        // Enviar notificaciones WebSocket
        webSocketService.notifyOrderStatusUpdate(orderResponse);
        webSocketService.notifyOrderUpdateToTable(order.getTable().getId(), orderResponse);

        return orderResponse;
    }

    public void deleteOrder(String id) {
        log.info("Eliminando orden con ID: {}", id);
        Order order = findOrderById(id);
        orderRepository.delete(order);
        log.info("Orden eliminada: {}", id);
    }

    public Long countOrdersByStatus(OrderStatus status) {
        return orderRepository.countByStatus(status);
    }

    public Double getAveragePreparationTime() {
        Double avgTime = orderRepository.getAveragePreparationTimeInMinutes();
        return avgTime != null ? avgTime : 0.0;
    }

    private Order findOrderById(String id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Orden no encontrada con ID: " + id));
    }

    private OrderResponse toResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .table(tableService.getTableById(order.getTable().getId()))
                .customerName(order.getCustomerName())
                .status(order.getStatus())
                .items(order.getItems().stream()
                        .map(this::toItemResponse)
                        .collect(Collectors.toList()))
                .totalAmount(order.getTotalAmount())
                .notes(order.getNotes())
                .createdAt(order.getCreatedAt())
                .readyAt(order.getReadyAt())
                .deliveredAt(order.getDeliveredAt())
                .updatedAt(order.getUpdatedAt())
                .build();
    }

    private OrderItemResponse toItemResponse(OrderItem item) {
        return OrderItemResponse.builder()
                .id(item.getId())
                .product(productService.getProductById(item.getProduct().getId()))
                .quantity(item.getQuantity())
                .unitPrice(item.getUnitPrice())
                .subtotal(item.getSubtotal())
                .notes(item.getNotes())
                .build();
    }
}
