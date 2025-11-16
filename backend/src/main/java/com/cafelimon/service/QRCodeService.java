package com.cafelimon.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

/**
 * Servicio para generación de códigos QR
 */
@Service
@Slf4j
public class QRCodeService {

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    private static final int QR_CODE_WIDTH = 300;
    private static final int QR_CODE_HEIGHT = 300;

    /**
     * Genera un código QR para una mesa
     *
     * @param tableId ID de la mesa
     * @return String en Base64 del código QR
     */
    public String generateQRCode(String tableId) {
        try {
            String url = generateMenuUrl(tableId);
            log.info("Generando QR code para mesa {} con URL: {}", tableId, url);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            Map<EncodeHintType, Object> hints = new HashMap<>();
            hints.put(EncodeHintType.MARGIN, 1);

            BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE,
                    QR_CODE_WIDTH, QR_CODE_HEIGHT, hints);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            byte[] qrCodeBytes = outputStream.toByteArray();
            String base64QR = Base64.getEncoder().encodeToString(qrCodeBytes);

            log.info("QR code generado exitosamente para mesa {}", tableId);
            return "data:image/png;base64," + base64QR;

        } catch (WriterException | IOException e) {
            log.error("Error generando QR code para mesa {}: {}", tableId, e.getMessage(), e);
            throw new RuntimeException("Error generando código QR", e);
        }
    }

    /**
     * Genera la URL del menú para una mesa
     *
     * @param tableId ID de la mesa
     * @return URL del menú
     */
    public String generateMenuUrl(String tableId) {
        return String.format("%s/menu?table=%s", frontendUrl, tableId);
    }

    /**
     * Regenera el código QR para una mesa
     *
     * @param tableId ID de la mesa
     * @return Nuevo código QR en Base64
     */
    public String regenerateQRCode(String tableId) {
        log.info("Regenerando QR code para mesa {}", tableId);
        return generateQRCode(tableId);
    }
}
