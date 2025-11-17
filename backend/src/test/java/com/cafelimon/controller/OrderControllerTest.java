package com.cafelimon.controller;

import com.cafelimon.dto.order.CreateOrderRequest;
import com.cafelimon.dto.order.OrderItemRequest;
import com.cafelimon.dto.order.OrderResponse;
import com.cafelimon.dto.order.UpdateOrderStatusRequest;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.model.OrderStatus;
import com.cafelimon.service.OrderService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class OrderControllerTest {

    private MockMvc mockMvc;

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private ObjectMapper objectMapper;
    private OrderResponse orderResponse;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(orderController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        orderResponse = OrderResponse.builder()
                .id("order-1")
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("5000"))
                .build();
    }

    @Test
    void getAllOrders_ShouldReturnOrders() throws Exception {
        List<OrderResponse> orders = Arrays.asList(orderResponse);
        when(orderService.getAllOrders()).thenReturn(orders);

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(orderService, times(1)).getAllOrders();
    }

    @Test
    void getActiveOrders_ShouldReturnActiveOrders() throws Exception {
        List<OrderResponse> orders = Arrays.asList(orderResponse);
        when(orderService.getActiveOrders()).thenReturn(orders);

        mockMvc.perform(get("/api/orders/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).getActiveOrders();
    }

    @Test
    void getOrdersByStatus_ShouldReturnOrders() throws Exception {
        List<OrderResponse> orders = Arrays.asList(orderResponse);
        when(orderService.getOrdersByStatus(OrderStatus.PENDING)).thenReturn(orders);

        mockMvc.perform(get("/api/orders/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).getOrdersByStatus(OrderStatus.PENDING);
    }

    @Test
    void getOrdersByTable_ShouldReturnOrders() throws Exception {
        List<OrderResponse> orders = Arrays.asList(orderResponse);
        when(orderService.getOrdersByTable("table-1")).thenReturn(orders);

        mockMvc.perform(get("/api/orders/table/table-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).getOrdersByTable("table-1");
    }

    @Test
    void getOrderById_ShouldReturnOrder() throws Exception {
        when(orderService.getOrderById("order-1")).thenReturn(orderResponse);

        mockMvc.perform(get("/api/orders/order-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("order-1"));

        verify(orderService, times(1)).getOrderById("order-1");
    }

    @Test
    void createOrder_ShouldCreateOrder() throws Exception {
        OrderItemRequest item = new OrderItemRequest();
        item.setProductId("prod-1");
        item.setQuantity(2);

        CreateOrderRequest request = new CreateOrderRequest();
        request.setTableId("table-1");
        request.setItems(Arrays.asList(item));
        when(orderService.createOrder(any(CreateOrderRequest.class))).thenReturn(orderResponse);

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).createOrder(any(CreateOrderRequest.class));
    }

    @Test
    void updateOrderStatus_ShouldUpdateStatus() throws Exception {
        UpdateOrderStatusRequest request = new UpdateOrderStatusRequest();
        request.setStatus(OrderStatus.LISTO);
        when(orderService.updateOrderStatus(anyString(), any(UpdateOrderStatusRequest.class))).thenReturn(orderResponse);

        mockMvc.perform(patch("/api/orders/order-1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).updateOrderStatus(anyString(), any(UpdateOrderStatusRequest.class));
    }

    @Test
    void deleteOrder_ShouldDeleteOrder() throws Exception {
        doNothing().when(orderService).deleteOrder("order-1");

        mockMvc.perform(delete("/api/orders/order-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(orderService, times(1)).deleteOrder("order-1");
    }
}
