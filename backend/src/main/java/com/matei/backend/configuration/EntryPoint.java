package com.matei.backend.configuration;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.mvc.method.RequestMappingInfo;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

@Component
@RequiredArgsConstructor
public class EntryPoint implements AuthenticationEntryPoint {
    private final RequestMappingHandlerMapping handlerMapping;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        if(!request.getRequestURI().equals("/error")) {
            if(!isExistingEndpoint(request)) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Not Found");
            }
            else {
                JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint = new JwtAuthenticationEntryPoint();
                jwtAuthenticationEntryPoint.commence(request, response, authException);
            }
        }
    }

    public boolean isExistingEndpoint(HttpServletRequest request) {
        String uri = request.getRequestURI();

        Map<RequestMappingInfo, HandlerMethod> mappings = handlerMapping.getHandlerMethods();

        for (RequestMappingInfo mapping : mappings.keySet()) {
            var a = mapping.getPathPatternsCondition().getPatterns().stream().findFirst().get().getPatternString();
            if (uri.startsWith(mapping.getPathPatternsCondition().getPatterns().stream().findFirst().get().getPatternString())){
                return true;
            }
        }

        return false;
    }
}
