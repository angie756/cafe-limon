package com.cafelimon.controller;

import com.cafelimon.dto.ApiResponse;
import com.cafelimon.dto.table.QRCodeResponse;
import com.cafelimon.dto.table.TableRequest;
import com.cafelimon.dto.table.TableResponse;
import com.cafelimon.service.TableService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller para gestión de mesas
 */
@RestController
@RequestMapping("/api/tables")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Mesas", description = "Endpoints para gestión de mesas y códigos QR")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TableController {

    private final TableService tableService;

    @GetMapping
    @Operation(summary = "Obtener todas las mesas")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getAllTables() {
        log.info("GET /api/tables");
        List<TableResponse> tables = tableService.getAllTables();
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/active")
    @Operation(summary = "Obtener mesas activas")
    public ResponseEntity<ApiResponse<List<TableResponse>>> getActiveTables() {
        log.info("GET /api/tables/active");
        List<TableResponse> tables = tableService.getActiveTables();
        return ResponseEntity.ok(ApiResponse.success(tables));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Obtener mesa por ID")
    public ResponseEntity<ApiResponse<TableResponse>> getTableById(@PathVariable String id) {
        log.info("GET /api/tables/{}", id);
        TableResponse table = tableService.getTableById(id);
        return ResponseEntity.ok(ApiResponse.success(table));
    }

    @GetMapping("/number/{number}")
    @Operation(summary = "Obtener mesa por número")
    public ResponseEntity<ApiResponse<TableResponse>> getTableByNumber(@PathVariable String number) {
        log.info("GET /api/tables/number/{}", number);
        TableResponse table = tableService.getTableByNumber(number);
        return ResponseEntity.ok(ApiResponse.success(table));
    }

    @GetMapping("/{id}/qr")
    @Operation(summary = "Obtener código QR de una mesa")
    public ResponseEntity<ApiResponse<QRCodeResponse>> getQRCode(@PathVariable String id) {
        log.info("GET /api/tables/{}/qr", id);
        QRCodeResponse qrCode = tableService.getQRCode(id);
        return ResponseEntity.ok(ApiResponse.success(qrCode));
    }

    @PostMapping
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Crear nueva mesa", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<TableResponse>> createTable(
            @Valid @RequestBody TableRequest request) {
        log.info("POST /api/tables - Número: {}", request.getNumber());
        TableResponse table = tableService.createTable(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Mesa creada exitosamente", table));
    }

    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Actualizar mesa", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<TableResponse>> updateTable(
            @PathVariable String id,
            @Valid @RequestBody TableRequest request) {
        log.info("PUT /api/tables/{}", id);
        TableResponse table = tableService.updateTable(id, request);
        return ResponseEntity.ok(ApiResponse.success("Mesa actualizada exitosamente", table));
    }

    @PostMapping("/{id}/regenerate-qr")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Regenerar código QR de una mesa", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<QRCodeResponse>> regenerateQRCode(@PathVariable String id) {
        log.info("POST /api/tables/{}/regenerate-qr", id);
        QRCodeResponse qrCode = tableService.regenerateQRCode(id);
        return ResponseEntity.ok(ApiResponse.success("Código QR regenerado exitosamente", qrCode));
    }

    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearer-key")
    @Operation(summary = "Eliminar mesa", description = "Requiere autenticación")
    public ResponseEntity<ApiResponse<Void>> deleteTable(@PathVariable String id) {
        log.info("DELETE /api/tables/{}", id);
        tableService.deleteTable(id);
        return ResponseEntity.ok(ApiResponse.success("Mesa eliminada exitosamente", null));
    }
}
