package com.cafelimon.service;

import com.cafelimon.dto.table.QRCodeResponse;
import com.cafelimon.dto.table.TableRequest;
import com.cafelimon.dto.table.TableResponse;
import com.cafelimon.exception.ResourceNotFoundException;
import com.cafelimon.model.Table;
import com.cafelimon.repository.TableRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TableServiceTest {

    @Mock
    private TableRepository tableRepository;

    @Mock
    private QRCodeService qrCodeService;

    @InjectMocks
    private TableService tableService;

    private Table table1;
    private Table table2;

    @BeforeEach
    void setUp() {
        table1 = Table.builder()
                .number("1")
                .capacity(4)
                .location("Interior")
                .qrCode("qr-code-1")
                .active(true)
                .build();
        ReflectionTestUtils.setField(table1, "id", "table-1");

        table2 = Table.builder()
                .number("2")
                .capacity(2)
                .location("Exterior")
                .qrCode("qr-code-2")
                .active(false)
                .build();
        ReflectionTestUtils.setField(table2, "id", "table-2");
    }

    @Test
    void getAllTables_ShouldReturnAllTables() {
        when(tableRepository.findAll()).thenReturn(Arrays.asList(table1, table2));

        List<TableResponse> result = tableService.getAllTables();

        assertThat(result).hasSize(2);
        assertThat(result.get(0).getNumber()).isEqualTo("1");
        assertThat(result.get(1).getNumber()).isEqualTo("2");
        verify(tableRepository, times(1)).findAll();
    }

    @Test
    void getActiveTables_ShouldReturnOnlyActiveTables() {
        when(tableRepository.findByActiveTrueOrderByNumberAsc()).thenReturn(Arrays.asList(table1));

        List<TableResponse> result = tableService.getActiveTables();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getActive()).isTrue();
        verify(tableRepository, times(1)).findByActiveTrueOrderByNumberAsc();
    }

    @Test
    void getTableById_WhenTableExists_ShouldReturnTable() {
        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));

        TableResponse result = tableService.getTableById("table-1");

        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo("table-1");
        assertThat(result.getNumber()).isEqualTo("1");
        verify(tableRepository, times(1)).findById("table-1");
    }

    @Test
    void getTableById_WhenTableNotFound_ShouldThrowException() {
        when(tableRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.getTableById("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-id");
    }

    @Test
    void getTableByNumber_WhenTableExists_ShouldReturnTable() {
        when(tableRepository.findByNumber("1")).thenReturn(Optional.of(table1));

        TableResponse result = tableService.getTableByNumber("1");

        assertThat(result).isNotNull();
        assertThat(result.getNumber()).isEqualTo("1");
        verify(tableRepository, times(1)).findByNumber("1");
    }

    @Test
    void getTableByNumber_WhenTableNotFound_ShouldThrowException() {
        when(tableRepository.findByNumber("99")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.getTableByNumber("99"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con número: 99");
    }

    @Test
    void createTable_WithValidData_ShouldCreateTableAndGenerateQR() {
        TableRequest request = new TableRequest();
        request.setNumber("3");
        request.setCapacity(6);
        request.setLocation("Terraza");
        request.setActive(true);

        when(tableRepository.existsByNumber("3")).thenReturn(false);
        when(tableRepository.save(any(Table.class))).thenReturn(table1);
        when(qrCodeService.generateQRCode(anyString())).thenReturn("new-qr-code");

        TableResponse result = tableService.createTable(request);

        assertThat(result).isNotNull();
        verify(tableRepository, times(1)).existsByNumber("3");
        verify(tableRepository, times(2)).save(any(Table.class));
        verify(qrCodeService, times(1)).generateQRCode(anyString());
    }

    @Test
    void createTable_WithExistingNumber_ShouldThrowException() {
        TableRequest request = new TableRequest();
        request.setNumber("1");
        request.setCapacity(4);
        request.setLocation("Interior");
        request.setActive(true);

        when(tableRepository.existsByNumber("1")).thenReturn(true);

        assertThatThrownBy(() -> tableService.createTable(request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe una mesa con el número: 1");

        verify(tableRepository, never()).save(any());
    }

    @Test
    void updateTable_WithValidData_ShouldUpdateTable() {
        TableRequest request = new TableRequest();
        request.setNumber("1-Updated");
        request.setCapacity(6);
        request.setLocation("Terraza");
        request.setActive(true);

        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));
        when(tableRepository.existsByNumber("1-Updated")).thenReturn(false);
        when(tableRepository.save(any(Table.class))).thenReturn(table1);

        TableResponse result = tableService.updateTable("table-1", request);

        assertThat(result).isNotNull();
        verify(tableRepository, times(1)).findById("table-1");
        verify(tableRepository, times(1)).save(any(Table.class));
    }

    @Test
    void updateTable_WithSameNumber_ShouldUpdateWithoutCheckingNumber() {
        TableRequest request = new TableRequest();
        request.setNumber("1");
        request.setCapacity(6);
        request.setLocation("Terraza");
        request.setActive(true);

        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));
        when(tableRepository.save(any(Table.class))).thenReturn(table1);

        TableResponse result = tableService.updateTable("table-1", request);

        assertThat(result).isNotNull();
        verify(tableRepository, times(1)).findById("table-1");
        verify(tableRepository, never()).existsByNumber(any());
        verify(tableRepository, times(1)).save(any(Table.class));
    }

    @Test
    void updateTable_WithExistingNumber_ShouldThrowException() {
        TableRequest request = new TableRequest();
        request.setNumber("2");
        request.setCapacity(4);
        request.setLocation("Interior");
        request.setActive(true);

        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));
        when(tableRepository.existsByNumber("2")).thenReturn(true);

        assertThatThrownBy(() -> tableService.updateTable("table-1", request))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Ya existe una mesa con el número: 2");

        verify(tableRepository, never()).save(any());
    }

    @Test
    void updateTable_WhenTableNotFound_ShouldThrowException() {
        TableRequest request = new TableRequest();
        request.setNumber("3");
        request.setCapacity(4);
        request.setLocation("Interior");
        request.setActive(true);

        when(tableRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.updateTable("invalid-id", request))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-id");
    }

    @Test
    void deleteTable_WhenTableExists_ShouldDeleteTable() {
        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));

        tableService.deleteTable("table-1");

        verify(tableRepository, times(1)).findById("table-1");
        verify(tableRepository, times(1)).delete(table1);
    }

    @Test
    void deleteTable_WhenTableNotFound_ShouldThrowException() {
        when(tableRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.deleteTable("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-id");
    }

    @Test
    void regenerateQRCode_WhenTableExists_ShouldRegenerateQRCode() {
        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));
        when(qrCodeService.regenerateQRCode("table-1")).thenReturn("new-qr-code");
        when(qrCodeService.generateMenuUrl("table-1")).thenReturn("http://menu/table-1");

        QRCodeResponse result = tableService.regenerateQRCode("table-1");

        assertThat(result).isNotNull();
        assertThat(result.getTableId()).isEqualTo("table-1");
        assertThat(result.getTableNumber()).isEqualTo("1");
        assertThat(result.getQrCode()).isEqualTo("new-qr-code");
        assertThat(result.getMenuUrl()).isEqualTo("http://menu/table-1");
        verify(tableRepository, times(1)).save(table1);
    }

    @Test
    void regenerateQRCode_WhenTableNotFound_ShouldThrowException() {
        when(tableRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.regenerateQRCode("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-id");
    }

    @Test
    void getQRCode_WhenTableExists_ShouldReturnQRCodeResponse() {
        when(tableRepository.findById("table-1")).thenReturn(Optional.of(table1));
        when(qrCodeService.generateMenuUrl("table-1")).thenReturn("http://menu/table-1");

        QRCodeResponse result = tableService.getQRCode("table-1");

        assertThat(result).isNotNull();
        assertThat(result.getTableId()).isEqualTo("table-1");
        assertThat(result.getTableNumber()).isEqualTo("1");
        assertThat(result.getQrCode()).isEqualTo("qr-code-1");
        assertThat(result.getMenuUrl()).isEqualTo("http://menu/table-1");
    }

    @Test
    void getQRCode_WhenTableNotFound_ShouldThrowException() {
        when(tableRepository.findById("invalid-id")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tableService.getQRCode("invalid-id"))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("Mesa no encontrada con ID: invalid-id");
    }
}
