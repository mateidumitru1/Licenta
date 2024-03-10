package com.matei.backend.service.util;

import com.matei.backend.dto.response.event.EventWithoutArtistListResponseDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import com.matei.backend.entity.ResetPasswordToken;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Attachments;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.*;

@Service
@RequiredArgsConstructor
public class EmailService {
    private final Email from = new Email("matei.dumitrud@gmail.com");
    private final String urlPrefix = "http://localhost:4200/";
    private final PdfService pdfService;


    public void sendWelcomeEmail(String firstName, String username, String toEmail) {
        Email to = new Email(toEmail);

        final String welcomeTemplateId = "d-339bb448fb5140c09cdb25e202700da9";

        Personalization personalization = new Personalization();
        personalization.addDynamicTemplateData("firstName", firstName);
        personalization.addDynamicTemplateData("username", username);
        personalization.addDynamicTemplateData("email", toEmail);
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(welcomeTemplateId);
        mail.addPersonalization(personalization);

        send(mail);
    }

    public void sendResetPasswordEmail(String toEmail, ResetPasswordToken token) {
        Email to = new Email(toEmail);

        var url = urlPrefix + "/reset-password/" + token.getToken();
        final String resetPasswordTemplateId = "d-761f1f0d47814e79bbee8243edd4507c";

        Personalization personalization = new Personalization();
        personalization.addDynamicTemplateData("url", url);
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(resetPasswordTemplateId);
        mail.addPersonalization(personalization);

        send(mail);
    }

    public void sendTicketEmail(String toEmail, Map<EventWithoutArtistListResponseDto, List<TicketResponseDto>> eventTicketMap) {
        Email to = new Email(toEmail);

        final String sendTicketTemplateId = "d-22dfa17cd6234faeb5f3bdcb9095342d";

        List<Attachments> attachmentsList = new ArrayList<>();

        eventTicketMap.forEach((eventResponseDto, ticketResponseDtoList) -> {
            byte[] pdfBytes = pdfService.createPdf(eventResponseDto, ticketResponseDtoList);

            Attachments attachments = new Attachments();
            attachments.setContent(Base64.getEncoder().encodeToString(pdfBytes));
            attachments.setType("application/pdf");
            attachments.setFilename(eventResponseDto.getTitle() + ".pdf");

            attachmentsList.add(attachments);
        });

        Personalization personalization = new Personalization();
//        personalization.addDynamicTemplateData("image", "data:image/jpeg;base64, " + ticketResponseDto.getImage());
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(sendTicketTemplateId);
        mail.addPersonalization(personalization);

        attachmentsList.forEach(mail::addAttachments);

        send(mail);
    }

    public void sendVerifyAccountEmail(String email, String username, String token) {
        String url = urlPrefix + "/verify-account/" + token;
        String resendUrl = urlPrefix + "/resend-verify-account-email/" + email;
        Email to = new Email(email);

        final String verifyAccountTemplateId = "d-5a4b16b54cf5430dab56719a141d4d8d";

        Personalization personalization = new Personalization();
        personalization.addDynamicTemplateData("username", username);
        personalization.addDynamicTemplateData("url", url);
        personalization.addDynamicTemplateData("resendUrl", resendUrl);
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId(verifyAccountTemplateId);
        mail.addPersonalization(personalization);

        send(mail);
    }

    private void send(Mail mail) {
        SendGrid sg = new SendGrid(System.getenv("SENDGRID_API_KEY"));
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            sg.api(request);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
