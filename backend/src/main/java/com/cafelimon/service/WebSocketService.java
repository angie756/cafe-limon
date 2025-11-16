package com.cafelimon.service;

import com.cafelimon.dto.order.OrderResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

/**
 * Servicio para enviar notificaciones WebSocket
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketService {

    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Notifica una nueva orden a todos los usuarios conectados
     */
    public void notifyNewOrder(OrderResponse order) {
        log.info("Enviando notificación de nueva orden: {}", order.getId());
        messagingTemplate.convertAndSend("/topic/orders/new", order);
    }

    /**
     * Notifica actualización de estado de orden
     */
    public void notifyOrderStatusUpdate(OrderResponse order) {
        log.info("Enviando notificación de actualización de orden: {} - Estado: {}",
                order.getId(), order.getStatus());
        messagingTemplate.convertAndSend("/topic/orders/updates", order);
    }

    /**
     * Notifica actualización de orden a una mesa específica
     */
    public void notifyOrderUpdateToTable(String tableId, OrderResponse order) {
        log.info("Enviando notificación de orden a mesa {}: {}", tableId, order.getId());
        messagingTemplate.convertAndSend("/topic/tables/" + tableId + "/orders", order);
    }

    /**
     * Notifica a la cocina sobre una nueva orden
     */
    public void notifyKitchen(OrderResponse order) {
        log.info("Notificando cocina sobre orden: {}", order.getId());
        messagingTemplate.convertAndSend("/topic/kitchen/orders", order);
    }
}
