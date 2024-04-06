package com.matei.backend.service.util;

import com.itextpdf.xmp.impl.Base64;
import com.matei.backend.dto.response.event.EventWithoutTicketArtistResponseDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.*;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PdfService {
    private static final Map<Character, Character> letterMap = new HashMap<>();

    static {
        letterMap.put('ă', 'a');
        letterMap.put('â', 'a');
        letterMap.put('î', 'i');
        letterMap.put('ș', 's');
        letterMap.put('ț', 't');
        letterMap.put('Ă', 'A');
        letterMap.put('Â', 'A');
        letterMap.put('Î', 'I');
        letterMap.put('Ș', 'S');
        letterMap.put('Ț', 'T');
    }

    public byte[] createPdf(EventWithoutTicketArtistResponseDto eventResponseDto, List<TicketResponseDto> ticketResponseDtoList) {
        PDDocument document = new PDDocument();
        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();

        try {
            PDPage firstPage = new PDPage();

            document.addPage(firstPage);
            PDPageContentStream firstPageContentStream  = new PDPageContentStream(document, firstPage);
            firstPageContentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
            firstPageContentStream.beginText();
            firstPageContentStream.newLineAtOffset(20, 700);
            firstPageContentStream.showText(removeDiacritics(eventResponseDto.getTitle()));
            firstPageContentStream.newLineAtOffset(0, -20);
            firstPageContentStream.showText("Data: " + eventResponseDto.getDate().toString());
            firstPageContentStream.newLineAtOffset(0, -20);
            firstPageContentStream.showText("Locatie: " + removeDiacritics(eventResponseDto.getLocation().getName()) + ", " + removeDiacritics(eventResponseDto.getLocation().getAddress()));
            firstPageContentStream.endText();
            firstPageContentStream.close();

            List<byte[]> imageBytes = ticketResponseDtoList.stream().map(ticketResponseDto -> ticketResponseDto.getImage().getBytes()).toList();

            for (TicketResponseDto ticketResponseDto : ticketResponseDtoList) {
                PDPage page = new PDPage();
                document.addPage(page);
                PDPageContentStream detailsContentStream = new PDPageContentStream(document, page);
                detailsContentStream.setFont(new PDType1Font(Standard14Fonts.FontName.HELVETICA), 12);
                detailsContentStream.beginText();
                detailsContentStream.newLineAtOffset(20, 700);
                detailsContentStream.showText("Event: " + removeDiacritics(ticketResponseDto.getTicketType().getName()));
                detailsContentStream.endText();
                detailsContentStream.close();

                PDPageContentStream imageContentStream = new PDPageContentStream(document, page, PDPageContentStream.AppendMode.APPEND, true);
                PDImageXObject pdImage = PDImageXObject.createFromByteArray(document, Base64.decode(ticketResponseDto.getImage().getBytes()), "qr");
                imageContentStream.drawImage(pdImage, 150, 280);
                imageContentStream.close();
            }

            document.save(byteArrayOutputStream);
            document.close();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        return byteArrayOutputStream.toByteArray();
    }

    public static String removeDiacritics(String input) {
        StringBuilder sb = new StringBuilder();
        for (char c : input.toCharArray()) {
            if (letterMap.containsKey(c)) {
                sb.append(letterMap.get(c));
            } else {
                sb.append(c);
            }
        }
        return sb.toString();
    }
}
