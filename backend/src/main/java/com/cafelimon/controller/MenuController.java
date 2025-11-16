package com.cafelimon.controller;

import com.cafelimon.dto.ApiResponse;
import com.cafelimon.dto.menu.MenuResponse;
import com.cafelimon.service.MenuService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controller para el menú
 */
@RestController
@RequestMapping("/api/menu")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Menú", description = "Endpoints para obtener el menú del café")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MenuController {

    private final MenuService menuService;

    @GetMapping
    @Operation(summary = "Obtener menú completo", description = "Retorna todas las categorías y productos activos")
    public ResponseEntity<ApiResponse<MenuResponse>> getFullMenu() {
        log.info("GET /api/menu");
        MenuResponse menu = menuService.getFullMenu();
        return ResponseEntity.ok(ApiResponse.success(menu));
    }

    @GetMapping("/table/{tableId}")
    @Operation(summary = "Obtener menú para una mesa específica")
    public ResponseEntity<ApiResponse<MenuResponse>> getMenuForTable(@PathVariable String tableId) {
        log.info("GET /api/menu/table/{}", tableId);
        MenuResponse menu = menuService.getMenuForTable(tableId);
        return ResponseEntity.ok(ApiResponse.success(menu));
    }
}
