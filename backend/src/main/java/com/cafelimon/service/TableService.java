package com.cafelimon.service;

import com.cafelimon.dto.table.QRCodeResponse;
import com.cafelimon.dto.table.TableRequest;
import com.cafelimon.dto.table.TableResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Table;
import com.cafelimon.repository.TableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio para gestión de mesas
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class TableService {

    private final TableRepository tableRepository;
    private final QRCodeService qrCodeService;

    public List<TableResponse> getAllTables() {
        return tableRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TableResponse> getActiveTables() {
        return tableRepository.findByActiveTrueOrderByNumberAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TableResponse getTableById(String id) {
        Table table = findTableById(id);
        return toResponse(table);
    }

    public TableResponse getTableByNumber(String number) {
        Table table = tableRepository.findByNumber(number)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con número: " + number));
        return toResponse(table);
    }

    public TableResponse createTable(TableRequest request) {
        log.info("Creando nueva mesa: {}", request.getNumber());

        if (tableRepository.existsByNumber(request.getNumber())) {
            throw new IllegalArgumentException("Ya existe una mesa con el número: " + request.getNumber());
        }

        Table table = Table.builder()
                .number(request.getNumber())
                .capacity(request.getCapacity())
                .location(request.getLocation())
                .active(request.getActive())
                .build();

        table = tableRepository.save(table);

        // Generar código QR para la mesa
        String qrCode = qrCodeService.generateQRCode(table.getId());
        table.setQrCode(qrCode);
        table = tableRepository.save(table);

        log.info("Mesa creada con ID: {} y QR code generado", table.getId());

        return toResponse(table);
    }

    public TableResponse updateTable(String id, TableRequest request) {
        log.info("Actualizando mesa con ID: {}", id);

        Table table = findTableById(id);

        if (!table.getNumber().equals(request.getNumber()) &&
                tableRepository.existsByNumber(request.getNumber())) {
            throw new IllegalArgumentException("Ya existe una mesa con el número: " + request.getNumber());
        }

        table.setNumber(request.getNumber());
        table.setCapacity(request.getCapacity());
        table.setLocation(request.getLocation());
        table.setActive(request.getActive());

        table = tableRepository.save(table);
        log.info("Mesa actualizada: {}", table.getId());

        return toResponse(table);
    }

    public void deleteTable(String id) {
        log.info("Eliminando mesa con ID: {}", id);
        Table table = findTableById(id);
        tableRepository.delete(table);
        log.info("Mesa eliminada: {}", id);
    }

    public QRCodeResponse regenerateQRCode(String id) {
        log.info("Regenerando QR code para mesa con ID: {}", id);

        Table table = findTableById(id);
        String newQRCode = qrCodeService.regenerateQRCode(table.getId());
        table.setQrCode(newQRCode);
        tableRepository.save(table);

        log.info("QR code regenerado para mesa: {}", id);

        return QRCodeResponse.builder()
                .tableId(table.getId())
                .tableNumber(table.getNumber())
                .qrCode(newQRCode)
                .menuUrl(qrCodeService.generateMenuUrl(table.getId()))
                .build();
    }

    public QRCodeResponse getQRCode(String id) {
        Table table = findTableById(id);
        return QRCodeResponse.builder()
                .tableId(table.getId())
                .tableNumber(table.getNumber())
                .qrCode(table.getQrCode())
                .menuUrl(qrCodeService.generateMenuUrl(table.getId()))
                .build();
    }

    private Table findTableById(String id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mesa no encontrada con ID: " + id));
    }

    private TableResponse toResponse(Table table) {
        return TableResponse.builder()
                .id(table.getId())
                .number(table.getNumber())
                .capacity(table.getCapacity())
                .qrCode(table.getQrCode())
                .location(table.getLocation())
                .active(table.getActive())
                .createdAt(table.getCreatedAt())
                .updatedAt(table.getUpdatedAt())
                .build();
    }
}
