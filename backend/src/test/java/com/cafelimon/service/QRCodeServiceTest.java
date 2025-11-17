package com.cafelimon.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ExtendWith(MockitoExtension.class)
class QRCodeServiceTest {

    @InjectMocks
    private QRCodeService qrCodeService;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(qrCodeService, "frontendUrl", "http://localhost:5173");
    }

    @Test
    void generateMenuUrl_ShouldReturnCorrectUrl() {
        String result = qrCodeService.generateMenuUrl("table-123");

        assertThat(result).isEqualTo("http://localhost:5173/menu?table=table-123");
    }

    @Test
    void generateMenuUrl_WithDifferentTableId_ShouldReturnCorrectUrl() {
        String result = qrCodeService.generateMenuUrl("table-456");

        assertThat(result).isEqualTo("http://localhost:5173/menu?table=table-456");
    }

    @Test
    void generateQRCode_WithValidTableId_ShouldReturnBase64QRCode() {
        String result = qrCodeService.generateQRCode("table-123");

        assertThat(result).isNotNull();
        assertThat(result).startsWith("data:image/png;base64,");
        assertThat(result.length()).isGreaterThan(100);
    }

    @Test
    void generateQRCode_ShouldContainEncodedData() {
        String result = qrCodeService.generateQRCode("table-123");

        assertThat(result).contains("iVBORw0KGgo"); // PNG header in base64
    }

    @Test
    void generateQRCode_WithDifferentTableIds_ShouldGenerateDifferentQRCodes() {
        String qrCode1 = qrCodeService.generateQRCode("table-1");
        String qrCode2 = qrCodeService.generateQRCode("table-2");

        assertThat(qrCode1).isNotEqualTo(qrCode2);
    }

    @Test
    void generateQRCode_WithSameTableId_ShouldGenerateSameQRCode() {
        String qrCode1 = qrCodeService.generateQRCode("table-123");
        String qrCode2 = qrCodeService.generateQRCode("table-123");

        assertThat(qrCode1).isEqualTo(qrCode2);
    }

    @Test
    void regenerateQRCode_ShouldReturnNewQRCode() {
        String result = qrCodeService.regenerateQRCode("table-123");

        assertThat(result).isNotNull();
        assertThat(result).startsWith("data:image/png;base64,");
    }

    @Test
    void regenerateQRCode_ShouldReturnSameAsGenerateQRCode() {
        String generated = qrCodeService.generateQRCode("table-123");
        String regenerated = qrCodeService.regenerateQRCode("table-123");

        assertThat(regenerated).isEqualTo(generated);
    }

    @Test
    void generateQRCode_WithEmptyTableId_ShouldStillGenerateQRCode() {
        String result = qrCodeService.generateQRCode("");

        assertThat(result).isNotNull();
        assertThat(result).startsWith("data:image/png;base64,");
    }

    @Test
    void generateQRCode_WithSpecialCharactersInTableId_ShouldGenerateQRCode() {
        String result = qrCodeService.generateQRCode("table-123-@#$");

        assertThat(result).isNotNull();
        assertThat(result).startsWith("data:image/png;base64,");
    }

    @Test
    void generateMenuUrl_WithCustomFrontendUrl_ShouldUseCustomUrl() {
        ReflectionTestUtils.setField(qrCodeService, "frontendUrl", "https://cafelimon.com");

        String result = qrCodeService.generateMenuUrl("table-789");

        assertThat(result).isEqualTo("https://cafelimon.com/menu?table=table-789");
    }

    @Test
    void generateQRCode_WithCustomFrontendUrl_ShouldEncodeCustomUrl() {
        ReflectionTestUtils.setField(qrCodeService, "frontendUrl", "https://cafelimon.com");

        String result = qrCodeService.generateQRCode("table-789");

        assertThat(result).isNotNull();
        assertThat(result).startsWith("data:image/png;base64,");
        assertThat(result.length()).isGreaterThan(100);
    }
}
