package com.cafelimon.service;

import com.cafelimon.dto.order.OrderResponse;
import com.cafelimon.model.OrderStatus;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.messaging.simp.SimpMessagingTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WebSocketServiceTest {

    @Mock
    private SimpMessagingTemplate messagingTemplate;

    @InjectMocks
    private WebSocketService webSocketService;

    private OrderResponse orderResponse;

    @BeforeEach
    void setUp() {
        orderResponse = OrderResponse.builder()
                .id("order-123")
                .status(OrderStatus.PENDING)
                .totalAmount(new BigDecimal("15000"))
                .customerName("Juan Perez")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void notifyNewOrder_ShouldSendMessageToNewOrdersTopic() {
        webSocketService.notifyNewOrder(orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/orders/new", orderResponse);
    }

    @Test
    void notifyNewOrder_WithMultipleOrders_ShouldSendMultipleMessages() {
        OrderResponse order1 = OrderResponse.builder().id("order-1").build();
        OrderResponse order2 = OrderResponse.builder().id("order-2").build();

        webSocketService.notifyNewOrder(order1);
        webSocketService.notifyNewOrder(order2);

        verify(messagingTemplate, times(2))
                .convertAndSend(eq("/topic/orders/new"), any(OrderResponse.class));
    }

    @Test
    void notifyOrderStatusUpdate_ShouldSendMessageToUpdatesTopic() {
        orderResponse = OrderResponse.builder()
                .id("order-123")
                .status(OrderStatus.EN_PREPARACION)
                .build();

        webSocketService.notifyOrderStatusUpdate(orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/orders/updates", orderResponse);
    }

    @Test
    void notifyOrderStatusUpdate_WithDifferentStatuses_ShouldSendMessages() {
        OrderResponse pendingOrder = OrderResponse.builder()
                .id("order-1")
                .status(OrderStatus.PENDING)
                .build();

        OrderResponse preparingOrder = OrderResponse.builder()
                .id("order-2")
                .status(OrderStatus.EN_PREPARACION)
                .build();

        OrderResponse readyOrder = OrderResponse.builder()
                .id("order-3")
                .status(OrderStatus.LISTO)
                .build();

        webSocketService.notifyOrderStatusUpdate(pendingOrder);
        webSocketService.notifyOrderStatusUpdate(preparingOrder);
        webSocketService.notifyOrderStatusUpdate(readyOrder);

        verify(messagingTemplate, times(3))
                .convertAndSend(eq("/topic/orders/updates"), any(OrderResponse.class));
    }

    @Test
    void notifyOrderUpdateToTable_ShouldSendMessageToTableSpecificTopic() {
        webSocketService.notifyOrderUpdateToTable("table-1", orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/table-1/orders", orderResponse);
    }

    @Test
    void notifyOrderUpdateToTable_WithDifferentTables_ShouldSendToDifferentTopics() {
        webSocketService.notifyOrderUpdateToTable("table-1", orderResponse);
        webSocketService.notifyOrderUpdateToTable("table-2", orderResponse);
        webSocketService.notifyOrderUpdateToTable("table-5", orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/table-1/orders", orderResponse);
        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/table-2/orders", orderResponse);
        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/table-5/orders", orderResponse);
    }

    @Test
    void notifyKitchen_ShouldSendMessageToKitchenTopic() {
        webSocketService.notifyKitchen(orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/kitchen/orders", orderResponse);
    }

    @Test
    void notifyKitchen_WithMultipleOrders_ShouldSendMultipleMessages() {
        OrderResponse order1 = OrderResponse.builder().id("order-1").build();
        OrderResponse order2 = OrderResponse.builder().id("order-2").build();
        OrderResponse order3 = OrderResponse.builder().id("order-3").build();

        webSocketService.notifyKitchen(order1);
        webSocketService.notifyKitchen(order2);
        webSocketService.notifyKitchen(order3);

        verify(messagingTemplate, times(3))
                .convertAndSend(eq("/topic/kitchen/orders"), any(OrderResponse.class));
    }

    @Test
    void allNotificationMethods_ShouldWorkWithSameOrder() {
        webSocketService.notifyNewOrder(orderResponse);
        webSocketService.notifyOrderStatusUpdate(orderResponse);
        webSocketService.notifyOrderUpdateToTable("table-1", orderResponse);
        webSocketService.notifyKitchen(orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/orders/new", orderResponse);
        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/orders/updates", orderResponse);
        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/table-1/orders", orderResponse);
        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/kitchen/orders", orderResponse);
    }

    @Test
    void notifyOrderUpdateToTable_WithEmptyTableId_ShouldStillSendMessage() {
        webSocketService.notifyOrderUpdateToTable("", orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables//orders", orderResponse);
    }

    @Test
    void notifyOrderUpdateToTable_WithNullTableId_ShouldStillSendMessage() {
        webSocketService.notifyOrderUpdateToTable(null, orderResponse);

        verify(messagingTemplate, times(1))
                .convertAndSend("/topic/tables/null/orders", orderResponse);
    }
}
