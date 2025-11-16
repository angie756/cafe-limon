package com.cafelimon;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Clase principal de la aplicación Café Limón
 *
 * Sistema de auto pedido mediante códigos QR para optimizar
 * la atención al cliente en Café Limón - El Carmen de Viboral, Antioquia.
 *
 * @author Angie Melissa Gutierrez Quintana
 * @version 1.0.0
 * @since 2025
 */
@SpringBootApplication
@EnableJpaAuditing
public class CafeLimonApplication {

    public static void main(String[] args) {
        SpringApplication.run(CafeLimonApplication.class, args);
        System.out.println("""

            ╔═══════════════════════════════════════════════════════════╗
            ║                                                           ║
            ║     ☕ Café Limón - Backend API Iniciado ☕               ║
            ║                                                           ║
            ║     Sistema de Auto Pedido mediante QR                   ║
            ║     El Carmen de Viboral, Antioquia                      ║
            ║                                                           ║
            ║     API: http://localhost:8080                           ║
            ║     Swagger UI: http://localhost:8080/swagger-ui.html    ║
            ║     API Docs: http://localhost:8080/api-docs             ║
            ║                                                           ║
            ║     Proyecto de Grado - Politécnico ASYS 2025           ║
            ║                                                           ║
            ╚═══════════════════════════════════════════════════════════╝

            """);
    }
}
