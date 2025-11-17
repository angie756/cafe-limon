package com.cafelimon.controller;

import com.cafelimon.dto.table.QRCodeResponse;
import com.cafelimon.dto.table.TableRequest;
import com.cafelimon.dto.table.TableResponse;
import com.cafelimon.exception.GlobalExceptionHandler;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.service.TableService;
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

import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@ExtendWith(MockitoExtension.class)
class TableControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TableService tableService;

    @InjectMocks
    private TableController tableController;

    private ObjectMapper objectMapper;
    private TableResponse tableResponse;
    private TableRequest tableRequest;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(tableController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        objectMapper = new ObjectMapper();

        tableResponse = TableResponse.builder()
                .id("table-1")
                .number("1")
                .capacity(4)
                .active(true)
                .build();

        tableRequest = new TableRequest();
        tableRequest.setNumber("5");
        tableRequest.setCapacity(6);
        tableRequest.setActive(true);
    }

    @Test
    void getAllTables_ShouldReturnTables() throws Exception {
        List<TableResponse> tables = Arrays.asList(tableResponse);
        when(tableService.getAllTables()).thenReturn(tables);

        mockMvc.perform(get("/api/tables"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data").isArray());

        verify(tableService, times(1)).getAllTables();
    }

    @Test
    void getActiveTables_ShouldReturnActiveTables() throws Exception {
        List<TableResponse> tables = Arrays.asList(tableResponse);
        when(tableService.getActiveTables()).thenReturn(tables);

        mockMvc.perform(get("/api/tables/active"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(tableService, times(1)).getActiveTables();
    }

    @Test
    void getTableById_ShouldReturnTable() throws Exception {
        when(tableService.getTableById("table-1")).thenReturn(tableResponse);

        mockMvc.perform(get("/api/tables/table-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.id").value("table-1"));

        verify(tableService, times(1)).getTableById("table-1");
    }

    @Test
    void getTableById_WhenNotFound_ShouldReturnNotFound() throws Exception {
        when(tableService.getTableById("invalid")).thenThrow(new ResourceNotFoundException("Mesa no encontrada"));

        mockMvc.perform(get("/api/tables/invalid"))
                .andExpect(status().isNotFound());
    }

    @Test
    void createTable_ShouldCreateTable() throws Exception {
        when(tableService.createTable(any(TableRequest.class))).thenReturn(tableResponse);

        mockMvc.perform(post("/api/tables")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tableRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true));

        verify(tableService, times(1)).createTable(any(TableRequest.class));
    }

    @Test
    void updateTable_ShouldUpdateTable() throws Exception {
        when(tableService.updateTable(anyString(), any(TableRequest.class))).thenReturn(tableResponse);

        mockMvc.perform(put("/api/tables/table-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tableRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(tableService, times(1)).updateTable(anyString(), any(TableRequest.class));
    }

    @Test
    void deleteTable_ShouldDeleteTable() throws Exception {
        doNothing().when(tableService).deleteTable("table-1");

        mockMvc.perform(delete("/api/tables/table-1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(tableService, times(1)).deleteTable("table-1");
    }

    @Test
    void getQRCode_ShouldReturnQRCode() throws Exception {
        QRCodeResponse qrCodeResponse = QRCodeResponse.builder()
                .tableId("table-1")
                .tableNumber("1")
                .qrCode("qr-code-data")
                .menuUrl("http://localhost/menu?table=table-1")
                .build();

        when(tableService.getQRCode("table-1")).thenReturn(qrCodeResponse);

        mockMvc.perform(get("/api/tables/table-1/qr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.qrCode").value("qr-code-data"));

        verify(tableService, times(1)).getQRCode("table-1");
    }

    @Test
    void regenerateQRCode_ShouldReturnNewQRCode() throws Exception {
        QRCodeResponse qrCodeResponse = QRCodeResponse.builder()
                .tableId("table-1")
                .tableNumber("1")
                .qrCode("new-qr-code-data")
                .menuUrl("http://localhost/menu?table=table-1")
                .build();

        when(tableService.regenerateQRCode("table-1")).thenReturn(qrCodeResponse);

        mockMvc.perform(post("/api/tables/table-1/regenerate-qr"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(tableService, times(1)).regenerateQRCode("table-1");
    }
}
