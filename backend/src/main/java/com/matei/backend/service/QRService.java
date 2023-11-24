package com.matei.backend.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.EncodeHintType;
import com.google.zxing.WriterException;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel;
import com.matei.backend.dto.response.QRResponseDto;
import com.matei.backend.entity.QR;
import com.matei.backend.repository.QRRepository;
import lombok.RequiredArgsConstructor;
import org.apache.commons.codec.binary.Base64;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class QRService {

    private final QRRepository qrRepository;

    public QRResponseDto createQR() throws WriterException, IOException {

        UUID uuid = UUID.randomUUID();
        String url = "http://localhost:4200/validate-ticket/" + uuid.toString();

        Map<EncodeHintType, Object> hints = new HashMap<>();
        hints.put(EncodeHintType.ERROR_CORRECTION, ErrorCorrectionLevel.L);
        hints.put(EncodeHintType.CHARACTER_SET, "UTF-8");

        QRCodeWriter qrCodeWriter = new QRCodeWriter();

        var width = 300;
        var height = 300;
        BitMatrix bitMatrix = qrCodeWriter.encode(url, BarcodeFormat.QR_CODE, width, height, hints);

        BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        for (int x = 0; x < width; x++) {
            for (int y = 0; y < width; y++) {
                bufferedImage.setRGB(x, y, bitMatrix.get(x, y) ? 0xFF000000 : 0xFFFFFFFF);
            }
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(bufferedImage, "jpg", baos);

        byte[] imageBytes = baos.toByteArray();

        var qr = qrRepository.save(QR.builder()
                .image(Base64.encodeBase64String(imageBytes))
                .used(false)
                .build());

        return QRResponseDto.builder()
                .id(qr.getId())
                .image(Base64.encodeBase64String(imageBytes))
                .used(qr.getUsed())
                .build();
    }

    public Boolean validateQR(UUID qrId) {
        var qr = qrRepository.findById(qrId).orElseThrow(() -> new RuntimeException("QR not found"));

        if(qr.getUsed()) {
            return false;
        }

        qr.setUsed(true);
        qrRepository.save(qr);
        return true;
    }
}
