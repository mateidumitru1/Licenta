package com.matei.backend.service;

import com.matei.backend.entity.ResetPasswordToken;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import com.sendgrid.helpers.mail.objects.Personalization;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final Email from = new Email("matei.dumitrud@gmail.com");

    public void sendResetPasswordEmail(String toEmail, ResetPasswordToken token) {
        Email to = new Email(toEmail);

        var url = "http://localhost:4200/reset-password/" + token.getToken();

        Personalization personalization = new Personalization();
        personalization.addDynamicTemplateData("url", url);
        personalization.addTo(to);

        Mail mail = new Mail();
        mail.setFrom(from);
        mail.setTemplateId("d-761f1f0d47814e79bbee8243edd4507c");
        mail.addPersonalization(personalization);

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
