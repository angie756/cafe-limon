package com.cafelimon.model;

/**
 * Estados posibles de un pedido
 */
public enum OrderStatus {
    PENDING,         // Pedido recibido, esperando preparación
    EN_PREPARACION, // En proceso de preparación
    LISTO,          // Pedido listo para entregar
    ENTREGADO,      // Pedido entregado al cliente
    CANCELADO       // Pedido cancelado
}
