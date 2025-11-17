package com.cafelimon.service;

import com.cafelimon.dto.order.*;
import com.cafelimon.dto.product.ProductResponse;
import com.cafelimon.dto.table.TableResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.*;
import com.cafelimon.repository.OrderItemRepository;
import com.cafelimon.repository.OrderRepository;
import com.cafelimon.repository.ProductRepository;
import com.cafelimon.repository.TableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.util.ReflectionTestUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private TableRepository tableRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private ProductService productService;

    @Mock
    private TableService tableService;

    @Mock
    private WebSocketService webSocketService;

    @InjectMocks
    private OrderService orderService;

    private Order order;
    private com.cafelimon.model.Table table;
    private Product product;
    private OrderItem orderItem;
    private TableResponse tableResponse;
    private ProductResponse productResponse;

    @BeforeEach
    void setUp() {
        table = com.cafelimon.model.Table.builder()
                .number("1")
                .capacity(4)
                .active(true)
                .build();
        ReflectionTestUtils.setField(table, "id", "table-1");

        tableResponse = TableResponse.builder()
                .id("table-1")
                .number("1")
                .capacity(4)
                .active(true)
                .build();

        Category category = Category.builder()
                .name("Bebidas")
                .build();
        ReflectionTestUtils.setField(category, "id", "cat-1");

        product = Product.builder()
                .name("Café")
                .price(new BigDecimal("2500"))
                .category(category)
                .available(true)
                .orderCount(0L)
                .build();
        ReflectionTestUtils.setField(product, "id", "prod-1");

        productResponse = ProductResponse.builder()
                .id("prod-1")
                .name("Café")
                .price(new BigDecimal("2500"))
                .available(true)
                .build();

        orderItem = OrderItem.builder()
                .product(product)
                .quantity(2)
                .unitPrice(new BigDecimal("2500"))
                .subtotal(new BigDecimal("5000"))
                .build();
        ReflectionTestUtils.setField(orderItem, "id", "item-1");

        order = Order.builder()
                .table(table)
                .customerName("Cliente Test")
                .status(OrderStatus.PENDING)
                .items(Arrays.asList(orderItem))
                .totalAmount(new BigDecimal("5000"))
                .build();
        ReflectionTestUtils.setField(order, "id", "order-1");

        orderItem.setOrder(order);
    }

    @Test
    void getAllOrders_ShouldReturnAllOrders() {
        when(orderRepository.findAll()).thenReturn(Arrays.asList(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        List<OrderResponse> result = orderService.getAllOrders();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo("order-1");
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void getActiveOrders_ShouldReturnOnlyActiveOrders() {
        List<OrderStatus> activeStatuses = Arrays.asList(
                OrderStatus.PENDING,
                OrderStatus.EN_PREPARACION,
                OrderStatus.LISTO
        );
        when(orderRepository.findActiveOrders(activeStatuses)).thenReturn(Arrays.asList(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        List<OrderResponse> result = orderService.getActiveOrders();

        assertThat(result).hasSize(1);
        verify(orderRepository, times(1)).findActiveOrders(activeStatuses);
    }

    @Test
    void getOrdersByStatus_ShouldReturnOrdersWithStatus() {
        when(orderRepository.findByStatus(OrderStatus.PENDING)).thenReturn(Arrays.asList(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        List<OrderResponse> result = orderService.getOrdersByStatus(OrderStatus.PENDING);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(OrderStatus.PENDING);
        verify(orderRepository, times(1)).findByStatus(OrderStatus.PENDING);
    }

    @Test
    void getOrdersByTable_ShouldReturnOrdersForTable() {
        when(orderRepository.findByTableId("table-1")).thenReturn(Arrays.asList(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        List<OrderResponse> result = orderService.getOrdersByTable("table-1");

        assertThat(result).hasSize(1);
        verify(orderRepository, times(1)).findByTableId("table-1");
    }

    @Test
    void getOrdersByDateRange_ShouldReturnOrdersInRange() {
        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now();

        when(orderRepository.findByDateRange(start, end)).thenReturn(Arrays.asList(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        List<OrderResponse> result = orderService.getOrdersByDateRange(start, end);

        assertThat(result).hasSize(1);
        verify(orderRepository, times(1)).findByDateRange(start, end);
    }

    @Test
    void getOrdersByDateRangePageable_ShouldReturnPagedOrders() {
        LocalDateTime start = LocalDateTime.now().minusDays(1);
        LocalDateTime end = LocalDateTime.now();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Order> page = new PageImpl<>(Arrays.asList(order));

        when(orderRepository.findByDateRangePageable(start, end, pageable)).thenReturn(page);
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        Page<OrderResponse> result = orderService.getOrdersByDateRangePageable(start, end, pageable);

        assertThat(result.getContent()).hasSize(1);
        verify(orderRepository, times(1)).findByDateRangePageable(start, end, pageable);
    }

    @Test
    void getOrderById_WhenOrderExists_ShouldReturnOrder() {
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);

        OrderResponse result = orderService.getOrderById("order-1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("order-1");
        verify(orderRepository, times(1)).findById("order-1");
    }

    @Test
    void getOrderById_WhenOrderNotFound_ShouldThrowException() {
        when(orderRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getOrderById("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Orden no encontrada con ID: invalid-id");
    }

    @Test
    void createOrder_WithValidData_ShouldCreateOrder() {
        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId("prod-1");
        itemRequest.setQuantity(2);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setTableId("table-1");
        request.setCustomerName("Cliente Test");
        request.setItems(Arrays.asList(itemRequest));

        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table));
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);
        doNothing().when(productService).incrementOrderCount(anyString());
        doNothing().when(webSocketService).notifyNewOrder(any());
        doNothing().when(webSocketService).notifyKitchen(any());
        doNothing().when(webSocketService).notifyOrderUpdateToTable(anyString(), any());

        OrderResponse result = orderService.createOrder(request);

        assertThat(result).isNotNull();
        verify(tableRepository, times(1)).findById("table-1");
        verify(productRepository, times(1)).findById("prod-1");
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(productService, times(1)).incrementOrderCount("prod-1");
        verify(webSocketService, times(1)).notifyNewOrder(any());
        verify(webSocketService, times(1)).notifyKitchen(any());
        verify(webSocketService, times(1)).notifyOrderUpdateToTable(anyString(), any());
    }

    @Test
    void createOrder_WithInvalidTable_ShouldThrowException() {
        CreateOrderRequest request = new CreateOrderRequest();
        request.setTableId("invalid-table");
        request.setItems(Collections.emptyList());

        when(tableRepository.findById("invalid-table")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.createOrder(request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-table");
    }

    @Test
    void createOrder_WithUnavailableProduct_ShouldThrowException() {
        product.setAvailable(false);

        OrderItemRequest itemRequest = new OrderItemRequest();
        itemRequest.setProductId("prod-1");
        itemRequest.setQuantity(2);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setTableId("table-1");
        request.setItems(Arrays.asList(itemRequest));

        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table));
        when(productRepository.findById("prod-1")).thenReturn(Optional.of(product));

        assertThatThrownBy(() -> orderService.createOrder(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Producto no disponible: Café");
    }

    @Test
    void updateOrderStatus_ToListo_ShouldSetReadyAt() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.LISTO);

        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);
        doNothing().when(webSocketService).notifyOrderStatusUpdate(any());
        doNothing().when(webSocketService).notifyOrderUpdateToTable(anyString(), any());

        OrderResponse result = orderService.updateOrderStatus("order-1", request);

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).save(any(Order.class));
        verify(webSocketService, times(1)).notifyOrderStatusUpdate(any());
    }

    @Test
    void updateOrderStatus_ToEntregado_ShouldSetDeliveredAt() {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.ENTREGADO);

        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);
        when(tableService.getTableById(anyString())).thenReturn(tableResponse);
        when(productService.getProductById(anyString())).thenReturn(productResponse);
        doNothing().when(webSocketService).notifyOrderStatusUpdate(any());
        doNothing().when(webSocketService).notifyOrderUpdateToTable(anyString(), any());

        OrderResponse result = orderService.updateOrderStatus("order-1", request);

        assertThat(result).isNotNull();
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void deleteOrder_WhenOrderExists_ShouldDeleteOrder() {
        when(orderRepository.findById("order-1")).thenReturn(Optional.of(order));

        orderService.deleteOrder("order-1");

        verify(orderRepository, times(1)).delete(order);
    }

    @Test
    void deleteOrder_WhenOrderNotFound_ShouldThrowException() {
        when(orderRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.deleteOrder("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void countOrdersByStatus_ShouldReturnCount() {
        when(orderRepository.countByStatus(OrderStatus.PENDING)).thenReturn(5L);

        Long count = orderService.countOrdersByStatus(OrderStatus.PENDING);

        assertThat(count).isEqualTo(5L);
        verify(orderRepository, times(1)).countByStatus(OrderStatus.PENDING);
    }

    @Test
    void getAveragePreparationTime_WhenDataExists_ShouldReturnAverage() {
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(15.5);

        Double avgTime = orderService.getAveragePreparationTime();

        assertThat(avgTime).isEqualTo(15.5);
    }

    @Test
    void getAveragePreparationTime_WhenNoData_ShouldReturnZero() {
        when(orderRepository.getAveragePreparationTimeInMinutes()).thenReturn(null);

        Double avgTime = orderService.getAveragePreparationTime();

        assertThat(avgTime).isEqualTo(0.0);
    }
}
